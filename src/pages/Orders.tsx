import React, { useState, useEffect, Suspense } from 'react';
import {
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Eye,
  X,
  Map as MapIcon,
  List,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase, subscribeToTable, deleteRow } from '@/supabase';
import { type Order, type Region, type User } from '@/types';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import { OrderMap } from '@/components/OrderMap';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Todas');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [drivers, setDrivers] = useState<User[]>([]);

  useEffect(() => {
    setLoading(true);
    const regionFilter = region === 'Todas' ? {} : { region };
    
    // Configurar o dateRange se as datas estiverem definidas
    let dateRange: { column: string; start?: string; end?: string } | undefined;
    if (startDate || endDate) {
      dateRange = { column: 'created_at' };
      if (startDate) dateRange.start = startDate + 'T00:00:00.000Z';
      if (endDate) dateRange.end = endDate + 'T23:59:59.999Z';
    }

    const unsubOrders = subscribeToTable('orders', regionFilter, (data) => {
      setOrders(data);
      setLoading(false);
    }, 'created_at', false, 1000, dateRange); // Limite de 1000 pedidos e aplica filtros de data

    const unsubDrivers = subscribeToTable('app_users', regionFilter, (data) => {
      setDrivers(data.filter((u: User) => u.role === 'motorista'));
    }, 'created_at', false, 200); // Limite de 200 motoristas

    const locationChannel = supabase
      .channel('driver_gps_locations')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_users' }, (payload) => {
        const updated = payload.new as any;
        if (updated.role === 'motorista' && updated.lat != null && updated.lng != null) {
          setDrivers(prev => prev.map((d: any) =>
            d.id === updated.id
              ? { ...d, lat: updated.lat, lng: updated.lng, location_updated_at: updated.location_updated_at }
              : d
          ));
        }
      })
      .subscribe();

    return () => {
      unsubOrders();
      unsubDrivers();
      supabase.removeChannel(locationChannel);
    };
  }, [region, startDate, endDate]);

  const filteredOrders = orders.filter(order => {
    const pName = order.pointName || order.point_name || '';
    const matchesRegion = region === 'Todas' || order.region === region;
    const matchesSearch = (order.short_id?.toString() || '').includes(searchTerm.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      pName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const timeVal = order.timestamp || order.created_at || new Date().toISOString();
    const orderDate = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
    
    const matchesStartDate = !startDate || orderDate >= new Date(startDate + 'T00:00:00');
    const matchesEndDate = !endDate || orderDate <= new Date(endDate + 'T23:59:59');

    return matchesRegion && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ['ID Pedido', 'Franqueado', 'Região', 'Volume', 'Data', 'Status', 'Tipo', 'Motorista', 'Veículo'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => {
        const timeVal = order.timestamp || order.created_at || new Date().toISOString();
        const date = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
        const pName = order.pointName || order.point_name || '';
        const orderNum = order.short_id || order.id;
        return [
          `#${orderNum}`,
          order.region,
          order.units,
          date.toLocaleDateString('pt-BR'),
          order.status,
          order.type,
          `"${order.driverName || (order as any).driver_name || ''}"`,
          `"${order.vehicle || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_${region}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteOrder = async (orderId: string, orderNum: string) => {
    if (confirm(`Tem certeza que deseja excluir o pedido #${orderNum}? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteRow('orders', orderId);
        // Remove imediatamente do estado local para feedback instantâneo
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        alert('Erro ao excluir pedido. Tente novamente.');
      }
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Gestão de Pedidos</h2>
          <p className="text-on-surface-variant font-body mt-1">Hub Regional {region} — Operações Diárias</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                viewMode === 'table' ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-slate-50"
              )}
            >
              <List className="w-3 h-3" />
              LISTA
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                viewMode === 'map' ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-slate-50"
              )}
            >
              <MapIcon className="w-3 h-3" />
              MAPA
            </button>
          </div>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as (Region | 'Todas')[]).map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={cn('px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-primary-container p-4 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[130px] text-white">
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Volume Diário Total</p>
            <h3 className="text-4xl font-extrabold mt-1">
              {orders.reduce((acc, curr) => acc + curr.units, 0).toLocaleString()} 
              <span className="text-lg font-normal opacity-80 ml-2">Unidades</span>
            </h3>
          </div>
          <div className="relative z-10 flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-white/90 text-[10px] font-bold">
              Monitorando {orders.length} pedidos ativos
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-secondary flex flex-col justify-between shadow-sm min-h-[130px]">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Pedidos Concluídos</p>
          <div>
            <h4 className="text-2xl font-black">{orders.filter(o => ['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length}</h4>
            <p className="text-secondary font-semibold text-[10px] uppercase tracking-tighter">Hoje</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-primary flex flex-col justify-between shadow-sm min-h-[130px]">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Em Processamento</p>
          <div>
            <h4 className="text-2xl font-black">{orders.filter(o => !['COMPLETED', 'DELIVERED', 'Entregue'].includes(o.status)).length}</h4>
            <p className="text-primary font-semibold text-[10px] uppercase tracking-tighter">Aguardando Logística</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID ou Franqueado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                showFilters ? "bg-primary text-white" : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-slate-100 bg-slate-50/50"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data Inicial</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data Final</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="text-xs font-bold text-primary hover:underline mb-2"
                  >
                    Limpar Datas
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'map' ? (
          <div className="p-4">
            <OrderMap
              orders={orders as any}
              drivers={drivers as any}
              region={region}
              heightClassName="h-[760px]"
            />
            <div className="flex gap-4 mt-3 justify-center text-[10px] text-on-surface-variant">
              <span>🔴 Pedido aguardando</span>
              <span>🟡 Em trânsito</span>
              <span>🟢 Entregue</span>
              <span>🔵 Motorista</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">ID Pedido</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Franqueado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest text-center">Volume</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface-variant">Carregando pedidos...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface-variant">Nenhum pedido encontrado.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4">
                    <span className="font-black text-primary text-sm">#{order.short_id || order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-on-surface text-sm">{order.pointName || order.point_name || 'Desconhecido'}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">{order.region}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-on-surface">
                    {order.units} <span className="text-[10px] font-normal opacity-60">unid</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {(() => {
                      const timeVal = order.timestamp || order.created_at || new Date().toISOString();
                      const date = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
                      return date.toLocaleDateString('pt-BR');
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                      ['COMPLETED', 'DELIVERED', 'Entregue'].includes(order.status) ? "bg-green-100 text-green-700" : 
                      ['IN_PROGRESS', 'IN PROGRESS', 'ACCEPTED'].includes(order.status) ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id, order.short_id || order.id);
                        }}
                        className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <p className="text-xs text-on-surface-variant">
            Exibindo {filteredOrders.length} de {orders.length} pedidos ativos
          </p>
          <div className="flex gap-1">
            <button className="p-1 rounded bg-white border border-slate-200 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded bg-primary text-white text-xs font-bold">1</button>
            <button className="p-1 rounded bg-white border border-slate-200 disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
