import React, { useState, useEffect, lazy, Suspense, Component, type ReactNode } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { type Region } from '@/types';
import { supabase } from '@/supabase';
import { ShieldX, LogOut, Truck, RefreshCw, AlertTriangle } from 'lucide-react';
import { RegionProvider } from '@/context/RegionContext';
import { cn } from '@/lib/utils';

// Lazy retry helper — tenta novamente se o chunk falhar (comum em deploys Vercel)
// Se todas as tentativas falharem, força reload da página para baixar chunks frescos
function lazyRetry<T extends Record<string, any>>(
  importFn: () => Promise<T>,
  accessor: (m: T) => any,
  retries = 2
): React.LazyExoticComponent<any> {
  return lazy(() => {
    const attempt = (n: number): Promise<{ default: any }> =>
      importFn()
        .then(m => ({ default: accessor(m) }))
        .catch(err => {
          if (n <= 0) {
            // Chunk não existe mais (novo deploy Vercel) — forçar reload
            console.error('[LazyRetry] Chunk não encontrado após todas as tentativas. Recarregando página...');
            window.location.reload();
            // Nunca resolve — a página será recarregada
            return new Promise(() => {});
          }
          console.warn(`[LazyRetry] Chunk falhou, tentando novamente... (${n} restantes)`);
          return new Promise(r => setTimeout(r, 500)).then(() => attempt(n - 1));
        });
    return attempt(retries);
  });
}

// Code splitting — paginas secundarias carregam sob demanda com retry
// Dashboard importado diretamente porque é a landing page
const Reports = lazyRetry(() => import('@/pages/Reports'), m => m.Reports);
const Schedule = lazyRetry(() => import('@/pages/Schedule'), m => m.Schedule);
const Orders = lazyRetry(() => import('@/pages/Orders'), m => m.Orders);
const KPIs = lazyRetry(() => import('@/pages/KPIs'), m => m.KPIs);
const Transfer = lazyRetry(() => import('@/pages/Transfer'), m => m.Transfer);
const Finance = lazyRetry(() => import('@/pages/Finance'), m => m.Finance);
const Users = lazyRetry(() => import('@/pages/Users'), m => m.Users);
const ExtraDeliveries = lazyRetry(() => import('@/pages/ExtraDeliveries'), m => m.ExtraDeliveries);
const Vehicles = lazyRetry(() => import('@/pages/Vehicles'), m => m.Vehicles);
const Profile = lazyRetry(() => import('@/pages/Profile'), m => m.Profile);
const Franqueados = lazyRetry(() => import('@/pages/Franqueados'), m => m.Franqueados);

// Fallback minimo para Suspense (nao bloqueia a UI)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// ErrorBoundary — captura erros de lazy loading e evita tela branca
class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RouteErrorBoundary] Erro ao carregar rota:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h2 className="text-lg font-black text-on-surface">Erro ao Carregar Página</h2>
        <p className="text-sm text-on-surface-variant mt-2 max-w-sm">
          Ocorreu um problema ao carregar esta página. Tente recarregar.
        </p>
        {error?.message && (
          <p className="text-[10px] text-red-400 mt-2 font-mono bg-red-50 px-3 py-2 rounded-lg">{error.message}</p>
        )}
      </div>
      <button
        onClick={() => { navigate(0); }}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Recarregar Página
      </button>
    </div>
  );
}

// Tela de bloqueio para motoristas
function MotoristaBlocked({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-red-700" />
        <div className="p-10 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center">
            <Truck className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-on-surface">Acesso Restrito</h1>
            <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">
              O <strong>Portal Administrativo</strong> é exclusivo para
              administradores e usuários do sistema.
            </p>
            <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
              Motoristas devem usar o <strong>App Mobile Dom da Empada</strong>
              para registrar entregas e checklists.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full justify-center"
          >
            <LogOut className="w-4 h-4" />
            Sair e Voltar ao Login
          </button>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-6">© 2026 Dom da Empada Franquias</p>
    </div>
  );
}

// Componente de rota protegida — apenas administradores
function AdminRoute({ isAdmin, loading, children }: { isAdmin: boolean; loading: boolean; children: React.ReactNode }) {
  if (loading) return null;
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface mb-2">Acesso Restrito</h2>
          <p className="text-on-surface-variant text-sm max-w-xs">
            Apenas <strong>administradores</strong> podem acessar a página de usuários.
          </p>
        </div>
        <Navigate to="/" replace />
      </div>
    );
  }
  return <>{children}</>;
}

// Timeout adaptativo: mais curto em localhost para nao travar a UI
const getRoleTimeout = () =>
  !import.meta.env.PROD && window.location.hostname === 'localhost' ? 5000 : 15000;

export default function App() {
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const location = useLocation();

  useEffect(() => {
    const checkDb = async () => {
      try {
        const { error } = await supabase.from('app_users').select('id', { count: 'exact', head: true }).limit(1);
        setDbStatus(error ? 'error' : 'connected');
      } catch {
        setDbStatus('error');
      }
    };
    checkDb();
  }, []);

  useEffect(() => {
    let cancelled = false;
    console.log('[App] useEffect init - pathname:', location.pathname);

    const init = async () => {
      console.log('[App] Init iniciado');
      // Admin master: bypass inmediato, zero espera de rede
      if (localStorage.getItem('admin_master_auth') === 'true') {
        console.log('[App] Admin master detected - bypass');
        if (!cancelled) {
          setUser({ email: 'admin.master@domdaempada.com.br', id: 'admin-master-id' });
          setUserRole('admin');
          setLoading(false);
          setRoleLoading(false);
        }
        return;
      }

      // Sessao persistente — busca por pattern no localStorage (zero rede)
      let cached: string | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
          cached = localStorage.getItem(k);
          break;
        }
      }
      console.log('[App] Sessao cached:', cached ? 'sim' : 'não');
      if (!cached) {
        console.log('[App] Sem sessao - loading false');
        if (!cancelled) { setLoading(false); setRoleLoading(false); }
        return;
      }

      // Tem sessao cached: mostrar UI imediatamente, role em background
      setLoading(false);
      try {
        const session = JSON.parse(cached);
        if (!session?.user) { if (!cancelled) setRoleLoading(false); return; }
        setUser({ id: session.user.id, email: session.user.email });

        // Fetch role com timeout adaptativo (mais curto em localhost)
        const roleP = supabase.from('app_users').select('role').eq('auth_uid', session.user.id).single() as any;
        const timeoutP = new Promise<{ data: any }>(r => setTimeout(() => r({ data: null }), getRoleTimeout()));
        const { data } = await Promise.race([roleP, timeoutP]);
        if (!cancelled) setUserRole(data?.role ?? null);
      } catch {
        if (!cancelled) setUserRole(null);
      }
      if (!cancelled) setRoleLoading(false);
    };

    init();
    return () => { cancelled = true; console.log('[App] useEffect cleanup'); };
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Portal Administrativo';
      case '/reports': return 'Relatórios de Entrega';
      case '/schedule': return 'Cronograma de Viagens';
      case '/orders': return 'Gestão de Pedidos';
      case '/kpis': return 'Indicadores de Desempenho';
      case '/transfer': return 'Transferência de Estoque';
      case '/finance': return 'Preços e Royalties';
      case '/extras': return 'Entregas Extras por Motorista';
      case '/users': return 'Gestão de Usuários';
      case '/vehicles': return 'Gestão de Veículos';
      case '/franqueados': return 'Rede de Franqueados';
      case '/profile': return 'Meu Perfil';
      default: return 'Portal Administrativo';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Carregando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  if (location.pathname === '/login' && user) {
    return <Navigate to="/" />;
  }

  // ── Bloquear motoristas: não têm acesso ao portal administrativo ──
  if (user && userRole === 'motorista') {
    const handleLogoutMotorista = async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_master_auth');
      // Limpar tokens de sessão
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i) || '';
        if (k.startsWith('sb-')) localStorage.removeItem(k);
      }
      window.location.href = '/login';
    };
    return <MotoristaBlocked onLogout={handleLogoutMotorista} />;
  }

  if (location.pathname === '/login') {
    return <Login onLogin={async () => {
      // Admin master bypass (sem Supabase Auth)
      if (localStorage.getItem('admin_master_auth') === 'true') {
        setUser({ email: 'admin.master@domdaempada.com.br', id: 'admin-master-id' });
        setUserRole('admin');
        setLoading(false);
        setRoleLoading(false);
        return;
      }
      // Login normal — usar getSession() para evitar race condition com localStorage
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const roleP = supabase.from('app_users').select('role').eq('auth_uid', session.user.id).single() as any;
          const timeoutP = new Promise<{ data: any }>(r => setTimeout(() => r({ data: null }), getRoleTimeout()));
          const { data } = await Promise.race([roleP, timeoutP]);
          setUserRole(data?.role ?? null);
        } else {
          console.warn('[App] getSession() retornou sem usuário após login');
        }
      } catch (e) {
        console.error('[App] Erro pos-login:', e);
      }
      setLoading(false);
      setRoleLoading(false);
    }} />;
  }

  return (
    <RegionProvider>
      <div className="min-h-screen bg-background">
        <Sidebar 
          adminAuth={userRole === 'admin' && !user?.email?.includes('@')}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
        <TopBar 
          region={region} 
          setRegion={setRegion} 
          title={getTitle()}
          onMenuToggle={() => setMobileSidebarOpen(o => !o)}
        />
        
        <main className="pt-14 lg:ml-64 lg:pt-16 min-h-screen">
          <RouteErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/kpis" element={<KPIs />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/extras" element={<ExtraDeliveries />} />
                <Route path="/users" element={<Users />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/franqueados" element={<Franqueados />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </main>

        {/* Status de Conexão Supabase */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-lg border border-slate-100 text-[10px] font-bold uppercase tracking-wider">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            dbStatus === 'connected' ? "bg-green-500" : dbStatus === 'error' ? "bg-red-500" : "bg-amber-500"
          )} />
          {dbStatus === 'connected' ? (
            <span className="text-green-600">Conectado ao Supabase</span>
          ) : dbStatus === 'error' ? (
            <span className="text-red-600">Erro de Conexão</span>
          ) : (
            <span className="text-amber-600">Verificando Banco...</span>
          )}
        </div>
      </div>
    </RegionProvider>
  );
}
