import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileDown, 
  Plus, 
  Calendar as CalendarIcon, 
  Search, 
  Filter,
  Eye,
  Edit2,
  Trash2,
  Camera,
  Truck,
  User as UserIcon,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { db, collection, onSnapshot, query, where, orderBy, handleFirestoreError, OperationType } from '@/firebase';
import { type Order } from '@/types';

export function Reports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState<'Recife' | 'Salvador'>('Recife');

  useEffect(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const q = query(
      collection(db, 'orders'),
      where('region', '==', regionFilter),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Client-side date filtering for the "last month" requirement
      const filtered = ordersData.filter(order => {
        const orderDate = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
        return orderDate >= oneMonthAgo;
      });

      setOrders(filtered);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [regionFilter]);

  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = ['ID Pedido', 'Franqueado', 'Motorista', 'Veículo', 'Status', 'Data', 'Volume'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => {
        const date = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
        return [
          `#${order.id}`,
          `"${order.pointName}"`,
          `"${order.driverName || 'N/A'}"`,
          `"${order.vehicle || 'N/A'}"`,
          order.status,
          date.toLocaleDateString('pt-BR'),
          order.units
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_recife_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Relatório de Operações</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Região {regionFilter} • Consolidado Mensal
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <div className="px-4 py-2 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Região Selecionada</span>
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as any)}
              className="text-sm font-semibold text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="Recife">Recife</option>
              <option value="Salvador">Salvador</option>
            </select>
          </div>
          <button className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-md">
            <CalendarIcon className="w-4 h-4" />
            Últimos 30 Dias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl relative overflow-hidden border-l-4 border-primary shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Volume Total (Mês)</p>
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <Download className="w-5 h-5" />
            </span>
          </div>
          <h3 className="text-5xl font-black text-primary mb-2">
            {orders.reduce((acc, curr) => acc + curr.units, 0).toLocaleString()}
          </h3>
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Unidades processadas no período
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-secondary shadow-sm">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Pedidos Concluídos</p>
          <h3 className="text-4xl font-black text-on-surface mb-2">
            {orders.filter(o => o.status === 'COMPLETED').length}
          </h3>
          <p className="text-xs text-on-surface-variant">Eficiência de entrega: {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100) : 0}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-tertiary shadow-sm">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Total de Pedidos</p>
          <h3 className="text-4xl font-black text-on-surface mb-2">{orders.length}</h3>
          <p className="text-xs text-on-surface-variant">Pedidos registrados na região</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center px-6 mb-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          <div className="w-1/4">Pedido / Franqueado</div>
          <div className="w-1/4">Logística (Motorista/Veículo)</div>
          <div className="w-1/6 text-center">Data</div>
          <div className="w-1/6 text-center">Status</div>
          <div className="w-1/6"></div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
            <p className="text-on-surface-variant animate-pulse font-bold">Gerando relatório detalhado...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
            <p className="text-on-surface-variant">Nenhum dado encontrado para o período selecionado.</p>
          </div>
        ) : orders.map((order) => (
          <motion.div 
            key={order.id}
            whileHover={{ scale: 1.005 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 p-6 flex items-center"
          >
            <div className="w-1/4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">#{order.id}</h4>
                <p className="text-[10px] text-on-surface-variant uppercase font-black">{order.pointName}</p>
              </div>
            </div>
            <div className="w-1/4">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <UserIcon className="w-3 h-3 text-secondary" />
                {order.driverName || 'Não atribuído'}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-1">
                <Truck className="w-3 h-3" />
                {order.vehicle || 'Aguardando escala'}
              </div>
            </div>
            <div className="w-1/6 text-center">
              <span className="text-xs font-medium text-on-surface">
                {(() => {
                  const date = (order.timestamp as any)?.toDate ? (order.timestamp as any).toDate() : new Date(order.timestamp);
                  return date.toLocaleDateString('pt-BR');
                })()}
              </span>
            </div>
            <div className="w-1/6 text-center">
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight",
                order.status === 'COMPLETED' ? "bg-green-100 text-green-700" : 
                order.status === 'IN PROGRESS' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              )}>
                {order.status}
              </span>
            </div>
            <div className="w-1/6 flex justify-end gap-2">
              <button className="p-2 hover:bg-slate-50 text-primary rounded-lg transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs text-on-surface-variant font-medium">
          Exibindo <span className="font-bold text-on-surface">{orders.length}</span> pedidos em {regionFilter} no último mês
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-4 h-4" /> EXPORTAR RELATÓRIO COMPLETO (CSV)
        </button>
      </div>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
