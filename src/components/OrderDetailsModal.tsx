import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  History,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize,
  Camera,
  ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { type Order } from '@/types';
import { supabase, normalizeStorageUrl } from '@/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState<'pdf' | 'photo'>('pdf');
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  // Helper to format dates safely (handles Firestore Timestamp and ISO strings)
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '—';
    try {
      const date = (timestamp as any)?.toDate ? (timestamp as any).toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '—';
    }
  };

  const formatTime = (timestamp: any): string => {
    if (!timestamp) return '—';
    try {
      const date = (timestamp as any)?.toDate ? (timestamp as any).toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  // Helper para converter imagem em base64 usando canvas (síncrono)
  const getImageAsBase64 = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.error('[PDF] Erro ao carregar imagem:', url);
        resolve(null);
      };
      img.src = url;
    });
  };

  const generateOrderPdf = async (mode: 'save' | 'preview') => {
    if (!order) return null;
    try {
      const logoBase64 = await getImageAsBase64('/logo.png');
      
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const marginLeft = 15;
      const marginRight = 15;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const primaryColor = [139, 0, 0];

      // 1. Fetch Data
      // IMPORTANTE: Este PDF usa SOMENTE order_items (pedido original do franqueado).
      // NÃO usa delivery_products (o que o motorista entregou) e NÃO inclui Entrega extra.
      const { data: productsData } = await supabase
        .from('products')
        .select('name, category, sort_order')
        .eq('region', order.region)
        .neq('category', 'Entrega extra') // Excluir itens de entrega extra
        .order('sort_order', { ascending: true });

      const { data: orderItemsData } = await supabase
        .from('order_items')
        .select('product_name, quantity')
        .eq('order_id', order.id);

      const orderItemsMap: Record<string, number> = {};
      (orderItemsData || []).forEach((item: any) => {
        orderItemsMap[item.product_name] = item.quantity || 0;
      });

      // 2. Agrupar usando CATEGORIAS OFICIAIS (sem Entrega extra)
      const CATEGORIES_ORDER = ['Empada Salgada', 'Empadas Doces', 'Pastéis', 'Descartáveis', 'Fardamento'];
      const groupedProducts: Record<string, Array<{ name: string, quantity: number, sort_order: number }>> = {};
      CATEGORIES_ORDER.forEach(cat => { groupedProducts[cat] = []; });
      groupedProducts['Outros'] = [];

      (productsData || []).forEach((p: any) => {
        const cat = p.category || 'Outros';
        // Nunca incluir Entrega extra no PDF do pedido do franqueado
        if (cat === 'Entrega extra') return;
        if (groupedProducts[cat]) {
          groupedProducts[cat].push({
            name: p.name,
            quantity: orderItemsMap[p.name] || 0,
            sort_order: p.sort_order || 999
          });
        } else {
          groupedProducts['Outros'].push({
            name: p.name,
            quantity: orderItemsMap[p.name] || 0,
            sort_order: p.sort_order || 999
          });
        }
      });

      // Ordenar cada seção pelo sort_order do banco
      Object.keys(groupedProducts).forEach(cat => {
        groupedProducts[cat].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
      });


      let y = 12;

      // 3. Header - Logo esquerda, PEDIDO DA UNIDADE / DATA DE ENTREGA direita
      const headerY = y;
      if (logoBase64) {
        try { doc.addImage(logoBase64, 'PNG', marginLeft, headerY, 25, 20); }
        catch (e) { console.log('[PDF] Logo error:', e); }
      }

      const pName = order.pointName || order.point_name || 'N/A';
      const orderDate = formatDate(order.timestamp || order.created_at);

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

      // 4. Seções de Produtos
      const renderSection = (title: string, products: any[], unitName: string, splitAt?: number) => {
        if (products.length === 0) return 0;
        if (y > pageHeight - 40) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, marginLeft, y);
        y += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);

        const colWidth = contentWidth / 2;
        let sectionTotal = 0;
        const itemHeight = 5;

        if (splitAt) {
          // Layout com split fixo: col1 = primeiros splitAt, col2 = resto
          const col1Items = products.slice(0, splitAt);
          const col2Items = products.slice(splitAt, splitAt * 2);
          const startY = y;

          col1Items.forEach(p => {
            doc.text(`${p.name}: ${p.quantity} ${unitName}`, marginLeft, y);
            sectionTotal += p.quantity;
            y += itemHeight;
          });

          y = startY;
          col2Items.forEach(p => {
            doc.text(`${p.name}: ${p.quantity} ${unitName}`, marginLeft + colWidth, y);
            sectionTotal += p.quantity;
            y += itemHeight;
          });

          y = Math.max(startY + col1Items.length * itemHeight, startY + col2Items.length * itemHeight);
        } else {
          // Layout em pares
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
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text(`TOTAL: ${sectionTotal} ${unitName}`, pageWidth - marginRight, y, { align: 'right' });
        y += 4;
        doc.setLineWidth(0.2);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 8;

        return sectionTotal;
      };

      let totalEmpadas = 0;
      totalEmpadas += renderSection('EMPADA SALGADA', groupedProducts['Empada Salgada'], 'Caixas', 7);
      totalEmpadas += renderSection('EMPADAS DOCES', groupedProducts['Empadas Doces'], 'Caixas');

      // Total de empadas
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Total de empadas: ${totalEmpadas} Caixas`, marginLeft, y);
      y += 3;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 8;

      renderSection('PASTÉIS', groupedProducts['Pastéis'], 'Caixas');

      // Agrupar itens restantes em Embalagens / Outros (sem Entrega extra)
      const otherItems = [
        ...groupedProducts['Descartáveis'],
        ...groupedProducts['Fardamento'],
        ...(groupedProducts['Outros'] || [])
      ].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

      renderSection('EMBALAGENS / OUTROS', otherItems, 'Unidades');


      // 5. TOTAL ENTREGUE
      if (y > pageHeight - 60) { doc.addPage(); y = 20; }

      y += 4;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('TOTAL ENTREGUE:', marginLeft, y);
      y += 3;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const drawField = (label: string, x: number, currentY: number) => {
        const text = `${label}:`;
        doc.text(text, x, currentY);
        const textWidth = doc.getTextWidth(text);
        (doc as any).setLineDashPattern([0.5, 0.5], 0);
        doc.line(x + textWidth + 2, currentY + 0.5, x + 55, currentY + 0.5);
        (doc as any).setLineDashPattern([], 0);
      };

      const c1 = marginLeft;
      const c2 = marginLeft + 65;
      const c3 = marginLeft + 130;

      drawField('Troca', c1, y);
      drawField('Diferença', c2, y);
      drawField('Avaria', c3, y);
      y += 10;
      drawField('Vazada', c1, y);
      drawField('Empada', c2, y);
      drawField('Pastel', c3, y);
      y += 10;
      drawField('Pastel de Camarão com Requeijão', c1, y);

      // === OBSERVAÇÕES (do banco ou order) ===
      y += 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Observações:', marginLeft, y);
      y += 5;

      const orderObservations = (order as any).observations || (order as any).observacoes || '';
      if (orderObservations) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        const maxWidth = pageWidth - marginLeft - marginRight;
        const wrappedLines = doc.splitTextToSize(orderObservations, maxWidth);
        wrappedLines.forEach((line: string) => {
          if (y > pageHeight - 20) { doc.addPage(); y = 20; }
          doc.text(line, marginLeft, y);
          y += 6;
        });
      } else {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.2);
        for (let i = 0; i < 3; i++) {
          (doc as any).setLineDashPattern([0.5, 0.5], 0);
          doc.line(marginLeft, y, pageWidth - marginRight, y);
          (doc as any).setLineDashPattern([], 0);
          y += 7;
        }
      }

      if (mode === 'save') {
        const saveName = order.pointName || order.point_name || 'Desconhecido';
        doc.save(`Pedido_${saveName}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
      } else {
        return doc.output('datauristring');
      }
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      if (mode === 'save') alert("Erro ao gerar PDF: " + error.message);
      return null;
    }
  };

  // Buscar foto da entrega (mesma lógica do Reports.tsx)
  useEffect(() => {
    const fetchDeliveryPhoto = async () => {
      if (!order) return;
      setLoadingPhoto(true);
      setDeliveryPhoto(null);
      let photoUrl = '';

      // P1: delivery_point_details
      try {
        const { data: detailData } = await supabase
          .from('delivery_point_details')
          .select('delivery_photo_url')
          .eq('order_id', order.id)
          .maybeSingle();
        if (detailData?.delivery_photo_url) {
          photoUrl = detailData.delivery_photo_url;
          console.log('[OrderDetailsModal] Foto encontrada em delivery_point_details:', photoUrl);
        }
      } catch (e) { /* ignorar */ }

      // P2: campos do pedido
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
      }

      // P3: storage bucket fallback
      if (!photoUrl) {
        try {
          const searchTerms = [(order as any).pointId, order.id].filter(Boolean);
          for (const term of searchTerms) {
            const { data: storageData } = await supabase
              .storage
              .from('delivery-photos')
              .list('', { limit: 50, search: term });
            if (storageData && storageData.length > 0) {
              const { data: publicUrlData } = supabase
                .storage
                .from('delivery-photos')
                .getPublicUrl(storageData[0].name);
              if (publicUrlData?.publicUrl) {
                photoUrl = publicUrlData.publicUrl;
                break;
              }
            }
          }
        } catch (e) { /* ignorar */ }
      }

      if (photoUrl) {
        setDeliveryPhoto(normalizeStorageUrl(photoUrl));
        setActiveTab('photo');
      }
      setLoadingPhoto(false);
    };

    fetchDeliveryPhoto();
  }, [order?.id]);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!order) return;
      setLoadingPdf(true);
      const preview = await generateOrderPdf('preview');
      if (preview) setPdfPreview(preview);
      setLoadingPdf(false);
    };
    fetchPreview();
  }, [order?.id]);

  const handlePrintOrder = async () => {
    await generateOrderPdf('save');
  };

  const handleTrackRoute = async () => {
    const dName = order?.driverName || (order as any)?.driver_name;
    if (!dName) {
      alert('Nenhum motorista atribuído a este pedido.');
      return;
    }

    try {
      const { data: driverData, error } = await supabase
        .from('app_users')
        .select('lat, lng')
        .eq('name', dName)
        .eq('role', 'motorista')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar localização do motorista:', error);
        alert('Erro ao buscar localização do motorista.');
        return;
      }

      if (driverData?.lat && driverData?.lng) {
        const url = `https://www.google.com/maps/search/?api=1&query=${driverData.lat},${driverData.lng}`;
        window.open(url, '_blank');
      } else {
        alert('O motorista ainda não enviou sua localização GPS ou não está ativo no momento.');
      }
    } catch (err) {
      console.error('Erro ao processar acompanhamento de rota:', err);
      alert('Erro ao tentar abrir o mapa.');
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tight">Detalhes da Operação</h3>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Pedido #{order.short_id || order.id}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-on-surface-variant"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            {deliveryPhoto && (
              <div className="flex bg-slate-100 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('photo')}
                  className={cn(
                    "flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    activeTab === 'photo' ? "bg-white text-primary border-b-2 border-primary" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Camera className="w-4 h-4" />
                  Foto da Entrega
                </button>
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={cn(
                    "flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    activeTab === 'pdf' ? "bg-white text-primary border-b-2 border-primary" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  Guia de Pedido
                </button>
              </div>
            )}

            {/* Content - PDF or Photo */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start bg-slate-200/50">
              {/* Zoom Controls (only for PDF) */}
              {activeTab === 'pdf' && (
              <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-on-surface-variant flex items-center gap-2"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                <span className="text-xs font-black text-on-surface min-w-[45px] text-center">{zoom}%</span>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                <button 
                  onClick={() => setZoom(Math.min(300, zoom + 25))}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-on-surface-variant"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setZoom(100)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-on-surface-variant"
                  title="Reset Zoom"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
              )}

              {activeTab === 'pdf' && (
              <div className="w-full h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-300 overflow-auto relative group flex justify-center">
                {loadingPdf ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 z-10">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs font-bold text-on-surface-variant animate-pulse">Gerando Guia em Alta Resolução...</p>
                  </div>
                ) : pdfPreview ? (
                  <div 
                    className="transition-transform duration-200 ease-out origin-top"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      transform: `scale(${zoom / 100})`,
                      minWidth: '100%'
                    }}
                  >
                    <iframe 
                      src={`${pdfPreview}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <AlertCircle className="w-12 h-12 mb-2" />
                    <p className="text-sm font-bold">Não foi possível carregar a prévia</p>
                  </div>
                )}
              </div>
              )}

              {activeTab === 'photo' && deliveryPhoto && (
                <div className="w-full h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-300 overflow-auto relative flex flex-col items-center justify-center p-4">
                  {loadingPhoto ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-xs font-bold text-on-surface-variant animate-pulse">Buscando foto da entrega...</p>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={deliveryPhoto} 
                        alt="Foto da Entrega"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg cursor-pointer"
                        onClick={() => window.open(deliveryPhoto!, '_blank')}
                        onError={(e) => {
                          console.error('[OrderDetailsModal] Erro ao carregar imagem:', deliveryPhoto);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <p className="mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-white/50 px-4 py-1 rounded-full border border-slate-200">Clique na imagem para ampliar</p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'pdf' && (
                <p className="mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-white/50 px-4 py-1 rounded-full border border-slate-200">Visualização em Alta Definição (A4)</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
              <button 
                onClick={handlePrintOrder} 
                className="flex-1 py-4 primary-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Imprimir Guia
              </button>
              <button 
                onClick={handleTrackRoute}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Acompanhar Rota
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
