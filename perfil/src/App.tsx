import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { Reports } from '@/pages/Reports';
import { Schedule } from '@/pages/Schedule';
import { Orders } from '@/pages/Orders';
import { KPIs } from '@/pages/KPIs';
import { Transfer } from '@/pages/Transfer';
import { Finance } from '@/pages/Finance';
import { Users } from '@/pages/Users';
import { Login } from '@/pages/Login';
import { type Region } from '@/types';
import { auth, onAuthStateChanged } from '@/firebase';

export default function App() {
  const [region, setRegion] = useState<Region>('Recife');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dom da Empada Control';
      case '/reports': return 'Relatórios de Entrega';
      case '/schedule': return 'Cronograma de Viagens';
      case '/orders': return 'Gestão de Pedidos';
      case '/kpis': return 'Indicadores de Desempenho';
      case '/transfer': return 'Transferência de Estoque';
      case '/finance': return 'Preços e Royalties';
      case '/users': return 'Gestão de Usuários';
      default: return 'Dom da Empada Control';
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

  if (location.pathname === '/login') {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar region={region} setRegion={setRegion} title={getTitle()} />
      
      <main className="ml-64 pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/kpis" element={<KPIs />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>

      <button className="fixed bottom-8 right-8 primary-gradient text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-50">
        <span className="text-xl font-bold">+</span>
        <span className="font-bold uppercase tracking-wider text-xs">Novo Lote {region}</span>
      </button>
    </div>
  );
}
