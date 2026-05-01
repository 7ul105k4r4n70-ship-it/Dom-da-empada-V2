import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle,
  RotateCcw,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { KPIDeliveryPerformance } from '@/components/KPIDeliveryPerformance';
import { KPIFranchiseeProducts } from '@/components/KPIFranchiseeProducts';
import { KPIFlowDistributionCard } from '@/components/KPIFlowDistributionCard';
import { type Region } from '@/types';

export function KPIs() {
  const [region, setRegion] = useState<Region>('Recife');
  const [unit, setUnit] = useState<'Unidades' | 'Caixas'>('Unidades');
  const [activeTab, setActiveTab] = useState<'overview' | 'franchisee-products' | 'delivery-performance'>('overview');
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    setResetDone(true);
    setShowResetModal(false);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Indicadores de Entrega</h2>
          <p className="text-on-surface-variant font-body">Análise métrica da operação logística.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1 items-end">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Visualizar por</label>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              {(['Unidades', 'Caixas'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-all',
                    unit === u ? 'primary-gradient text-white shadow-sm' : 'text-on-surface-variant hover:bg-slate-200')}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Admin</label>
            <button onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
              Redefinir KPI
            </button>
          </div>
        </div>
      </div>

      {resetDone && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <span>✓ KPI de {region} redefinido com sucesso. Ação registrada em auditoria.</span>
        </div>
      )}

      {/* ⚠️ Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as const).map(r => (
          <button key={r} onClick={() => { setRegion(r as any); setSelectedPoint(null); }}
            className={cn('px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
            activeTab === 'overview' ? 'primary-gradient text-white shadow-sm' : 'text-on-surface-variant hover:bg-slate-100'
          )}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('franchisee-products')}
          className={cn(
            'px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
            activeTab === 'franchisee-products' ? 'primary-gradient text-white shadow-sm' : 'text-on-surface-variant hover:bg-slate-100'
          )}
        >
          Produtos por Franqueado
        </button>
        <button
          onClick={() => setActiveTab('delivery-performance')}
          className={cn(
            'px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
            activeTab === 'delivery-performance' ? 'primary-gradient text-white shadow-sm' : 'text-on-surface-variant hover:bg-slate-100'
          )}
        >
          Desempenho das Entregas
        </button>
      </div>

      {activeTab === 'overview' ? (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" key="overview-grid">
        <div className="lg:col-span-8">
          <KPIFlowDistributionCard
            region={region}
            unit={unit}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-tertiary text-white rounded-xl p-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-secondary" />
                <h5 className="font-bold text-xs tracking-widest uppercase">Alerta de Estoque</h5>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                A unidade <span className="font-bold text-secondary-container">Shopping Salvador</span> está operando com 15% abaixo da margem de empadas de Camarão.
              </p>
              <button className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-colors">Resolver Agora</button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h5 className="font-bold text-on-surface uppercase text-xs tracking-widest mb-4">Concentração Geográfica</h5>
            <div className="aspect-square bg-slate-50 rounded-lg relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full p-6 opacity-10">
                  <path d="M50 100 Q100 40 150 100 Q100 160 50 100Z" fill="currentColor" className="text-slate-400" />
                </svg>
              </div>
              <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-primary/20 rounded-full animate-pulse border-2 border-primary"></div>
              <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-secondary/20 rounded-full animate-pulse border-2 border-secondary"></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-4 text-center">Focos de alta demanda detectados no <span className="font-bold">Setor Norte</span>.</p>
          </div>
        </div>
      </div>
      ) : (
        activeTab === 'franchisee-products' ? <KPIFranchiseeProducts region={region} unit={unit} /> : <KPIDeliveryPerformance region={region} />
      )}

      {/* ── RESET KPI MODAL ── */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowResetModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="flex justify-end mb-2">
                <button onClick={() => setShowResetModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Redefinir KPI — {region}</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Esta ação zerará os contadores de KPI da região <strong>{region}</strong> para o período atual. A operação será registrada em auditoria.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                <button onClick={handleReset}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">
                  <RotateCcw className="w-4 h-4 inline mr-1" />Confirmar Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
