import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarDays, MapPin, Package, RotateCcw, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeToTable } from '@/supabase';
import { type Order, type Region } from '@/types';

interface KPIDeliveryPerformanceProps {
  region: Region;
}

interface PointMetrics {
  pointName: string;
  totalOrders: number;
  completedOrders: number;
  inTransitOrders: number;
  pendingOrders: number;
  totalUnits: number;
  completionRate: number;
}

interface SummaryMetrics {
  totalOrders: number;
  completedOrders: number;
  inTransitOrders: number;
  pendingOrders: number;
  totalUnits: number;
  activePoints: number;
  completionRate: number;
}

function normalizeText(value: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getPointName(order: Order) {
  return order.pointName || order.point_name || 'Ponto não informado';
}

function getOrderDate(order: Order) {
  const rawValue = order.timestamp || order.created_at;
  if (!rawValue) return null;
  const parsed = (rawValue as any)?.toDate ? (rawValue as any).toDate() : new Date(rawValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isCompletedStatus(status?: string) {
  const normalized = normalizeText(status || '').replace(/\s+/g, '_');
  return normalized === 'completed' || normalized === 'delivered' || normalized === 'entregue';
}

function isInTransitStatus(status?: string) {
  const normalized = normalizeText(status || '').replace(/\s+/g, '_');
  return normalized === 'in_progress' || normalized === 'in_transit' || normalized === 'accepted';
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value || 0);
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace('.', ',')}%`;
}

export function KPIDeliveryPerformance({ region }: KPIDeliveryPerformanceProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToTable('orders', { region }, (data) => {
      setOrders((data || []) as Order[]);
      setLoading(false);
    }, 'created_at');
    return () => unsub();
  }, [region]);

  useEffect(() => {
    setSelectedPoint('');
    setStartDate('');
    setEndDate('');
  }, [region]);

  const pointOptions = useMemo(() => {
    return Array.from(new Set(orders.map((order) => getPointName(order)))).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      if (startDate && orderDate < new Date(`${startDate}T00:00:00`)) return false;
      if (endDate && orderDate > new Date(`${endDate}T23:59:59`)) return false;
      if (selectedPoint && getPointName(order) !== selectedPoint) return false;
      return true;
    });
  }, [orders, startDate, endDate, selectedPoint]);

  const overallPointMetrics = useMemo(() => {
    const grouped: Record<string, PointMetrics> = {};

    orders.forEach((order) => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return;

      if (startDate && orderDate < new Date(`${startDate}T00:00:00`)) return;
      if (endDate && orderDate > new Date(`${endDate}T23:59:59`)) return;

      const pointName = getPointName(order);
      if (!grouped[pointName]) {
        grouped[pointName] = {
          pointName,
          totalOrders: 0,
          completedOrders: 0,
          inTransitOrders: 0,
          pendingOrders: 0,
          totalUnits: 0,
          completionRate: 0,
        };
      }

      grouped[pointName].totalOrders += 1;
      grouped[pointName].totalUnits += Number(order.units || 0);

      if (isCompletedStatus(order.status)) {
        grouped[pointName].completedOrders += 1;
      } else if (isInTransitStatus(order.status)) {
        grouped[pointName].inTransitOrders += 1;
      } else {
        grouped[pointName].pendingOrders += 1;
      }
    });

    return Object.values(grouped)
      .map((item) => ({
        ...item,
        completionRate: item.totalOrders > 0 ? (item.completedOrders / item.totalOrders) * 100 : 0,
      }))
      .sort((a, b) => b.completionRate - a.completionRate || b.totalOrders - a.totalOrders || a.pointName.localeCompare(b.pointName));
  }, [orders, startDate, endDate]);

  const summary = useMemo<SummaryMetrics>(() => {
    const totals: SummaryMetrics = {
      totalOrders: 0,
      completedOrders: 0,
      inTransitOrders: 0,
      pendingOrders: 0,
      totalUnits: 0,
      activePoints: 0,
      completionRate: 0,
    };

    filteredOrders.forEach((order) => {
      totals.totalOrders += 1;
      totals.totalUnits += Number(order.units || 0);
      if (isCompletedStatus(order.status)) {
        totals.completedOrders += 1;
      } else if (isInTransitStatus(order.status)) {
        totals.inTransitOrders += 1;
      } else {
        totals.pendingOrders += 1;
      }
    });

    totals.activePoints = new Set(filteredOrders.map((order) => getPointName(order))).size;
    totals.completionRate = totals.totalOrders > 0 ? (totals.completedOrders / totals.totalOrders) * 100 : 0;

    return totals;
  }, [filteredOrders]);

  const generalTotals = useMemo<SummaryMetrics>(() => {
    const totals: SummaryMetrics = {
      totalOrders: 0,
      completedOrders: 0,
      inTransitOrders: 0,
      pendingOrders: 0,
      totalUnits: 0,
      activePoints: overallPointMetrics.length,
      completionRate: 0,
    };

    overallPointMetrics.forEach((point) => {
      totals.totalOrders += point.totalOrders;
      totals.completedOrders += point.completedOrders;
      totals.inTransitOrders += point.inTransitOrders;
      totals.pendingOrders += point.pendingOrders;
      totals.totalUnits += point.totalUnits;
    });

    totals.completionRate = totals.totalOrders > 0 ? (totals.completedOrders / totals.totalOrders) * 100 : 0;

    return totals;
  }, [overallPointMetrics]);

  const selectedModeLabel = selectedPoint || 'Geral · Todos os pontos';

  const handleReset = () => {
    setSelectedPoint('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h4 className="text-lg font-black text-on-surface">Desempenho das Entregas</h4>
              <p className="text-sm text-on-surface-variant">Acompanhe a operação por ponto ou no modo geral com intervalo de datas.</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-on-surface-variant hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Redefinir
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Data inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Data final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ponto</label>
              <select
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos os pontos</option>
                {pointOptions.map((point) => (
                  <option key={point} value={point}>{point}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-tertiary text-white rounded-2xl shadow-lg p-6 overflow-hidden relative">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <BarChart3 className="w-3.5 h-3.5" />
              Modo atual
            </div>
            <div>
              <p className="text-sm text-white/70">Escopo selecionado</p>
              <p className="text-2xl font-black leading-tight mt-1">{selectedModeLabel}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-black">Pedidos</p>
                <p className="text-2xl font-black mt-1">{formatNumber(summary.totalOrders)}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-black">Taxa</p>
                <p className="text-2xl font-black mt-1">{formatPercent(summary.completionRate)}</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Total de pedidos</p>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.totalOrders)}</p>
          <p className="text-xs text-on-surface-variant mt-2">No intervalo filtrado</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Entregues</p>
            <Truck className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.completedOrders)}</p>
          <p className="text-xs text-on-surface-variant mt-2">Concluídos com sucesso</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Em rota</p>
            <Truck className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.inTransitOrders)}</p>
          <p className="text-xs text-on-surface-variant mt-2">Operação em andamento</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Pendentes</p>
            <CalendarDays className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.pendingOrders)}</p>
          <p className="text-xs text-on-surface-variant mt-2">Ainda não concluídos</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Volume total</p>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.totalUnits)}</p>
          <p className="text-xs text-on-surface-variant mt-2">Unidades movimentadas</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Pontos ativos</p>
            <MapPin className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-4xl font-black text-on-surface mt-4">{formatNumber(summary.activePoints)}</p>
          <p className="text-xs text-on-surface-variant mt-2">Pontos com pedidos no período</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h5 className="text-lg font-black text-on-surface">Desempenho por ponto</h5>
            <p className="text-sm text-on-surface-variant">Clique em uma linha para analisar um ponto isoladamente ou mantenha o modo geral.</p>
          </div>
          <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Geral do período: {formatNumber(generalTotals.totalOrders)} pedidos · {formatPercent(generalTotals.completionRate)} de conclusão
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-on-surface-variant">
            <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-sm font-bold">Carregando desempenho das entregas...</p>
          </div>
        ) : overallPointMetrics.length === 0 ? (
          <div className="px-6 py-16 text-center text-on-surface-variant">
            <p className="text-sm font-bold">Nenhum pedido encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">Ponto</th>
                  <th className="px-4 py-4 text-right">Pedidos</th>
                  <th className="px-4 py-4 text-right">Entregues</th>
                  <th className="px-4 py-4 text-right">Em rota</th>
                  <th className="px-4 py-4 text-right">Pendentes</th>
                  <th className="px-4 py-4 text-right">Volume</th>
                  <th className="px-6 py-4 text-right">Taxa de conclusão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {overallPointMetrics.map((point) => {
                  const isSelected = selectedPoint === point.pointName;
                  return (
                    <tr
                      key={point.pointName}
                      onClick={() => setSelectedPoint((current) => current === point.pointName ? '' : point.pointName)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-slate-50',
                        isSelected && 'bg-primary/5'
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                          )}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-on-surface">{point.pointName}</p>
                            <p className="text-[11px] text-on-surface-variant">Clique para isolar este ponto</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold">{formatNumber(point.totalOrders)}</td>
                      <td className="px-4 py-4 text-right font-bold text-green-600">{formatNumber(point.completedOrders)}</td>
                      <td className="px-4 py-4 text-right font-bold text-amber-600">{formatNumber(point.inTransitOrders)}</td>
                      <td className="px-4 py-4 text-right font-bold text-red-500">{formatNumber(point.pendingOrders)}</td>
                      <td className="px-4 py-4 text-right font-bold">{formatNumber(point.totalUnits)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          'inline-flex min-w-[96px] justify-center rounded-full px-3 py-1 text-xs font-black',
                          point.completionRate >= 70 ? 'bg-green-100 text-green-700' : point.completionRate >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        )}>
                          {formatPercent(point.completionRate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white text-sm font-black">
                  <td className="px-6 py-4">Geral</td>
                  <td className="px-4 py-4 text-right">{formatNumber(generalTotals.totalOrders)}</td>
                  <td className="px-4 py-4 text-right">{formatNumber(generalTotals.completedOrders)}</td>
                  <td className="px-4 py-4 text-right">{formatNumber(generalTotals.inTransitOrders)}</td>
                  <td className="px-4 py-4 text-right">{formatNumber(generalTotals.pendingOrders)}</td>
                  <td className="px-4 py-4 text-right">{formatNumber(generalTotals.totalUnits)}</td>
                  <td className="px-6 py-4 text-right">{formatPercent(generalTotals.completionRate)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
