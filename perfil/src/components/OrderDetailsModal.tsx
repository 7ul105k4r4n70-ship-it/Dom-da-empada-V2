import React from 'react';
import { 
  X, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { type Order } from '@/types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'IN PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'AWAITING LOGISTICS': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'IN PROGRESS': return <Truck className="w-4 h-4" />;
      case 'AWAITING LOGISTICS': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-on-surface tracking-tight">Pedido {order.id}</h3>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Detalhes da Operação</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-on-surface-variant"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Status Banner */}
            <div className={cn(
              "p-4 rounded-2xl border flex items-center justify-between",
              getStatusColor(order.status)
            )}>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <span className="font-black uppercase tracking-widest text-xs">{order.status}</span>
              </div>
              <span className="text-[10px] font-bold opacity-70">Atualizado em tempo real</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Point Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Ponto de Entrega</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{order.pointName}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase font-medium">ID: {order.pointId}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">Região</span>
                      <span className="text-xs font-black text-primary uppercase">{order.region}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Logística</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Motorista Responsável</p>
                        <p className="text-sm font-bold text-on-surface">{order.driverName || 'Não atribuído'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Veículo</p>
                        <p className="text-sm font-bold text-on-surface">{order.vehicle || 'Aguardando escala'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Informações do Lote</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-tertiary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Data de Solicitação</p>
                        <p className="text-sm font-bold text-on-surface">
                          {new Date(order.timestamp).toLocaleDateString('pt-BR')} às {new Date(order.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-tertiary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Volume Total</p>
                        <p className="text-lg font-black text-on-surface">{order.units} <span className="text-xs font-normal opacity-60">Unidades</span></p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Tipo de Pedido</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                          order.type === 'EXTRA DELIVERY' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {order.type === 'EXTRA DELIVERY' ? 'Entrega Extra' : 'Regular'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Observações do Hub</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed italic">
                    "Lote prioritário para reposição de estoque de fim de semana. Verificar integridade da câmara fria no descarregamento."
                  </p>
                </div>
              </div>
            </div>

            {/* Status History Section */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-4 h-4 text-on-surface-variant" />
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Histórico de Status</h4>
              </div>
              
              <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  order.statusHistory.map((history, index) => (
                    <div key={index} className="relative pl-8 group">
                      <div className={cn(
                        "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10",
                        history.status === 'COMPLETED' ? "bg-green-500" : 
                        history.status === 'IN PROGRESS' ? "bg-amber-500" : 
                        history.status === 'AWAITING LOGISTICS' ? "bg-blue-500" : "bg-slate-400"
                      )}>
                        {history.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{history.status}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">Responsável: <span className="text-on-surface">{history.userName}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-on-surface">
                            {new Date(history.timestamp).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            {new Date(history.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pl-8 py-2">
                    <p className="text-xs text-on-surface-variant italic">Nenhum histórico registrado para este pedido.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button className="flex-1 py-3 bg-white border border-slate-200 text-on-surface rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95">
              Imprimir Guia
            </button>
            <button className="flex-1 py-3 primary-gradient text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
              Acompanhar Rota
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
