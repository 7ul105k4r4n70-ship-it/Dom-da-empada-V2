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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth, signOut } from '@/firebase';

const navItems = [
  { icon: LayoutDashboard, label: 'Painel', path: '/' },
  { icon: FileText, label: 'Relatórios', path: '/reports' },
  { icon: Calendar, label: 'Cronograma', path: '/schedule' },
  { icon: ShoppingCart, label: 'Pedidos', path: '/orders' },
  { icon: BarChart3, label: 'KPIs', path: '/kpis' },
  { icon: ArrowLeftRight, label: 'Transferência', path: '/transfer' },
  { icon: Wallet, label: 'Finanças', path: '/finance' },
  { icon: Users, label: 'Usuários', path: '/users' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">Dom da Empada</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
          Excelência Operacional
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
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
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 bg-slate-100 rounded-xl flex items-center gap-3">
          <img 
            src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-on-surface truncate">{user?.displayName || "Usuário"}</p>
            <p className="text-[10px] text-on-surface-variant uppercase">Colaborador</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
