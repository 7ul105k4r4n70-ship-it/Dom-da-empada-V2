import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  Download,
  Filter,
  User,
  MapPin,
  Calendar,
  X,
  PackageSearch,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { type Region, type DriverExtras, type Order } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase, subscribeToTable } from '@/supabase';

export function ExtraDeliveries() {
  const [region, setRegion] = useState<Region>('Recife');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [driverExtrasData, setDriverExtrasData] = useState<DriverExtras[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados reais do Supabase
  useEffect(() => {
    setLoading(true);
    // Filtrar por EXTRA DELIVERY e região (se não for 'Todas')
    const filters: Record<string, any> = { type: 'EXTRA DELIVERY' };
    if (region !== 'Todas') {
      filters.region = region;
    }
    
    const unsub = subscribeToTable('orders', filters, (data: Order[]) => {
      // Agrupar pedidos por motorista
      const grouped = data.reduce<Record<string, DriverExtras>>((acc, order) => {
        const driverName = order.driverName || (order as any).driver_name || 'Sem Motorista';
        const driverId = (order as any).driver_id || driverName; // Fallback para o nome se não tiver ID
        
        if (!acc[driverId]) {
          acc[driverId] = {
            id: driverId,
            driverName: driverName,
            region: order.region,
            totalExtras: 0,
            workDays: [],
            totalValue: 0,
            deliveries: []
          };
        }

        const date = new Date(order.timestamp || order.created_at || '').toLocaleDateString('pt-BR');
        const shortDate = date.split('/').slice(0, 2).join('/'); // dd/mm

        acc[driverId].totalExtras += 1;
        if (!acc[driverId].workDays.includes(shortDate)) {
          acc[driverId].workDays.push(shortDate);
        }
        
        // Valor padrão de 40.00 por entrega se não especificado
        const val = (order as any).extra_delivery_value || 40.00;
        acc[driverId].totalValue += val;
        
        acc[driverId].deliveries.push({
          id: order.id,
          date: date,
          pointName: order.pointName || order.point_name || 'Desconhecido',
          valuePerDelivery: val,
          region: order.region
        });

        return acc;
      }, {});

      setDriverExtrasData(Object.values(grouped));
      setLoading(false);
    }, 'created_at', false);

    return () => unsub();
  }, [region]);


  const handleValueChange = (driverId: string, deliveryId: string, newValue: string) => {
    const val = parseFloat(newValue) || 0;
    
    setDriverExtrasData(prev => prev.map(driver => {
      if (driver.id !== driverId) return driver;

      const updatedDeliveries = driver.deliveries.map(del => 
        del.id === deliveryId ? { ...del, valuePerDelivery: val } : del
      );

      const newTotal = updatedDeliveries.reduce((acc, d) => acc + d.valuePerDelivery, 0);

      return {
        ...driver,
        deliveries: updatedDeliveries,
        totalValue: newTotal
      };
    }));
  };

  const filtered = useMemo(() => driverExtrasData.filter(d => d.region === region), [region, driverExtrasData]);
  const totalExtras = filtered.reduce((a, d) => a + d.totalExtras, 0);
  const totalPayout = filtered.reduce((a, d) => a + d.totalValue, 0);

  const handleExportPDF = async (driver?: DriverExtras) => {
    try {
      const doc = new jsPDF();
      let currentUser = 'Administrador';
      
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.user_metadata?.name) {
          currentUser = data.user.user_metadata.name;
        }
      } catch (e) {
        console.warn("Não foi possível obter usuário logado", e);
      }
      
      const primaryColor = [184, 1, 31];
      
      // INFORMAÇÕES À ESQUERDA (RENTE À LINHA)
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(`Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 20, 27);
      doc.text(`Usuário: ${currentUser}`, 20, 33);
      doc.text(`Região: ${region}`, 20, 39);

      // LOGO REAL À DIREITA (REDONDO)
      try {
        const logoSize = 35; // Aumentado de 25 para 35
        const logoX = 155;  // Ajustado para centralizar com o novo tamanho
        const logoY = 4;
        
        doc.addImage('/logo.png', 'PNG', logoX, logoY, logoSize, logoSize);
      } catch (e) {
        doc.setFontSize(20);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('DOM DA EMPADA', 140, 20);
      }

      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(20, 42, 190, 42); // Linha movida para baixo do logo

      doc.setFontSize(14);
      doc.text('RELATÓRIO DE ENTREGAS EXTRAS', 20, 52); // Título movido para baixo

      if (driver) {
        doc.setFontSize(11);
        doc.text(`Motorista: ${driver.driverName}`, 20, 62);
        doc.text(`Total de Entregas: ${driver.totalExtras}`, 20, 67);
        doc.text(`Valor Acumulado: R$ ${driver.totalValue.toFixed(2)}`, 20, 72);

        const tableData = driver.deliveries.map(del => [
          del.date,
          del.pointName,
          `R$ ${del.valuePerDelivery.toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: 80, // Tabela movida para baixo
          head: [['Data', 'Ponto de Entrega', 'Valor']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor as any },
        });
      } else {
        const tableData = filtered.map(d => [
          d.driverName,
          d.totalExtras.toString(),
          d.workDays.join(', '),
          `R$ ${d.totalValue.toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: 65, // Tabela movida para baixo
          head: [['Motorista', 'Extras', 'Dias', 'Total']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor as any },
        });

        // @ts-ignore
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`TOTAL GERAL DA REGIÃO: R$ ${totalPayout.toFixed(2)}`, 110, finalY);
      }

      doc.save(`Rel_Extras_${region}_${new Date().getTime()}.pdf`);
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF: " + error.message);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-secondary font-bold tracking-widest uppercase mb-1">Módulo 08</p>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Entregas Extras por Motorista</h2>
          <p className="text-on-surface-variant mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
            Remuneração variável · Região {region}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
              showFilters ? 'bg-primary text-white border-primary shadow-lg' : 'border-slate-200 hover:bg-slate-50'
            )}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Fechar Filtros' : 'Filtros'}
          </button>
          <button
            onClick={() => handleExportPDF()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl primary-gradient text-white text-sm font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Imprimir PDF Geral
          </button>
        </div>
      </div>

      {/* ⚠️ Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as const).map(r => (
          <button
            key={r}
            onClick={() => { setRegion(r as any); setExpandedRow(null); }}
            className={cn(
              'px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-on-surface-variant font-bold">Carregando entregas...</span>
        </div>
      )}

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
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data Inicial</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data Final</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex items-end">
                <button onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline">
                  <X className="w-3 h-3" /> Limpar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Motoristas com Extras</span>
            <div className="bg-primary/10 text-primary p-2 rounded-lg"><User className="w-4 h-4" /></div>
          </div>
          <p className="text-5xl font-black text-on-surface">{filtered.length}</p>
          <p className="text-xs text-on-surface-variant mt-2">Em {region} · período filtrado</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-secondary shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total de Extras</span>
            <div className="bg-secondary/10 text-secondary p-2 rounded-lg"><PackageSearch className="w-4 h-4" /></div>
          </div>
          <p className="text-5xl font-black text-on-surface">{totalExtras}</p>
          <p className="text-xs text-on-surface-variant mt-2">Entregas fora da rota padrão</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-tertiary shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Valor Total a Pagar</span>
            <div className="bg-tertiary/10 text-tertiary p-2 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-3xl font-black text-on-surface">
            R$ {totalPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-on-surface-variant mt-2">Remuneração variável acumulada</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
            Motoristas — {region}
          </h4>
          <span className="text-xs text-on-surface-variant">{filtered.length} motoristas nesta região</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-on-surface-variant text-sm">Nenhum motorista com entregas extras em {region}.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(driver => (
              <div key={driver.id}>
                <button
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors text-left group"
                  onClick={() => setExpandedRow(expandedRow === driver.id ? null : driver.id)}
                >
                  <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-primary/20">
                    {driver.driverName.charAt(0)}
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-bold text-on-surface text-sm">{driver.driverName}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">{driver.region}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-2xl text-primary">{driver.totalExtras}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Entregas Extras</p>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {driver.workDays.slice(0, 3).map(d => (
                          <span key={d} className="text-[9px] bg-slate-100 text-on-surface-variant px-1.5 py-0.5 rounded font-bold">{d}</span>
                        ))}
                        {driver.workDays.length > 3 && (
                          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            +{driver.workDays.length - 3}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant uppercase mt-1">Dias trabalhados</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-secondary">
                        R$ {driver.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-on-surface-variant uppercase">A receber</p>
                    </div>
                  </div>
                  <div className={cn('transition-transform duration-200', expandedRow === driver.id ? 'rotate-180' : '')}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedRow === driver.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 bg-slate-50/30">
                        <div className="ml-14 bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                              Detalhamento das Entregas Extras · {driver.driverName}
                            </p>
                            <button 
                              onClick={() => handleExportPDF(driver)}
                              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                            >
                              <Download className="w-3 h-3" /> Imprimir Recibo
                            </button>
                          </div>
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest bg-slate-50/50">
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Ponto de Entrega</th>
                                <th className="px-4 py-3 text-right">Valor Unit.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {driver.deliveries.map(del => (
                                <tr key={del.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-4 py-3 text-sm text-on-surface-variant">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3 h-3" />
                                      {del.date}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-on-surface">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-3 h-3 text-secondary" />
                                      {del.pointName}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <span className="text-xs font-bold text-on-surface-variant">R$</span>
                                      <input 
                                        type="number" 
                                        step="0.01"
                                        value={del.valuePerDelivery}
                                        onChange={(e) => handleValueChange(driver.id, del.id, e.target.value)}
                                        className="w-20 bg-slate-100 border-none rounded px-2 py-1 text-sm font-black text-primary text-right focus:ring-2 focus:ring-primary/20 outline-none"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="border-t-2 border-slate-100">
                              <tr className="bg-slate-50">
                                <td colSpan={2} className="px-4 py-3 text-xs font-black uppercase text-on-surface-variant">Total</td>
                                <td className="px-4 py-3 text-right font-black text-secondary">
                                  R$ {driver.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-on-surface-variant">
            Total: <span className="font-bold text-on-surface">{filtered.length} motoristas</span> ·{' '}
            <span className="font-bold text-primary">{totalExtras} extras</span> ·{' '}
            <span className="font-bold text-secondary">R$ {totalPayout.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </p>
          <p className="text-[10px] text-on-surface-variant/60 uppercase font-bold">⚠️ Dados exclusivos de {region}</p>
        </div>
      </div>
    </div>
  );
}
