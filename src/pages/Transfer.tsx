import React, { useState, useEffect, useMemo } from 'react';
import { 
  Truck, 
  ArrowRightLeft, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Thermometer,
  Map as MapIcon,
  Navigation,
  ChevronRight,
  Package,
  Search,
  Loader2,
  Plus,
  Minus,
  ArrowRight,
  Printer,
  Calendar,
  FileText,
  Filter,
  Pencil,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase, subscribeToTable, insertRow, updateRow, deleteRow } from '@/supabase';
import { type Region } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
  id: string;
  name: string;
  category: string;
  region: string;
}

interface TransferItem {
  productId: string;
  name: string;
  quantity: number;
  category: string;
}

interface TransferRecord {
  id: string;
  origin: Region;
  destination: Region;
  items: TransferItem[];
  total_items: number;
  status: string;
  created_at: string;
}

// Ordem fixa dos produtos - EXATAMENTE IGUAL AO PDF DE REFERÊNCIA
// IMPORTANTE: Os pastéis devem ter "Pastel" no nome para distinguir das empadas!
const PRODUCT_ORDER: Record<string, number> = {
  // EMPADAS SALGADAS - Coluna 1 (ordem exata do PDF)
  'Palmito': 1,
  'Frango puro': 2, 'Frango Puro': 2, 'Frango Puro ': 2, 'Frango': 2,
  'Frango c/ Bacon': 3, 'Frango com Bacon': 3, 'Frango C/ Bacon': 3, 'Frango c/ Bacon ': 3, 'Bacon': 3,
  'Frango c/ Azeitona': 4, 'Frango com Azeitona': 4, 'Frango C/ Azeitona': 4, 'Azeitona': 4,
  'Frango c/ Cheddar': 5, 'Frango com Cheddar': 5, 'Frango C/ Cheddar': 5, 'Cheddar': 5,
  'Frango c/ Requeijão': 6, 'Frango com Requeijão': 6, 'Frango C/ Requeijão': 6, 'Frango com requeijão': 6,
  'Alho Poró': 7, 'Alho poró': 7, 'Alho Poro': 7, 'Alho poro': 7,
  
  // EMPADAS SALGADAS - Coluna 2 (ordem exata do PDF)
  '2 Queijos': 8, 'Queijo': 8,
  'Camarão': 9,
  'Camarão c/ Requeijão': 10, 'Camarão com Requeijão': 10, 'Camarão C/ Requeijão': 10, 'Camarão com requeijão': 10,
  'Bacalhau': 11,
  'Charque': 12,
  'Carne de sol c/ queijo coalho': 13, 'Carne de sol com queijo coalho': 13, 'Carne de sol': 13,
  'Nordestina': 14,
  
  // EMPADAS DOCES - Coluna 1
  'Leite Condensado': 15,
  'Chocolate': 16,
  'Paçoca': 17,
  
  // EMPADAS DOCES - Coluna 2
  'Romeu e Julieta': 18,
  'Banana c/ Doce de leite': 19, 'Banana com Doce de leite': 19,
  
  // PASTÉIS - Coluna 1 (NOMES COM "Pastel" PARA DISTINGUIR)
  'Pastel Frango com Requeijão': 20,
  'Pastel Carne com Azeitona': 21,
  
  // PASTÉIS - Coluna 2
  'Pastel Pizza': 22, 'Pastel de Pizza': 22,
  'Pastel Camarão com Requeijão': 23,
  
  // EMBALAGENS
  'Embalagem P': 24,
  'Embalagem M': 25,
  'Embalagem G': 26,
  'Forminha': 27,
  'Guardanapo': 28,
  'CX Delivery': 29,
  
  // Outros (vão pro final)
  'Calabresa': 100,
  'Carne Seca': 100,
  'Vazada': 101,
};

// Função auxiliar para obter a ordem de um produto (com fallback)
const getProductOrder = (name: string): number => {
  // Tentar match exato
  if (PRODUCT_ORDER[name] !== undefined) return PRODUCT_ORDER[name];
  
  // Tentar match sem espaços no final
  const trimmed = name.trim();
  if (PRODUCT_ORDER[trimmed] !== undefined) return PRODUCT_ORDER[trimmed];
  
  // Tentar match case-insensitive
  const lowerName = name.toLowerCase();
  for (const [key, order] of Object.entries(PRODUCT_ORDER)) {
    if (key.toLowerCase() === lowerName) return order;
  }
  
  // Se não encontrar, retornar 999 (vai pro final)
  return 999;
};

export function Transfer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Estado para os itens sendo transferidos (quantidades por ID de produto)
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null);

  // Região atual para exibir os produtos (ex: Recife enviando para Salvador)
  const [originRegion, setOriginRegion] = useState<Region>('Recife');
  const destinationRegion: Region = originRegion === 'Recife' ? 'Salvador' : 'Recife';

  useEffect(() => {
    setLoadingProducts(true);
    // Busca produtos da região de origem ordenados por sort_order
    const unsubProducts = subscribeToTable('products', { region: originRegion }, (data) => {
      setProducts(data as Product[]);
      setLoadingProducts(false);
    }, 'sort_order', true);

    // Busca histórico de transferências que CHEGAM na região selecionada (destination)
    const unsubTransfers = subscribeToTable('transfers', { destination: originRegion }, (data) => {
      setTransfers((data as any[]).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });

    return () => {
      unsubProducts();
      unsubTransfers();
    };
  }, [originRegion]);

  const filteredProducts = useMemo(() => {
    // Filtrar por busca e excluir categoria "Entrega extra"
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      p.category !== 'Entrega extra'
    );
    
    // Ordenar pela sequência fixa definida em PRODUCT_ORDER
    return filtered.sort((a, b) => {
      const orderA = getProductOrder(a.name);
      const orderB = getProductOrder(b.name);
      return orderA - orderB;
    });
  }, [products, searchQuery]);

  const filteredTransfers = useMemo(() => {
    console.log('[Transfer] Total transfers:', transfers.length);
    console.log('[Transfer] Transfers data:', transfers.map(t => ({ origin: t.origin, dest: t.destination, date: t.created_at })));
    
    const filtered = transfers.filter(t => {
      if (!startDate && !endDate) return true;
      const date = new Date(t.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      
      const include = (!start || date >= start) && (!end || date <= end);
      console.log('[Transfer] Filtering:', t.origin, '->', t.destination, 'date:', t.created_at, 'include:', include);
      return include;
    });
    
    console.log('[Transfer] Filtered count:', filtered.length);
    return filtered;
  }, [transfers, startDate, endDate]);

  // Helper para converter imagem em base64
  const getImageAsBase64 = (url: string): Promise<string | null> => {
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

  // Mapeamento de produtos para categorias (EXATAMENTE igual ao PDF de referência)
  const getCategoryByName = (name: string): string => {
    const order = getProductOrder(name);
    if (order >= 1 && order <= 14) return 'EMPADAS SALGADAS';
    if (order >= 15 && order <= 19) return 'EMPADAS DOCES';
    if (order >= 20 && order <= 23) return 'PASTÉIS';
    if (order >= 24 && order <= 29) return 'EMBALAGENS';
    return 'OUTROS';
  };

  const handleEditTransfer = (t: TransferRecord) => {
    // Preenche o formulário com os itens da transferência para edição
    const newQuantities: Record<string, number> = {};
    t.items.forEach(item => {
      newQuantities[item.productId] = item.quantity;
    });
    setQuantities(newQuantities);
    setOriginRegion(t.origin);
    setEditingTransferId(t.id);
    // Scroll para o formulário
    document.getElementById('formulario-transferencia')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCancelEdit = () => {
    setEditingTransferId(null);
    setQuantities({});
  };

  const handleDeleteTransfer = async (t: TransferRecord) => {
    if (!confirm(`Excluir transferência ${t.origin} → ${t.destination} de ${new Date(t.created_at).toLocaleDateString('pt-BR')}?`)) return;
    try {
      await deleteRow('transfers', t.id);
      setTransfers(prev => prev.filter(tr => tr.id !== t.id));
    } catch (error: any) {
      alert('Erro ao excluir: ' + (error?.message || 'Erro desconhecido'));
    }
  };

  const handleExportTransferPDF = async (t: TransferRecord) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const primaryColor = [139, 0, 0]; // Dark red
      const marginLeft = 15;
      const marginRight = 15;
      const pageWidth = 210;
      let y = 12;

      // 1. Logo (Top Left)
      const logoBase64 = await getImageAsBase64('/logo.png');
      if (logoBase64) {
        try {
          const logoWidth = 25;
          const logoHeight = 20;
          doc.addImage(logoBase64, 'PNG', marginLeft, y, logoWidth, logoHeight);
        } catch (e) {
          console.log('[PDF] Erro ao adicionar logo:', e);
        }
      }

      // 2. Header Info (Top Right)
      const transferDate = new Date(t.created_at).toLocaleDateString('pt-BR');
      
      // Texto conforme direção da transferência
      const headerText = t.origin === 'Recife' && t.destination === 'Salvador' 
        ? 'Contagem da Câmara'
        : t.origin === 'Salvador' && t.destination === 'Recife'
        ? 'Carga de Salvador'
        : `Transferência: ${t.origin} → ${t.destination}`;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(headerText.toUpperCase(), pageWidth - marginRight, y + 6, { align: 'right' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`DATA: ${transferDate}`, pageWidth - marginRight, y + 11, { align: 'right' });

      y += 22;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 8;

      // 3. Agrupar itens pela CATEGORIA SALVA (evita duplicação entre grupos)
      const categoryMap: Record<string, string> = {
        'Empada Salgada': 'EMPADAS SALGADAS',
        'Empadas Doces': 'EMPADAS DOCES',
        'Pastéis': 'PASTÉIS',
        'Descartáveis': 'EMBALAGENS',
        'Embalagens': 'EMBALAGENS'
      };

      const groupedItems: Record<string, typeof t.items> = {
        'EMPADAS SALGADAS': [],
        'EMPADAS DOCES': [],
        'PASTÉIS': [],
        'EMBALAGENS': []
      };

      t.items.forEach(item => {
        const cat = categoryMap[item.category] || 'EMBALAGENS';
        groupedItems[cat].push(item);
      });

      // Ordenar cada grupo pelo PRODUCT_ORDER
      Object.keys(groupedItems).forEach(cat => {
        groupedItems[cat].sort((a, b) => getProductOrder(a.name) - getProductOrder(b.name));
      });

      // 4. Render Sections - EXATAMENTE 7 ITENS NA COLUNA 1, 7 NA COLUNA 2
      const renderSection = (title: string, items: typeof t.items, unitName: string) => {
        if (items.length === 0) return 0;
        if (y > 280) { doc.addPage(); y = 20; }
        
        // Section Title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, marginLeft, y);
        y += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        
        const colWidth = (pageWidth - marginLeft - marginRight) / 2;
        let sectionTotal = 0;
        const itemHeight = 5;

        // Ordenar itens conforme PRODUCT_ORDER
        const sortedItems = [...items].sort((a, b) => getProductOrder(a.name) - getProductOrder(b.name));
        
        // Dividir em duas colunas: 7 na primeira, resto na segunda
        const col1Items = sortedItems.slice(0, 7);  // Primeiros 7
        const col2Items = sortedItems.slice(7, 14); // Próximos 7 (se houver)
        const maxRows = Math.max(col1Items.length, col2Items.length);
        
        const startY = y;
        
        // Renderizar coluna 1 (posição Y aumenta)
        for (let i = 0; i < col1Items.length; i++) {
          if (y > 275) { doc.addPage(); y = 20; }
          const item = col1Items[i];
          doc.text(`${item.name}: ${item.quantity} ${unitName}`, marginLeft, y);
          sectionTotal += item.quantity;
          y += itemHeight;
        }
        
        // Resetar Y para desenhar coluna 2 do mesmo ponto inicial
        y = startY;
        
        // Renderizar coluna 2 (mesmo Y inicial, mas X deslocado)
        for (let i = 0; i < col2Items.length; i++) {
          if (y > 275) { doc.addPage(); y = 20; }
          const item = col2Items[i];
          doc.text(`${item.name}: ${item.quantity} ${unitName}`, marginLeft + colWidth, y);
          sectionTotal += item.quantity;
          y += itemHeight;
        }
        
        // Avançar Y para o fim da seção (o maior das duas colunas)
        y = Math.max(startY + (col1Items.length * itemHeight), startY + (col2Items.length * itemHeight));

        // Section Total
        y += 2;
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL: ${sectionTotal} ${unitName}`, pageWidth - marginRight, y, { align: 'right' });
        y += 4;
        
        // Separator line
        doc.setLineWidth(0.2);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 8;

        return sectionTotal;
      };

      const totalSalgadas = renderSection('EMPADAS SALGADAS', groupedItems['EMPADAS SALGADAS'], 'Caixas');
      const totalDoces = renderSection('EMPADAS DOCES', groupedItems['EMPADAS DOCES'], 'Caixas');
      
      // Total de Empadas
      if (totalSalgadas > 0 || totalDoces > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de empadas: ${totalSalgadas + totalDoces} Caixas`, marginLeft, y);
        y += 4;
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.3);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 8;
      }

      renderSection('PASTÉIS', groupedItems['PASTÉIS'], 'Caixas');
      renderSection('EMBALAGENS', groupedItems['EMBALAGENS'], 'Unidades');

      doc.save(`Transferencia_${t.origin}_${t.destination}_${new Date(t.created_at).getTime()}.pdf`);
    } catch (e) {
      console.error("PDF Export Error:", e);
      alert("Erro ao gerar PDF");
    }
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleManualQuantityChange = (productId: string, value: string) => {
    const num = parseInt(value);
    setQuantities(prev => {
      if (isNaN(num) || num <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: num };
    });
  };

  const totalItemsCount = (Object.values(quantities) as number[]).reduce((a, b) => a + b, 0);

  const handleRegisterTransfer = async () => {
    if (totalItemsCount === 0) return;
    setIsSubmitting(true);

    const items: TransferItem[] = Object.entries(quantities).map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return {
        productId: id,
        name: prod?.name || 'Produto Desconhecido',
        quantity: qty as number,
        category: prod?.category || 'Empada Salgada'
      };
    });

    try {
      if (editingTransferId) {
        // MODO EDIÇÃO: atualizar transferência existente
        await updateRow('transfers', editingTransferId, {
          origin: originRegion,
          destination: destinationRegion,
          items,
          total_items: totalItemsCount,
          status: 'Concluído'
        });
        // Atualiza o card no estado local
        setTransfers(prev => prev.map(t => 
          t.id === editingTransferId 
            ? { ...t, origin: originRegion, destination: destinationRegion, items, total_items: totalItemsCount } as TransferRecord
            : t
        ));
        setEditingTransferId(null);
        setQuantities({});
        alert('Transferência atualizada com sucesso!');
      } else {
        // MODO NOVO: criar transferência
        console.log('[Transfer] Enviando dados:', {
          origin: originRegion,
          destination: destinationRegion,
          items,
          total_items: totalItemsCount,
          status: 'Concluído'
        });
        
        const newTransfer = await insertRow('transfers', {
          origin: originRegion,
          destination: destinationRegion,
          items,
          total_items: totalItemsCount,
          status: 'Concluído'
        });
        // Adiciona imediatamente ao estado local
        setTransfers(prev => [newTransfer as TransferRecord, ...prev]);
        setQuantities({});
        alert('Transferência registrada com sucesso!');
      }
    } catch (error: any) {
      console.error('[Transfer] Erro detalhado:', error);
      console.error('[Transfer] Mensagem:', error?.message);
      console.error('[Transfer] Detalhes:', error?.details);
      alert('Erro ao ' + (editingTransferId ? 'atualizar' : 'registrar') + ' transferência: ' + (error?.message || 'Erro desconhecido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Transferência de Estoque</h2>
          </div>
          <p className="text-on-surface-variant font-medium">Movimentação controlada de produtos entre centros de distribuição.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Thermometer className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Câmara Fria: -18.4°C</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Painel de Registro (Col 1-8) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase mb-1">Origem</span>
                    <button 
                      onClick={() => setOriginRegion(originRegion === 'Recife' ? 'Salvador' : 'Recife')}
                      className="px-6 py-2 bg-white border-2 border-primary rounded-xl text-primary font-black text-sm transition-all hover:bg-primary hover:text-white"
                    >
                      {originRegion}
                    </button>
                 </div>
                 <ArrowRight className="w-6 h-6 text-slate-300 mt-4" />
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase mb-1">Destino</span>
                    <div className="px-6 py-2 bg-slate-100 border-2 border-transparent rounded-xl text-slate-500 font-black text-sm opacity-60">
                      {destinationRegion}
                    </div>
                 </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filtrar produtos..."
                  className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none w-64"
                />
              </div>
            </div>

            <div className="p-0 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loadingProducts ? (
                <div className="py-20 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando catálogo...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center">
                   <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                   <p className="font-bold text-slate-400">Nenhum produto cadastrado para esta região.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {Object.entries(
                    filteredProducts.reduce((acc, p) => {
                      if (!acc[p.category]) acc[p.category] = [];
                      acc[p.category].push(p);
                      return acc;
                    }, {} as Record<string, Product[]>)
                  )
                  // Ordenar categorias: Empada Salgada, Empadas Doces, Pastéis, Descartáveis, Fardamento
                  .sort(([catA], [catB]) => {
                    const order = ['Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento'];
                    return order.indexOf(catA) - order.indexOf(catB);
                  })
                  .map(([category, catProducts]) => (
                    <div key={category} className="bg-white">
                      <div className="bg-slate-50/80 px-8 py-3 flex items-center justify-between border-y border-slate-100/50">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{category}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">{(catProducts as Product[]).length} Itens</span>
                      </div>
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-50">
                          {(catProducts as Product[]).map(product => (
                            <tr key={product.id} className="group hover:bg-slate-50/30 transition-colors">
                              <td className="px-8 py-4 w-2/3">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100">
                                    <Package className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <p className="font-bold text-on-surface text-sm">{product.name}</p>
                                     <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Cód: {product.id.split('-')[0]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-4">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => handleQuantityChange(product.id, -1)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <input 
                                    type="number"
                                    min="0"
                                    value={quantities[product.id] || ''}
                                    placeholder="0"
                                    onChange={(e) => handleManualQuantityChange(product.id, e.target.value)}
                                    className="w-20 text-center border-2 border-slate-100 rounded-xl py-2 font-black text-primary focus:border-primary focus:ring-0 outline-none bg-white text-sm"
                                  />
                                  <button 
                                    onClick={() => handleQuantityChange(product.id, 1)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Resumo do Carregamento</p>
                    <p className="text-lg font-black">{totalItemsCount} <span className="text-sm font-bold opacity-40">Itens Selecionados</span></p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  {editingTransferId && (
                    <button 
                      onClick={handleCancelEdit}
                      className="px-6 py-5 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                      CANCELAR EDIÇÃO
                    </button>
                  )}
                  <button 
                    disabled={totalItemsCount === 0 || isSubmitting}
                    onClick={handleRegisterTransfer}
                    className="px-10 py-5 primary-gradient text-white font-black rounded-3xl shadow-xl shadow-primary/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingTransferId ? 'ATUALIZAR TRANSFERÊNCIA' : 'REGISTRAR TRANSFERÊNCIA'}
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Histórico e Métricas (Col 9-12) */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-black">Histórico Recente</h3>
                </div>

                {/* Filtros de Data */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Filter className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Filtrar por Período</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Início</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-bold focus:ring-1 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Fim</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-bold focus:ring-1 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(''); setEndDate(''); }}
                      className="text-[9px] font-black text-primary uppercase hover:underline ml-1"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {filteredTransfers.length === 0 ? (
                  <p className="text-center py-10 text-xs font-bold text-slate-300 uppercase italic">Nenhuma movimentação encontrada.</p>
                ) : filteredTransfers.slice(0, 10).map((t) => (
                  <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase">{t.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">{t.destination}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {/* Identificação da ação */}
                    <div className="mb-2">
                      {t.origin === 'Recife' && t.destination === 'Salvador' ? (
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                          Contagem da Câmara
                        </span>
                      ) : t.origin === 'Salvador' && t.destination === 'Recife' ? (
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                          Carga enviada
                        </span>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-lg font-black leading-none">{t.total_items}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase">Total de Itens</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 mr-2">
                           {t.items.slice(0, 3).map((item, idx) => (
                             <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-primary shadow-sm" title={item.name}>
                                {item.name.charAt(0)}
                             </div>
                           ))}
                        </div>
                        <button 
                          onClick={() => handleEditTransfer(t)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                          title="Editar Transferência"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransfer(t)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Excluir Transferência"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleExportTransferPDF(t)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Imprimir Relatório"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-4 text-xs font-black text-primary uppercase tracking-widest border-2 border-primary/10 rounded-2xl hover:bg-primary/5 transition-all">
                Ver Relatório Geral PDF
              </button>
           </div>

        </div>
      </div>
    </div>
  );
}
