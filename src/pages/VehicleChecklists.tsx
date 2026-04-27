import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Car, Calendar, Search, Filter, MapPin, X, ChevronLeft, ChevronRight, Camera, ZoomIn, ZoomOut, RotateCcw, RotateCw, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { subscribeToTable, normalizeStorageUrl } from '@/supabase';
import { type Region } from '@/types';

interface Checklist {
  id: string;
  driver_id: string;
  vehicle: string;
  km: number;
  checks: Record<string, 'ok' | 'problem'>;
  photos: string[];
  observations: string;
  status: 'ok' | 'problem';
  region: Region;
  created_at: string;
  driver_name?: string;
}

export function VehicleChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Recife');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'problem'>('all');
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Photo modal states (same as Reports page)
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [photoRotation, setPhotoRotation] = useState<number>(0);
  const [photoPosition, setPhotoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoading(true);
    const regionFilter = region === 'Todas' ? {} : { region };
    const unsub = subscribeToTable('vehicle_checklists', regionFilter, (data) => {
      setChecklists(data || []);
      setLoading(false);
    }, 'created_at', false);
    return () => unsub();
  }, [region]);

  const filteredChecklists = checklists.filter(c => {
    const matchesSearch = c.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.driver_name && c.driver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' ? true : c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const hasProblems = (checks: Record<string, string>) => {
    return Object.values(checks).some(v => v === 'problem');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Checklists de Veículos</h2>
          <p className="text-on-surface-variant">Inspeções veiculares enviadas pelos motoristas.</p>
        </div>
        
        {/* Region Tabs */}
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
          {(['Recife', 'Salvador', 'Todas'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRegion(r as any)}
              className={cn(
                "px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200",
                region === r
                  ? "primary-gradient text-white shadow-md"
                  : "text-slate-500 hover:text-primary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder="Buscar por veículo ou motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'ok', 'problem'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
                filterStatus === status
                  ? status === 'problem' ? "bg-red-600 text-white" : "bg-primary text-white"
                  : "bg-surface-container text-on-surface-variant"
              )}
            >
              {status === 'all' ? 'Todos' : status === 'ok' ? 'OK' : 'Problemas'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-black text-on-surface">{checklists.length}</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Checklists</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-black text-on-surface">
              {checklists.filter(c => c.status === 'ok').length}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sem Problemas</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-black text-on-surface">
              {checklists.filter(c => c.status === 'problem').length}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Com Problemas</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-on-surface">
              {checklists.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hoje</p>
        </div>
      </div>

      {/* Checklists Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Veículo</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">KM</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Itens Verificados</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Fotos</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Data</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-on-surface-variant">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                    Carregando checklists...
                  </td>
                </tr>
              ) : filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                    Nenhum checklist encontrado.
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((checklist) => (
                  <tr key={checklist.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                        checklist.status === 'ok' 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {checklist.status === 'ok' ? (
                          <><CheckCircle2 className="w-3 h-3" /> OK</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3" /> Problema</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-on-surface">{checklist.vehicle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-on-surface">{checklist.km.toLocaleString()} km</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(checklist.checks).map(([item, status]) => (
                          <span
                            key={item}
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              status === 'ok' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}
                            title={item}
                          >
                            {item.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">{checklist.photos?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface-variant">
                        {new Date(checklist.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-on-surface-variant/60">
                        {new Date(checklist.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedChecklist(checklist);
                          setCurrentPhotoIndex(0);
                        }}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedChecklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onMouseDown={() => setSelectedChecklist(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    selectedChecklist.status === 'ok' ? "bg-green-100" : "bg-red-100"
                  )}>
                    {selectedChecklist.status === 'ok' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Checklist {selectedChecklist.vehicle}</h3>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(selectedChecklist.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChecklist(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* KM */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Car className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase">Quilometragem</p>
                    <p className="text-xl font-bold">{selectedChecklist.km.toLocaleString()} km</p>
                  </div>
                </div>

                {/* Check Items */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Itens Verificados</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedChecklist.checks).map(([item, status]) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl",
                          status === 'ok' ? "bg-green-50" : "bg-red-50"
                        )}
                      >
                        {status === 'ok' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={cn(
                          "font-medium",
                          status === 'ok' ? "text-green-700" : "text-red-700"
                        )}>
                          {item.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                {selectedChecklist.photos && selectedChecklist.photos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Fotos do Veículo</h4>
                    <div className="relative">
                      <div 
                        className="aspect-video rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => setPhotoModalOpen(true)}
                      >
                        <img
                          src={normalizeStorageUrl(selectedChecklist.photos[currentPhotoIndex])}
                          alt={`Foto ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      {selectedChecklist.photos.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(i => i > 0 ? i - 1 : selectedChecklist.photos.length - 1); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(i => i < selectedChecklist.photos.length - 1 ? i + 1 : 0); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <div className="flex justify-center gap-2 mt-2">
                        {selectedChecklist.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPhotoIndex(idx)}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              idx === currentPhotoIndex ? "bg-primary" : "bg-slate-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Observations */}
                {selectedChecklist.observations && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3">Observações</h4>
                    <div className="p-4 bg-amber-50 rounded-xl text-amber-800">
                      {selectedChecklist.observations}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Photo Modal (same as Reports page) */}
      <AnimatePresence>
        {photoModalOpen && selectedChecklist && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => { 
              setPhotoModalOpen(false); 
              setPhotoZoom(1); 
              setPhotoRotation(0); 
              setPhotoPosition({ x: 0, y: 0 }); 
            }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                <div>
                  <p className="font-bold text-sm">
                    Foto do Veículo · {selectedChecklist.vehicle}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {selectedChecklist.photos.length > 1 && `Foto ${currentPhotoIndex + 1} de ${selectedChecklist.photos.length}`}
                  </p>
                </div>
                <button 
                  onClick={() => { 
                    setPhotoModalOpen(false); 
                    setPhotoZoom(1); 
                    setPhotoRotation(0); 
                    setPhotoPosition({ x: 0, y: 0 }); 
                  }} 
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col min-h-0">
                {/* Image container with drag and wheel zoom */}
                <div 
                  className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden p-4 cursor-move"
                  onMouseDown={(e) => {
                    if (photoZoom > 1) {
                      setIsDragging(true);
                      dragStartRef.current = { x: e.clientX, y: e.clientY };
                      positionStartRef.current = { ...photoPosition };
                      currentPositionRef.current = { ...photoPosition };
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isDragging && photoZoom > 1 && imgRef.current) {
                      const deltaX = (e.clientX - dragStartRef.current.x) / photoZoom;
                      const deltaY = (e.clientY - dragStartRef.current.y) / photoZoom;
                      const newX = positionStartRef.current.x + deltaX;
                      const newY = positionStartRef.current.y + deltaY;
                      currentPositionRef.current = { x: newX, y: newY };
                      imgRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${photoZoom}) rotate(${photoRotation}deg)`;
                    }
                  }}
                  onMouseUp={() => {
                    if (isDragging) {
                      setIsDragging(false);
                      setPhotoPosition(currentPositionRef.current);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isDragging) {
                      setIsDragging(false);
                      setPhotoPosition(currentPositionRef.current);
                    }
                  }}
                  onWheel={(e) => {
                    e.preventDefault();
                    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                    const newZoom = Math.max(0.5, Math.min(3, photoZoom * zoomFactor));
                    setPhotoZoom(newZoom);
                    if (imgRef.current) {
                      imgRef.current.style.transform = `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${newZoom}) rotate(${photoRotation}deg)`;
                    }
                  }}
                >
                  <img 
                    ref={imgRef}
                    src={normalizeStorageUrl(selectedChecklist.photos[currentPhotoIndex])}
                    alt={`Foto ${currentPhotoIndex + 1}`}
                    className="max-w-full max-h-full object-contain select-none will-change-transform"
                    style={{ 
                      transform: `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${photoZoom}) rotate(${photoRotation}deg)`,
                      transformOrigin: 'center center',
                      cursor: isDragging ? 'grabbing' : photoZoom > 1 ? 'grab' : 'default'
                    }}
                    draggable={false}
                  />
                </div>
                
                {/* Controls bar */}
                <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-center gap-2 flex-shrink-0">
                  {/* Previous photo */}
                  {selectedChecklist.photos.length > 1 && (
                    <button 
                      onClick={() => {
                        setCurrentPhotoIndex(i => i > 0 ? i - 1 : selectedChecklist.photos.length - 1);
                        setPhotoZoom(1);
                        setPhotoRotation(0);
                        setPhotoPosition({ x: 0, y: 0 });
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                      title="Foto Anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  
                  {/* Zoom out */}
                  <button 
                    onClick={() => {
                      const newZoom = Math.max(0.5, photoZoom - 0.25);
                      setPhotoZoom(newZoom);
                      if (imgRef.current) {
                        imgRef.current.style.transform = `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${newZoom}) rotate(${photoRotation}deg)`;
                      }
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title="Zoom -"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  
                  {/* Zoom in */}
                  <button 
                    onClick={() => {
                      const newZoom = Math.min(3, photoZoom + 0.25);
                      setPhotoZoom(newZoom);
                      if (imgRef.current) {
                        imgRef.current.style.transform = `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${newZoom}) rotate(${photoRotation}deg)`;
                      }
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title="Zoom +"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  
                  {/* Rotate left */}
                  <button 
                    onClick={() => setPhotoRotation(r => r - 90)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title="Girar Esquerda"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  
                  {/* Rotate right */}
                  <button 
                    onClick={() => setPhotoRotation(r => r + 90)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title="Girar Direita"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  
                  {/* Reset */}
                  <button 
                    onClick={() => { 
                      setPhotoZoom(1); 
                      setPhotoRotation(0); 
                      setPhotoPosition({ x: 0, y: 0 }); 
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors flex items-center gap-1"
                    title="Redefinir"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    <span className="text-xs font-medium">Redefinir</span>
                  </button>
                  
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  
                  {/* Zoom info */}
                  <span className="text-xs text-slate-500 font-medium min-w-[50px] text-center">
                    {Math.round(photoZoom * 100)}%
                  </span>
                  
                  {/* Next photo */}
                  {selectedChecklist.photos.length > 1 && (
                    <>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button 
                        onClick={() => {
                          setCurrentPhotoIndex(i => i < selectedChecklist.photos.length - 1 ? i + 1 : 0);
                          setPhotoZoom(1);
                          setPhotoRotation(0);
                          setPhotoPosition({ x: 0, y: 0 });
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                        title="Próxima Foto"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
