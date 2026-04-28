import React, { useState, useEffect } from 'react';
import { TrendingUp, Truck, Clock, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase, subscribeToTable, seedInitialData } from '@/supabase';
import { type Order, type Region } from '@/types';

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverNames, setDriverNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    supabase.from('app_users').select('id, name').in('role', ['motorista', 'driver']).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((u: any) => { map[u.id] = u.name; });
        setDriverNames(map);
      }
    });
  }, []);

  const getTimeStatus = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // 7:00 (420 min) às 12:00 (720 min) -> Verde
    if (totalMinutes >= 420 && totalMinutes <= 720) {
      return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Operacional' };
    }
    
    // 12:01 (721 min) às 13:00 (780 min) -> Vermelho
    if (totalMinutes > 720 && totalMinutes <= 780) {
      return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Intervalo' };
    }

    // 16:45 (1005 min) às 7:00 (420 min do dia seguinte) -> Vermelho
    // Como é um ciclo que passa pela meia-noite:
    if (totalMinutes >= 1005 || totalMinutes < 420) {
      return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Fora de Horário' };
    }

    // Outros horários (ex: 13:01 às 16:44) -> Padrão cinza/neutro ou manter operacional se preferir
    return { color: 'bg-slate-100 text-on-surface-variant border-slate-200', label: 'Padrão' };
  };

  const timeStatus = getTimeStatus();

  const handleSeed = async () => {
    try {
      await seedInitialData(user?.id ?? 'system');
      alert("Dados iniciais semeados com sucesso!");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    // Otimização: Carregar apenas pedidos dos últimos 7 dias para o dashboard
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Usar filtro vazio para 'Todas'
    const regionFilter = region === 'Todas' ? {} : { region };
    
    const unsub = subscribeToTable('orders', regionFilter, (data) => {
      if (!cancelled) {
        // Filtrar apenas pedidos recentes no cliente também
        const recentOrders = (data || []).filter(order => {
          const orderDate = new Date(order.created_at || order.timestamp || Date.now());
          return orderDate >= sevenDaysAgo;
        });
        setOrders(recentOrders);
        setLoading(false);
      }
    }, 'created_at');
    return () => { cancelled = true; unsub(); };
  }, [region]);

  // Agregados reais
  const totalUnits = orders.reduce((acc, curr) => acc + (curr.units || 0), 0);
  const completedOrders = orders.filter(o => ['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => !['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length;
  const urgentOrders = orders.filter(o => o.status === 'IDLE' || o.status === 'AWAITING LOGISTICS').length;

  return (
    <div className="space-y-8">
      <header className="relative flex items-center justify-between min-h-[64px]">
        {/* Lado Esquerdo: Título */}
        <div className="z-10">
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Painel Operacional</h2>
        </div>

        {/* Centro: Data e Hora */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={cn(
            "flex items-center gap-2 border px-4 py-2 rounded-full transition-colors duration-500",
            timeStatus.color
          )}>
            <Clock className="w-4 h-4" />
            <span className="font-bold text-sm">
              {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Lado Direito: Botão (se existir) */}
        <div className="z-10">
          {user?.email === "7ul105k4r4n70@gmail.com" && (
            <button 
              onClick={handleSeed}
              className="text-xs font-bold text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              SEMEAR DADOS INICIAIS
            </button>
          )}
        </div>
      </header>

      {/* Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Recife', 'Salvador'] as Region[]).map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={cn('px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border-l-4 border-primary shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Entregas do Dia</span>
            <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-on-surface mb-0.5">{completedOrders}</span>
            <div className="flex items-center gap-1 text-green-600 text-[11px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>Unidades: {totalUnits.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl border-l-4 border-secondary shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Pedidos Pendentes</span>
            <div className="bg-secondary/10 text-secondary p-1.5 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-on-surface mb-0.5">{pendingOrders}</span>
            <div className="flex items-center gap-1 text-red-600 text-[11px] font-bold">
              <span>{urgentOrders} urgentes</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl border-l-4 border-tertiary shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Estoque Crítico</span>
            <div className="flex bg-slate-100 p-1 rounded-lg text-[9px]">
              <button className="bg-white px-2 py-0.5 rounded shadow-sm font-bold">UNID</button>
              <button className="px-2 py-0.5 text-on-surface-variant opacity-60">CAIXAS</button>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Frango Tradicional</span>
              <span className="font-bold">14.200</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Carne de Sol</span>
              <span className="font-bold">9.420</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-[60%] rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cards de Status de Entregas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Entregas do Dia */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Entregas do Dia</span>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-on-surface">{orders.length}</p>
              <p className="text-xs text-on-surface-variant">pedidos programados</p>
            </div>
          </div>

          {/* Entregas em Viagem */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Em Viagem</span>
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Entregues</span>
                <span className="text-lg font-black text-secondary">{orders.filter(o => ['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pendentes</span>
                <span className="text-lg font-black text-amber-500">{orders.filter(o => ['IN_PROGRESS', 'IN PROGRESS', 'ACCEPTED'].includes(o.status)).length}</span>
              </div>
            </div>
          </div>

          {/* Entregas Pendentes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pendentes para Segunda viagem</span>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Entregues</span>
                <span className="text-lg font-black text-secondary">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pendentes</span>
                <span className="text-lg font-black text-amber-600">
                  {orders.filter(o => !['COMPLETED', 'DELIVERED', 'Entregue', 'IN_PROGRESS', 'IN PROGRESS', 'ACCEPTED'].includes(o.status)).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-2">Rota dos Motoristas</h4>
          
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[800px] pr-2">
            {/* Motoristas: todos os pedidos deles. Sem Motorista: apenas pedidos de hoje */}
            {Object.entries(
              orders.reduce<Record<string, Order[]>>((acc, order) => {
                if (!['COMPLETED', 'DELIVERED', 'Entregue', 'CANCELLED', 'Cancelado'].includes(order.status)) {
                  const driverId = (order as any).driver_id;
                  const driver = order.driverName || (order as any).driver_name
                    || (driverId ? driverNames[driverId] : null)
                    || 'Sem Motorista';
                  if (driver === 'Sem Motorista') {
                    const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Recife' });
                    const orderStr = new Date((order as any).created_at || order.timestamp).toLocaleDateString('pt-BR', { timeZone: 'America/Recife' });
                    if (orderStr !== todayStr) return acc;
                  }
                  if (!acc[driver]) acc[driver] = [];
                  acc[driver].push(order);
                }
                return acc;
              }, {})
            ).length > 0 ? (
              Object.entries(
                orders.reduce<Record<string, Order[]>>((acc, order) => {
                  if (!['COMPLETED', 'DELIVERED', 'Entregue', 'CANCELLED', 'Cancelado'].includes(order.status)) {
                    const driverId = (order as any).driver_id;
                    const driver = order.driverName || (order as any).driver_name
                      || (driverId ? driverNames[driverId] : null)
                      || 'Sem Motorista';
                    if (driver === 'Sem Motorista') {
                      const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Recife' });
                      const orderStr = new Date((order as any).created_at || order.timestamp).toLocaleDateString('pt-BR', { timeZone: 'America/Recife' });
                      if (orderStr !== todayStr) return acc;
                    }
                    if (!acc[driver]) acc[driver] = [];
                    acc[driver].push(order);
                  }
                  return acc;
                }, {})
              ).map(([driver, driverOrders]: [string, Order[]]) => (
                <div key={driver} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-on-surface uppercase tracking-tight block leading-none">{driver}</span>
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{driverOrders.length} {driverOrders.length === 1 ? 'entrega pendente' : 'entregas pendentes'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {driverOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between group pl-2 border-l-2 border-slate-100 hover:border-primary transition-colors py-0.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                            {(order as any).point_name || order.pointName || 'Desconhecido'}
                          </span>
                          <span className="text-[9px] text-on-surface-variant font-medium">
                            {order.vehicle || 'Sem veículo'}
                            {!['IN PROGRESS','IN_PROGRESS','IN_TRANSIT','ACCEPTED'].includes(order.status) && (
                              <>
                                {' · '}
                                {new Date((order as any).created_at || order.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Recife' })}
                              </>
                            )}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ml-2",
                          ['IN PROGRESS','IN_PROGRESS','IN_TRANSIT','ACCEPTED'].includes(order.status) ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {['IN PROGRESS','IN_PROGRESS','IN_TRANSIT','ACCEPTED'].includes(order.status) ? 'Em Rota' : 'Aguardando'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-on-surface-variant italic font-medium">Nenhuma rota ativa no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
