import { createClient } from '@supabase/supabase-js';

// Producao Vercel (HTTPS): /supabase é o proxy rewrite que aponta para 72.60.61.216:8000 (Kong gateway)
// Dev localhost: conexao direta com Supabase Kong
const isLocalDev = !import.meta.env.PROD && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Em producao (Vercel), SEMPRE usar o proxy /supabase para evitar Mixed Content (HTTPS → HTTP)
// Em localhost, usar a URL direta do .env ou fallback para o IP do servidor
const finalUrl = isLocalDev
  ? (import.meta.env.VITE_SUPABASE_URL || 'http://72.60.61.216:8000')
  : window.location.origin + '/supabase'; // prod: proxy rewrite Vercel → 72.60.61.216:8000 (Kong)
console.log('[Supabase] URL:', finalUrl, '| localDev:', isLocalDev, '| PROD:', import.meta.env.PROD);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.mNICLM3eLL20ZItNn-asYmBADDcz2gCCwLBJ3csHTtg';

// Service Role Key — permite criar usuários já confirmados (sem e-mail)
// Nunca expor esta chave no cliente em produção!
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';

export const supabase = createClient(finalUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Realtime ativo — necessário para o V1 atualizar o V2 instantaneamente
  realtime: { params: { eventsPerSecond: 8 } },
  global: {
    headers: { 'X-Client-Info': 'domdaempada-admin' },
  },
});

// Cliente Admin (service_role) — criado sob demanda para evitar
// "Multiple GoTrueClient instances" warning que trava o auth
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(finalUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { params: { eventsPerSecond: 0 } },
    });
  }
  return _supabaseAdmin;
}

// ─── Auth helpers ───────────────────────────────────────────
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Cria usuário no Supabase Auth.
 * Tenta via Admin API primeiro (confirma e-mail automaticamente).
 * Se a service_role key for inválida, cai no signUp normal.
 */
export async function signUpWithEmail(email: string, password: string) {
  // Tentativa 1: Admin API (bypassa confirmação de e-mail)
  try {
    console.log('[signUpWithEmail] Tentando Admin API...');
    const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      if (!error.message?.toLowerCase().includes('unauthorized')) throw error;
      console.warn('[signUpWithEmail] Admin API Unauthorized — usando fallback signUp.');
    } else {
      console.log('[signUpWithEmail] Admin API sucesso:', data);
      return data;
    }
  } catch (adminErr: any) {
    if (!adminErr.message?.toLowerCase().includes('unauthorized')) throw adminErr;
    console.warn('[signUpWithEmail] Admin API indisponível — usando fallback signUp.');
  }

  // Tentativa 2: signUp normal
  console.log('[signUpWithEmail] Tentando signUp normal...');
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    console.error('[signUpWithEmail] signUp erro:', signUpError);
    throw signUpError;
  }
  
  // Confirmar email via SQL direto (para garantir que login funcione)
  if (data?.user?.id) {
    console.log('[signUpWithEmail] Confirmando email via SQL...');
    await supabase.rpc('confirm_user_email', { user_id_input: data.user.id });
  }
  
  console.log('[signUpWithEmail] signUp sucesso:', data);
  return data;
}

/**
 * Define/redefine a senha de um franqueado diretamente em app_users.password.
 * Sem Supabase Auth — login é feito por nome + senha diretamente.
 */
export async function setFranchiseePassword(franchiseeName: string, newPassword: string) {
  const { error } = await supabase
    .from('app_users')
    .update({ password: newPassword })
    .ilike('name', franchiseeName)
    .eq('role', 'franqueado');
  if (error) throw error;
}

/**
 * Redefine a senha de um usuário direto na tabela app_users.
 */
export async function resetUserPassword(userId: string, newPassword: string) {
  const { error } = await supabase
    .from('app_users')
    .update({ password: newPassword })
    .eq('id', userId);
  if (error) throw error;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Delete user from Supabase Auth by email
 * Requires service_role key
 */
export async function deleteAuthUserByEmail(email: string) {
  // First, list users to find the ID
  try {
    const { data: listData, error: listError } = await getSupabaseAdmin().auth.admin.listUsers();
    if (listError) {
      console.error('[deleteAuthUser] Erro ao listar usuários:', listError);
      throw listError;
    }
    
    const user = listData.users.find(u => u.email === email);
    if (!user) {
      console.log('[deleteAuthUser] Usuário não encontrado:', email);
      return null;
    }
    
    console.log('[deleteAuthUser] Encontrado usuário com ID:', user.id);
    
    // Delete the user
    const { error: deleteError } = await getSupabaseAdmin().auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error('[deleteAuthUser] Erro ao excluir:', deleteError);
      throw deleteError;
    }
    
    console.log('[deleteAuthUser] Usuário excluído com sucesso:', email);
    return true;
  } catch (err) {
    console.error('[deleteAuthUser] Erro:', err);
    throw err;
  }
}

export function onAuthChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}

// Leitura local da sessao — zero rede, instantaneo
export function getCurrentUser() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const session = JSON.parse(raw);
        return session.user ?? null;
      }
    }
    return null;
  } catch { return null; }
}

// ─── Realtime subscribe helper ──────────────────────────────
// Em localhost, timeout muito menor para não travar a UI durante desenvolvimento
const DEFAULT_TIMEOUT = isLocalDev ? 3000 : 15000;
const DEFAULT_RETRIES = isLocalDev ? 1 : 2;

function fetchWithRetry(
  table: string,
  filters: Record<string, string>,
  orderCol: string,
  ascending: boolean,
  retries = DEFAULT_RETRIES,
  timeoutMs = DEFAULT_TIMEOUT
): Promise<any[]> {
  const attempt = (n: number): Promise<any[]> => {
    let q = supabase.from(table).select('*');
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
    const fetchP = q.order(orderCol, { ascending }) as unknown as Promise<{ data: any[] | null; error: any }>;
    const timeoutP = new Promise<{ data: null; error: string }>(r =>
      setTimeout(() => r({ data: null, error: `timeout ${timeoutMs}ms` }), timeoutMs)
    );
    return Promise.race([fetchP, timeoutP]).then(({ data, error }) => {
      if (error || !data) {
        console.warn(`[Supabase] ${table} tentativa ${retries - n + 1}: ${error || 'sem dados'} (${data?.length ?? 0} rows)`);
        if (n > 0) return new Promise(r => setTimeout(r, 500)).then(() => attempt(n - 1));
      }
      if (error) console.error(`[Supabase] Erro final ${table}:`, error);
      console.log(`[Supabase] ${table}: ${data?.length || 0} registros retornados`);
      return data || [];
    });
  };
  return attempt(retries);
}

export function subscribeToTable(
  table: string,
  filters: Record<string, string>,
  callback: (rows: any[]) => void,
  orderCol = 'created_at',
  ascending = false
) {
  console.log(`[Supabase] subscribeToTable('${table}') iniciado`, filters);

  // Busca inicial
  console.log(`[Supabase] Fazendo fetch inicial de ${table}...`);
  const initialFetch = fetchWithRetry(table, filters, orderCol, ascending, isLocalDev ? 1 : 2, isLocalDev ? 3000 : 15000).then(data => {
    console.log(`[Supabase] ✅ ${table}: ${data.length} registros recebidos`);
    callback(data);
    return data;
  }).catch(error => {
    console.error(`[Supabase] ❌ ERRO ao buscar ${table}:`, error);
    callback([]);
    return [];
  });

  // Configurar Realtime subscription para atualizações instantâneas
  let currentRows: any[] = [];
  initialFetch.then(data => { currentRows = data || []; });

  console.log(`[Supabase] Configurando Realtime para ${table}...`);
  const channel = supabase
    .channel(`public:${table}:changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload: any) => {
        console.log(`[Realtime] ${table} event:`, payload.eventType, payload);

        // Recarregar dados após qualquer mudança para manter consistência
        fetchWithRetry(table, filters, orderCol, ascending, 0, 8000).then(data => {
          currentRows = data || [];
          callback(currentRows);
        });
      }
    )
    .subscribe((status: string) => {
      console.log(`[Realtime] ${table} subscription status:`, status);
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error(`[Realtime] ❌ ERRO na subscription de ${table}:`, status);
      }
    });

  return () => {
    console.log(`[Realtime] ${table} unsubscribing`);
    supabase.removeChannel(channel);
  };
}

// ─── CRUD helpers ───────────────────────────────────────────
export async function insertRow(table: string, data: Record<string, any>) {
  const { data: row, error } = await supabase.from(table).insert(data).select().single();
  if (error) throw error;
  return row;
}

export async function updateRow(table: string, id: string, data: Record<string, any>) {
  const { error } = await supabase.from(table).update(data).eq('id', id);
  if (error) throw error;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function fetchRows(
  table: string,
  filters: Record<string, string> = {},
  orderCol = 'created_at',
  ascending = false,
  limitCount?: number
) {
  let q = supabase.from(table).select('*');
  for (const [col, val] of Object.entries(filters)) {
    q = q.eq(col, val);
  }
  q = q.order(orderCol, { ascending });
  if (limitCount) q = q.limit(limitCount);
  // Timeout de 8s com retry
  console.log(`[Supabase] fetchRows('${table}') iniciado`, filters);
  const data = await fetchWithRetry(table, filters, orderCol, ascending);
  console.log(`[Supabase] fetchRows('${table}'): ${data.length} registros`);
  return data;
}

// ─── Seed initial data ──────────────────────────────────────
/**
 * Normaliza URLs do Supabase Storage para evitar Mixed Content e CORS.
 * Converte URLs HTTP do servidor E URLs do domínio motorista para o proxy /supabase em produção.
 */
export function normalizeStorageUrl(url: string | null | undefined): string {
  if (!url) return '';
  // Em produção (HTTPS), converter URLs brutas do servidor (independente de http/https)
  if (!isLocalDev && url.includes('72.60.61.216:8000')) {
    return url.replace(/^https?:\/\/72\.60\.61\.216:8000/, '/supabase');
  }
  // Converter URLs do domínio motorista para o proxy do administrativo
  if (!isLocalDev && url.includes('motorista.sk4r4n70.cloud/api/supabase')) {
    return url.replace(/^https?:\/\/motorista\.sk4r4n70\.cloud\/api\/supabase/, '/supabase');
  }
  // Converter URLs do domínio API direto
  if (!isLocalDev && url.includes('api.sk4r4n70.cloud')) {
    return url.replace(/^https?:\/\/api\.sk4r4n70\.cloud/, '/supabase');
  }
  return url;
}

export async function seedInitialData(userId: string) {
  // Check if already seeded
  const { data: existing } = await supabase.from('app_users').select('id').limit(1);
  if (existing && existing.length > 0) return;

  // Seed users
  await supabase.from('app_users').insert([
    { name: 'Ricardo Mendes', email: 'ricardo.mendes@domdaempada.com', role: 'admin', region: 'Recife', status: 'Ativo', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop' },
    { name: 'Mariana Silva', email: 'mariana.silva@domdaempada.com', role: 'usuario', region: 'Salvador', status: 'Ativo', photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
  ]);

  // Seed orders
  await supabase.from('orders').insert([
    {
      order_code: 'REC-9012', point_id: 'P1', point_name: 'Boa Viagem Store',
      units: 450, status: 'COMPLETED', type: 'REGULAR', region: 'Recife',
      lat: -8.1267, lng: -34.9011,
      status_history: [
        { status: 'IDLE', timestamp: new Date(Date.now() - 86400000).toISOString(), userName: 'Sistema', userId: 'system' },
        { status: 'COMPLETED', timestamp: new Date().toISOString(), userName: 'Ricardo Mendes', userId: 'user2' },
      ]
    },
    {
      order_code: 'REC-8994', point_id: 'P2', point_name: 'Casa Forte Hub',
      units: 1200, status: 'IN PROGRESS', type: 'EXTRA DELIVERY', region: 'Recife',
      lat: -8.0347, lng: -34.9197,
      status_history: [
        { status: 'IDLE', timestamp: new Date(Date.now() - 21600000).toISOString(), userName: 'Sistema', userId: 'system' },
        { status: 'IN PROGRESS', timestamp: new Date().toISOString(), userName: 'Mariana Silva', userId: 'user1' },
      ]
    },
  ]);

  // Seed notifications
  await supabase.from('notifications').insert([
    { title: 'Estoque Crítico', message: 'O estoque de Empada de Frango no Hub Recife está abaixo de 15%.', type: 'stock', severity: 'critical', read: false, user_id: userId, link: '/inventory' },
    { title: 'Pedido REC-9012 Concluído', message: 'O pedido da Boa Viagem Store foi entregue com sucesso.', type: 'order', severity: 'info', read: false, user_id: userId, link: '/orders' },
    { title: 'Conflito na Agenda', message: 'O motorista Ricardo possui dois agendamentos para o mesmo horário.', type: 'schedule', severity: 'warning', read: true, user_id: userId, link: '/schedule' },
  ]);
}
