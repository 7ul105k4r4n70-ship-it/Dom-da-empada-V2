import React from 'react';
import { 
  Calculator, 
  Download, 
  FileText, 
  TrendingUp, 
  History,
  Info,
  Edit3,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function Finance() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Preços e Royalties</h2>
            <p className="text-on-surface-variant font-body">Gestão estratégica de precificação e automação de repasses financeiros.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-on-surface font-semibold hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" /> Exportar Excel
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl primary-gradient text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              <FileText className="w-4 h-4" /> Gerar Relatório PDF
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 bg-white rounded-xl p-8 border-l-4 border-secondary shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <Edit3 className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold font-headline">Entrada Manual de Preços</h3>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Data de Vigência *</label>
              <input type="date" className="bg-slate-50 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-secondary/50 py-1.5 px-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
              <div className="col-span-5">Produto / Sabor</div>
              <div className="col-span-3">Preço de Custo (R$)</div>
              <div className="col-span-4 text-right">Preço de Venda Sugerido (R$)</div>
            </div>

            {[
              { name: 'Empada de Frango', desc: 'Clássica - 120g', cost: '2.45', sell: '8.50', img: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?q=80&w=100&auto=format&fit=crop' },
              { name: 'Empada de Camarão', desc: 'Premium - 120g', cost: '3.80', sell: '12.90', img: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?q=80&w=100&auto=format&fit=crop' },
              { name: 'Queijo do Reino', desc: 'Gourmet - 110g', cost: '3.10', sell: '10.00', img: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?q=80&w=100&auto=format&fit=crop' },
            ].map((prod, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center bg-slate-50/50 p-4 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{prod.name}</span>
                    <span className="text-xs text-on-surface-variant">{prod.desc}</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <input className="w-full bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-secondary py-2 px-3" placeholder={prod.cost} type="number" />
                </div>
                <div className="col-span-4 flex justify-end">
                  <input className="w-32 bg-white border border-slate-200 rounded-lg text-sm font-bold text-secondary text-right focus:ring-secondary py-2 px-3" placeholder={prod.sell} type="number" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end pt-6 border-t border-slate-100">
            <button className="px-10 py-3 bg-secondary text-white font-bold rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-secondary/20">
              Salvar Novos Preços
            </button>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-8 border-l-4 border-primary shadow-sm flex-1 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <Calculator className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold font-headline">Cálculo de Royalties</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-primary text-white rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-white/80">Faturamento Mensal (Rede)</span>
                  <Info className="w-4 h-4 text-white/60" />
                </div>
                <div className="text-3xl font-black tracking-tight">R$ 142.580,00</div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest border-b border-slate-100 pb-2">Repasse por Franqueado</h4>
                {[
                  { name: 'Loja Boa Viagem', pct: '5%', amount: '4.215,00', status: 'Processado', color: 'bg-green-100 text-green-700' },
                  { name: 'Shopping Salvador', pct: '6.5%', amount: '5.842,50', status: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Unidade Olinda', pct: '4.5%', amount: '2.105,20', status: 'Processado', color: 'bg-green-100 text-green-700' },
                ].map((fran, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{fran.name}</p>
                      <p className="text-[10px] text-on-surface-variant">Percentual: {fran.pct}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">R$ {fran.amount}</p>
                      <span className={cn("inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase", fran.color)}>{fran.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button className="w-full py-4 bg-slate-50 text-tertiary font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <History className="w-4 h-4" /> Ver Histórico
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Média de Royalties (Trimestre)</p>
              <h4 className="text-2xl font-black mb-4">R$ 12.450 / mês</h4>
              <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>+4.2% em relação ao período anterior</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
