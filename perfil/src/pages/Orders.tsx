import React, { useState, useEffect } from 'react';
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
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '@/firebase';
import { type Order } from '@/types';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import { OrderMap } from '@/components/OrderMap';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pointName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle Firestore Timestamp or ISO string
    const orderDate = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
    
    const matchesStartDate = !startDate || orderDate >= new Date(startDate + 'T00:00:00');
    const matchesEndDate = !endDate || orderDate <= new Date(endDate + 'T23:59:59');

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ['ID Pedido', 'Franqueado', 'Região', 'Volume', 'Data', 'Status', 'Tipo', 'Motorista', 'Veículo'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => {
        const date = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
        return [
          `#${order.id}`,
          `"${order.pointName}"`,
          order.region,
          order.units,
          date.toLocaleDateString('pt-BR'),
          order.status,
          order.type,
          `"${order.driverName || ''}"`,
          `"${order.vehicle || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Gestão de Pedidos</h2>
          <p className="text-on-surface-variant font-body mt-1">Hub Regional Recife — Operações Diárias</p>
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
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-sm font-semibold">Status do Hub: Produção Ativa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-primary-container p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[160px] text-white">
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Volume Diário Total</p>
            <h3 className="text-5xl font-extrabold mt-2">
              {orders.reduce((acc, curr) => acc + curr.units, 0).toLocaleString()} 
              <span className="text-xl font-normal opacity-80 ml-2">Unidades</span>
            </h3>
          </div>
          <div className="relative z-10 flex gap-4 mt-4">
            <div className="flex items-center gap-1 text-white/90 text-xs font-bold">
              Monitorando {orders.length} pedidos ativos
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-secondary flex flex-col justify-between shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Pedidos Concluídos</p>
          <div>
            <h4 className="text-3xl font-black">{orders.filter(o => o.status === 'COMPLETED').length}</h4>
            <p className="text-secondary font-semibold text-xs uppercase tracking-tighter">Hoje</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-primary flex flex-col justify-between shadow-sm">
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Em Processamento</p>
          <div>
            <h4 className="text-3xl font-black">{orders.filter(o => o.status !== 'COMPLETED').length}</h4>
            <p className="text-primary font-semibold text-xs uppercase tracking-tighter">Aguardando Logística</p>
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
          <div className="p-6 bg-slate-50/30">
            <OrderMap 
              orders={filteredOrders} 
              center={filteredOrders.length > 0 && filteredOrders[0].lat ? [filteredOrders[0].lat, filteredOrders[0].lng!] : [-8.0476, -34.8770]}
            />
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
                    <span className="font-black text-primary text-sm">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-on-surface text-sm">{order.pointName}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-medium">{order.region}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-on-surface">
                    {order.units} <span className="text-[10px] font-normal opacity-60">unid</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {(() => {
                      const date = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
                      return date.toLocaleDateString('pt-BR');
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                      order.status === 'COMPLETED' ? "bg-green-100 text-green-700" : 
                      order.status === 'IN PROGRESS' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary opacity-0 group-hover:opacity-100">
                      <Eye className="w-5 h-5" />
                    </button>
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
