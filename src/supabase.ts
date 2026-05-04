import { createClient } from '@supabase/supabase-js';

// Producao Vercel (HTTPS): /supabase é o proxy rewrite que aponta para 72.60.61.216:8000 (Kong gateway)
// Dev localhost: conexao direta com Supabase Kong
const isLocalDev = !import.meta.env.PROD && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Em producao (Vercel), SEMPRE usar o proxy /supabase para evitar Mixed Content (HTTPS → HTTP)
// Em localhost, usar a URL direta do .env ou fallback para o IP do servidor
const finalUrl = isLocalDev
  ? (import.meta.env.VITE_SUPABASE_URL || 'http://72.60.61.216:8000')
  : window.location.origin + '/supabase'; // prod: proxy rewrite Vercel → 72.60.61.216:8000 (Kong)
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
  realtime: {
    params: { eventsPerSecond: 4 },
    // Reconectar devagar para parar o flood de ERR_CONNECTION_TIMED_OUT
    reconnectAfterMs: (tries: number) => Math.min(tries * 30000, 120000),
    heartbeatIntervalMs: 60000,
  },
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
      console.error('[signUpWithEmail] Admin API error:', error);
      if (!error.message?.toLowerCase().includes('unauthorized')) throw error;
      console.warn('[signUpWithEmail] Admin API Unauthorized — usando fallback signUp.');
    } else {
      console.log('[signUpWithEmail] Admin API sucesso. User ID:', data.user?.id, 'Email confirmado:', data.user?.email_confirmed_at);
      return data;
    }
  } catch (adminErr: any) {
    console.error('[signUpWithEmail] Admin API exception:', adminErr);
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
  
  console.log('[signUpWithEmail] signUp normal. User ID:', data.user?.id, 'Email confirmado:', data.user?.email_confirmed_at);
  
  // Confirmar email via SQL direto (para garantir que login funcione)
  if (data?.user?.id) {
    console.log('[signUpWithEmail] Confirmando email via SQL RPC...');
    try {
      const { error: rpcError } = await supabase.rpc('confirm_user_email', { user_id_input: data.user.id });
      if (rpcError) {
        console.error('[signUpWithEmail] RPC confirm_user_email erro:', rpcError);
      } else {
        console.log('[signUpWithEmail] RPC confirm_user_email sucesso');
      }
    } catch (rpcErr: any) {
      console.error('[signUpWithEmail] RPC confirm_user_email exception:', rpcErr);
    }
  }
  
  console.log('[signUpWithEmail] signUp sucesso final:', data);
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
// Agora usa fetchRows com limite para evitar carregamentos massivos
export function subscribeToTable(
  table: string,
  filters: Record<string, string>,
  callback: (rows: any[]) => void,
  orderCol = 'created_at',
  ascending = false,
  limitCount = 99999, // Sem limite - todos os pedidos devem aparecer
  dateRange?: { column: string; start?: string; end?: string }
) {
  let active = true;

  const doFetch = () =>
    fetchRows(table, filters, orderCol, ascending, limitCount, dateRange).then(data => {
      if (active) callback(data);
    });

  doFetch();

  // Polling de backup a cada 60s (reduzido para melhorar performance)
  const interval = setInterval(doFetch, 60000);

  // Realtime para atualizações imediatas quando disponível
  let debounce: ReturnType<typeof setTimeout> | null = null;
  const channel = supabase
    .channel(`rt:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(doFetch, 1000); // Aumentado debounce para 1s
    })
    .subscribe();

  return () => {
    active = false;
    clearInterval(interval);
    if (debounce) clearTimeout(debounce);
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
  limitCount?: number,
  dateRange?: { column: string; start?: string; end?: string }
) {
  let q = supabase.from(table).select('*');
  for (const [col, val] of Object.entries(filters)) q = q.eq(col, val);
  
  if (dateRange) {
    if (dateRange.start) q = q.gte(dateRange.column, dateRange.start);
    if (dateRange.end) q = q.lte(dateRange.column, dateRange.end);
  }
  
  q = q.order(orderCol, { ascending });
  if (limitCount) q = q.limit(limitCount);
  
  const { data, error } = await (q as any);
  if (error) console.error(`[Supabase] fetchRows ${table}:`, error.message);
  return data || [];
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
