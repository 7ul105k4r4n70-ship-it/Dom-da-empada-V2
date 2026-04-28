import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Package, RotateCcw, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeToTable, supabase } from '@/supabase';
import { type Order, type Region } from '@/types';

type KPIUnit = 'Unidades' | 'Caixas';
type RelevantCategory = 'Empadas Salgadas' | 'Empadas Doces' | 'Pastéis';

interface KPIFlowDistributionCardProps {
  region: Region;
  unit: KPIUnit;
  selectedPoint?: string | null;
  onSelectPoint?: (pointName: string | null) => void;
}

interface ProductEntry {
  orderId: string;
  pointName: string;
  dayKey: string;
  productName: string;
  category: RelevantCategory;
  quantityBoxes: number;
}

interface ProductRow {
  key: string;
  productName: string;
  category: RelevantCategory;
  dailyValues: Record<string, number>;
  total: number;
}

const DELIVERED_STATUSES = ['COMPLETED', 'DELIVERED', 'Entregue'];
const SAVORY_FLAVORS = ['camarao', 'frango', 'carne', 'queijo', 'palmito', 'bacalhau', 'charque', 'atum', 'presunto', 'calabresa', 'sardinha'];
const SWEET_FLAVORS = ['banana', 'chocolate', 'romeu', 'julieta', 'beijinho', 'coco', 'prestigio', 'pacoca', 'morango', 'doce de leite', 'goiabada', 'brigadeiro'];

function normalizeText(value: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function formatDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCompactDate(date: Date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatWeekday(date: Date) {
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value || 0);
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

function classifyRelevantCategory(category: string, productName: string): RelevantCategory | null {
  const cat = normalizeText(category);
  const name = normalizeText(productName);

  if (cat.includes('pastel') || name.includes('pastel')) return 'Pastéis';

  const isSweet = ((cat.includes('empada') && cat.includes('doce')) || cat.includes('empadas doces') || cat === 'food_sweet' || SWEET_FLAVORS.some((flavor) => name.includes(flavor)));
  if (isSweet) return 'Empadas Doces';

  const isSavory = cat.includes('empada salgada') || cat.includes('salgada') || cat === 'food_salty' || SAVORY_FLAVORS.some((flavor) => name.includes(flavor));
  if (isSavory) return 'Empadas Salgadas';

  return null;
}

function getUnitsPerBox(category: RelevantCategory) {
  if (category === 'Empadas Doces') return 18;
  if (category === 'Pastéis') return 12;
  return 19;
}

function getCategoryBadgeClass(category: RelevantCategory) {
  if (category === 'Empadas Doces') return 'bg-pink-100 text-pink-700';
  if (category === 'Pastéis') return 'bg-orange-100 text-orange-700';
  return 'bg-amber-100 text-amber-700';
}

export function KPIFlowDistributionCard({ region, unit, selectedPoint: selectedPointProp, onSelectPoint }: KPIFlowDistributionCardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [internalSelectedPoint, setInternalSelectedPoint] = useState('');
  const hasLoadedEntriesRef = useRef(false);

  const dailyColumns = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6 + index);
      return {
        key: formatDayKey(date),
        weekday: formatWeekday(date),
        shortDate: formatCompactDate(date),
        date,
      };
    });
  }, []);

  const { windowStart, windowEnd } = useMemo(() => ({
    windowStart: dailyColumns[0]?.date,
    windowEnd: dailyColumns[dailyColumns.length - 1] ? endOfDay(dailyColumns[dailyColumns.length - 1].date) : undefined,
  }), [dailyColumns]);

  useEffect(() => {
    setInternalSelectedPoint('');
    hasLoadedEntriesRef.current = false;
    setLoadingEntries(true);
  }, [region]);

  useEffect(() => {
    setLoadingOrders(true);
    
    // Otimização: Carregar apenas pedidos dos últimos 14 dias para KPIs
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    const unsub = subscribeToTable('orders', { region }, (data) => {
      // Filtrar apenas pedidos recentes
      const recentOrders = (data || []).filter(order => {
        const orderDate = new Date(order.created_at || order.timestamp || Date.now());
        return orderDate >= fourteenDaysAgo;
      });
      setOrders(recentOrders as Order[]);
      setLoadingOrders(false);
    }, 'created_at');

    return () => unsub();
  }, [region]);

  useEffect(() => {
    let cancelled = false;

    const loadEntries = async () => {
      if (!hasLoadedEntriesRef.current) {
        setLoadingEntries(true);
      }

      const recentDeliveredOrders = orders.filter((order) => {
        if (!DELIVERED_STATUSES.includes(order.status)) return false;
        const orderDate = getOrderDate(order);
        return Boolean(orderDate && windowStart && windowEnd && orderDate >= windowStart && orderDate <= windowEnd);
      });

      if (recentDeliveredOrders.length === 0) {
        if (!cancelled) {
          setEntries([]);
          hasLoadedEntriesRef.current = true;
          setLoadingEntries(false);
        }
        return;
      }

      const orderIds = recentDeliveredOrders.map((order) => order.id);
      const [{ data: orderItems, error: orderItemsError }, { data: deliveryProducts, error: deliveryProductsError }] = await Promise.all([
        supabase.from('order_items').select('order_id, product_name, quantity').in('order_id', orderIds),
        supabase.from('delivery_products').select('order_id, product_name, quantity, category').in('order_id', orderIds),
      ]);

      if (orderItemsError) console.error('[KPIFlowDistributionCard] Erro ao buscar order_items:', orderItemsError);
      if (deliveryProductsError) console.error('[KPIFlowDistributionCard] Erro ao buscar delivery_products:', deliveryProductsError);

      const orderMap: Record<string, { quantityMap: Record<string, number>; categoryMap: Record<string, string> }> = {};
      const ensureOrderMap = (orderId: string) => {
        if (!orderMap[orderId]) {
          orderMap[orderId] = { quantityMap: {}, categoryMap: {} };
        }
        return orderMap[orderId];
      };

      (orderItems || []).forEach((item: any) => {
        const orderEntry = ensureOrderMap(item.order_id);
        orderEntry.quantityMap[item.product_name] = Number(item.quantity || 0);
      });

      (deliveryProducts || []).forEach((item: any) => {
        const orderEntry = ensureOrderMap(item.order_id);
        const quantity = Number(item.quantity || 0);
        orderEntry.quantityMap[item.product_name] = quantity > 0 ? quantity : (orderEntry.quantityMap[item.product_name] || 0);
        if (item.category) orderEntry.categoryMap[item.product_name] = item.category;
      });

      const nextEntries: ProductEntry[] = [];
      recentDeliveredOrders.forEach((order) => {
        const orderDate = getOrderDate(order);
        if (!orderDate) return;

        const productMap = orderMap[order.id];
        if (!productMap) return;

        Object.entries(productMap.quantityMap).forEach(([productName, quantity]) => {
          const parsedQuantity = Number(quantity || 0);
          if (parsedQuantity <= 0) return;

          const category = classifyRelevantCategory(productMap.categoryMap[productName] || '', productName);
          if (!category) return;

          nextEntries.push({
            orderId: order.id,
            pointName: getPointName(order),
            dayKey: formatDayKey(orderDate),
            productName,
            category,
            quantityBoxes: parsedQuantity,
          });
        });
      });

      if (!cancelled) {
        setEntries(nextEntries);
        hasLoadedEntriesRef.current = true;
        setLoadingEntries(false);
      }
    };

    void loadEntries();

    return () => {
      cancelled = true;
    };
  }, [orders, region, windowEnd, windowStart]);

  const selectedPoint = selectedPointProp ?? internalSelectedPoint;

  const handleSelectPoint = (pointName: string | null) => {
    if (selectedPointProp === undefined) {
      setInternalSelectedPoint(pointName || '');
    }
    onSelectPoint?.(pointName);
  };

  const filteredEntries = useMemo(() => {
    return selectedPoint ? entries.filter((entry) => entry.pointName === selectedPoint) : entries;
  }, [entries, selectedPoint]);

  const pointSummaries = useMemo(() => {
    const pointMap: Record<string, { total: number; orderIds: Set<string> }> = {};

    entries.forEach((entry) => {
      if (!pointMap[entry.pointName]) {
        pointMap[entry.pointName] = { total: 0, orderIds: new Set<string>() };
      }

      const quantityValue = unit === 'Caixas' ? entry.quantityBoxes : entry.quantityBoxes * getUnitsPerBox(entry.category);
      pointMap[entry.pointName].total += quantityValue;
      pointMap[entry.pointName].orderIds.add(entry.orderId);
    });

    return Object.entries(pointMap)
      .map(([pointName, summary]) => ({
        pointName,
        total: summary.total,
        orderCount: summary.orderIds.size,
      }))
      .sort((a, b) => b.total - a.total || a.pointName.localeCompare(b.pointName));
  }, [entries, unit]);

  const productRows = useMemo(() => {
    const rowMap: Record<string, ProductRow> = {};

    filteredEntries.forEach((entry) => {
      const rowKey = `${entry.category}::${entry.productName}`;
      if (!rowMap[rowKey]) {
        rowMap[rowKey] = {
          key: rowKey,
          productName: entry.productName,
          category: entry.category,
          dailyValues: Object.fromEntries(dailyColumns.map((column) => [column.key, 0])),
          total: 0,
        };
      }

      const quantityValue = unit === 'Caixas' ? entry.quantityBoxes : entry.quantityBoxes * getUnitsPerBox(entry.category);
      rowMap[rowKey].dailyValues[entry.dayKey] += quantityValue;
      rowMap[rowKey].total += quantityValue;
    });

    return Object.values(rowMap).sort((a, b) => b.total - a.total || a.productName.localeCompare(b.productName));
  }, [dailyColumns, filteredEntries, unit]);

  const totalVolume = useMemo(() => {
    return productRows.reduce((sum, row) => sum + row.total, 0);
  }, [productRows]);

  const totalOrders = useMemo(() => {
    return new Set(filteredEntries.map((entry) => entry.orderId)).size;
  }, [filteredEntries]);

  const loading = loadingOrders || loadingEntries;

  return (
    <div className="bg-white rounded-xl p-8 min-h-[400px] shadow-sm border border-slate-100 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h4 className="text-xl font-bold text-on-surface">Fluxo de Distribuição {region}</h4>
          <p className="text-sm text-on-surface-variant">
            {selectedPoint ? `Quantidades diárias do ponto ${selectedPoint}` : 'Quantidades diárias de todos os pontos juntos'}
            {' · '}
            Baseado no Relatório de Entregas dos últimos 7 dias.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            {unit}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {selectedPoint || 'Todos os pontos'}
          </span>
          <button
            onClick={() => handleSelectPoint(null)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redefinir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Volume total</p>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-black text-on-surface mt-3">{formatNumber(totalVolume)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Produtos</p>
            <Package className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-3xl font-black text-on-surface mt-3">{formatNumber(productRows.length)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Pedidos entregues</p>
            <Store className="w-4 h-4 text-tertiary" />
          </div>
          <p className="text-3xl font-black text-on-surface mt-3">{formatNumber(totalOrders)}</p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[240px] flex items-center justify-center rounded-2xl bg-slate-50 text-on-surface-variant">
          <p className="text-sm font-bold animate-pulse">Carregando estatísticas das entregas...</p>
        </div>
      ) : productRows.length === 0 ? (
        <div className="min-h-[240px] flex flex-col items-center justify-center rounded-2xl bg-slate-50 text-center text-on-surface-variant px-6">
          <p className="text-sm font-bold">Nenhuma entrega encontrada para empadas salgadas, empadas doces ou pastéis.</p>
          <p className="text-xs mt-2">A estatística aparece aqui quando houver produtos confirmados no Relatório de Entregas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-4 py-4">Categoria</th>
                {dailyColumns.map((column) => (
                  <th key={column.key} className="px-3 py-4 text-right">
                    <div className="flex flex-col items-end leading-tight">
                      <span>{column.weekday}</span>
                      <span className="text-[9px] font-bold normal-case tracking-normal text-on-surface-variant/70">{column.shortDate}</span>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {productRows.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-black text-on-surface">{row.productName}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', getCategoryBadgeClass(row.category))}>
                      {row.category}
                    </span>
                  </td>
                  {dailyColumns.map((column) => (
                    <td key={column.key} className="px-3 py-4 text-right font-bold text-on-surface">
                      {formatNumber(row.dailyValues[column.key] || 0)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex min-w-[92px] justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
                      {formatNumber(row.total)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-slate-100 pt-5 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h5 className="text-sm font-black uppercase tracking-widest text-on-surface">Pontos</h5>
            <p className="text-[11px] text-on-surface-variant">Clique no nome do ponto para mostrar apenas as quantidades daquele ponto.</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            {pointSummaries.length} ponto(s) com movimentação
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {pointSummaries.length === 0 ? (
            <div className="w-full rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm font-bold text-on-surface-variant">
              Nenhum ponto com movimentação nos últimos 7 dias.
            </div>
          ) : (
            pointSummaries.map((point) => {
              const isSelected = selectedPoint === point.pointName;
              return (
                <button
                  key={point.pointName}
                  onClick={() => handleSelectPoint(selectedPoint === point.pointName ? null : point.pointName)}
                  className={cn(
                    'rounded-2xl border px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md min-w-[220px]',
                    isSelected ? 'border-primary bg-primary text-white' : 'border-slate-100 bg-white'
                  )}
                >
                  <p className={cn('text-sm font-black', isSelected ? 'text-white' : 'text-on-surface')}>{point.pointName}</p>
                  <div className={cn('mt-2 flex items-center justify-between text-[11px] font-bold', isSelected ? 'text-white/80' : 'text-on-surface-variant')}>
                    <span>{formatNumber(point.orderCount)} pedido(s)</span>
                    <span>{formatNumber(point.total)} {unit === 'Caixas' ? 'caixas' : 'unidades'}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
