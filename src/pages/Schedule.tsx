import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  User,
  Clock,
  X,
  ChevronDown,
  Navigation,
  FileText,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { type Region, type Order } from '@/types';
import { supabase, normalizeStorageUrl } from '@/supabase';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

interface ScheduleItem {
  id: string;
  day: number;
  date: string;
  type: string;
  location: string;
  time: string;
  vehicle: string;
  driver: string;
  status: 'Ativa' | 'Conflito' | 'Aguardando' | 'Concluída';
  color: string;
  orderIds?: string[];
  points?: Array<{ id: string; name: string; time: string; region: string }>;
}

export function Schedule() {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<ScheduleItem | null>(null);
  const [tripOrders, setTripOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filters, setFilters] = useState({
    driver: '',
    vehicle: '',
    status: ''
  });

  const [drivers, setDrivers] = useState<Array<{id: string, name: string, status: string}>>([]);
  const [vehicles, setVehicles] = useState<Array<{id: string, plate: string, model: string, status: string}>>([]);
  const [points, setPoints] = useState<Array<{id: string, name: string, region: string}>>([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] = useState<{
    points: Array<{ pointId: string }>;
    driverId: string;
    vehicleId: string;
    date: string;
    type: string;
  }>({
    points: [{ pointId: '' }],
    driverId: '',
    vehicleId: '',
    date: '',
    type: 'Rota Padrão'
  });

  // Calendário dinâmico - semana atual
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  useEffect(() => {
    const fetchData = async () => {
      // Timeout de 3s para cada fetch
      const withTimeout = <T,>(p: Promise<T>, fallback: T): Promise<T> =>
        Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), 8000))]);

      const emptyResult = { data: null, error: null };
      try {
        const [driversRes, vehiclesRes, franchiseesRes] = await Promise.all([
          withTimeout(supabase.from('app_users').select('id, name, status').eq('role', 'motorista') as any, emptyResult),
          withTimeout(supabase.from('vehicles').select('id, plate, model, status') as any, emptyResult),
          withTimeout(supabase.from('franchisees').select('id, name, points, region') as any, emptyResult)
        ]);

        if (driversRes.data && driversRes.data.length > 0) {
          setDrivers(driversRes.data);
        }
        if (vehiclesRes.data && vehiclesRes.data.length > 0) {
          setVehicles(vehiclesRes.data);
        }
        if (franchiseesRes.data && franchiseesRes.data.length > 0) {
          const allPoints: Array<{id: string, name: string, region: string}> = [];
          franchiseesRes.data.forEach((f: any) => {
            if (Array.isArray(f.points)) {
              f.points.forEach((p: any) => {
                allPoints.push({ id: p.id, name: p.name, region: f.region });
              });
            }
          });
          setPoints(allPoints);
        }
      } catch (error) {
        console.error('Erro ao carregar dados para agendamento:', error);
      } finally {
        setLoadingPoints(false);
      }
    };
    fetchData();
  }, []);

  // Formata data local como YYYY-MM-DD (evita problema de timezone do toISOString)
  const fmtDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Carrega agendamentos do Supabase (período de 4 semanas)
  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const periodEnd = new Date(currentWeekStart);
      periodEnd.setDate(periodEnd.getDate() + 27);

      const startStr = fmtDate(currentWeekStart);
      const endStr = fmtDate(periodEnd);

      let query = supabase.from('schedules').select('*');
      if (region !== 'Todas') {
        query = query.eq('region', region);
      }
      const { data, error } = await query
        .gte('scheduled_date', startStr)
        .lte('scheduled_date', endStr)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar agendamentos:', error);
        setScheduleItems([]);
        setLoadingSchedules(false);
        return;
      }

      console.log('CALENDARIO - Agendamentos recebidos:', data?.length || 0, data);
      
      const items: ScheduleItem[] = (data || []).map((s: any) => {
        let parsedPoints: Array<{ id: string; name: string; time: string; region: string }> | undefined;
        if (s.points_json) {
          try { parsedPoints = JSON.parse(s.points_json); } catch { /* ignore */ }
        }
        if (!parsedPoints && s.location && s.location.includes('→')) {
          const names = s.location.split('→').map((n: string) => n.trim());
          parsedPoints = names.map((name: string, idx: number) => ({
            id: `stop-${idx}`, name, time: '', region: s.region || ''
          }));
        }
        return {
          id: s.id,
          day: parseInt(s.scheduled_date.split('-')[2], 10),
          date: s.scheduled_date,
          type: s.title || 'Rota',
          location: s.location || '',
          time: s.scheduled_time || '',
          vehicle: s.vehicle_name || '',
          driver: s.driver_name || '',
          status: s.status || 'Ativa',
          color: s.color || 'primary',
          orderIds: s.order_ids || [],
          points: parsedPoints,
        };
      });
      setScheduleItems(items);
    } catch (e) {
      console.error('Erro ao carregar agendamentos:', e);
      setScheduleItems([]);
    }
    setLoadingSchedules(false);
  };

  useEffect(() => {
    loadSchedules();
  }, [region, currentWeekStart]);

  const fetchTripOrders = async (trip: ScheduleItem) => {
    if (!trip.orderIds || trip.orderIds.length === 0) {
      setTripOrders([]);
      return;
    }
    
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('id', trip.orderIds);
      
      if (error) throw error;
      setTripOrders(data || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos da viagem:', error);
      setTripOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSelectTrip = (trip: ScheduleItem) => {
    setSelectedTrip(trip);
    fetchTripOrders(trip);
  };

  // Buscar pedido pelo nome do ponto e abrir modal PDF
  const handleOpenPdfForPoint = async (pointName: string) => {
    const normalized = pointName.toLowerCase().trim();
    if (!normalized) return;
    try {
      // Buscar pedido mais recente com este ponto
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('region', region === 'Todas' ? 'Recife' : region) // Fallback region
        .or(`pointName.ilike.%${pointName}%,point_name.ilike.%${pointName}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setSelectedOrder(data[0] as Order);
      } else {
        alert('Nenhum pedido recente encontrado para este ponto.');
      }
    } catch (e) {
      console.error('[Schedule] Erro ao buscar pedido do ponto:', e);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Deseja realmente excluir este agendamento?')) return;
    // Remove imediatamente do estado local
    setScheduleItems(prev => prev.filter(item => item.id !== id));
    if (selectedTrip?.id === id) setSelectedTrip(null);
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Erro ao excluir agendamento:', err);
      alert('Erro ao excluir agendamento: ' + (err?.message || JSON.stringify(err)));
      // Recarrega em caso de erro para restaurar
      loadSchedules();
    }
  };

  const handleEditStart = (item: ScheduleItem) => {
    console.log('EDITAR - Item clicado:', item);
    
    const editPoints = item.points && item.points.length > 0
      ? item.points.map(p => ({ pointId: p.id.startsWith('stop-') ? '' : p.id }))
      : [{ pointId: '' }];
    
    const matchedDriver = drivers.find(d => d.name === item.driver);
    const matchedVehicle = vehicles.find(v => (v.model + ' ' + v.plate) === item.vehicle);
    
    console.log('EDITAR - Driver encontrado:', matchedDriver);
    console.log('EDITAR - Vehicle encontrado:', matchedVehicle);
    console.log('EDITAR - Points:', editPoints);

    setEditingScheduleId(item.id);
    setNewSchedule({
      points: editPoints,
      driverId: matchedDriver?.id || '',
      vehicleId: matchedVehicle?.id || '',
      date: item.date,
      type: item.type || 'Rota Padrão'
    });
    
    // Rolar até o form
    setTimeout(() => {
      document.getElementById('novo-agendamento-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingScheduleId(null);
    setNewSchedule({
      points: [{ pointId: '' }],
      driverId: '',
      vehicleId: '',
      date: '',
      type: 'Rota Padrão'
    });
  };

  const filteredSchedule = useMemo(() => {
    return scheduleItems.filter(item => {
      const matchDriver = !filters.driver || item.driver === filters.driver;
      const matchVehicle = !filters.vehicle || item.vehicle === filters.vehicle;
      const matchStatus = !filters.status || item.status === filters.status;
      return matchDriver && matchVehicle && matchStatus;
    });
  }, [filters]);

  const uniqueDrivers = Array.from(new Set(scheduleItems.map(i => i.driver)));
  const uniqueVehicles = Array.from(new Set(scheduleItems.map(i => i.vehicle)));
  const uniqueStatuses = Array.from(new Set(scheduleItems.map(i => i.status)));

  const renderDay = (date: Date, index?: number) => {
    const dayNum = date.getDate();
    const dateStr = fmtDate(date);
    const items = scheduleItems.filter(item => item.date === dateStr);
    const isToday = fmtDate(new Date()) === dateStr;
    
    return (
      <div key={dateStr} className="border-r border-slate-100 p-3 space-y-2 hover:bg-slate-50 transition-colors group min-h-[120px] last:border-r-0">
        <span className={cn(
          "text-sm font-bold transition-colors w-7 h-7 rounded-full flex items-center justify-center",
          isToday ? "bg-primary text-white" : items.length > 0 ? "text-primary" : "text-on-surface-variant"
        )}>{dayNum}</span>
        
        <div className="space-y-2">
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleSelectTrip(item)}
              className={cn(
                "p-2 border-l-4 rounded-lg space-y-1 cursor-pointer transition-all hover:scale-105 hover:shadow-md relative group/card",
                item.status === 'Conflito' ? "bg-red-100 border-red-600 animate-pulse" : 
                item.color === 'primary' ? "bg-primary/10 border-primary" :
                item.color === 'secondary' ? "bg-secondary/10 border-secondary" :
                "bg-tertiary/10 border-tertiary"
              )}
            >
              <div className="flex justify-between items-start">
                <p className={cn(
                  "text-[10px] font-bold uppercase",
                  item.status === 'Conflito' ? "text-red-600" : 
                  item.color === 'primary' ? "text-primary" :
                  item.color === 'secondary' ? "text-secondary" :
                  "text-tertiary"
                )}>{item.type}</p>
                {item.status === 'Conflito' && <AlertTriangle className="w-3 h-3 text-red-600" />}
              </div>
              <div className="flex justify-between items-start gap-1">
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "text-[11px] font-medium leading-tight truncate",
                    item.status === 'Conflito' ? "text-red-900" : "text-on-surface"
                  )} title={item.location}>
                    {item.points && item.points.length > 1
                      ? `${item.points.length} paradas`
                      : item.location}
                  </p>
                </div>
              </div>
              <p className={cn(
                "text-[9px]",
                item.status === 'Conflito' ? "text-red-900/70" : "text-on-surface-variant"
              )}>
                {item.vehicle}
              </p>
              <p className="text-[8px] font-bold opacity-60 uppercase">{item.driver}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Cronograma de Viagens</h2>
          <p className="text-on-surface-variant font-body mt-1">Escala semanal de entregas e manutenções.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all",
              showFilters 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "border-slate-200 hover:bg-slate-50"
            )}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Fechar Filtros' : 'Filtros'}
          </button>
        </div>
      </div>


      {/* ⚠️ Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as const).map(r => (
          <button key={r} onClick={() => setRegion(r as any)}
            className={cn('px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Motorista</label>
                <div className="relative">
                  <select 
                    value={filters.driver}
                    onChange={(e) => setFilters({...filters, driver: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Todos os Motoristas</option>
                    {uniqueDrivers.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Veículo</label>
                <div className="relative">
                  <select 
                    value={filters.vehicle}
                    onChange={(e) => setFilters({...filters, vehicle: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Todos os Veículos</option>
                    {uniqueVehicles.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Status</label>
                <div className="relative">
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium appearance-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Todos os Status</option>
                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {(filters.driver || filters.vehicle || filters.status) && (
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={() => setFilters({ driver: '', vehicle: '', status: '' })}
                    className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <X className="w-3 h-3" />
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Navegação da Semana */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <button
              onClick={() => {
                const newWeek = new Date(currentWeekStart);
                newWeek.setDate(newWeek.getDate() - 28);
                setCurrentWeekStart(newWeek);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Período anterior"
            >
              <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-on-surface">
                {currentWeekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} - {new Date(currentWeekStart.getTime() + 27 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-on-surface-variant">Período de 4 semanas</p>
            </div>
            <button
              onClick={() => {
                const newWeek = new Date(currentWeekStart);
                newWeek.setDate(newWeek.getDate() + 28);
                setCurrentWeekStart(newWeek);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Próximo período"
            >
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-1 shadow-sm overflow-hidden border border-slate-100">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {days.map((day, i) => {
                const date = new Date(currentWeekStart);
                date.setDate(date.getDate() + i);
                return (
                  <div key={day} className="py-4 text-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{day}</div>
                    <div className="text-[10px] text-on-surface-variant/60 mt-1">
                      {date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* 4 semanas com divisores */}
            <div className="flex flex-col">
              {[0, 7, 14, 21].map((weekStart) => (
                <div key={weekStart} className="grid grid-cols-7 auto-rows-fr border-b border-slate-200 last:border-b-0">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const date = new Date(currentWeekStart);
                    date.setDate(date.getDate() + weekStart + dayIndex);
                    return renderDay(date, weekStart + dayIndex);
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-4">

          {/* Status Logístico - Card Pequeno */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Status Logístico</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-xs font-medium">Motorista no Ponto</span>
                </div>
                <span className="text-xs font-bold text-secondary">08:30</span>
              </div>
            </div>
          </div>

          {/* Detalhes da Viagem Selecionada */}
          <AnimatePresence mode="wait">
            {selectedTrip && (
              <motion.div
                key="trip-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "p-4 rounded-xl shadow-lg border-l-4 space-y-3",
                  selectedTrip.status === 'Conflito' ? "bg-red-50 border-red-600" :
                  selectedTrip.color === 'primary' ? "bg-primary/5 border-primary" :
                  selectedTrip.color === 'secondary' ? "bg-secondary/5 border-secondary" :
                  "bg-tertiary/5 border-tertiary"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-on-surface">Detalhes da Rota</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditStart(selectedTrip)}
                      className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                      title="Editar agendamento"
                    >
                      <Pencil className="w-3 h-3 text-amber-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(selectedTrip.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Excluir agendamento"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                    <button
                      onClick={() => setSelectedTrip(null)}
                      className="p-1 hover:bg-black/5 rounded-full transition-colors ml-1"
                    >
                      <X className="w-3 h-3 text-on-surface-variant" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Truck className="w-3 h-3 text-on-surface-variant" />
                  <span className="text-on-surface-variant">{selectedTrip.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3 h-3 text-on-surface-variant" />
                  <span className="text-on-surface-variant">{selectedTrip.driver}</span>
                </div>

                {/* Pontos/Paradas da rota */}
                {selectedTrip.points && selectedTrip.points.length > 0 && (
                  <div className="bg-white rounded-lg border border-slate-100 p-2 space-y-1.5">
                    {selectedTrip.points.map((point, idx) => {
                      // Tentar encontrar TODOS os pedidos para este ponto na data da viagem
                      const normalizeString = (str: string) => {
                        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().trim();
                      };
                      
                      const ptName = (point.name || '').toLowerCase().trim();
                      const normalizedPtName = normalizeString(ptName);
                      
                      const pointOrders = tripOrders.filter((o: any) => {
                        const orderPoint = (o.pointName || o.point_name || '').toLowerCase().trim();
                        const normalizedOrderPoint = normalizeString(orderPoint);
                        const statusLower = (o.status || '').toLowerCase();
                        
                        // Apenas pedidos ativos (ignorando cancelados e os que já foram concluídos/entregues)
                        const isDoneOrInvalid = ['cancelled', 'cancelado', 'deleted', 'excluido', 'completed', 'delivered', 'entregue', 'closed', 'fechado'].some(s => statusLower.includes(s));
                        
                        // Verifica se o nome bate e se o pedido é ativo
                        return normalizedOrderPoint && normalizedPtName && normalizedOrderPoint === normalizedPtName && !isDoneOrInvalid;
                      });

                      return (
                        <div key={point.id} className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-on-surface truncate">{point.name}</p>
                            </div>
                          </div>
                          
                          {/* Botões PDF dos Pedidos (múltiplos se houver) */}
                          {pointOrders.length > 0 && (
                            <div className="space-y-1">
                              {pointOrders.map((order: any, orderIdx: number) => (
                                <button
                                  key={order.id}
                                  onClick={() => setSelectedOrder(order)}
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
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Novo Agendamento - Card na Sidebar */}
          <div id="novo-agendamento-form" className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {editingScheduleId ? <Pencil className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-primary" />}
                <h3 className="text-sm font-extrabold">{editingScheduleId ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              </div>
              {editingScheduleId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-[10px] text-on-surface-variant hover:text-red-500 font-bold transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
            <div className="space-y-3">
              {/* Motorista */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Motorista</label>
                <select
                  value={newSchedule.driverId}
                  onChange={(e) => setNewSchedule({...newSchedule, driverId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-lg text-xs focus:ring-primary"
                >
                  <option value="">Selecione o motorista...</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                  ))}
                </select>
              </div>
              {/* Veículo */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Veículo</label>
                <select
                  value={newSchedule.vehicleId}
                  onChange={(e) => setNewSchedule({...newSchedule, vehicleId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-lg text-xs focus:ring-primary"
                >
                  <option value="">Selecione o veículo...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.model} - {v.plate} ({v.status})</option>
                  ))}
                </select>
              </div>
              {/* Data Base */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Data</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-lg text-xs focus:ring-primary"
                />
              </div>

              {/* Lista de Pontos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Pontos da Rota</label>
                  <span className="text-[10px] text-on-surface-variant">{newSchedule.points.length} parada(s)</span>
                </div>
                
                {newSchedule.points.map((point, index) => {
                  const selectedPoint = points.find(p => p.id === point.pointId);
                  return (
                    <div key={index} className="bg-slate-50 rounded-lg p-2 space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary">Parada {index + 1}</span>
                        {newSchedule.points.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = [...newSchedule.points];
                              updated.splice(index, 1);
                              setNewSchedule({ ...newSchedule, points: updated });
                            }}
                            className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                      <select
                        value={point.pointId}
                        onChange={(e) => {
                          const updated = [...newSchedule.points];
                          updated[index] = { ...updated[index], pointId: e.target.value };
                          setNewSchedule({ ...newSchedule, points: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg text-xs focus:ring-primary py-1.5 px-2"
                      >
                        <option value="">Selecione o ponto...</option>
                        {points.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {selectedPoint && (
                        <div className="mt-1">
                          <span className="text-[9px] text-on-surface-variant">{selectedPoint.region}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setNewSchedule({
                      ...newSchedule,
                      points: [...newSchedule.points, { pointId: '' }]
                    });
                  }}
                  className="w-full py-1.5 border border-dashed border-primary/40 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar Ponto
                </button>
              </div>

              <button
                onClick={async () => {
                  const validPoints = newSchedule.points.filter(p => p.pointId);
                  if (validPoints.length === 0 || !newSchedule.driverId || !newSchedule.vehicleId || !newSchedule.date) {
                    alert('Por favor, preencha motorista, veículo, data e ao menos um ponto.');
                    return;
                  }
                  try {
                    const selectedDriver = drivers.find(d => d.id === newSchedule.driverId);
                    const selectedVehicle = vehicles.find(v => v.id === newSchedule.vehicleId);
                    
                    const pointData = validPoints.map(p => {
                      const selectedPoint = points.find(pt => pt.id === p.pointId);
                      return { id: p.pointId, name: selectedPoint?.name || '', time: '', region: selectedPoint?.region || '' };
                    });
                    
                    const locationStr = pointData.map(p => p.name).join(' → ');
                    
                    const saveData = {
                      title: validPoints.length > 1 ? `Rota com ${validPoints.length} paradas` : newSchedule.type,
                      location: locationStr,
                      scheduled_date: newSchedule.date,
                      scheduled_time: '',
                      vehicle_id: newSchedule.vehicleId,
                      vehicle_name: selectedVehicle ? (selectedVehicle.model + ' ' + selectedVehicle.plate) : '',
                      driver_id: newSchedule.driverId,
                      driver_name: selectedDriver?.name || '',
                      region: region || '',
                      status: 'Ativa',
                      color: 'primary',
                      stops_count: validPoints.length,
                      order_ids: [],
                    };
                    
                    if (editingScheduleId) {
                      const { error } = await supabase.from('schedules').update(saveData).eq('id', editingScheduleId);
                      if (error) throw error;
                      alert('Agendamento atualizado!');
                      setEditingScheduleId(null);
                    } else {
                      console.log('INSERT - saveData:', saveData);
                      const { data, error } = await supabase.from('schedules').insert(saveData).select();
                      console.log('INSERT - result:', { data, error });
                      if (error) throw error;
                      alert(`Agendamento criado! ${validPoints.length} parada(s)`);
                    }
                    
                    setNewSchedule({
                      points: [{ pointId: '' }],
                      driverId: '',
                      vehicleId: '',
                      date: '',
                      type: 'Rota Padrão'
                    });
                    
                    // Recarrega do Supabase
                    await loadSchedules();
                  } catch (err: any) {
                    console.error('Erro ao salvar:', err);
                    alert('Erro: ' + (err?.message || JSON.stringify(err)));
                  }
                }}
                className="w-full py-2 primary-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                {editingScheduleId ? 'Salvar Alterações' : 'Validar e Agendar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
