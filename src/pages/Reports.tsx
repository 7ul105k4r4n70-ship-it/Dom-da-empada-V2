import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Download, 
  FileDown,
  Edit2,
  Trash2,
  Camera,
  Truck,
  User as UserIcon,
  X,
  Save,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Package,
  MessageSquare,
  Printer,
  Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { subscribeToTable, updateRow, deleteRow, supabase, normalizeStorageUrl } from '@/supabase';
import { type Order, type Region } from '@/types';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Keywords que indicam entrega confirmada pelo motorista (robusto contra variações)
const DELIVERED_KEYWORDS = ['completed', 'delivered', 'entregue', 'concluido', 'finalizado', 'sucesso', 'entrega realizada', 'done', 'success'];

// Helper para verificar se status é entregue — remove acentos e busca por keywords
function isDeliveredStatus(status: string | undefined): boolean {
  if (!status) return false;
  const normalized = (status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  return DELIVERED_KEYWORDS.some(k => normalized.includes(k));
}

// Cores e ícones por categoria (mesmo padrão de Finance.tsx / Preços e Royalties)
type ProductCategory = 'Empada Salgada' | 'Empadas Doces' | 'Pastéis' | 'Descartáveis' | 'Fardamento' | 'Entrega extra';

const CATEGORY_COLORS: Record<ProductCategory | 'Outros', string> = {
  'Empada Salgada': 'bg-amber-100 text-amber-700 border-amber-200',
  'Empadas Doces': 'bg-pink-100 text-pink-700 border-pink-200',
  'Pastéis': 'bg-orange-100 text-orange-700 border-orange-200',
  'Descartáveis': 'bg-sky-100 text-sky-700 border-sky-200',
  'Fardamento': 'bg-violet-100 text-violet-700 border-violet-200',
  'Entrega extra': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Outros': 'bg-slate-100 text-slate-700 border-slate-200',
};

const CATEGORY_HEADER_BG: Record<ProductCategory | 'Outros', string> = {
  'Empada Salgada': 'bg-amber-600',
  'Empadas Doces': 'bg-pink-600',
  'Pastéis': 'bg-orange-600',
  'Descartáveis': 'bg-sky-600',
  'Fardamento': 'bg-violet-600',
  'Entrega extra': 'bg-emerald-600',
  'Outros': 'bg-slate-600',
};

const CATEGORY_ICONS: Record<ProductCategory | 'Outros', string> = {
  'Empada Salgada': '🥧',
  'Empadas Doces': '🍫',
  'Pastéis': '🍞',
  'Descartáveis': '🪣',
  'Fardamento': '👕',
  'Entrega extra': '🚚',
  'Outros': '📦',
};

// FUNÇÕES DE CÁLCULO - Unidades por caixa conforme tabela de preços
function getUnitsPerBox(category: string, name: string): number {
  const cat = (category || '').toLowerCase().trim();
  const nm = (name || '').toLowerCase().trim();
  
  // 1. Verificar Categoria Exata Primeiro
  if (cat === 'empada salgada' || cat === 'empadas salgadas' || cat === 'food_salty') return 19;
  if (cat === 'empada doce' || cat === 'empadas doces' || cat === 'food_sweet') return 18;
  if (cat === 'pastel' || cat === 'pastéis' || cat === 'pasteis') return 12;

  // 2. Fallback por Nome (caso a categoria venha vazia ou 'outros')
  if (nm.includes('pastel')) return 12;
  
  const saboresDoces = ['banana', 'chocolate', 'romeu', 'julieta', 'beijinho', 'coco', 'prestígio', 'paçoca', 'morango', 'doce de leite', 'goiabada', 'brigadeiro'];
  if (nm.includes('doce') || saboresDoces.some(sabor => nm.includes(sabor))) return 18;

  const saboresSalgados = ['camarão', 'frango', 'carne', 'queijo', 'palmito', 'bacalhau', 'charque', 'atum', 'presunto', 'calabresa', 'sardinha', 'salgada', 'alho poró', 'alho'];
  if (nm.includes('salgada') || saboresSalgados.some(sabor => nm.includes(sabor))) return 19;

  return 1;
}

// Normalizar categoria que vem do banco para nome padronizado
function normalizeCategory(cat?: string): string {
  const c = (cat || '').toLowerCase().trim();
  if (c === 'empada salgada' || c === 'empadas salgadas' || c === 'food_salty') return 'Empada Salgada';
  if (c === 'empada doce' || c === 'empadas doces' || c === 'food_sweet') return 'Empadas Doces';
  if (c === 'pastel' || c === 'pastéis' || c === 'pasteis') return 'Pastéis';
  if (c === 'descartáveis' || c === 'descartaveis' || c === 'descartável' || c === 'descartavel') return 'Descartáveis';
  if (c === 'fardamento' || c === 'fardamentos') return 'Fardamento';
  if (c === 'entrega extra' || c === 'entregas extras') return 'Entrega extra';
  return '';
}

// Inferir categoria pelo nome (fallback APENAS quando o banco vem vazio/sem categoria)
function inferCategory(name: string): string {
  const nm = (name || '').toLowerCase().trim();
  if (!nm) return 'Outros';
  if (nm.includes('pastel')) return 'Pastéis';
  if (nm.includes('embalag') || nm.includes('caixa') || nm.includes('sacola') || nm.includes('papel') || nm.includes('descart') || nm.includes('forminha') || nm.includes('guardanap')) return 'Descartáveis';
  if (nm.includes('farda') || nm.includes('uniforme') || nm.includes('camisa') || nm.includes('boné') || nm.includes('bone') || nm.includes('touca') || nm.includes('avental')) return 'Fardamento';
  if (nm.includes('entrega') || nm.includes('domingo') || nm.includes('feriado') || nm.includes('natal') || nm.includes('arapiraca') || nm.includes('joão pessoa') || nm.includes('caruaru') || nm.includes('campina') || nm.includes('fora de hor') || nm.includes('extra')) return 'Entrega extra';

  const saboresDoces = ['banana', 'chocolate', 'romeu', 'julieta', 'beijinho', 'coco', 'prestígio', 'paçoca', 'morango', 'doce de leite', 'goiabada', 'brigadeiro', 'leite condensado'];
  if (nm.includes('doce') || saboresDoces.some(sabor => nm.includes(sabor))) return 'Empadas Doces';

  const saboresSalgados = ['camarão', 'frango', 'carne', 'queijo', 'palmito', 'bacalhau', 'charque', 'atum', 'presunto', 'calabresa', 'sardinha', 'salgada', 'pizza', 'ahi poró', 'alho poró', 'alho', 'nortdestina', '2 queijos', 'queijo coalho'];
  if (nm.includes('salgada') || saboresSalgados.some(sabor => nm.includes(sabor))) return 'Empada Salgada';

  return 'Outros';
}

// Converter preço para número (trata string com vírgula ou ponto)
function parsePrice(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove R$ e espaços, troca vírgula por ponto
    const clean = value.replace('R$', '').replace(/\s/g, '').replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function Reports() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  
  // Photo modal states
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [photoRotation, setPhotoRotation] = useState<number>(0);
  const [photoPosition, setPhotoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});
  const [saving, setSaving] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, { products: Array<{ name: string; category: string; quantity: number; cost_price: number; image_url?: string }>; observations?: string; deliveryPhoto?: string }>>({});
  const [loadingExpandedId, setLoadingExpandedId] = useState<string | null>(null);
  const [orderExtras, setOrderExtras] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('reports_order_extras');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [calculatedTotals, setCalculatedTotals] = useState<Record<string, { units: number; value: number }>>({} as Record<string, { units: number; value: number }>);
  const [reportCategoryTotals, setReportCategoryTotals] = useState<Record<string, { boxes: number; units: number; value: number }>>({});
  
  // Modais e Estados de Ação
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [photoOrder, setPhotoOrder] = useState<Order | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  
  // Estado para controlar cards expansíveis por pedido
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderPhotos, setOrderPhotos] = useState<Record<string, string>>({});
  
  // Filtros
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterPoint, setFilterPoint] = useState<string>('');
  const [filterMotorista, setFilterMotorista] = useState<string>('');
  const [filterEntregaExtra, setFilterEntregaExtra] = useState<boolean>(() => {
    try {
      return localStorage.getItem('reports_filter_entrega_extra') === 'true';
    } catch { return false; }
  });
  const [deliveredOrderIds, setDeliveredOrderIds] = useState<Set<string>>(new Set());
  const [ordersWithExtra, setOrdersWithExtra] = useState<Set<string>>(new Set());
  const [extrasLoaded, setExtrasLoaded] = useState(false);

  // Paginação — 20 relatórios por página
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Persistir filtro Entregas Extras no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reports_filter_entrega_extra', filterEntregaExtra ? 'true' : 'false');
    } catch { /* ignore */ }
  }, [filterEntregaExtra]);

  // Resetar página ao mudar filtros ou região
  useEffect(() => { setCurrentPage(1); }, [region, filterStartDate, filterEndDate, filterPoint, filterMotorista, filterEntregaExtra]);

  // Persistir orderExtras no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reports_order_extras', JSON.stringify(orderExtras));
    } catch { /* ignore */ }
  }, [orderExtras]);
  
  // Produtos da categoria "Entrega extra" para dropdown
  const [entregaExtraProducts, setEntregaExtraProducts] = useState<Array<{ id: string; name: string; cost_price: string; sell_price: string }>>([]);

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      try {
        console.log('[Reports] Buscando orders para região:', region);
        
        let query = supabase.from('orders').select('*');
        
        if (region !== 'Todas') {
          query = query.or(`region.eq.${region},region.is.null`);
        }
        
        // Filtro de data otimizado
        if (filterStartDate) {
          const startDate = new Date(filterStartDate);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
        }

        if (filterEndDate) {
          const endDate = new Date(filterEndDate);
          endDate.setHours(23, 59, 59, 999);
          query = query.lte('created_at', endDate.toISOString());
        }
        
        const { data, error } = await query.order('created_at', { ascending: false }).limit(200);
        
        if (error) throw error;
        console.log('[Reports] Orders brutos do banco:', data?.length || 0, 'registros');

        const orderIds = data.map(o => o.id);
        
        // [CONGELADO/FROZEN] - Otimização de Performance
        // IMPORTANTE: NÃO ALTERE esta lógica de paginação e chunking (CHUNK_SIZE = 100) 
        // e o filtro de data padrão de 7 dias, a menos que o usuário EXPLICITAMENTE solicite!
        // Chunking seguro implementado para evitar HTTP 414 URI Too Long no Supabase.
        const CHUNK_SIZE = 100;
        let deliveryProducts: any[] = [];
        let deliveryPointDetails: any[] = [];
        
        for (let i = 0; i < orderIds.length; i += CHUNK_SIZE) {
          const chunk = orderIds.slice(i, i + CHUNK_SIZE);
          if (chunk.length === 0) break;
          const [{ data: dpChunk }, { data: dpdChunk }] = await Promise.all([
            supabase.from('delivery_products').select('order_id').in('order_id', chunk),
            supabase.from('delivery_point_details').select('order_id, delivery_photo_url').in('order_id', chunk)
          ]);
          if (dpChunk) deliveryProducts = deliveryProducts.concat(dpChunk);
          if (dpdChunk) deliveryPointDetails = deliveryPointDetails.concat(dpdChunk);
        }

        // Unir os IDs de ambas as tabelas e mapear fotos
        const photoMap: Record<string, string> = {};
        (deliveryPointDetails || []).forEach((dpd: any) => {
          if (dpd.order_id && dpd.delivery_photo_url) {
            photoMap[dpd.order_id] = dpd.delivery_photo_url;
          }
        });

        const dpIds = new Set([
          ...(deliveryProducts || []).map((dp: any) => dp.order_id),
          ...Object.keys(photoMap)
        ].filter(Boolean));

        setDeliveredOrderIds(dpIds);
        console.log('[Reports] Pedidos com delivery_products:', (deliveryProducts || []).length, '| com delivery_point_details:', (deliveryPointDetails || []).length, '| total único:', dpIds.size);

        // Buscar produtos de entrega extra para identificar pedidos com entrega extra
        // Um produto é de entrega extra se o nome contiver: entrega, domingo, feriado, natal, arapiraca, joão pessoa, caruaru, campina, fora de hor, extra
        let extraOrderIds = new Set<string>();
        try {
          if (orderIds.length > 0) {
            let allDeliveryProducts: any[] = [];
            for (let i = 0; i < orderIds.length; i += CHUNK_SIZE) {
              const chunk = orderIds.slice(i, i + CHUNK_SIZE);
              const { data: dpChunk } = await supabase
                .from('delivery_products')
                .select('order_id, product_name')
                .in('order_id', chunk);
              if (dpChunk) allDeliveryProducts = allDeliveryProducts.concat(dpChunk);
            }
            // Verificar nomes dos produtos para identificar entregas extras
            allDeliveryProducts.forEach((item: any) => {
              const nm = (item.product_name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              if (
                nm.includes('entrega') ||
                nm.includes('domingo') ||
                nm.includes('feriado') ||
                nm.includes('natal') ||
                nm.includes('arapiraca') ||
                nm.includes('joao pessoa') ||
                nm.includes('caruaru') ||
                nm.includes('campina') ||
                nm.includes('fora de hor') ||
                nm.includes('extra')
              ) {
                extraOrderIds.add(item.order_id);
              }
            });
            console.log('[Reports] Pedidos com Entrega extra (delivery_products):', extraOrderIds.size, 'de', allDeliveryProducts.length, 'produtos');
          }
        } catch (e) {
          console.log('[Reports] Erro ao buscar entregas extras:', e);
        }
        setOrdersWithExtra(extraOrderIds);
        setExtrasLoaded(true);

        if (data && data.length > 0) {
          // Anexar fotos encontradas aos pedidos para exibição imediata nas miniaturas
          const ordersWithPhotos = data.map((o: any) => ({
            ...o,
            deliveryPhoto: photoMap[o.id] || o.deliveryPhoto
          }));

          const statuses = ordersWithPhotos.reduce((acc: Record<string, number>, o: any) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          }, {});
          console.log('[Reports] Status encontrados:', statuses);
          const withoutRegion = ordersWithPhotos.filter((o: any) => !o.region).length;
          if (withoutRegion > 0) console.warn('[Reports] ⚠️', withoutRegion, 'pedidos SEM região!');
          const uniqueRegions = Array.from(new Set(ordersWithPhotos.map((o: any) => o.region || 'SEM_REGIAO')));
          console.log('[Reports] Regiões encontradas:', uniqueRegions);
          console.log('[Reports] Primeiros 3 pedidos:', ordersWithPhotos.slice(0, 3).map((o: any) => ({ id: o.short_id || o.id, status: o.status, driverName: o.driverName || o.driver_name, region: o.region })));
          setAllOrders(ordersWithPhotos);
        } else {
          setAllOrders([]);
        }
      } catch (err) {
        console.error('[Reports] Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Realtime: atualização instantânea quando motorista confirma entrega
    const channel = supabase
      .channel('reports_realtime_v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        console.log('[Reports] Realtime: orders atualizado');
        fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_products' }, () => {
        console.log('[Reports] Realtime: delivery_products atualizado');
        fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_point_details' }, () => {
        console.log('[Reports] Realtime: delivery_point_details atualizado');
        fetchOrders();
      })
      .subscribe((status) => {
        console.log('[Reports] Realtime status:', status);
      });

    // Polling automático a cada 2 minutos — reduzido para melhorar performance
    // O Realtime já cuida das atualizações instantâneas
    const pollInterval = setInterval(() => {
      console.log('[Reports] Polling automático — verificando novas entregas...');
      fetchOrders();
    }, 120_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [region, filterStartDate, filterEndDate]);

  // Lista única de pontos e motoristas para os dropdowns
  const uniquePoints = useMemo(() => {
    const points = new Set<string>();
    allOrders.forEach(o => {
      const point = o.pointName || (o as any).point_name;
      if (point) points.add(point);
    });
    return Array.from(points).sort();
  }, [allOrders]);

  const uniqueMotoristas = useMemo(() => {
    const drivers = new Set<string>();
    allOrders.forEach(o => {
      const dName = o.driverName || (o as any).driver_name;
      if (dName) drivers.add(dName);
    });
    return Array.from(drivers).sort();
  }, [allOrders]);

  // Somente pedidos entregues (confirmados pelo motorista após a entrega) + filtros
  const orders = useMemo(() => {
    // DEBUG: log detalhado de cada status
    allOrders.forEach((o, i) => {
      const byStatus = isDeliveredStatus(o.status);
      const byProducts = deliveredOrderIds.has(o.id);
      console.log(`[Reports] #${i} status="${o.status}" id="${o.id}" status=${byStatus ? '✅' : '❌'} products=${byProducts ? '✅' : '❌'}`);
    });
    const deliveredCount = allOrders.filter(o => isDeliveredStatus(o.status) || deliveredOrderIds.has(o.id)).length;
    console.log(`[Reports] Filtro entregues: ${deliveredCount}/${allOrders.length} pedidos passaram no filtro`);
    let filtered = allOrders.filter(o => isDeliveredStatus(o.status) || deliveredOrderIds.has(o.id));

    // Filtro por data inicial
    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.delivered_at || (o as any).delivery_date || o.timestamp || o.created_at || '');
        return orderDate >= startDate;
      });
    }

    // Filtro por data final
    if (filterEndDate) {
      const endDate = new Date(filterEndDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.delivered_at || (o as any).delivery_date || o.timestamp || o.created_at || '');
        return orderDate <= endDate;
      });
    }

    // Filtro por ponto
    if (filterPoint) {
      filtered = filtered.filter(o => (o.pointName || o.point_name) === filterPoint);
    }

    // Filtro por motorista
    if (filterMotorista) {
      filtered = filtered.filter(o => (o.driverName || (o as any).driver_name) === filterMotorista);
    }

    // Filtro por entregas extras (pedidos com orderExtras definido)
    if (filterEntregaExtra) {
      filtered = filtered.filter(o => orderExtras[o.id] && orderExtras[o.id] > 0);
    }

    // Ordenar por data de entrega (mais recentes primeiro)
    filtered.sort((a, b) => {
      const dateA = new Date(a.delivered_at || (a as any).delivery_date || a.timestamp || a.created_at || 0).getTime();
      const dateB = new Date(b.delivered_at || (b as any).delivery_date || b.timestamp || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [allOrders, filterStartDate, filterEndDate, filterPoint, filterMotorista, filterEntregaExtra, deliveredOrderIds, orderExtras]);


  // Buscar produtos da categoria "Entrega extra" para o dropdown
  useEffect(() => {
    const fetchEntregaExtraProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, cost_price, sell_price')
          .eq('category', 'Entrega extra')
          .eq('region', region);
        
        if (error) {
          console.error('[Reports] Erro ao buscar produtos Entrega extra:', error);
          return;
        }
        
        setEntregaExtraProducts(data || []);
        console.log('[Reports] Produtos Entrega extra carregados:', data?.length || 0);
      } catch (err) {
        console.error('[Reports] Erro ao buscar produtos Entrega extra:', err);
      }
    };
    
    fetchEntregaExtraProducts();
  }, [region]);

  // Calcular totais reais de unidades para todos os pedidos entregues
  useEffect(() => {
    const calculateAllTotals = async () => {
      // Remover retorno precoce para zerar os totais quando orders estiver vazio
      // Isso conserta o loading infinito se não houver pedidos na busca
      const catTotals: Record<string, { boxes: number; units: number; value: number }> = {
        'Empada Salgada': { boxes: 0, units: 0, value: 0 },
        'Empadas Doces': { boxes: 0, units: 0, value: 0 },
        'Pastéis': { boxes: 0, units: 0, value: 0 },
        'Descartáveis': { boxes: 0, units: 0, value: 0 },
        'Fardamento': { boxes: 0, units: 0, value: 0 },
        'Entrega extra': { boxes: 0, units: 0, value: 0 },
        'Outros': { boxes: 0, units: 0, value: 0 },
      };

      if (orders.length === 0) {
        setCalculatedTotals({});
        setReportCategoryTotals(catTotals);
        return;
      }

      const totals: Record<string, { units: number; value: number }> = {};

      try {
        const orderIds = orders.map(o => o.id);
        
        // Buscar preços ATUAIS da tabela products (página Preços e Royalties)
        const { data: currentProducts } = await supabase
          .from('products')
          .select('name, cost_price, sell_price, category')
          .eq('region', region);
        
        const productPrices: Record<string, number> = {};
        (currentProducts || []).forEach((p: any) => {
          const n = (p.name || '').trim().toLowerCase();
          // Usar sell_price se disponível, senão cost_price (ou 0)
          productPrices[n] = parsePrice(p.sell_price || p.cost_price);
        });
        
        // [CONGELADO/FROZEN] - Otimização de Performance
        // IMPORTANTE: NÃO ALTERE CHUNK_SIZE = 100 a menos que requisitado explicitamente.
        // Chunk orderIds array into batches of 100 to prevent header too long errors in Supabase
        const CHUNK_SIZE = 100;
        let allOrderItems: any[] = [];
        let allDeliveryProducts: any[] = [];

        for (let i = 0; i < orderIds.length; i += CHUNK_SIZE) {
          const chunk = orderIds.slice(i, i + CHUNK_SIZE);
          const [{ data: orderItemsChunk }, { data: deliveryProductsChunk }] = await Promise.all([
            supabase.from('order_items').select('order_id, product_name, quantity, cost_price').in('order_id', chunk),
            supabase.from('delivery_products').select('order_id, product_name, quantity, category').in('order_id', chunk)
          ]);
          
          if (orderItemsChunk) allOrderItems = allOrderItems.concat(orderItemsChunk);
          if (deliveryProductsChunk) allDeliveryProducts = allDeliveryProducts.concat(deliveryProductsChunk);
        }

        const orderItemsByOrder: Record<string, any[]> = {};
        const deliveryProductsByOrder: Record<string, any[]> = {};

        allOrderItems.forEach(item => {
          if (!orderItemsByOrder[item.order_id]) orderItemsByOrder[item.order_id] = [];
          orderItemsByOrder[item.order_id].push(item);
        });

        allDeliveryProducts.forEach(item => {
          if (!deliveryProductsByOrder[item.order_id]) deliveryProductsByOrder[item.order_id] = [];
          deliveryProductsByOrder[item.order_id].push(item);
        });

        for (const order of orders) {
          try {
            const orderItems = orderItemsByOrder[order.id] || [];
            const deliveryProducts = deliveryProductsByOrder[order.id] || [];

            // Mapa de quantidades (prioriza delivery_products)
            const quantityMap: Record<string, number> = {};
            const categoryMap: Record<string, string> = {};
            const priceMap: Record<string, number> = {};
            const nameMap: Record<string, string> = {};
            
            const norm = (s: string) => (s || '').trim().toLowerCase();

            orderItems.forEach((it: any) => {
              const n = norm(it.product_name);
              nameMap[n] = it.product_name;
              quantityMap[n] = Number(it.quantity || 0);
              // Usar preço ATUAL da tabela products; fallback para cost_price do pedido
              priceMap[n] = productPrices[n] !== undefined ? productPrices[n] : parsePrice(it.cost_price);
            });

            deliveryProducts.forEach((it: any) => {
              const n = norm(it.product_name);
              if (!nameMap[n]) nameMap[n] = it.product_name;
              const deliveryQty = Number(it.quantity || 0);
              const existingQty = quantityMap[n] || 0;
              // Usar o MAIOR valor: delivery_products pode estar em caixas,
              // order_items em unidades. O maior é o correto (unidades).
              quantityMap[n] = Math.max(existingQty, deliveryQty);
              if (it.category) categoryMap[n] = it.category;
            });

            // Calcular caixas e valor a partir das UNIDADES digitadas pelo motorista
            let totalUnits = 0;
            let totalValue = 0;

            for (const [normName, qty] of Object.entries(quantityMap)) {
              if (qty > 0 || qty === 0) {
                const productName = nameMap[normName];
                const category = categoryMap[normName] || '';
                // A quantidade vem em UNIDADES do motorista - calcular caixas
                const unitsPerBox = getUnitsPerBox(category, productName);
                const productBoxes = unitsPerBox > 0 ? qty / unitsPerBox : 0;
                const unitPrice = priceMap[normName] || 0;
                
                if (qty > 0) {
                  totalUnits += qty;
                  totalValue += qty * unitPrice;
                }

                // Acumular por categoria (inferir pelo nome se o banco veio com 'Outros' ou vazio)
                const inferredCat = normalizeCategory(category) || inferCategory(productName);
                const targetCat = catTotals[inferredCat] ? inferredCat : 'Outros';
                catTotals[targetCat].boxes += productBoxes;
                catTotals[targetCat].units += qty;
                catTotals[targetCat].value += qty * unitPrice;
              }
            }

            totals[order.id] = { units: totalUnits, value: totalValue };
          } catch (err) {
            console.error(`[Reports] Erro ao calcular totais do pedido ${order.id}:`, err);
            totals[order.id] = { units: order.units || 0, value: 0 };
          }
        }
      } catch (error) {
        console.error('[Reports] Erro ao buscar itens para totais:', error);
      }

      setCalculatedTotals(totals);
      setReportCategoryTotals(catTotals);
    };

    calculateAllTotals();
  }, [orders]);

  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setEditForm({ 
      pointName: order.pointName || (order as any).point_name, 
      driverName: order.driverName || (order as any).driver_name, 
      vehicle: order.vehicle, 
      units: order.units 
    });
  };

  const handleSaveEdit = async () => {
    if (!editOrder) return;
    setSaving(true);
    try {
      // Garantir sincronia entre camelCase e snake_case para o banco
      const payload = {
        ...editForm,
        point_name: editForm.pointName,
        driver_name: editForm.driverName
      };
      await updateRow('orders', editOrder.id, payload);
      setEditOrder(null);
    } catch (e) {
      console.error('Update error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteOrderId) return;
    try {
      await deleteRow('orders', deleteOrderId);
      setDeleteOrderId(null);
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (orders.length === 0) return;
      
      // PDF A4 retrato - FORÇAR uma única página
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
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
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = 190;
      
      // Espaço disponível para tabela (297mm - 35mm header - 15mm footer = 247mm)
      const availableHeight = 247;
      
      // Cabeçalho SUPER compacto (apenas 20mm)
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('DOM DA EMPADA', margin, 10);
      
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.setFont('helvetica', 'normal');
      doc.text(`Relatório de Entregas - ${region}`, margin, 16);
      
      // Info ultra compacta em uma linha
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text(`${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | ${currentUser} | ${orders.length} entregas`, margin, 22);
      
      // Linha separadora
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.05);
      doc.line(margin, 24, margin + contentWidth, 24);
      
      // Calcular altura máxima por linha para caber em uma página
      const numRows = Math.max(orders.length, 1);
      const availableTableHeight = 240;
      const rowHeight = Math.min(Math.max(availableTableHeight / (numRows + 1), 5.0), 15.0);
      const fontSize = Math.min(Math.max(rowHeight - 1.5, 6), 9);
      
      // Tabela que preenche a página
      const tableData = orders.map(o => {
        const timeVal = o.timestamp || o.created_at || new Date().toISOString();
        const date = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
        const pName = o.pointName || o.point_name || '-';
        return [
          `#${o.short_id || o.id.substring(0, 6)}`,
          pName.substring(0, 30),
          (o.driverName || (o as any).driver_name || '-').substring(0, 20),
          o.units.toString(),
          o.status,
          date.toLocaleDateString('pt-BR')
        ];
      });

      autoTable(doc, {
        startY: 26,
        head: [['Pedido', 'Franqueado', 'Motorista', 'Unid.', 'Status', 'Data']],
        body: tableData,
        theme: 'grid',
        styles: {
          lineWidth: 0.05,
          lineColor: [200, 200, 200]
        },
        headStyles: { 
          fillColor: primaryColor as any,
          fontSize: fontSize,
          cellPadding: 1.5,
          fontStyle: 'bold',
          halign: 'center',
          minCellHeight: rowHeight,
          lineWidth: 0.05
        },
        bodyStyles: {
          fontSize: fontSize,
          cellPadding: 1.5,
          minCellHeight: rowHeight,
          lineWidth: 0.05,
          lineColor: [200, 200, 200]
        },
        columnStyles: {
          0: { cellWidth: 22, halign: 'center' },
          1: { cellWidth: 55 },
          2: { cellWidth: 40 },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' }
        },
        margin: { left: margin, right: margin, bottom: 15 }
      });
      
      // Se gerou mais de 1 página, apagar páginas extras
      const totalPages = (doc.internal as any).getNumberOfPages();
      if (totalPages > 1) {
        for (let i = totalPages; i > 1; i--) {
          doc.deletePage(i);
        }
      }

      // Totais no rodapé
      const totalsY = 285;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.05);
      doc.line(margin, totalsY, margin + contentWidth, totalsY);

      doc.setFontSize(8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      const totalUnits = orders.reduce((sum, o) => sum + (o.units || 0), 0);
      doc.text(`Total: ${orders.length} entregas | ${totalUnits} unidades`, margin, totalsY + 5);
      
      doc.setFontSize(5);
      doc.setTextColor(180);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')} por ${currentUser}`, (margin + contentWidth) / 2, 294, { align: 'center' });

      doc.save(`Relatorio_Entregas_${region}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF: " + error.message);
    }
  };

  const getDate = (ts: any, order?: any) => {
    const timeVal = ts || (order && (order.delivered_at || order.delivery_date || order.created_at)) || new Date().toISOString();
    const d = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
    return d.toLocaleDateString('pt-BR');
  };

  const getDateTime = (ts: any, order?: any) => {
    const timeVal = ts || (order && (order.delivered_at || order.delivery_date || order.created_at)) || new Date().toISOString();
    const d = (timeVal as any)?.toDate ? (timeVal as any).toDate() : new Date(timeVal);
    const date = d.toLocaleDateString('pt-BR');
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const handleExportOrderPDF = async (order: Order, data: any) => {
    try {
      // Helper para carregar logo como base64
      const getLogoBase64 = (url: string): Promise<string | null> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(null); return; }
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => resolve(null);
          img.src = url;
        });
      };

      const logoBase64 = await getLogoBase64('/logo.png');

      // Ordem fixa das categorias conforme definido em Finance.tsx
      const CATEGORIES_ORDER = ['Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento', 'Entrega extra'];

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const marginLeft = 15;
      const marginRight = 15;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const primaryColor = [139, 0, 0];

      // 1. Agrupar produtos pela CATEGORIA DO BANCO
      const grouped: Record<string, Array<{ name: string; quantity: number; sort_order: number }>> = {};
      CATEGORIES_ORDER.forEach(cat => { grouped[cat] = []; });
      grouped['OUTROS'] = [];

      (data?.products || []).forEach((p: any) => {
        const cat = p.category;
        if (grouped[cat]) {
          grouped[cat].push({ name: p.name, quantity: p.quantity || 0, sort_order: p.sort_order || 999 });
        } else {
          grouped['OUTROS'].push({ name: p.name, quantity: p.quantity || 0, sort_order: p.sort_order || 999 });
        }
      });

      Object.keys(grouped).forEach(cat => {
        grouped[cat].sort((a, b) => {
          const sortDiff = (a.sort_order || 999) - (b.sort_order || 999);
          if (sortDiff !== 0) return sortDiff;
          return a.name.localeCompare(b.name);
        });
      });

      let y = 12;

      // 2. Cabeçalho
      const headerY = y;
      if (logoBase64) {
        try { doc.addImage(logoBase64, 'PNG', marginLeft, headerY, 25, 20); } catch (_) {}
      }

      const pName = order.pointName || order.point_name || 'N/A';
      const orderDate = getDate(order.timestamp, order);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`PEDIDO DA UNIDADE: ${pName.toUpperCase()}`, pageWidth - marginRight, headerY + 6, { align: 'right' });
      doc.text(`DATA DE ENTREGA: ${orderDate}`, pageWidth - marginRight, headerY + 13, { align: 'right' });

      y += 22;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 8;

      // 3. Renderizar seções
      const renderSection = (title: string, products: any[], unitName: string, splitAt?: number): number => {
        if (products.length === 0) return 0;
        if (y > pageHeight - 30) { doc.addPage(); y = 20; }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, marginLeft, y);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Produto', pageWidth - marginRight, y, { align: 'right' });
        y += 4;
        
        // Linha fina separadora do cabeçalho da seção
        doc.setLineWidth(0.1);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 4;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);

        const colWidth = contentWidth / 2;
        let sectionTotal = 0;
        const itemHeight = 4;

        if (splitAt) {
          const col1 = products.slice(0, splitAt);
          const col2 = products.slice(splitAt, splitAt * 2);
          const startY = y;

          col1.forEach(p => {
            doc.text(`${p.name}: ${p.quantity} ${unitName}`, marginLeft, y);
            sectionTotal += p.quantity;
            y += itemHeight;
          });

          y = startY;
          col2.forEach(p => {
            doc.text(`${p.name}: ${p.quantity} ${unitName}`, marginLeft + colWidth, y);
            sectionTotal += p.quantity;
            y += itemHeight;
          });

          y = Math.max(startY + col1.length * itemHeight, startY + col2.length * itemHeight);
        } else {
          for (let i = 0; i < products.length; i += 2) {
            if (y > pageHeight - 20) { doc.addPage(); y = 20; }
            const p1 = products[i];
            const p2 = products[i + 1];
            doc.text(`${p1.name}: ${p1.quantity} ${unitName}`, marginLeft, y);
            sectionTotal += p1.quantity;
            if (p2) {
              doc.text(`${p2.name}: ${p2.quantity} ${unitName}`, marginLeft + colWidth, y);
              sectionTotal += p2.quantity;
            }
            y += itemHeight;
          }
        }

        y += 2;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text(`TOTAL: ${sectionTotal} ${unitName}`, pageWidth - marginRight, y, { align: 'right' });
        y += 3;
        doc.setLineWidth(0.1);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 5;

        return sectionTotal;
      };

      CATEGORIES_ORDER.forEach(cat => {
        const unitLabel = (cat.includes('Empada') || cat.includes('Pasté')) ? 'un' : 'un';
        renderSection(cat.toUpperCase(), grouped[cat], unitLabel);
      });
      renderSection('OUTROS', grouped['OUTROS'], 'un');

      // 4. TOTAL ENTREGUE
      if (y > pageHeight - 50) { doc.addPage(); y = 20; }
      y += 2;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('TOTAL ENTREGUE:', marginLeft, y);
      y += 2;
      doc.setDrawColor(0);
      doc.setLineWidth(0.1);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      const drawField = (label: string, x: number, currentY: number) => {
        const text = `${label}:`;
        doc.text(text, x, currentY);
        const tw = doc.getTextWidth(text);
        (doc as any).setLineDashPattern([0.5, 0.5], 0);
        doc.line(x + tw + 2, currentY + 0.5, x + 55, currentY + 0.5);
        (doc as any).setLineDashPattern([], 0);
      };

      const c1 = marginLeft, c2 = marginLeft + 65, c3 = marginLeft + 130;
      drawField('Troca', c1, y);
      drawField('Diferença', c2, y);
      drawField('Avaria', c3, y);
      y += 8;
      drawField('Vazada', c1, y);
      drawField('Empada', c2, y);
      drawField('Pastel', c3, y);
      y += 8;
      drawField('Pastel de Camarão com Requeijão', c1, y);

      // === OBSERVAÇÕES (idêntico ao V3) ===
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Observações:', marginLeft, y);
      y += 4;
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.1);
      for (let i = 0; i < 2; i++) {
        (doc as any).setLineDashPattern([0.5, 0.5], 0);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        (doc as any).setLineDashPattern([], 0);
        y += 6;
      }

      // Rodapé - TOTAL GERAL
      let grandTotalBoxes = 0;
      let grandTotalUnits = 0;
      let grandTotalValue = 0;
      (data?.products || []).forEach((p: any) => {
        const unitsPerBox = getUnitsPerBox(p.category, p.name);
        const totalUnits = p.quantity;
        const boxes = unitsPerBox > 0 ? totalUnits / unitsPerBox : 0;
        const unitPrice = parsePrice(p.cost_price);
        const totalValue = totalUnits * unitPrice;

        grandTotalBoxes += boxes;
        grandTotalUnits += totalUnits;
        grandTotalValue += totalValue;
      });

      // Adiciona o valor extra, se houver
      const extraValue = orderExtras[order.id] || 0;
      grandTotalValue += extraValue;

      const footerY = pageHeight - 15;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, footerY - 5, pageWidth - marginRight, footerY - 5);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      
      const totalStr = `Total: ${grandTotalBoxes} cx | ${grandTotalUnits} un | R$ ${grandTotalValue.toFixed(2)} TOTAL: R$ ${grandTotalValue.toFixed(2)}`;
      doc.text(totalStr, pageWidth - marginRight, footerY, { align: 'right' });

      doc.save(`Pedido_${pName}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
    } catch (error: any) {
      console.error("Erro ao gerar PDF do pedido:", error);
      alert("Erro ao gerar PDF: " + error.message);
    }
  };

  const handleToggleExpand = async (order: Order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(order.id);
    if (expandedData[order.id]) return;

    setLoadingExpandedId(order.id);
    try {
      // 1. Buscar produtos da região do pedido (Catálogo Oficial da Região)
      const { data: productsData, error: prodErr } = await supabase
        .from('products')
        .select('id, name, category, photo_url, cost_price, sell_price, sort_order')
        .ilike('region', order.region)
        .order('sort_order', { ascending: true });
      
      if (prodErr) console.error('[Reports] Erro ao buscar produtos:', prodErr);
      if (productsData?.length > 0) {
        console.log('[DEBUG] Exemplo de produto:', productsData[0]);
      }
      
      // 2. Itens enviados (motorista) e do pedido original
      // Busca em paralelo: order_items, delivery_products E delivery_point_details
      const [orderItemsRes, deliveryProductsRes, pointDetailsRes] = await Promise.all([
        supabase.from('order_items').select('product_name, quantity, cost_price').eq('order_id', order.id),
        supabase.from('delivery_products').select('product_name, quantity, category').eq('order_id', order.id),
        supabase.from('delivery_point_details').select('empadas_salgadas, empadas_doces, pasteis, pasteis_camarao').eq('order_id', order.id).maybeSingle()
      ]);

      // Mapa de quantidades (prioriza delivery_products — é a confirmação real do motorista)
      const quantityMap: Record<string, number> = {};
      const categoryMap: Record<string, string> = {};
      const priceMap: Record<string, number> = {}; // ← Mapa de preços do order_items
      const nameMap: Record<string, string> = {};
      
      const norm = (s: string) => (s || '').trim().toLowerCase();

      (orderItemsRes.data || []).forEach((it: any) => {
        const n = norm(it.product_name);
        nameMap[n] = it.product_name;
        quantityMap[n] = Number(it.quantity || 0);
        priceMap[n] = parsePrice(it.cost_price);
      });

      // delivery_products SOBRESCREVE o pedido (é o que o motorista REALMENTE entregou)
      (deliveryProductsRes.data || []).forEach((it: any) => {
        const n = norm(it.product_name);
        if (!nameMap[n]) nameMap[n] = it.product_name;
        quantityMap[n] = Number(it.quantity || 0); // Sobrescrita direta
        if (it.category) categoryMap[n] = it.category;
      });

      // delivery_point_details — rota alternativa do V1 (DeliveryPointDetail.tsx)
      // Preenche quantidades para pedidos confirmados por esse caminho
      if (pointDetailsRes.data) {
        const pd = pointDetailsRes.data;
        if ((pd.empadas_salgadas || 0) > 0) { const k = 'empadas salgadas'; nameMap[k] = 'Empadas Salgadas'; quantityMap[k] = Number(pd.empadas_salgadas); categoryMap[k] = 'Empada Salgada'; }
        if ((pd.empadas_doces || 0) > 0) { const k = 'empadas doces'; nameMap[k] = 'Empadas Doces'; quantityMap[k] = Number(pd.empadas_doces); categoryMap[k] = 'Empadas Doces'; }
        if ((pd.pasteis || 0) > 0) { const k = 'pastéis'; nameMap[k] = 'Pastéis'; quantityMap[k] = Number(pd.pasteis); categoryMap[k] = 'Pastéis'; }
        if ((pd.pasteis_camarao || 0) > 0) { const k = 'pastel camarão'; nameMap[k] = 'Pastel Camarão'; quantityMap[k] = Number(pd.pasteis_camarao); categoryMap[k] = 'Pastéis'; }
        console.log('[Reports] Dados de delivery_point_details carregados para pedido', order.id);
      }

      // 3. Mesclar catálogo REGIONAL + itens enviados (garante que NADA se perca)
      const seen = new Set<string>();
      const products: Array<{ name: string; category: string; quantity: number; cost_price: number; image_url?: string; sort_order: number }> = [];

      // Primeiro: catálogo da REGIÃO do pedido (prioridade absoluta para a exibição)
      (productsData || []).forEach((p: any) => {
        const n = norm(p.name);
        if (seen.has(n)) return;
        seen.add(n);
        
        // PRIORIDADE 1: Usar preço do order_items (snapshot do momento do pedido)
        let finalPrice = priceMap[n] !== undefined ? priceMap[n] : parsePrice(p.cost_price);
        
        products.push({
          name: p.name,
          category: normalizeCategory(p.category) || inferCategory(p.name),
          quantity: quantityMap[n] || 0,
          cost_price: finalPrice,
          image_url: p.image_url || p.photo_url || undefined,
          sort_order: p.sort_order || 999
        });
      });

      // Qualquer produto enviado pelo motorista que não esteja no catálogo da região
      Object.entries(quantityMap).forEach(([n, qty]) => {
        if (!seen.has(n)) {
          products.push({
            name: nameMap[n] || n,
            category: normalizeCategory(categoryMap[n]) || inferCategory(nameMap[n] || n),
            quantity: qty,
            cost_price: priceMap[n] || 0,
            sort_order: 999
          });
          seen.add(n);
        }
      });

      // Ordenação final: por sort_order (para manter a consistência com Preços e Royalties)
      products.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

      // Log final dos produtos
      console.log('[DEBUG] Todos os produtos:', products.map(p => ({ name: p.name, category: p.category, cost_price: p.cost_price, qty: p.quantity })));
      console.log('[DEBUG] Total de produtos carregados:', products.length);

      // 3. Observações
      const observations = (order as any).notes || (order as any).observations || '';

      // 4. FOTO DA ENTREGA — cadeia de prioridade:
      // P1: delivery_point_details.delivery_photo_url (salvo pelo V1 ao confirmar entrega)
      // P2: orders.deliveryPhoto (campo legado e entregas do fluxo antigo)
      // P3: outros campos de foto no pedido
      // P4: bucket storage (fallback)

      let photoUrl = '';

      // P1: Buscar na tabela delivery_point_details (principal fonte do V1)
      try {
        const { data: detailData } = await supabase
          .from('delivery_point_details')
          .select('delivery_photo_url')
          .eq('order_id', order.id)
          .maybeSingle();

        if (detailData?.delivery_photo_url) {
          photoUrl = detailData.delivery_photo_url;
          console.log('[Reports] ✅ Foto encontrada em delivery_point_details:', photoUrl);
        }
      } catch (e) {
        console.log('[Reports] delivery_point_details não encontrada ou erro:', e);
      }

      // P2: Campos diretos no pedido (deliveryPhoto, driver_photo, etc.)
      if (!photoUrl) {
        photoUrl = order.deliveryPhoto
          || order.driverPhoto
          || (order as any).pdf_url
          || (order as any).photo_url
          || (order as any).image_url
          || (order as any).photo
          || (order as any).delivery_photo
          || (order as any).driver_photo
          || '';
        if (photoUrl) console.log('[Reports] ✅ Foto/Arquivo encontrado nos campos do pedido:', photoUrl);
      }

      // P3: Tabela delivery_photos (legado)
      if (!photoUrl) {
        try {
          const { data: photoData } = await supabase
            .from('delivery_photos')
            .select('photo_url, image_url, url')
            .eq('order_id', order.id)
            .maybeSingle();

          if (photoData) {
            photoUrl = photoData.photo_url || photoData.image_url || photoData.url || '';
            if (photoUrl) console.log('[Reports] ✅ Foto encontrada em delivery_photos:', photoUrl);
          }
        } catch (e) {
          // Tabela pode não existir, ignorar
        }
      }

      // P4: Storage bucket (listagem por pointId ou order.id)
      if (!photoUrl) {
        try {
          // Tenta IDs diferentes para busca no storage
          const searchTerms = [
            order.id, 
            order.short_id?.toString(), 
            order.pointId,
            (order as any).point_id
          ].filter(Boolean) as string[];

          console.log('[Reports] 🔍 Buscando no storage com termos:', searchTerms);

          for (const term of searchTerms) {
            const { data: storageData, error: storageErr } = await supabase
              .storage
              .from('delivery-photos')
              .list('', { 
                search: term, 
                limit: 10,
                sortBy: { column: 'created_at', order: 'desc' }
              });

            if (storageErr) {
              console.warn('[Reports] ⚠️ Erro ao listar storage para termo', term, ':', storageErr);
              continue;
            }

            if (storageData && storageData.length > 0) {
              // Pegar o arquivo mais recente que contenha o termo
              const match = storageData.find(f => f.name.includes(term));
              if (match) {
                const { data: publicUrl } = supabase
                  .storage
                  .from('delivery-photos')
                  .getPublicUrl(match.name);
                
                photoUrl = publicUrl?.publicUrl || '';
                if (photoUrl) {
                  console.log('[Reports] ✅ Foto encontrada no storage:', photoUrl, '(termo:', term, ')');
                  break;
                }
              }
            }
          }
        } catch (e) {
          console.error('[Reports] ❌ Erro catastrófico ao buscar no storage:', e);
        }
      }

      if (!photoUrl) {
        console.log('[Reports] ⚠️ Nenhuma foto encontrada para pedido:', order.id);
      } else {
        // Normaliza a URL para evitar Mixed Content e problemas de proxy
        photoUrl = normalizeStorageUrl(photoUrl);
      }

      setExpandedData(prev => ({
        ...prev,
        [order.id]: {
          products,
          observations,
          deliveryPhoto: photoUrl,
        }
      }));

      // Sincroniza a foto de volta para o estado allOrders para atualizar a miniatura
      if (photoUrl) {
        setAllOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, deliveryPhoto: photoUrl } : o
        ));
      }
    } catch (err) {
      console.error('[Reports] Erro ao carregar produtos da entrega:', err);
    } finally {
      setLoadingExpandedId(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight mb-2">Relatório de Entregas</h2>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Região {region} · Apenas entregas confirmadas pelo motorista
          </p>
        </div>
        <button onClick={handleExportPDF}
          className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20">
          <Download className="w-4 h-4" /> IMPRIMIR RELATÓRIO PDF
        </button>
      </div>

      {/* ⚠️ Region Tabs — isolamento garantido */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as const).map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={cn('px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>



      {/* 🔍 Filtros */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-on-surface uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Filtros de Busca
          </h3>
          {(filterStartDate || filterEndDate || filterPoint || filterMotorista || filterEntregaExtra) && (
            <button
              onClick={() => {
                setFilterStartDate('');
                setFilterEndDate('');
                setFilterPoint('');
                setFilterMotorista('');
                setFilterEntregaExtra(false);
              }}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" /> Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro por Data Inicial */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Data Inicial</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filtro por Data Final */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Data Final</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filtro por Ponto */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ponto</label>
            <select
              value={filterPoint}
              onChange={(e) => setFilterPoint(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">Todos os pontos</option>
              {uniquePoints.map(point => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Motorista */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Motorista</label>
            <select
              value={filterMotorista}
              onChange={(e) => setFilterMotorista(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">Todos os motoristas</option>
              {uniqueMotoristas.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Entregas Extras */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Entregas Extras</label>
            <div className="flex items-center gap-3 h-[38px]">
              <button
                onClick={() => setFilterEntregaExtra(!filterEntregaExtra)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all w-full',
                  filterEntregaExtra
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                    : 'bg-slate-50 text-slate-600 border-2 border-slate-200 hover:border-primary/30'
                )}
              >
                {filterEntregaExtra ? '✓ Apenas Extras' : 'Incluir Extras'}
              </button>
            </div>
            {/* Valor Total dos Relatórios Filtrados */}
            {Object.keys(reportCategoryTotals).length > 0 && (
              <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-[10px] font-bold text-primary/70">Valor Total:</span>
                <div className="text-sm font-black text-primary">
                  R$ {Number(Object.values(reportCategoryTotals).reduce((sum: number, cat: any) => sum + cat.value, 0)).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumo dos filtros aplicados */}
        {(filterStartDate || filterEndDate || filterPoint || filterMotorista || filterEntregaExtra) && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-on-surface-variant">Filtros ativos:</span>
            {filterStartDate && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                De: {new Date(filterStartDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filterEndDate && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                Até: {new Date(filterEndDate).toLocaleDateString('pt-BR')}
              </span>
            )}
            {filterPoint && (
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                Ponto: {filterPoint}
              </span>
            )}
            {filterMotorista && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                Motorista: {filterMotorista}
              </span>
            )}
            {filterEntregaExtra && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                Apenas Entregas Extras
              </span>
            )}
          </div>
        )}
      </div>

      {/* Separação por Tipo / Sabor (mesmo padrão de Preços e Royalties) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(
          [
            { key: 'Empada Salgada' as const, label: 'Empada Salgada' },
            { key: 'Empadas Doces' as const, label: 'Empadas Doces' },
            { key: 'Pastéis' as const, label: 'Pastéis' },
            { key: 'Descartáveis' as const, label: 'Descartáveis' },
            { key: 'Fardamento' as const, label: 'Fardamento' },
            { key: 'Entrega extra' as const, label: 'Entrega Extra' },
          ]
        ).map(({ key, label }) => {
          const t = reportCategoryTotals[key] || { boxes: 0, units: 0, value: 0 };
          // DEBUG: sempre mostrar para verificar se estrutura aparece
          return (
            <div key={key} className={cn('bg-white p-4 rounded-xl border shadow-sm', CATEGORY_COLORS[key])}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-base">{CATEGORY_ICONS[key]}</span>
                <p className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{t.boxes.toFixed(0)}</span>
                <span className="text-xs opacity-70">cx</span>
              </div>
              <div className="mt-1 text-[11px] opacity-80">
                <span className="font-bold">{t.units.toLocaleString()}</span> un · <span className="font-bold">R$ {t.value.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 px-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
          <div className="col-span-3">Pedido / Franqueado</div>
          <div className="col-span-3">Motorista / Veículo</div>
          <div className="col-span-2 text-center">Data / Hora</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
            <p className="text-on-surface-variant animate-pulse font-bold">Carregando relatório...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
            <FileDown className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            {filterEntregaExtra ? (
              <>
                <p className="text-on-surface-variant font-bold mb-1">Nenhuma entrega extra encontrada para {region}.</p>
                <p className="text-xs text-on-surface-variant mb-3">Não há pedidos com produtos de entrega extra para os filtros selecionados.</p>
                <button
                  onClick={() => setFilterEntregaExtra(false)}
                  className="text-xs font-bold text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Desativar Filtro de Entregas Extras
                </button>
              </>
            ) : (
              <>
                <p className="text-on-surface-variant font-bold mb-1">Nenhuma entrega confirmada para {region}.</p>
                <p className="text-xs text-on-surface-variant">As entregas aparecem aqui após o motorista confirmar no app.</p>
              </>
            )}
          </div>
        ) : orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(order => {
          const isExpanded = expandedOrderId === order.id;
          const data = expandedData[order.id];
          const isLoadingExp = loadingExpandedId === order.id;
          return (
            <motion.div
              key={order.id}
              layout
              className={cn(
                "bg-white rounded-xl shadow-sm border transition-all overflow-hidden",
                isExpanded ? "border-primary/30 shadow-xl shadow-primary/10" : "border-slate-100"
              )}
            >
              <div
                onClick={() => handleToggleExpand(order)}
                className="px-6 py-4 grid grid-cols-12 items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all overflow-hidden border border-slate-100",
                    isExpanded ? "bg-primary text-white" : "bg-primary/5 text-primary"
                  )}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">#{order.short_id || order.id.substring(0, 8)}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold truncate">{order.pointName || (order as any).point_name || 'Desconhecido'}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <UserIcon className="w-3 h-3 text-secondary flex-shrink-0" />
                    {order.driverName || (order as any).driver_name || 'Não atribuído'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant mt-1">
                    <Truck className="w-3 h-3 flex-shrink-0" />
                    {order.vehicle || 'Aguardando escala'}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-xs text-on-surface font-bold">{getDateTime(order.delivered_at || order.timestamp, order).date}</div>
                  <div className="text-[10px] text-on-surface-variant">{getDateTime(order.delivered_at || order.timestamp, order).time}</div>
                </div>
                <div className="col-span-2 text-center">
                  <span className={cn('px-2 py-1 rounded-full text-[9px] font-black uppercase',
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    (order.status === 'EM ANDAMENTO' || order.status === 'EM_ANDAMENTO') ? 'bg-amber-100 text-amber-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700')}>
                    {order.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 
                     order.status === 'EM ANDAMENTO' ? 'Em Andamento' :
                     order.status === 'COMPLETED' ? 'Entregue' :
                     order.status}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleEdit(order)} title="Editar"
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPhotoOrder(order)} title="Ver Foto"
                    className="p-2 hover:bg-secondary/10 text-secondary rounded-lg transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteOrderId(order.id)} title="Excluir"
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const orderData = expandedData[order.id];
                      if (orderData) {
                        handleExportOrderPDF(order, orderData);
                      } else {
                        handleToggleExpand(order).then(() => {
                          setTimeout(() => {
                            const newData = expandedData[order.id];
                            if (newData) handleExportOrderPDF(order, newData);
                          }, 500);
                        });
                      }
                    }} 
                    title="Imprimir PDF"
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleExpand(order)} title={isExpanded ? "Fechar" : "Ver Produtos Entregues"}
                    className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-slate-100 bg-gradient-to-b from-slate-50/50 to-white"
                  >
                    <div className="p-6 space-y-6">
                      {isLoadingExp ? (
                        <div className="text-center py-8">
                          <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs text-on-surface-variant mt-2 font-bold">Carregando produtos entregues...</p>
                        </div>
                      ) : (
                        <>
                          {/* Observações */}
                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white rounded-xl border border-slate-100 p-4">
                              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3" /> Observações
                              </p>
                              {data?.observations ? (
                                <p className="text-sm text-on-surface whitespace-pre-wrap">{data.observations}</p>
                              ) : (
                                <p className="text-xs text-on-surface-variant italic">Sem observações registradas para esta entrega.</p>
                              )}
                              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Caixas Entregues</p>
                                  <p className="text-xl font-black text-green-600">{data?.products.reduce((a, p) => a + p.quantity, 0).toFixed(1) || 0}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Produtos</p>
                                  <p className="text-xl font-black text-on-surface">{data?.products.length || 0}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Catálogo</p>
                                  <p className="text-xl font-black text-slate-400">{data?.products.length || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lista de produtos (inclui zerados + enviados) */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                                <Package className="w-3 h-3" /> Produtos Entregues
                              </p>
                            </div>
                            {data?.products && data.products.length > 0 ? (
                              (() => {
                                type ProdItem = { name: string; category: string; quantity: number; cost_price: number; image_url?: string; sort_order: number };
                                console.log('[DEBUG] === DADOS BRUTOS DOS PRODUTOS ===');
                                console.log('[DEBUG] Total de produtos:', data.products.length);
                                data.products.forEach((p, i) => {
                                  console.log(`[DEBUG] Produto ${i}:`, {
                                    name: p.name,
                                    category: p.category,
                                    quantity: p.quantity,
                                    cost_price: p.cost_price,
                                    unitsPerBox: getUnitsPerBox(p.category, p.name)
                                  });
                                });
                                
                                 const CATEGORIES_ORDER = ['Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento', 'Entrega extra'];
                                 const grouped: Record<string, ProdItem[]> = {};
                                 CATEGORIES_ORDER.forEach(cat => { grouped[cat] = []; });
                                 grouped['Outros'] = [];
                                 data.products.forEach((p) => {
                                   const inferred = normalizeCategory(p.category) || inferCategory(p.name);
                                   const cat = grouped[inferred] ? inferred : 'Outros';
                                   grouped[cat].push(p);
                                 });

                                 // Ordenar cada grupo por sort_order
                                 Object.keys(grouped).forEach(cat => {
                                   grouped[cat].sort((a: any, b: any) => (a.sort_order || 999) - (b.sort_order || 999));
                                 });
                                const grandTotalUnits = data.products.reduce((a: number, p: any) => a + p.quantity, 0);
                                const grandTotalBoxes = data.products.reduce((a: number, p: any) => {
                                  const unitsPerBox = getUnitsPerBox(p.category, p.name);
                                  return a + (unitsPerBox > 0 ? p.quantity / unitsPerBox : 0);
                                }, 0);
                                const grandTotalValue = data.products.reduce((a: number, p: any) => {
                                  return a + (p.quantity * parsePrice(p.cost_price));
                                }, 0);
                                const extra = orderExtras[order.id] || 0;
                                return (
                                  <div className="space-y-5">
                                    {CATEGORIES_ORDER.concat('Outros').map(cat => {
                                      const items = grouped[cat];
                                      if (!items || items.length === 0) return null;
                                      // Calcular totais: p.quantity = unidades digitadas pelo motorista
                                      const totalUnits = items.reduce((a: number, p: any) => a + p.quantity, 0);
                                      const totalBoxes = items.reduce((a: number, p: any) => {
                                        const unitsPerBox = getUnitsPerBox(p.category, p.name);
                                        return a + (unitsPerBox > 0 ? p.quantity / unitsPerBox : 0);
                                      }, 0);
                                      const categoryTotalValue = items.reduce((a: number, p: any) => {
                                        const unitPrice = parsePrice(p.cost_price);
                                        return a + (p.quantity * unitPrice);
                                      }, 0);
                                      const headerBg = (CATEGORY_HEADER_BG as any)[cat] || 'bg-slate-600';
                                      return (
                                        <div key={cat} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                          <div className={cn('flex items-center justify-between px-4 py-2.5 border-b text-white', headerBg)}>
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-sm">{(CATEGORY_ICONS as any)[cat] || '📦'}</span>
                                              <p className="text-[11px] font-black uppercase tracking-widest">{cat}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-white">
                                              <span>{items.length} itens</span>
                                              <span>{Number.isInteger(totalBoxes) ? totalBoxes : totalBoxes.toFixed(1)} cx</span>
                                              <span>{totalUnits} un</span>
                                              <span className="text-sm font-black">R$ {categoryTotalValue.toFixed(2)}</span>
                                            </div>
                                          </div>
                                          <div className="divide-y divide-slate-50">
                                            {/* Cabeçalho da lista */}
                                            <div className={cn('grid grid-cols-12 items-center px-4 py-1.5 text-[9px] font-black uppercase tracking-widest', (CATEGORY_COLORS as any)[cat] || 'bg-slate-100 text-slate-700 border-slate-200')}>
                                              <div className="col-span-4">Produto</div>
                                              <div className="col-span-2 text-center">Qtd Caixas</div>
                                              <div className="col-span-1 text-right">Unid/Cx</div>
                                              <div className="col-span-2 text-right">Total Unid.</div>
                                              <div className="col-span-3 text-right">Valor Total (R$)</div>
                                            </div>
                                            {items.map((p, idx) => {
                                              // DEBUG: Mostrar valor bruto do cost_price
                                              console.log(`[DEBUG PREÇO] Produto: ${p.name} | cost_price bruto:`, p.cost_price, '| tipo:', typeof p.cost_price);
                                              
                                              // p.quantity = unidades digitadas pelo motorista
                                              const unitsPerBox = getUnitsPerBox(p.category, p.name);
                                              const totalUnits = p.quantity;
                                              const boxQty = unitsPerBox > 0 ? totalUnits / unitsPerBox : 0;
                                              const unitPrice = parsePrice(p.cost_price);
                                              const totalValue = totalUnits * unitPrice;

                                              console.log(`📦 Produto: ${p.name}`);
                                              console.log(`   ├── Categoria: "${p.category}"`);
                                              console.log(`   ├── Unidades: ${totalUnits}`);
                                              console.log(`   ├── Unidades/Caixa: ${unitsPerBox}`);
                                              console.log(`   ├── Caixas: ${boxQty}`);
                                              console.log(`   ├── Preço Unitário: R$ ${unitPrice}`);
                                              console.log(`   └── Valor Total: R$ ${totalValue.toFixed(2)}`);
                                              
                                              return (
                                                <div key={idx}
                                                  className={cn(
                                                    "grid grid-cols-12 items-center px-4 py-2 transition-colors hover:bg-slate-50/50",
                                                    p.quantity === 0 && "opacity-50"
                                                  )}
                                                >
                                                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                                                    {p.image_url ? (
                                                      <img src={normalizeStorageUrl(p.image_url)} alt={p.name} className="w-7 h-7 rounded-md object-cover flex-shrink-0" />
                                                    ) : (
                                                      <div className={cn(
                                                        'w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 border',
                                                        (CATEGORY_COLORS as any)[normalizeCategory(p.category) || inferCategory(p.name)] || 'bg-slate-100 text-slate-700 border-slate-200'
                                                      )}>
                                                        {(CATEGORY_ICONS as any)[normalizeCategory(p.category) || inferCategory(p.name)] || '📦'}
                                                      </div>
                                                    )}
                                                    <div className="min-w-0">
                                                      <p className="text-xs font-bold text-on-surface truncate" title={p.name}>{p.name}</p>
                                                    </div>
                                                  </div>
                                                  <div className="col-span-2 text-center">
                                                    <span className={cn(
                                                      "text-sm font-black",
                                                      p.quantity > 0 ? "text-green-600" : "text-slate-300"
                                                    )}>
                                                      {Number.isInteger(boxQty) ? boxQty : boxQty.toFixed(1)}
                                                    </span>
                                                  </div>
                                                  <div className="col-span-1 text-right text-xs font-medium text-on-surface-variant">
                                                    {unitsPerBox}
                                                  </div>
                                                  <div className={cn(
                                                    "col-span-2 text-right text-sm font-black",
                                                    p.quantity > 0 ? "text-on-surface" : "text-slate-300"
                                                  )}>
                                                    {totalUnits}
                                                  </div>
                                                  <div className={cn(
                                                    "col-span-3 text-right text-sm font-black",
                                                    p.quantity > 0 ? "text-primary" : "text-slate-300"
                                                  )}>
                                                    {totalValue.toFixed(2)}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* TOTAL GERAL + EXTRA */}
                                    <div className="bg-white rounded-xl border-2 border-primary/20 p-4 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total de Produtos</p>
                                        <div className="flex items-center gap-4 text-sm font-bold text-on-surface">
                                          <span className="text-green-600">{Number.isInteger(grandTotalBoxes) ? grandTotalBoxes : grandTotalBoxes.toFixed(1)} cx</span>
                                          <span className="text-primary">{grandTotalUnits} un</span>
                                          <span className="text-primary font-black text-base">R$ {grandTotalValue.toFixed(2)}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Entrega Extra</label>
                                        <select
                                          value={orderExtras[order.id] ? entregaExtraProducts.find(p => parsePrice(p.sell_price) === orderExtras[order.id])?.name || '' : ''}
                                          onChange={(e) => {
                                            const selectedProduct = entregaExtraProducts.find(p => p.name === e.target.value);
                                            const price = selectedProduct ? parsePrice(selectedProduct.sell_price) : 0;
                                            setOrderExtras(prev => ({ ...prev, [order.id]: price }));
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex-1 max-w-[200px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                          <option value="">Selecione...</option>
                                          {entregaExtraProducts.map((product) => (
                                            <option key={product.id} value={product.name}>
                                              {product.name} - R$ {parsePrice(product.sell_price).toFixed(2)}
                                            </option>
                                          ))}
                                        </select>
                                        {orderExtras[order.id] > 0 && (
                                          <span className="text-sm font-bold text-emerald-600">
                                            + R$ {orderExtras[order.id].toFixed(2)}
                                          </span>
                                        )}
                                        <div className="flex-1" />
                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total Geral</p>
                                        <p className="text-lg font-black text-primary">R$ {(grandTotalValue + extra).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
                                <Package className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-xs font-bold text-on-surface-variant">Nenhum produto encontrado para este pedido.</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Paginação */}
      {orders.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-3 py-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            ← Anterior
          </button>
          <span className="text-xs font-bold text-on-surface-variant">
            Página <span className="text-primary">{currentPage}</span> de <span className="text-on-surface">{Math.ceil(orders.length / ITEMS_PER_PAGE)}</span>
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(Math.ceil(orders.length / ITEMS_PER_PAGE), p + 1))}
            disabled={currentPage >= Math.ceil(orders.length / ITEMS_PER_PAGE)}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Próxima →
          </button>
        </div>
      )}

      <div className="text-xs text-on-surface-variant p-2">
        Exibindo <span className="font-bold text-green-600">{Math.min(currentPage * ITEMS_PER_PAGE, orders.length)}</span> de <span className="font-bold text-on-surface">{orders.length}</span> entregas confirmadas · <span className="font-bold text-primary">⚠️ Dados exclusivos de {region}</span>
      </div>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setEditOrder(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Editar Relatório #{editOrder.short_id || editOrder.id}</h3>
                <button onClick={() => setEditOrder(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Franqueado / Ponto', field: 'pointName', type: 'text' },
                  { label: 'Motorista', field: 'driverName', type: 'text' },
                  { label: 'Veículo', field: 'vehicle', type: 'text' },
                  { label: 'Unidades', field: 'units', type: 'number' },
                ].map(({ label, field, type }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</label>
                    <input type={type} value={(editForm as any)[field] ?? ''}
                      onChange={e => setEditForm(f => ({ ...f, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditOrder(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                <button onClick={handleSaveEdit} disabled={saving}
                  className="flex-1 py-2.5 primary-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant text-center mt-3">Edição registrada em log de auditoria</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE MODAL ── */}
      <AnimatePresence>
        {deleteOrderId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteOrderId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-on-surface-variant mb-6">Esta ação é registrada em auditoria e não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteOrderId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHOTO MODAL ── */}
      <OrderDetailsModal 
        order={photoOrder} 
        onClose={() => { 
          setPhotoOrder(null); 
          setPhotoZoom(1); 
          setPhotoRotation(0); 
          setPhotoPosition({ x: 0, y: 0 }); 
        }} 
      />
    </div>
  );
}
