import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  ChevronRight,
  AlertCircle,
  Map as MapIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function KPIs() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs text-secondary font-bold tracking-widest uppercase mb-1">Módulo 05</p>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Indicadores de Desempenho</h2>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Visualizar por</label>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button className="px-4 py-1.5 text-xs font-bold rounded-md transition-all primary-gradient text-white shadow-sm">Unidades</button>
            <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant rounded-md hover:bg-slate-200 transition-all">Caixas (Master)</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
              <p className="text-xs text-on-surface-variant font-medium mb-2">Entregas do Dia</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-on-surface">1.248</h3>
                <span className="text-xs font-bold text-green-600 flex items-center"><TrendingUp className="w-3 h-3" /> +12%</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 mt-4 italic font-medium">Meta: 1.100 unidades</p>
            </div>
            <div className="bg-white p-6 rounded-xl border-l-4 border-secondary shadow-sm">
              <p className="text-xs text-on-surface-variant font-medium mb-2">Média Semanal</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-on-surface">8.420</h3>
                <span className="text-xs font-bold text-primary flex items-center"><TrendingDown className="w-3 h-3" /> -3%</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 mt-4 italic font-medium">Período: 01 a 07 de Out</p>
            </div>
            <div className="bg-white p-6 rounded-xl border-l-4 border-tertiary shadow-sm">
              <p className="text-xs text-on-surface-variant font-medium mb-2">Volume Mensal (Proj.)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-on-surface">34.2k</h3>
                <span className="text-xs font-bold text-on-surface-variant flex items-center"><Minus className="w-3 h-3" /> estável</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 mt-4 italic font-medium">Baseado em Histórico 2023</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 min-h-[400px] flex flex-col shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-xl font-bold text-on-surface">Fluxo de Distribuição Recife</h4>
                <p className="text-sm text-on-surface-variant">Comparativo de produção vs. demanda regional</p>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase"><span className="w-2 h-2 rounded-full bg-primary"></span> Produção</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase"><span className="w-2 h-2 rounded-full bg-secondary"></span> Demanda</span>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-3 pb-4">
              {[40, 65, 50, 80, 95, 60, 75].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group transition-all cursor-pointer hover:bg-slate-100" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full bg-primary/20 h-[80%] rounded-t-lg"></div>
                  <div className="absolute bottom-0 w-1/2 left-1/4 bg-primary h-[60%] rounded-t-lg transition-all group-hover:h-[70%]"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-tighter pt-4 border-t border-slate-100">
              <span>Segunda</span><span>Terça</span><span>Quarta</span><span>Quinta</span><span>Sexta</span><span>Sábado</span><span>Domingo</span>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-on-surface">Breakdown por Produto e Sabor</h4>
              <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                Exportar CSV <Download className="w-4 h-4" />
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Sabor / Categoria</th>
                  <th className="px-4 py-4 text-right">Unidades</th>
                  <th className="px-4 py-4 text-right">% do Total</th>
                  <th className="px-4 py-4 text-right">Status</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Empada de Frango', cat: 'Clássica Artesanal', units: '4.210', pct: '32%', status: 'Em Alta', color: 'bg-green-100 text-green-800' },
                  { name: 'Queijo do Reino', cat: 'Gourmet Regional', units: '2.840', pct: '21%', status: 'Estável', color: 'bg-yellow-100 text-yellow-800' },
                  { name: 'Camarão com Catupiry', cat: 'Premium Seafood', units: '1.950', pct: '15%', status: 'Reposição', color: 'bg-red-100 text-red-800' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white font-bold text-xs">{item.name[0]}</div>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{item.cat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-bold">{item.units}</td>
                    <td className="px-4 py-4 text-right text-on-surface-variant">{item.pct}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", item.color)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h5 className="font-bold text-on-surface uppercase text-xs tracking-widest">Unidades Operacionais</h5>
              <p className="text-[10px] text-on-surface-variant mt-1">Selecione para KPI isolado</p>
            </div>
            <div className="divide-y divide-slate-50">
              {['Shopping Recife', 'Boa Viagem - Rua', 'Aeroporto Guararapes', 'Shopping Tacaruna'].map((hub, i) => (
                <button key={hub} className={cn(
                  "w-full px-6 py-4 flex items-center justify-between group transition-all text-left",
                  i === 0 ? "bg-primary text-white" : "hover:bg-slate-50"
                )}>
                  <div>
                    <p className="font-bold text-sm">{hub}</p>
                    <p className={cn("text-[10px]", i === 0 ? "text-white/70" : "text-on-surface-variant")}>ID: REC-0{i+1} | Ativo</p>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    i === 0 ? "border-white" : "border-slate-300"
                  )}>
                    {i === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

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
              <MapIcon className="w-full h-full p-8 text-slate-200" />
              <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-primary/20 rounded-full animate-pulse border-2 border-primary"></div>
              <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-secondary/20 rounded-full animate-pulse border-2 border-secondary"></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-4 text-center">Focos de alta demanda detectados no <span className="font-bold">Setor Norte</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
