import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Truck, Clock, Package, Calendar, Navigation, MapPin, FileText, User, AlertTriangle, Camera, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase, subscribeToTable, seedInitialData } from '@/supabase';
import { type Order, type Region } from '@/types';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverNames, setDriverNames] = useState<Record<string, string>>({});
  const [todaySchedules, setTodaySchedules] = useState<Array<{
    id: string;
    title: string;
    location: string;
    time: string;
    driver: string;
    vehicle: string;
    stops_count?: number;
    order_ids?: string[];
    points?: Array<{ id: string; name: string; region: string }>;
  }>>([]);

  // Estado para modal de detalhes do pedido
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  
  // IDs sendo excluídos (para feedback imediato na UI)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

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

  // driverDaySchedules calculado via useMemo (reativo a todaySchedules e orders)

  // linkedOrders calculado dinamicamente via useMemo (sempre atualizado quando orders mudam)
  const linkedOrders = useMemo(() => {
    const map: Record<string, Order[]> = {};
    todaySchedules.forEach((s: any) => {
      const pointNames = (s.points || []).map((p: any) => (p.name || '').toLowerCase().trim()).filter(Boolean);
      map[s.id] = orders.filter((o: any) => {
        if ((s.order_ids || []).includes(o.id)) return true;
        const orderPoint = (o.pointName || o.point_name || '').toLowerCase().trim();
        return pointNames.some((pn: string) => {
          if (!pn || !orderPoint) return false;
          return orderPoint === pn; // Match exato
        });
      });
    });
    return map;
  }, [orders, todaySchedules]);

  // Agrupa agendamentos por motorista+data, ocultando apenas viagens DE HOJE cujos pedidos foram todos entregues
  const driverDaySchedules = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const deliveredStatuses = ['completed', 'delivered', 'entregue', 'conclu\u00edda', 'concluida', 'concluido', 'finalizado', 'done'];
    const grouped: Record<string, typeof todaySchedules> = {};
    todaySchedules.forEach((s: any) => {
      // Sempre ocultar se o status do próprio agendamento for "concluída" etc.
      const scheduleStatusLower = (s.status || '').toLowerCase();
      const isScheduleDone = deliveredStatuses.some(st => scheduleStatusLower.includes(st));
      if (isScheduleDone) return;
      // Verificar pedidos entregues APENAS para agendamentos de hoje
      const isToday = s.scheduled_date === todayStr;
      if (isToday && (s.order_ids || []).length > 0) {
        const linked = orders.filter((o: any) => (s.order_ids || []).includes(o.id));
        const allDone = linked.length > 0 && linked.every((o: any) => {
          const oStatus = (o.status || '').toLowerCase();
          return deliveredStatuses.some(ds => oStatus.includes(ds));
        });
        if (allDone) return;
      }
      const key = `${s.driver || 'Sem motorista'}|${s.scheduled_date}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    });
    return grouped;
  }, [todaySchedules, orders]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .gte('scheduled_date', todayStr)
          .order('scheduled_date', { ascending: true })
          .order('scheduled_time', { ascending: true });

        if (!error && data) {
          const schedules = data.map((s: any) => {
            let parsedPoints: Array<{ id: string; name: string; region: string }> | undefined;
            if (s.points_json) {
              try { parsedPoints = JSON.parse(s.points_json); } catch { /* ignore */ }
            }
            // Fallback: extrair pontos da location separada por →
            if (!parsedPoints && s.location && s.location.includes('→')) {
              const names = s.location.split('→').map((n: string) => n.trim()).filter(Boolean);
              parsedPoints = names.map((name: string, idx: number) => ({
                id: `stop-${idx}`,
                name,
                region: s.region || ''
              }));
            }
            return {
              id: s.id,
              title: s.title || 'Rota',
              location: s.location || '',
              time: s.scheduled_time || '',
              driver: s.driver_name || '',
              vehicle: s.vehicle_name || '',
              scheduled_date: s.scheduled_date,
              stops_count: s.stops_count || 1,
              order_ids: s.order_ids || [],
              points: parsedPoints,
              status: s.status || '',
            };
          });
          setTodaySchedules(schedules);
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e);
      }
    };
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 300000);
    return () => clearInterval(interval);
  }, [region]);

  // Buscar pedido pelo nome do ponto e abrir modal PDF
  const handleOpenPdfForPoint = async (pointName: string) => {
    const normalized = pointName.toLowerCase().trim();
    if (!normalized) return;
    try {
      // Buscar pedido mais recente com este ponto
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('region', region)
        .or(`pointName.ilike.%${pointName}%,point_name.ilike.%${pointName}%`)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setSelectedOrderForModal(data[0] as Order);
      } else {
        // Fallback: busca parcial
        const { data: fallback } = await supabase
          .from('orders')
          .select('*')
          .eq('region', region)
          .order('created_at', { ascending: false })
          .limit(50);
        const matched = (fallback || []).find((o: any) => {
          const pn = (o.pointName || o.point_name || '').toLowerCase().trim();
          return pn.includes(normalized) || normalized.includes(pn);
        });
        if (matched) {
          setSelectedOrderForModal(matched as Order);
        } else {
          alert('Nenhum pedido encontrado para este ponto. Crie o pedido em "Gestão de Pedidos" primeiro.');
        }
      }
    } catch (e) {
      console.error('[Dashboard] Erro ao buscar pedido do ponto:', e);
    }
  };

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
        const allOrders = data || [];
        const doneStatuses = ['completed', 'delivered', 'entregue', 'cancelled', 'cancelado', 'closed', 'fechado'];
        const semMotorista = allOrders.filter(o => {
          const statusLower = (o.status || '').toLowerCase();
          const isDone = doneStatuses.some(s => statusLower.includes(s));
          const hasDriver = !!(o.driver_name || (o as any).driverName || (o as any).driver_id);
          return !isDone && !hasDriver;
        });
        console.log('[Dashboard] Total pedidos carregados:', allOrders.length);
        console.log('[Dashboard] Pedidos SEM MOTORISTA:', semMotorista.length);
        console.log('[Dashboard] Status dos pedidos SEM MOTORISTA:', [...new Set(semMotorista.map(o => o.status))]);
        setOrders(allOrders);
        setLoading(false);
      }
    }, 'created_at');
    return () => { cancelled = true; unsub(); };
  }, [region]);

  // Helper: verifica se uma data é hoje (timezone America/Recife)
  const isToday = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Recife', day: '2-digit', month: '2-digit', year: 'numeric' });
    const orderStr = d.toLocaleDateString('pt-BR', { timeZone: 'America/Recife', day: '2-digit', month: '2-digit', year: 'numeric' });
    return orderStr === todayStr;
  };

  // Pedidos do dia atual (considerando created_at ou delivered_at)
  const todayOrders = orders.filter(o => isToday(o.created_at) || isToday(o.delivered_at));

  // Agregados reais
  const totalUnits = orders.reduce((acc, curr) => acc + (curr.units || 0), 0);
  const completedOrders = orders.filter(o => ['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => !['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length;
  const urgentOrders = orders.filter(o => o.status === 'AGUARDANDO' || o.status === 'AGUARDANDO LOGÍSTICA').length;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cards de Status de Entregas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Entregas do Dia */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Entregas do Dia</span>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Feitas</span>
                <span className="text-lg font-black text-secondary">{todayOrders.filter(o => ['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pendentes</span>
                <span className="text-lg font-black text-amber-500">{orders.filter(o => ['EM ANDAMENTO', 'EM_ANDAMENTO', 'ACEITO'].includes(o.status)).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Sem Motorista</span>
                <span className="text-lg font-black text-red-500">{orders.filter(o => !['COMPLETED', 'DELIVERED', 'Entregue', 'CANCELLED', 'Cancelado'].includes(o.status) && !(o.driver_name || (o as any).driverName || (o as any).driver_id)).length}</span>
              </div>
            </div>
          </div>

          {/* Viagens Agendadas - Cards por Motorista-Dia */}
          {Object.entries(driverDaySchedules).length > 0 ? (
            Object.entries(driverDaySchedules).map(([key, daySchedules]) => {
              const [driverName, dateStr] = key.split('|');
              const displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              
              return (
                <div key={key} className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col overflow-hidden">
                  {/* Header bordô com infos do motorista */}
                  <div className="bg-[#7B2D3B] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">{driverName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {isToday ? 'Hoje' : displayDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/80">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {daySchedules[0]?.vehicle || 'Sem veículo'}
                      </span>
                      <span>· {(daySchedules as any).length} viagem{(daySchedules as any).length > 1 ? 'ns' : ''}</span>
                    </div>
                  </div>
                  
                  {/* Corpo branco com as viagens */}
                  <div className="p-3 flex-1">
                    <div className="space-y-2 flex-1 overflow-y-auto max-h-[240px] pr-1">
                      {(daySchedules as any).map((schedule: any) => {
                        const scheduleOrders = linkedOrders[schedule.id] || [];
                        return (
                          <div key={schedule.id} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-black text-slate-800">{schedule.type || schedule.title || 'Rota'}</p>
                                {schedule.scheduled_time && (
                                  <p className="text-[9px] text-slate-500">{schedule.scheduled_time}</p>
                                )}
                              </div>
                              {schedule.status === 'Conflito' && (
                                <span className="text-[8px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">CONFLITO</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-600 mb-1">{schedule.vehicle || 'Sem veículo'}</p>

                            {/* Pontos de entrega */}
                            {(() => {
                              let pts: Array<{name: string; region?: string}> = [];
                              if (schedule.points && schedule.points.length > 0) {
                                pts = schedule.points;
                              } else if (schedule.location) {
                                pts = schedule.location.split(/\s*[â†’â†’>]+\s*/).filter((s: string) => s.trim()).map((name: string) => ({ name: name.trim() }));
                              }
                              if (pts.length === 0) return null;
                              return (
                                <div className="space-y-1 mt-1.5 pt-1.5 border-t border-slate-200">
                                  <p className="text-[9px] font-bold text-slate-500 uppercase">{pts.length} parada{pts.length > 1 ? 's' : ''}</p>
                                  {pts.map((point: any, idx: number) => {
                                    const name = typeof point === 'string' ? point : point.name;
                                    
                                    // NOVO CÓDIGO: Busca global nos pedidos ativos para encontrar TODOS os pedidos do ponto na data da viagem
                                    const ptName = (name || '').toLowerCase().trim();
                                    
                                    // Remove espaços em branco extras, acentos e pontuação para comparar
                                    const normalizeString = (str: string) => {
                                      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().trim();
                                    };
                                    
                                    const normalizedPtName = normalizeString(ptName);
                                    
                                    // Filtrar pedidos do ponto (sem filtro de data por enquanto)
                                    const pointOrders = orders.filter((o: Order) => {
                                        const orderPoint = (o.pointName || (o as any).point_name || '').toLowerCase().trim();
                                        const normalizedOrderPoint = normalizeString(orderPoint);
                                        const statusLower = (o.status || '').toLowerCase();
                                        
                                        // Apenas pedidos ativos (ignorando cancelados e os que já foram concluídos/entregues)
                                        const isDoneOrInvalid = ['cancelled', 'cancelado', 'deleted', 'excluido', 'completed', 'delivered', 'entregue', 'closed', 'fechado'].some(s => statusLower.includes(s));
                                        
                                        // Debug logs
                                        console.log('[Dashboard Debug] Ponto:', name, '| Pedido:', orderPoint, '| Normalizado Ponto:', normalizedPtName, '| Normalizado Pedido:', normalizedOrderPoint, '| Ativo:', !isDoneOrInvalid);
                                        
                                        // Verifica se o nome bate e se o pedido é ativo
                                        return normalizedOrderPoint && normalizedPtName && normalizedOrderPoint === normalizedPtName && !isDoneOrInvalid;
                                      });
                                    
                                    console.log('[Dashboard Debug] Total pedidos encontrados para ponto', name, ':', pointOrders.length);

                                    return (
                                      <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                          <span className="w-4 h-4 rounded-full bg-[#7B2D3B]/10 text-[#7B2D3B] flex items-center justify-center text-[8px] font-bold shrink-0">
                                            {idx + 1}
                                          </span>
                                          <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-700 truncate">{name}</p>
                                            {point.region && <p className="text-[9px] text-slate-500">{point.region}</p>}
                                          </div>
                                        </div>

                                        {/* Botões PDF dos Pedidos (múltiplos se houver) */}
                                        {pointOrders.length > 0 && (
                                          <div className="space-y-1">
                                            {pointOrders.map((order: Order, orderIdx: number) => (
                                              <button
                                                key={order.id}
                                                onClick={() => setSelectedOrderForModal(order)}
                                                className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm group/btn"
                                              >
                                                <FileText className="w-3.5 h-3.5 text-[#7B2D3B] group-hover/btn:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold text-slate-700">
                                                  Pedido #{(order as any).short_id || (order as any).id?.replace(/\D/g, '').substring(0,3) || '...'}
                                                  {pointOrders.length > 1 && <span className="text-slate-400 ml-1">({orderIdx + 1}/{pointOrders.length})</span>}
                                                </span>
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col overflow-hidden min-h-[180px]">
              <div className="bg-[#7B2D3B] p-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-xs font-black text-white">Viagens Agendadas</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-5">
                <AlertTriangle className="w-6 h-6 text-[#7B2D3B]/30 mb-2" />
                <p className="text-xs text-slate-400 font-medium">Nenhuma viagem agendada.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 w-full lg:col-span-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-2">Rota dos Motoristas</h4>
          
          <div className="flex flex-wrap gap-4 overflow-y-auto max-h-[800px] pr-2 w-full">
            {/* Motoristas: todos os pedidos deles. Sem Motorista: TODOS os pedidos nao selecionados */}
            {(() => {
              const doneStatuses = ['completed', 'delivered', 'entregue', 'cancelled', 'cancelado', 'closed', 'fechado'];
              const deleteOrder = async (id: string) => {
                // Feedback imediato: remove da UI antes de confirmar no banco
                setOrders(prev => prev.filter(o => o.id !== id));
                setDeletingIds(prev => { const s = new Set(prev); s.add(id); return s; });
                try {
                  const { error } = await supabase.from('orders').delete().eq('id', id);
                  if (error) console.error('[Dashboard] Erro ao excluir pedido:', error.message);
                } catch (err) {
                  console.error('[Dashboard] Falha ao excluir pedido:', err);
                } finally {
                  setDeletingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
                }
              };
              const grouped = orders.reduce<Record<string, Order[]>>((acc, order) => {
                const statusLower = (order.status || '').toLowerCase();
                const isDone = doneStatuses.some(s => statusLower.includes(s));
                if (!isDone) {
                  const driverId = (order as any).driver_id;
                  const driver = order.driverName || (order as any).driver_name
                    || (driverId ? driverNames[driverId] : null)
                    || 'Sem Motorista';
                  if (!acc[driver]) acc[driver] = [];
                  acc[driver].push(order);
                }
                return acc;
              }, {});
              console.log('[Dashboard] Cards motoristas - grupos:', Object.keys(grouped).map(k => `${k}: ${grouped[k].length}`));
              return Object.entries(grouped).length > 0 ? (
              Object.entries(grouped).map(([driver, driverOrders]: [string, Order[]]) => (
                <div key={driver} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow w-[340px]">
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
                        <div 
                          key={order.id} 
                          onClick={() => setSelectedOrderForModal(order)}
                          className="flex items-center justify-between group pl-2 border-l-2 border-slate-100 hover:border-primary transition-colors py-0.5 cursor-pointer hover:bg-slate-50 rounded-r-lg"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                              {(order as any).point_name || order.pointName || 'Desconhecido'}
                            </span>
                            <span className="text-[9px] text-on-surface-variant font-medium">
                              {order.vehicle || 'Sem veículo'}
                              {!['EM ANDAMENTO','EM_ANDAMENTO','EM_TRÂNSITO','ACEITO'].includes(order.status) && (
                                <>
                                  {' · '}
                                  {new Date((order as any).created_at || order.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Recife' })}
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            {driver === 'Sem Motorista' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteOrder(order.id);
                                }}
                                disabled={deletingIds.has(order.id)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors shrink-0 ml-1 disabled:opacity-40"
                                title="Excluir permanentemente"
                              >
                                <X className="w-3 h-3 text-red-400 hover:text-red-600" />
                              </button>
                            )}
                            <span className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ml-2",
                              ['EM ANDAMENTO','EM_ANDAMENTO','EM_TRÂNSITO','ACEITO'].includes(order.status) ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                            )}>
                              {['EM ANDAMENTO','EM_ANDAMENTO','EM_TRÂNSITO','ACEITO'].includes(order.status) ? 'Em Rota' : 'Aguardando'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-on-surface-variant italic font-medium">Nenhuma rota ativa no momento.</p>
              </div>
            )})()}
          </div>
        </div>
      </div>

      {/* Modal de detalhes do pedido - abre ao clicar no ícone de câmera */}
      {selectedOrderForModal && (
        <OrderDetailsModal
          order={selectedOrderForModal}
          onClose={() => setSelectedOrderForModal(null)}
        />
      )}
    </div>
  );
}
