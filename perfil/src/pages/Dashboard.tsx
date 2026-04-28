import React, { useState, useEffect } from 'react';
import { TrendingUp, Truck, Clock, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, orderBy, limit, handleFirestoreError, OperationType, seedInitialData, auth } from '@/firebase';
import { type Order } from '@/types';

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const handleSeed = async () => {
    try {
      await seedInitialData();
      alert("Dados iniciais semeados com sucesso!");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Painel Operacional</h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
        {user?.email === "7ul105k4r4n70@gmail.com" && (
          <button 
            onClick={handleSeed}
            className="text-xs font-bold text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
          >
            SEMEAR DADOS INICIAIS
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Entregas do Dia</span>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-on-surface mb-1">1.284</span>
            <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs última semana</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border-l-4 border-secondary shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Pedidos Pendentes</span>
            <div className="bg-secondary/10 text-secondary p-2 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-on-surface mb-1">42</span>
            <div className="flex items-center gap-1 text-red-600 text-sm font-bold">
              <span>8 lotes urgentes</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border-l-4 border-tertiary shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Estoque Crítico</span>
            <div className="flex bg-slate-100 p-1 rounded-lg text-[10px]">
              <button className="bg-white px-3 py-1 rounded shadow-sm font-bold">UNID</button>
              <button className="px-3 py-1 text-on-surface-variant opacity-60">CAIXAS</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Frango Tradicional</span>
              <span className="font-bold">14.200</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Carne de Sol</span>
              <span className="font-bold">9.420</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-[60%] rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold tracking-tight">Entregas Recentes</h3>
            <button className="text-sm font-bold text-primary hover:underline underline-offset-4">Ver Mapa Logístico</button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">ID Pedido</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">Destino</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">Unidades</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-on-surface-variant">Carregando pedidos...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-on-surface-variant">Nenhum pedido recente encontrado.</td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-5 font-bold text-on-surface">{order.id}</td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">{order.pointName}</td>
                    <td className="px-6 py-5 text-sm">{order.units}</td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider",
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        order.status === 'IN PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Última Verificação</h4>
            <div className="relative group cursor-pointer overflow-hidden rounded-xl h-64 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1601050690597-df056fb01793?q=80&w=400&auto=format&fit=crop" 
                alt="Verification" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-lg border border-white/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase">ID Verificação</p>
                    <p className="text-sm font-bold text-on-surface">REC-V-49201</p>
                  </div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Temp. Lote</p>
                <p className="text-lg font-black">68°C</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Tempo Carga</p>
                <p className="text-lg font-black">4m 20s</p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Índice de Eficiência</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm opacity-80">Terminal Recife</span>
                <span className="text-2xl font-black">94.8%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[94.8%]"></div>
              </div>
              <p className="text-[10px] opacity-70 italic">Operando em capacidade ideal para o turno atual.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
