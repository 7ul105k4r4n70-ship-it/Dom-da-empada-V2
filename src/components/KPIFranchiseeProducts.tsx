import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Package, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeToTable } from '@/supabase';
import { type Region } from '@/types';

type KPIUnit = 'Unidades' | 'Caixas';
type PeriodKey = 'day' | 'week' | 'month';
type CategoryKey = 'empadasSalgadas' | 'empadasDoces' | 'pasteis' | 'embalagens' | 'descartaveis' | 'uniformes';

type CategoryTotals = Record<CategoryKey, number> & { total: number };

interface DeliveryProductMetric {
  id: string;
  product_name: string;
  category: string;
  quantity: number;
  point_name?: string;
  region: Region;
  delivered_at: string;
}

interface FranchiseePoint {
  id: string;
  name: string;
}

interface FranchiseeMetric {
  id: string;
  name: string;
  region: Region;
  points?: FranchiseePoint[];
}

interface FranchiseeRow {
  franchiseeName: string;
  pointNames: string[];
  totals: CategoryTotals;
}

interface KPIFranchiseeProductsProps {
  region: Region;
  unit: KPIUnit;
}

const PERIOD_OPTIONS: Array<{ key: PeriodKey; label: string; description: string }> = [
  { key: 'day', label: 'Hoje', description: 'Movimentação do dia atual' },
  { key: 'week', label: 'Semana', description: 'Acumulado da semana atual' },
  { key: 'month', label: 'Mês', description: 'Acumulado do mês atual' },
];

const CATEGORY_DEFINITIONS: Array<{ key: CategoryKey; label: string; shortLabel: string; accent: string }> = [
  { key: 'empadasSalgadas', label: 'Empadas Salgadas', shortLabel: 'Emp. Salgadas', accent: 'bg-amber-50 text-amber-700 border-amber-100' },
  { key: 'empadasDoces', label: 'Empadas Doces', shortLabel: 'Emp. Doces', accent: 'bg-pink-50 text-pink-700 border-pink-100' },
  { key: 'pasteis', label: 'Pastéis', shortLabel: 'Pastéis', accent: 'bg-orange-50 text-orange-700 border-orange-100' },
  { key: 'embalagens', label: 'Embalagens', shortLabel: 'Embalagens', accent: 'bg-sky-50 text-sky-700 border-sky-100' },
  { key: 'descartaveis', label: 'Descartáveis', shortLabel: 'Descartáveis', accent: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
  { key: 'uniformes', label: 'Uniformes', shortLabel: 'Uniformes', accent: 'bg-violet-50 text-violet-700 border-violet-100' },
];

function createEmptyTotals(): CategoryTotals {
  return {
    empadasSalgadas: 0,
    empadasDoces: 0,
    pasteis: 0,
    embalagens: 0,
    descartaveis: 0,
    uniformes: 0,
    total: 0,
  };
}

function normalizeText(value: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getUnitsPerBox(category: string, name: string): number {
  const cat = normalizeText(category);
  const nm = normalizeText(name);
  const savoryFlavors = ['camarao', 'frango', 'carne', 'queijo', 'palmito', 'bacalhau', 'charque', 'atum', 'presunto', 'calabresa', 'sardinha'];
  const sweetFlavors = ['banana', 'chocolate', 'romeu', 'julieta', 'beijinho', 'coco', 'prestigio', 'pacoca', 'morango', 'doce de leite', 'goiabada', 'brigadeiro'];

  const isSweet = (cat.includes('empada') && cat.includes('doce')) || cat.includes('empadas doces') || cat === 'food_sweet' || sweetFlavors.some((flavor) => nm.includes(flavor));
  if (isSweet) return 18;

  const isSavory = cat.includes('empada salgada') || cat.includes('empadas') || cat.includes('salgada') || cat === 'food_salty' || savoryFlavors.some((flavor) => nm.includes(flavor));
  if (isSavory) return 19;

  if ((nm.includes('camarao') && nm.includes('pastel')) || cat.includes('pastel') || nm.includes('pastel')) return 12;

  return 1;
}

function classifyCategory(category: string, name: string): CategoryKey {
  const cat = normalizeText(category);
  const nm = normalizeText(name);
  const sweetFlavors = ['banana', 'chocolate', 'romeu', 'julieta', 'beijinho', 'coco', 'prestigio', 'pacoca', 'morango', 'doce de leite', 'goiabada', 'brigadeiro'];

  if (cat.includes('fardamento') || cat.includes('uniforme') || nm.includes('farda') || nm.includes('uniforme')) return 'uniformes';
  if (cat.includes('descart')) return 'descartaveis';
  if (cat.includes('embalag') || nm.includes('embalag') || nm.includes('caixa') || nm.includes('sacola')) return 'embalagens';
  if (cat.includes('pastel') || nm.includes('pastel')) return 'pasteis';
  if ((cat.includes('empada') && cat.includes('doce')) || cat.includes('empadas doces') || sweetFlavors.some((flavor) => nm.includes(flavor))) return 'empadasDoces';
  return 'empadasSalgadas';
}

function getQuantityValue(item: DeliveryProductMetric, unit: KPIUnit) {
  const quantity = Number(item.quantity || 0);
  if (unit === 'Caixas') return quantity;
  return quantity * getUnitsPerBox(item.category, item.product_name);
}

function getStartOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getStartOfWeek(date: Date) {
  const result = getStartOfDay(date);
  const weekDay = result.getDay();
  const diff = weekDay === 0 ? -6 : 1 - weekDay;
  result.setDate(result.getDate() + diff);
  return result;
}

function getStartOfMonth(date: Date) {
  const result = getStartOfDay(date);
  result.setDate(1);
  return result;
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value || 0);
}

export function KPIFranchiseeProducts({ region, unit }: KPIFranchiseeProductsProps) {
  const [deliveries, setDeliveries] = useState<DeliveryProductMetric[]>([]);
  const [franchisees, setFranchisees] = useState<FranchiseeMetric[]>([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [loadingFranchisees, setLoadingFranchisees] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('day');

  useEffect(() => {
    setLoadingDeliveries(true);
    const unsub = subscribeToTable('delivery_products', { region }, (data) => {
      setDeliveries((data || []) as DeliveryProductMetric[]);
      setLoadingDeliveries(false);
    }, 'delivered_at', false);
    return () => unsub();
  }, [region]);

  useEffect(() => {
    setLoadingFranchisees(true);
    const unsub = subscribeToTable('franchisees', { region }, (data) => {
      setFranchisees((data || []) as FranchiseeMetric[]);
      setLoadingFranchisees(false);
    }, 'created_at');
    return () => unsub();
  }, [region]);

  const regionFranchisees = useMemo(
    () => franchisees.filter((franchisee) => franchisee.region === region),
    [franchisees, region]
  );

  const pointToFranchisee = useMemo(() => {
    const map: Record<string, string> = {};
    regionFranchisees.forEach((franchisee) => {
      const points = Array.isArray(franchisee.points) ? franchisee.points : [];
      points.forEach((point) => {
        if (point?.name) {
          map[normalizeText(point.name)] = franchisee.name;
        }
      });
    });
    return map;
  }, [regionFranchisees]);

  const metrics = useMemo(() => {
    const now = new Date();
    const startOfDay = getStartOfDay(now);
    const startOfWeek = getStartOfWeek(now);
    const startOfMonth = getStartOfMonth(now);

    const rowsByPeriod: Record<PeriodKey, Record<string, FranchiseeRow>> = {
      day: {},
      week: {},
      month: {},
    };

    const overallByPeriod: Record<PeriodKey, CategoryTotals> = {
      day: createEmptyTotals(),
      week: createEmptyTotals(),
      month: createEmptyTotals(),
    };

    const ensureRow = (period: PeriodKey, franchiseeName: string) => {
      if (!rowsByPeriod[period][franchiseeName]) {
        rowsByPeriod[period][franchiseeName] = {
          franchiseeName,
          pointNames: [],
          totals: createEmptyTotals(),
        };
      }
      return rowsByPeriod[period][franchiseeName];
    };

    regionFranchisees.forEach((franchisee) => {
      ensureRow('day', franchisee.name);
      ensureRow('week', franchisee.name);
      ensureRow('month', franchisee.name);
    });

    deliveries.forEach((delivery) => {
      if (delivery.region !== region) return;

      const deliveredAt = new Date(delivery.delivered_at);
      if (Number.isNaN(deliveredAt.getTime())) return;

      const periods: PeriodKey[] = [];
      if (deliveredAt >= startOfMonth) periods.push('month');
      if (deliveredAt >= startOfWeek) periods.push('week');
      if (deliveredAt >= startOfDay) periods.push('day');
      if (periods.length === 0) return;

      const pointName = delivery.point_name || '';
      const franchiseeName = pointToFranchisee[normalizeText(pointName)] || pointName || 'Não vinculado';
      const categoryKey = classifyCategory(delivery.category, delivery.product_name);
      const quantityValue = getQuantityValue(delivery, unit);

      periods.forEach((period) => {
        const row = ensureRow(period, franchiseeName);
        row.totals[categoryKey] += quantityValue;
        row.totals.total += quantityValue;

        if (pointName && !row.pointNames.includes(pointName)) {
          row.pointNames.push(pointName);
        }

        overallByPeriod[period][categoryKey] += quantityValue;
        overallByPeriod[period].total += quantityValue;
      });
    });

    const sortedRows = {
      day: Object.values(rowsByPeriod.day).sort((a, b) => b.totals.total - a.totals.total || a.franchiseeName.localeCompare(b.franchiseeName)),
      week: Object.values(rowsByPeriod.week).sort((a, b) => b.totals.total - a.totals.total || a.franchiseeName.localeCompare(b.franchiseeName)),
      month: Object.values(rowsByPeriod.month).sort((a, b) => b.totals.total - a.totals.total || a.franchiseeName.localeCompare(b.franchiseeName)),
    };

    return {
      rows: sortedRows,
      overall: overallByPeriod,
    };
  }, [deliveries, pointToFranchisee, region, regionFranchisees, unit]);

  const loading = loadingDeliveries || loadingFranchisees;
  const selectedRows = metrics.rows[selectedPeriod];
  const selectedTotals = metrics.overall[selectedPeriod];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PERIOD_OPTIONS.map((period) => {
          const total = metrics.overall[period.key].total;
          const activeFranchisees = metrics.rows[period.key].filter((row) => row.totals.total > 0).length;
          return (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={cn(
                'bg-white p-6 rounded-2xl border text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                selectedPeriod === period.key ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{period.label}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{period.description}</p>
                </div>
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  selectedPeriod === period.key ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                )}>
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5">
                <p className="text-4xl font-black text-on-surface leading-none">{formatQuantity(total)}</p>
                <p className="text-[11px] text-on-surface-variant mt-2">{activeFranchisees} franqueados com movimentação</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h4 className="text-lg font-black text-on-surface">Quantidades por Franqueado</h4>
            <p className="text-sm text-on-surface-variant">Baseado em entregas confirmadas na tabela delivery_products · visualização em {unit.toLowerCase()}.</p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
                  selectedPeriod === period.key ? 'primary-gradient text-white shadow-sm' : 'text-on-surface-variant hover:bg-slate-200'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {CATEGORY_DEFINITIONS.map((category) => (
            <div key={category.key} className={cn('rounded-xl border px-4 py-3', category.accent)}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{category.shortLabel}</p>
              <p className="text-2xl font-black mt-2">{formatQuantity(selectedTotals[category.key])}</p>
            </div>
          ))}
          <div className="rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 text-slate-700">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Geral</p>
            <p className="text-2xl font-black mt-2">{formatQuantity(selectedTotals.total)}</p>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-on-surface-variant">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-sm font-bold">Carregando indicadores por franqueado...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">Franqueado</th>
                  {CATEGORY_DEFINITIONS.map((category) => (
                    <th key={category.key} className="px-4 py-4 text-right">{category.shortLabel}</th>
                  ))}
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {selectedRows.map((row) => (
                  <tr key={row.franchiseeName} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-on-surface">{row.franchiseeName}</p>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            {row.pointNames.length > 0 ? `${row.pointNames.length} ponto(s) com movimentação` : 'Sem movimentação no período'}
                          </p>
                        </div>
                      </div>
                    </td>
                    {CATEGORY_DEFINITIONS.map((category) => (
                      <td key={category.key} className="px-4 py-4 text-right font-bold text-on-surface">
                        {formatQuantity(row.totals[category.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex min-w-[88px] justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">
                        {formatQuantity(row.totals.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white text-sm font-black">
                  <td className="px-6 py-4">Total Geral</td>
                  {CATEGORY_DEFINITIONS.map((category) => (
                    <td key={category.key} className="px-4 py-4 text-right">{formatQuantity(selectedTotals[category.key])}</td>
                  ))}
                  <td className="px-6 py-4 text-right">{formatQuantity(selectedTotals.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
