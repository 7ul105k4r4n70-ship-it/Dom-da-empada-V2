import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  ShoppingCart, 
  BarChart3, 
  ArrowLeftRight, 
  Wallet, 
  Users,
  LogOut,
  PackageSearch,
  Car,
  Package,
  UserCircle,
  Store,
  X,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/supabase';

const navItems = [
  { icon: LayoutDashboard, label: 'Painel', path: '/' },
  { icon: FileText, label: 'Relatórios', path: '/reports' },
  { icon: Calendar, label: 'Agenda de Viagens', path: '/schedule' },
  { icon: ShoppingCart, label: 'Pedidos', path: '/orders' },
  { icon: BarChart3, label: 'Indicadores de Entrega', path: '/kpis' },
  { icon: ArrowLeftRight, label: 'Transferência', path: '/transfer' },
  { icon: Wallet, label: 'Preços & Royalties', path: '/finance' },
  { icon: Store, label: 'Franqueados', path: '/franqueados' },
  { icon: PackageSearch, label: 'Entregas Extras', path: '/extras' },
  { icon: Car, label: 'Veículos', path: '/vehicles' },
  { icon: Users, label: 'Usuários', path: '/users', adminOnly: true },
];

export function Sidebar({ 
  adminAuth = false, 
  mobileOpen = false, 
  onClose = () => {}
}: { 
  adminAuth?: boolean; 
  mobileOpen?: boolean; 
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const logoUrl = '/logo.png';

  // Admin auth passado como prop — sem chamada de rede

  const handleLogout = async () => {
    try {
      // Limpar todas as chaves de autenticação e dados da sessão
      localStorage.removeItem('admin_master_auth');
      localStorage.removeItem('portal_user_email');
      localStorage.removeItem('portal_user_role');
      
      // Limpar pedidos ativos e dados relacionados
      localStorage.removeItem('active_orders');
      localStorage.removeItem('orders_cache');
      localStorage.removeItem('pending_orders');
      
      // Limpar chave regional e dados de região
      localStorage.removeItem('region');
      localStorage.removeItem('selected_region');
      localStorage.removeItem('user_region');
      
      // Limpar dados do usuário
      localStorage.removeItem('user');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');
      
      // Limpar sessionStorage também
      sessionStorage.clear();
      
      await signOutUser();
      window.location.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
      // Forçar limpeza mesmo em erro
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar desktop — fixa na esquerda */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50 hidden lg:flex">
        {/* Desktop sidebar content */}
        <div className="mb-6 px-2 text-center">
          <img src={logoUrl} alt="Dom da Empada" className="h-20 w-auto mx-auto mb-2" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold hidden xl:block">A Melhor Empada do Brasil</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.filter(item => !item.adminOnly || adminAuth).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-slate-200/50 text-primary font-bold" 
                  : "text-slate-600 hover:text-primary hover:bg-slate-200"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden xl:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 space-y-3">
          <div onClick={() => navigate('/profile')} className="p-3 bg-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-all group">
            <img src={adminAuth ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} alt="Profile" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary">{adminAuth ? 'Admin Master' : 'Usuário'}</p>
              <p className="text-[9px] text-on-surface-variant uppercase hidden xl:block">Ver Perfil</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden xl:inline">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Drawer mobile — desliza da esquerda */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50 lg:hidden transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Botao fechar */}
        <button onClick={onClose} className="self-end p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg mb-2">
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6 px-2 text-center">
          <img src={logoUrl} alt="Dom da Empada" className="h-20 w-auto mx-auto mb-2" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">A Melhor Empada do Brasil</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.filter(item => !item.adminOnly || adminAuth).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-slate-200/50 text-primary font-bold" 
                  : "text-slate-600 hover:text-primary hover:bg-slate-200"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 space-y-3">
          <div onClick={() => { navigate('/profile'); onClose(); }} className="p-3 bg-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-all">
            <img src={adminAuth ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} alt="Profile" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate">{adminAuth ? 'Admin Master' : 'Usuário'}</p>
              <p className="text-[9px] text-on-surface-variant uppercase">Ver Perfil</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>
    </>
  );
}
