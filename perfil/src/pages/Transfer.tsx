import React from 'react';
import { 
  Truck, 
  ArrowRightLeft, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Thermometer,
  Map as MapIcon,
  Navigation,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function Transfer() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Transferência de Estoque</h3>
          <p className="text-on-surface-variant mt-2 font-medium">Logística Interestadual Recife ↔ Salvador</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
            <Thermometer className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Câmara Fria: -18°C</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* RECIFE -> SALVADOR */}
        <div className="bg-white rounded-xl flex flex-col border-l-4 border-primary overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold text-primary">Recife → Salvador</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Fluxo: Câmara Fria (Congelados)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Prioridade Alta</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Quantidade (Caixas)</label>
                <input className="w-full bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-bold text-lg" placeholder="0" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Tipo de Produto</label>
                <select className="w-full bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-semibold text-sm">
                  <option>Empada de Frango</option>
                  <option>Empada de Camarão</option>
                  <option>Empada de Carne Sol</option>
                </select>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl primary-gradient text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
              <CheckCircle2 className="w-4 h-4" />
              REGISTRAR TRANSFERÊNCIA
            </button>
          </div>
          <div className="p-6 bg-slate-50/50">
            <h5 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Histórico Recente</h5>
            <div className="space-y-3">
              {[
                { qty: 120, item: 'Frango', date: '14/10', resp: 'Marcos S.' },
                { qty: 85, item: 'Camarão', date: '12/10', resp: 'Julia M.' },
              ].map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-lg flex justify-between items-center group hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-primary bg-primary/5 w-8 h-8 flex items-center justify-center rounded-md">{h.qty}</div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{h.qty} Caixas - {h.item}</p>
                      <p className="text-[10px] text-on-surface-variant">Data: {h.date} • Resp: {h.resp}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SALVADOR -> RECIFE */}
        <div className="bg-white rounded-xl flex flex-col border-l-4 border-secondary overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-headline text-xl font-bold text-secondary">Salvador → Recife</h4>
                  <p className="text-sm text-on-surface-variant font-medium">Fluxo: Carga Regular (Insumos)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full">Rotina Semanal</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Quantidade (KG/Unid)</label>
                <input className="w-full bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-secondary py-3 px-4 font-bold text-lg" placeholder="0" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Tipo de Carga</label>
                <select className="w-full bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-secondary py-3 px-4 font-semibold text-sm">
                  <option>Embalagens Vazias</option>
                  <option>Insumos Secos</option>
                  <option>Manutenção Equip.</option>
                </select>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl bg-secondary text-white font-bold text-sm tracking-wide shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Navigation className="w-4 h-4" />
              REGISTRAR TRANSFERÊNCIA
            </button>
          </div>
          <div className="p-6 bg-slate-50/50">
            <h5 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Histórico Recente</h5>
            <div className="space-y-3">
              {[
                { qty: 500, item: 'Caixas de Embarque', date: '15/10', resp: 'Fabio L.' },
                { qty: 8, item: 'Paletes - Insumos', date: '11/10', resp: 'Carla T.' },
              ].map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-lg flex justify-between items-center group hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-secondary bg-secondary/5 w-8 h-8 flex items-center justify-center rounded-md">{h.qty}</div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{h.qty} Unid - {h.item}</p>
                      <p className="text-[10px] text-on-surface-variant">Data: {h.date} • Resp: {h.resp}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden min-h-[300px] border border-slate-100 group shadow-sm">
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <MapIcon className="w-32 h-32 text-slate-800" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Rastreamento Ativo</span>
            </div>
            <h4 className="text-xl font-bold font-headline">Rota BR-101: Em Trânsito</h4>
            <p className="text-xs opacity-70">Previsão de chegada em Salvador: 04h 20min</p>
          </div>
        </div>

        <div className="bg-slate-100/50 rounded-xl p-6 flex flex-col justify-between border border-slate-200">
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Volume Mensal</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">Câmara Fria (REC-SSA)</span>
                  <span className="text-primary">82%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[82%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">Carga Geral (SSA-REC)</span>
                  <span className="text-secondary">45%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200 flex gap-4">
            <div className="flex-1 text-center">
              <p className="text-2xl font-black text-on-surface">1.2k</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Total Caixas</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-black text-on-surface">14</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Viagens/Mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
