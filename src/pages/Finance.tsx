import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Download, 
  FileText, 
  TrendingUp, 
  History,
  Info,
  Edit3,
  Save,
  Plus,
  X,
  Trash2,
  Package,
  Copy,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { type Region } from '@/types';
import { supabase, subscribeToTable, insertRow, deleteRow, updateRow } from '@/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente de produto arrastável
function SortableProduct({ 
  product, 
  index, 
  onUpdatePrice,
  onEdit,
  onDelete,
  dragMode,
  key
}: { 
  product: Product; 
  index: number;
  onUpdatePrice: (id: string, field: 'cost_price' | 'sell_price', value: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  dragMode: boolean;
  key: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: product.id,
    disabled: !dragMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: dragMode ? 'grab' : 'default',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "grid grid-cols-12 gap-4 items-center bg-slate-50/50 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-slate-100",
        isDragging && "border-primary shadow-lg"
      )}
    >
      <div className="col-span-4 flex items-center gap-3">
        {dragMode && (
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-primary"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border', CATEGORY_COLORS[product.category])}>
          {CATEGORY_ICONS[product.category]}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-on-surface truncate">{product.name}</span>
          {product.description && <span className="text-xs text-on-surface-variant truncate">{product.description}</span>}
        </div>
      </div>
      <div className="col-span-3">
        <input
          className="w-full bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-secondary py-1.5 px-3"
          defaultValue={product.cost_price}
          onBlur={(e) => onUpdatePrice(product.id, 'cost_price', e.target.value)}
          type="number" step="0.01"
        />
      </div>
      <div className="col-span-3 flex justify-end">
        <input
          className="w-full bg-white border border-slate-200 rounded-lg text-sm font-bold text-secondary text-right focus:ring-secondary py-1.5 px-3"
          defaultValue={product.sell_price}
          onBlur={(e) => onUpdatePrice(product.id, 'sell_price', e.target.value)}
          type="number" step="0.01"
        />
      </div>
      <div className="col-span-2 flex justify-end gap-1">
        <button
          onClick={() => onEdit(product)}
          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Editar Produto"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Excluir Produto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type ProductCategory = 'Empada Salgada' | 'Empadas Doces' | 'Pastéis' | 'Descartáveis' | 'Fardamento' | 'Entrega extra';

const CATEGORIES: ProductCategory[] = ['Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento', 'Entrega extra'];

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  'Empada Salgada': 'bg-amber-100 text-amber-700 border-amber-200',
  'Empadas Doces': 'bg-pink-100 text-pink-700 border-pink-200',
  'Pastéis': 'bg-orange-100 text-orange-700 border-orange-200',
  'Descartáveis': 'bg-sky-100 text-sky-700 border-sky-200',
  'Fardamento': 'bg-violet-100 text-violet-700 border-violet-200',
  'Entrega extra': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const CATEGORY_ICONS: Record<ProductCategory, string> = {
  'Empada Salgada': '🥧',
  'Empadas Doces': '🍫',
  'Pastéis': '🍞',
  'Descartáveis': '🪣',
  'Fardamento': '👕',
  'Entrega extra': '🚚',
};

interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  cost_price: string;
  sell_price: string;
  region: string;
}

const FRANCHISES_BY_REGION: Record<Region, Array<{name:string;pct:string;amount:string;status:string;color:string}>> = {
  Recife: [
    { name: 'Loja Boa Viagem', pct: '5%', amount: '4.215,00', status: 'Processado', color: 'bg-green-100 text-green-700' },
    { name: 'Unidade Olinda', pct: '4.5%', amount: '2.105,20', status: 'Processado', color: 'bg-green-100 text-green-700' },
    { name: 'Shopping Tacaruna', pct: '5.5%', amount: '3.480,00', status: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
  ],
  Salvador: [
    { name: 'Shopping Barra', pct: '6%', amount: '5.120,00', status: 'Processado', color: 'bg-green-100 text-green-700' },
    { name: 'Pelourinho Loja', pct: '6.5%', amount: '5.842,50', status: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Pituba Hub', pct: '5%', amount: '3.290,00', status: 'Processado', color: 'bg-green-100 text-green-700' },
  ],
};

export function Finance() {
  const [region, setRegion] = useState<Region>('Recife');
  const franchises = FRANCHISES_BY_REGION[region];
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'Todos'>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Empada Salgada' as ProductCategory,
    costPrice: '',
    sellPrice: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState('5');
  const [calculatedRoyalties, setCalculatedRoyalties] = useState<Array<{name: string, totalOrders: number, royaltyAmount: number}>>([]);
  const [selectedPoint, setSelectedPoint] = useState('');
  const [deliveryPoints, setDeliveryPoints] = useState<Array<{id: string, name: string, franchiseeName: string}>>([]);
  const [dragMode, setDragMode] = useState(false);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Função para salvar a nova ordem no banco
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex(p => p.id === active.id);
    const newIndex = products.findIndex(p => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reordenar array local
    const newProducts = arrayMove(products, oldIndex, newIndex);
    
    // Atualizar sort_order para todos os produtos
    const updates = newProducts.map((product: Product, index: number) => ({
      id: product.id,
      sort_order: index,
    }));

    try {
      // Atualizar cada produto no banco
      for (const update of updates) {
        await supabase
          .from('products')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
      
      // Atualizar estado local
      setProducts(newProducts);
    } catch (error) {
      console.error('Erro ao reordenar produtos:', error);
    }
  };

  useEffect(() => {
    const unsub = subscribeToTable('products', { region }, (data) => {
      setProducts(data);
      setLoadingProducts(false);
    }, 'sort_order', true);
    return () => unsub();
  }, [region]);

  useEffect(() => {
    const loadDeliveryPoints = async () => {
      try {
        const { data: franchisees } = await supabase
          .from('franchisees')
          .select('id, name, points')
          .eq('region', region);

        if (franchisees) {
          const allPoints: Array<{id: string, name: string, franchiseeName: string}> = [];
          franchisees.forEach((f: any) => {
            if (Array.isArray(f.points)) {
              f.points.forEach((p: any) => {
                allPoints.push({
                  id: p.id,
                  name: p.name,
                  franchiseeName: f.name
                });
              });
            }
          });
          setDeliveryPoints(allPoints);
        }
      } catch (error) {
        console.error('Erro ao carregar pontos de entrega:', error);
      }
    };
    loadDeliveryPoints();
  }, [region]);

  // Adicionar produto "Entrega extra" se não existir
  useEffect(() => {
    const addExtraDeliveryProduct = async () => {
      try {
        // Verificar se já existe em cada região
        const regions: Region[] = ['Recife', 'Salvador'];
        for (const r of regions) {
          const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('name', 'Entrega extra')
            .eq('region', r);
          
          if (!existing || existing.length === 0) {
            await supabase.from('products').insert({
              name: 'Entrega extra',
              description: 'Taxa de entrega extra',
              category: 'Entrega extra',
              cost_price: '0',
              sell_price: '0',
              region: r,
              sort_order: 999
            });
            console.log(`[Finance] Produto "Entrega extra" criado para ${r}`);
          }
        }
      } catch (error) {
        console.error('[Finance] Erro ao criar produto Entrega extra:', error);
      }
    };
    addExtraDeliveryProduct();
  }, []);

  const handleSaveProduct = async () => {
    if (!newProduct.name) return;
    setSavingProduct(true);
    try {
      // Determine sort_order based on category
      const getBaseSortOrder = (category: string) => {
        switch(category) {
          case 'Empada Salgada': return 1;
          case 'Empadas Doces': return 100;
          case 'Pastéis': return 200;
          default: return 999;
        }
      };
      
      if (editingProduct) {
        // Atualizar produto e preços na tabela products
        const { error } = await supabase.from('products').update({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          cost_price: newProduct.costPrice || '0',
          sell_price: newProduct.sellPrice || '0',
        }).eq('id', editingProduct.id);
        
        if (error) throw error;
      } else {
        // Inserir novo produto com preços
        const { error } = await supabase.from('products').insert({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          cost_price: newProduct.costPrice || '0',
          sell_price: newProduct.sellPrice || '0',
          region,
          sort_order: getBaseSortOrder(newProduct.category)
        });
        
        if (error) throw error;
      }
      setNewProduct({ name: '', description: '', category: 'Empada Salgada', costPrice: '', sellPrice: '' });
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      const msg = error?.message || error?.hint || JSON.stringify(error) || 'Erro desconhecido';
      alert(`Erro ao salvar produto:\n\n${msg}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      costPrice: product.cost_price,
      sellPrice: product.sell_price,
    });
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      await deleteRow('products', product.id);
    }
  };

  const handleUpdatePrice = async (id: string, field: 'cost_price' | 'sell_price', value: string) => {
    // Atualizar preço diretamente na tabela products
    await updateRow('products', id, { [field]: value });
  };

  const calculateRoyalties = async () => {
    if (!startDate || !endDate) {
      alert('Por favor, selecione a data de início e fim.');
      return;
    }

    if (!selectedPoint) {
      alert('Por favor, selecione o ponto de entrega.');
      return;
    }

    try {
      // Buscar pedidos do período filtrando pelo ponto selecionado
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate + 'T00:00:00')
        .lte('created_at', endDate + 'T23:59:59')
        .eq('point_name', selectedPoint);

      if (error) throw error;

      if (!orders || orders.length === 0) {
        alert('Nenhum pedido encontrado para este ponto no período selecionado.');
        return;
      }

      // Calcular total de pedidos para o ponto selecionado
      const totalOrders = orders.reduce((acc: number, order: any) => {
        return acc + (parseFloat(order.total_value) || 0);
      }, 0);

      // Calcular royalties
      const royaltyPct = parseFloat(royaltyPercentage) / 100;
      const royaltyAmount = totalOrders * royaltyPct;

      // Atualizar estado com o resultado
      setCalculatedRoyalties([{
        name: selectedPoint,
        totalOrders,
        royaltyAmount
      }]);
    } catch (error: any) {
      console.error('Erro ao calcular royalties:', error);
      alert('Erro ao calcular royalties: ' + error.message);
    }
  };


  const handleExportPDF = async () => {
    try {
      if (products.length === 0) return;
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
      
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(`Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 20, 27);
      doc.text(`Usuário: ${currentUser}`, 20, 33);
      doc.text(`Região: ${region}`, 20, 39);

      try {
        const logoSize = 35;
        const logoX = 155;
        const logoY = 4;
        doc.addImage('/logo.png', 'PNG', logoX, logoY, logoSize, logoSize);
      } catch (e) {
        doc.setFontSize(20);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('DOM DA EMPADA', 140, 20);
      }

      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.line(20, 42, 190, 42);

      doc.setFontSize(14);
      doc.text('TABELA DE PREÇOS E ROYALTIES', 20, 52);

      const tableData = products.map(p => [
        p.name,
        p.category,
        `R$ ${parseFloat(p.cost_price).toFixed(2)}`,
        `R$ ${parseFloat(p.sell_price).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 65,
        head: [['Produto', 'Categoria', 'Custo', 'Venda']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: primaryColor as any },
      });

      doc.save(`Tabela_Precos_${region}_${new Date().getTime()}.pdf`);
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF: " + error.message);
    }
  };

  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  const groupedProducts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<ProductCategory, Product[]>);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight mb-2">Preços e Royalties</h2>
            <p className="text-on-surface-variant font-body">Gestão estratégica de precificação — {region}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl primary-gradient text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <FileText className="w-4 h-4" /> Imprimir Tabela PDF
            </button>
          </div>
        </div>
      </header>

      {/* Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Recife', 'Salvador'] as Region[]).map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={cn('px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 bg-white rounded-xl p-8 border-l-4 border-secondary shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <Edit3 className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold font-headline">Entrada Manual de Preços</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1 items-end">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Data de Vigência *</label>
                <input type="date" className="bg-slate-50 border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-secondary/50 py-1.5 px-4" />
              </div>
              <div className="flex items-center gap-2">
              {/* Botão para ativar modo Drag & Drop */}
              <button
                onClick={() => setDragMode(!dragMode)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg",
                  dragMode 
                    ? "bg-primary text-white shadow-primary/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
                title={dragMode ? "Desativar arrastar" : "Ativar arrastar e soltar"}
              >
                <GripVertical className="w-4 h-4" /> 
                {dragMode ? "Arrastando..." : "Reordenar"}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-secondary/20"
              >
                <Plus className="w-4 h-4" /> Adicionar Produto
              </button>
            </div>
          </div>
        </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveCategory('Todos')}
              className={cn('px-4 py-1.5 rounded-full text-xs font-bold border transition-all',
                activeCategory === 'Todos' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400')}
            >
              Todos ({products.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={cn('px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5',
                    activeCategory === cat ? CATEGORY_COLORS[cat] + ' border-current' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400')}
                >
                  <span>{CATEGORY_ICONS[cat]}</span> {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            {loadingProducts ? (
              <div className="text-center py-10 text-sm text-on-surface-variant">Carregando produtos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant">Nenhum produto cadastrado nesta categoria.</p>
                <button onClick={() => setShowAddModal(true)} className="mt-3 text-sm font-bold text-secondary hover:underline">Adicionar primeiro produto</button>
              </div>
            ) : (
              CATEGORIES.map(cat => {
                const catProducts = groupedProducts[cat];
                if (catProducts.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                      <h4 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">{cat}</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{catProducts.length}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-4 px-4 py-1 text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                        {dragMode && <div className="col-span-1"></div>}
                        <div className={cn('col-span-4', dragMode && 'col-span-3')}>Produto</div>
                        <div className="col-span-3">Custo (R$)</div>
                        <div className="col-span-3 text-right">Caixa (R$)</div>
                        <div className="col-span-2 text-right">Ações</div>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={catProducts.map(p => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {catProducts.map((prod, idx) => (
                            <SortableProduct
                              key={prod.id}
                              product={prod}
                              index={idx}
                              onUpdatePrice={handleUpdatePrice}
                              onEdit={handleEditProduct}
                              onDelete={handleDeleteProduct}
                              dragMode={dragMode}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                );
              })
            )}
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
              {/* Point Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Ponto de Entrega</label>
                <select
                  value={selectedPoint}
                  onChange={(e) => setSelectedPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 py-2 px-3"
                >
                  <option value="">Selecione o ponto...</option>
                  {deliveryPoints.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.franchiseeName})</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest border-b border-slate-100 pb-2">Período de Cálculo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Data Início</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 py-2 px-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Data Fim</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 py-2 px-3"
                    />
                  </div>
                </div>
              </div>

              {/* Royalty Percentage */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Percentual de Royalties (%)</label>
                <input
                  type="number"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/20 py-2 px-3"
                />
              </div>

              <button
                onClick={calculateRoyalties}
                className="w-full py-3 primary-gradient text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                Calcular Royalties
              </button>

              <div className="p-4 bg-primary text-white rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-white/80">Faturamento Total (Período)</span>
                  <Info className="w-4 h-4 text-white/60" />
                </div>
                <div className="text-3xl font-black tracking-tight">R$ {calculatedRoyalties.reduce((acc, r) => acc + r.totalOrders, 0).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest border-b border-slate-100 pb-2">Repasse por Franqueado</h4>
                {calculatedRoyalties.length > 0 ? (
                  calculatedRoyalties.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-on-surface">{r.name}</p>
                        <p className="text-[10px] text-on-surface-variant">Total Pedidos: R$ {r.totalOrders.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">R$ {r.royaltyAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase bg-green-100 text-green-700">Calculado</span>
                      </div>
                    </div>
                  ))
                ) : (
                  franchises.map((fran, i) => (
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
                  ))
                )}
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
      {/* Modal Adicionar Produto */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onMouseDown={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h3>
                    <p className="text-xs text-on-surface-variant">Região: {region}</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Categoria *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setNewProduct(p => ({ ...p, category: cat }))}
                        className={cn('px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2',
                          newProduct.category === cat
                            ? CATEGORY_COLORS[cat] + ' border-current shadow-sm'
                            : 'border-slate-200 text-slate-400 hover:border-slate-300')}
                      >
                        <span>{CATEGORY_ICONS[cat]}</span> {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Nome do Produto *</label>
                  <input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/30"
                    placeholder="Ex: Empada de Frango Clássica"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Descrição</label>
                  <input
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/30"
                    placeholder="Ex: 120g - Sabor clássico"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Preço de Custo (R$)</label>
                    <input
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct(p => ({ ...p, costPrice: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/30"
                      placeholder="0.00" type="number" step="0.01"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Preço de Venda (R$)</label>
                    <input
                      value={newProduct.sellPrice}
                      onChange={(e) => setNewProduct(p => ({ ...p, sellPrice: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/30"
                      placeholder="0.00" type="number" step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={savingProduct || !newProduct.name}
                  className="px-6 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {savingProduct ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
