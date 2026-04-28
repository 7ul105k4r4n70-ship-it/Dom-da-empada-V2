import React, { useState, useMemo } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  day: number;
  type: string;
  location: string;
  time: string;
  vehicle: string;
  driver: string;
  status: 'Ativa' | 'Conflito' | 'Aguardando' | 'Concluída';
  color: string;
}

export function Schedule() {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    driver: '',
    vehicle: '',
    status: ''
  });

  const initialSchedule: ScheduleItem[] = [
    { 
      id: '1', 
      day: 13, 
      type: 'Rota Manhã', 
      location: 'Boa Viagem Store', 
      time: '08:00', 
      vehicle: 'Caminhão RX-22', 
      driver: 'Carlos Oliveira',
      status: 'Ativa',
      color: 'secondary'
    },
    { 
      id: '2', 
      day: 14, 
      type: 'Reposição Estoque', 
      location: 'Shopping Recife', 
      time: '10:30', 
      vehicle: 'Van VX-01', 
      driver: 'Roberto Silva',
      status: 'Ativa',
      color: 'primary'
    },
    { 
      id: '3', 
      day: 14, 
      type: 'Olinda Express', 
      location: 'Olinda Terminal', 
      time: '10:30', 
      vehicle: 'Van VX-01', 
      driver: 'Roberto Silva',
      status: 'Conflito',
      color: 'red'
    },
    { 
      id: '4', 
      day: 15, 
      type: 'Manutenção', 
      location: 'Inspeção Hub', 
      time: 'Dia Todo', 
      vehicle: 'Caminhão RX-22', 
      driver: 'Carlos Oliveira',
      status: 'Aguardando',
      color: 'tertiary'
    },
  ];

  const filteredSchedule = useMemo(() => {
    return initialSchedule.filter(item => {
      const matchDriver = !filters.driver || item.driver === filters.driver;
      const matchVehicle = !filters.vehicle || item.vehicle === filters.vehicle;
      const matchStatus = !filters.status || item.status === filters.status;
      return matchDriver && matchVehicle && matchStatus;
    });
  }, [filters]);

  const drivers = Array.from(new Set(initialSchedule.map(i => i.driver)));
  const vehicles = Array.from(new Set(initialSchedule.map(i => i.vehicle)));
  const statuses = Array.from(new Set(initialSchedule.map(i => i.status)));

  const renderDay = (dayNum: number) => {
    const items = filteredSchedule.filter(item => item.day === dayNum);
    
    return (
      <div key={dayNum} className="border-r border-b border-slate-50 p-3 space-y-2 hover:bg-slate-50 transition-colors group min-h-[120px]">
        <span className={cn(
          "text-sm font-bold transition-colors",
          items.length > 0 ? "text-primary" : "text-on-surface-variant"
        )}>{dayNum}</span>
        
        <div className="space-y-2">
          {items.map(item => (
            <div 
              key={item.id} 
              className={cn(
                "p-2 border-l-4 rounded-lg space-y-1 cursor-pointer transition-all hover:brightness-95",
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
              <p className={cn(
                "text-[11px] font-medium leading-tight",
                item.status === 'Conflito' ? "text-red-900" : "text-on-surface"
              )}>{item.location}</p>
              <p className={cn(
                "text-[9px]",
                item.status === 'Conflito' ? "text-red-900/70" : "text-on-surface-variant"
              )}>{item.time} • {item.vehicle}</p>
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
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Cronograma de Viagens</h2>
          <p className="text-on-surface-variant font-body mt-1">Hub Logístico Recife • Novembro 2023</p>
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
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
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
                    {drivers.map(d => <option key={d} value={d}>{d}</option>)}
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
                    {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
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
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
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
          <div className="bg-white rounded-xl p-1 shadow-sm overflow-hidden border border-slate-100">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {days.map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[600px]">
              {Array.from({ length: 14 }).map((_, i) => renderDay(i + 13))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Status Logístico</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-xs font-medium">Viagens Ativas</span>
                </div>
                <span className="text-xs font-bold">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span className="text-xs font-medium text-red-600">Conflitos</span>
                </div>
                <span className="text-xs font-bold text-red-600">02</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-medium">Aguardando Aprovação</span>
                </div>
                <span className="text-xs font-bold">04</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Plus className="w-5 h-5 text-primary" />
              <h3 className="text-md font-extrabold font-headline">Nova Solicitação</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Motorista</label>
                <select className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-primary">
                  <option>Carlos Oliveira</option>
                  <option>Roberto Silva</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Veículo</label>
                <select className="w-full bg-slate-50 border-none rounded-lg text-sm focus:ring-primary">
                  <option>Caminhão RX-22</option>
                  <option>Van VX-01</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Data</label>
                  <input type="date" className="w-full bg-slate-50 border-none rounded-lg text-xs focus:ring-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Hora</label>
                  <input type="time" className="w-full bg-slate-50 border-none rounded-lg text-xs focus:ring-primary" />
                </div>
              </div>
              <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary-container transition-all">
                Validar e Agendar
              </button>
            </div>
          </div>

          <div className="relative h-48 rounded-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" 
              alt="Map" 
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Vista do Hub Recife</p>
              <p className="text-white/70 text-[10px]">Rastreamento de frota em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
