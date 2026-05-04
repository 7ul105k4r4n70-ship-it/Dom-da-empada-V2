import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Camera, 
  Gauge, 
  Droplets, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Save, 
  Trash2,
  Edit2,
  History,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Fuel,
  User,
  UserMinus,
  Calendar,
  ClipboardCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  subscribeToTable, 
  insertRow, 
  updateRow, 
  deleteRow, 
  supabase,
  normalizeStorageUrl 
} from '@/supabase';
import { type Region, type Vehicle } from '@/types';

// â”€â”€â”€ Interface de Checklist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

interface FuelRegistration {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_plate: string;
  driver_id: string | null;
  fuel_level: number;
  fuel_status: string;
  km: number | null;
  total_value: number | null;
  price_per_liter: number | null;
  volume: number | null;
  receipt_url: string | null;
  region: Region;
  created_at: string;
}

// â”€â”€â”€ Componente de Progresso de Manutenção â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface MaintenanceProgressBarProps {
  label: string;
  icon: React.ElementType;
  current: number;
  target: number;
  interval: number;
  color: string;
}

const MaintenanceProgressBar: React.FC<MaintenanceProgressBarProps> = ({
  label, icon: Icon, current, target, interval, color
}) => {
  // Safe defaults — prevent NaN/Infinity when values are missing (V1-created vehicles may lack these)
  const safeCurrent = current ?? 0;
  const safeTarget = target ?? (safeCurrent + (interval || 10000));
  const safeInterval = interval || 10000;

  const startKm = safeTarget - safeInterval;
  const traveledSinceLast = safeCurrent - startKm;
  const progress = safeInterval > 0
    ? Math.min(Math.max((traveledSinceLast / safeInterval) * 100, 0), 100)
    : 0;
  const remaining = safeTarget - safeCurrent;
  const isUrgent = remaining <= 500;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", color)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
        </div>
        <span className={cn(
          "text-[10px] font-black",
          isUrgent ? "text-red-500 animate-pulse" : "text-on-surface-variant"
        )}>
          {remaining > 0 ? `FALTAM ${remaining.toLocaleString()} KM` : 'VENCIDO'}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            isUrgent ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : progress > 80 ? "bg-amber-500" : "bg-primary"
          )}
        />
      </div>
    </div>
  );
};

// â”€â”€â”€ Componente de Progresso de Combustível â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FuelProgressBarProps {
  fuelLevel: number | null;
}

const FuelProgressBar: React.FC<FuelProgressBarProps> = ({ fuelLevel }) => {
  const level = fuelLevel ?? 0;
  const progress = Math.min(Math.max(level, 0), 100);
  
  const getLabel = (lvl: number) => {
    if (lvl <= 10) return 'Reserva';
    if (lvl <= 25) return '1/4';
    if (lvl <= 50) return '1/2';
    if (lvl <= 75) return '3/4';
    return 'Cheio';
  };

  const getColor = (lvl: number) => {
    if (lvl <= 10) return 'text-red-500 bg-red-500/10';
    if (lvl <= 25) return 'text-orange-500 bg-orange-500/10';
    if (lvl <= 50) return 'text-amber-500 bg-amber-500/10';
    if (lvl <= 75) return 'text-primary bg-primary/10';
    return 'text-green-500 bg-green-500/10';
  };

  const getBarColor = (lvl: number) => {
    if (lvl <= 10) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (lvl <= 25) return 'bg-orange-500';
    if (lvl <= 50) return 'bg-amber-500';
    if (lvl <= 75) return 'bg-primary';
    return 'bg-green-500';
  };

  const colorClass = getColor(level);
  const barColor = getBarColor(level);
  const label = getLabel(level);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", colorClass)}>
            <Fuel className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Combustível</span>
        </div>
        <span className={cn("text-[10px] font-black", colorClass.split(' ')[0])}>
          {label} ({progress}%)
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn("h-full rounded-full transition-all duration-1000", barColor)}
        />
      </div>
    </div>
  );
};

// â”€â”€â”€ Modal de Cadastro/Edição de Veículo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface VehicleFormModalProps {
  vehicle?: Partial<Vehicle>;
  region: Region;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ vehicle, region, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>(vehicle || {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    current_km: 0,
    oil_change_interval: 10000,
    revision_interval: 20000,
    region: region,
    status: 'Ativo' as 'Ativo' | 'Manutenção' | 'Inativo'
  });

  const [remainingOilKm, setRemainingOilKm] = useState<string>(
    vehicle?.next_oil_change_km != null && vehicle?.current_km != null
      ? (vehicle.next_oil_change_km - vehicle.current_km).toString()
      : ''
  );
  const [kmValidationError, setKmValidationError] = useState<string>('');
  const [remainingRevKm, setRemainingRevKm] = useState<string>(
    vehicle?.next_revision_km != null && vehicle?.current_km != null
      ? (vehicle.next_revision_km - vehicle.current_km).toString()
      : ''
  );

  // CRITICAL: Reset internal state whenever vehicle prop changes to prevent data leakage between vehicles
  useEffect(() => {
    setFormData(vehicle || {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      color: '',
      current_km: 0,
      oil_change_interval: 10000,
      revision_interval: 20000,
      region: region,
      status: 'Ativo' as 'Ativo' | 'Manutenção' | 'Inativo'
    });
    setRemainingOilKm(
      vehicle?.next_oil_change_km != null && vehicle?.current_km != null
        ? (vehicle.next_oil_change_km - vehicle.current_km).toString()
        : ''
    );
    setRemainingRevKm(
      vehicle?.next_revision_km != null && vehicle?.current_km != null
        ? (vehicle.next_revision_km - vehicle.current_km).toString()
        : ''
    );
    setKmValidationError('');
  }, [vehicle?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        next_oil_change_km: formData.current_km! + (parseInt(remainingOilKm) || 0),
        next_revision_km: formData.current_km! + (parseInt(remainingRevKm) || 0),
      };

      if (vehicle?.id) {
        await updateRow('vehicles', vehicle.id, dataToSave);
        onSave?.({ ...vehicle, ...dataToSave });
      } else {
        console.log('Dados do veículo a serem salvos:', dataToSave);
        const newRow = await insertRow('vehicles', dataToSave);
        onSave?.(newRow || dataToSave);
      }
      onClose();
    } catch (error: any) {
      console.error('Erro detalhado ao salvar veículo:', error);
      const errorMessage = error.message || error.details || 'Erro desconhecido';
      alert(`Erro ao salvar veículo: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileName = `${Date.now()}_${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file);

      if (error) {
        console.error('Supabase storage error details:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(data.path);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error: any) {
      console.error('Full upload error context:', error);
      alert(`Erro ao subir foto: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onMouseDown={e => e.stopPropagation()}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100"
      >
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">{vehicle?.id ? 'Editar Veículo' : 'Novo Veículo'}</h3>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{region}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-3 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Foto do Veículo */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-64 h-40 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                {formData.photo_url ? (
                  <img src={normalizeStorageUrl(formData.photo_url)} alt="Veículo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Camera className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Adicionar Foto</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </div>
              {formData.photo_url && (
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, photo_url: '' }))}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Marca</label>
              <input 
                required
                value={formData.brand}
                onChange={e => setFormData(f => ({ ...f, brand: e.target.value }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                placeholder="Ex: Fiat"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Modelo</label>
              <input 
                required
                value={formData.model}
                onChange={e => setFormData(f => ({ ...f, model: e.target.value }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                placeholder="Ex: Fiorino"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Placa</label>
              <input 
                required
                value={formData.plate}
                onChange={e => setFormData(f => ({ ...f, plate: e.target.value.toUpperCase() }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                placeholder="ABC-1234"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Cor</label>
              <input 
                required
                value={formData.color}
                onChange={e => setFormData(f => ({ ...f, color: e.target.value }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                placeholder="Branco"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Ano</label>
              <input 
                required
                type="number"
                value={formData.year}
                onChange={e => setFormData(f => ({ ...f, year: parseInt(e.target.value) }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Quilometragem Atual</label>
              <input 
                required
                type="number"
                value={formData.current_km}
                onChange={e => setFormData(f => ({ ...f, current_km: parseInt(e.target.value) }))}
                className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Status do Veículo</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={e => setFormData(f => ({ ...f, status: e.target.value as any }))}
                  className="w-full bg-slate-50 px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold appearance-none"
                >
                  <option value="Ativo">Ativo (Disponível)</option>
                  <option value="Manutenção">Em Manutenção (Indisponível)</option>
                  <option value="Inativo">Inativo (Fora de uso)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[24px] space-y-6">
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Plano de Manutenção
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Troca de Óleo em...</label>
                </div>
                <div className="relative">
                  <input 
                    required
                    type="number"
                    value={remainingOilKm}
                    onChange={e => setRemainingOilKm(e.target.value)}
                    className="w-full bg-white px-5 py-3 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                    placeholder="km para a próxima"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant opacity-40">KM</span>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/60">Intervalo Padrão:</span>
                  <input 
                    type="number"
                    value={formData.oil_change_interval}
                    onChange={e => setFormData(f => ({ ...f, oil_change_interval: parseInt(e.target.value) }))}
                    className="bg-transparent border-none p-0 text-[10px] font-black text-primary w-12 outline-none focus:ring-0"
                  />
                  <span className="text-[10px] font-bold text-on-surface-variant/60">km</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-secondary" />
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Próxima Revisão em...</label>
                </div>
                <div className="relative">
                  <input 
                    required
                    type="number"
                    value={remainingRevKm}
                    onChange={e => setRemainingRevKm(e.target.value)}
                    className="w-full bg-white px-5 py-3 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                    placeholder="km para a próxima"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant opacity-40">KM</span>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/60">Intervalo Padrão:</span>
                  <input 
                    type="number"
                    value={formData.revision_interval}
                    onChange={e => setFormData(f => ({ ...f, revision_interval: parseInt(e.target.value) }))}
                    className="bg-transparent border-none p-0 text-[10px] font-black text-secondary w-12 outline-none focus:ring-0"
                  />
                  <span className="text-[10px] font-bold text-on-surface-variant/60">km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold text-on-surface-variant hover:bg-black/5 rounded-[20px] transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-[2] py-4 bg-primary text-white text-sm font-black rounded-[20px] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Veículo</>}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};
// â”€â”€â”€ Card de Veículo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface VehicleCardProps {
  vehicle: Vehicle;
  driverInfo?: { name: string; photo_url?: string };
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onUnassignDriver: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, driverInfo, onEdit, onDelete, onToggleStatus, onUnassignDriver }) => {
  const isMaintenance = vehicle.status === 'Manutenção';

  return (
    <motion.div 
      layout
      className={cn(
        "bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
        isMaintenance && "border-amber-200 bg-amber-50/30"
      )}
    >
      <div className="relative h-44 overflow-hidden">
        {vehicle.photo_url ? (
          <img src={normalizeStorageUrl(vehicle.photo_url)} alt={vehicle.model} className={cn("w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", isMaintenance && "grayscale opacity-70")} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
            <Car className="w-16 h-16 opacity-20" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={onToggleStatus}
            title={isMaintenance ? "Ativar Veículo" : "Sinalizar Parada / Manutenção"}
            className={cn(
              "p-2.5 backdrop-blur rounded-xl shadow-lg border transition-all",
              isMaintenance 
                ? "bg-green-500 text-white border-green-400 hover:bg-green-600" 
                : "bg-amber-500 text-white border-amber-400 hover:bg-amber-600"
            )}
          >
            {isMaintenance ? <CheckCircle2 className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="p-2.5 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-white text-primary hover:bg-primary hover:text-white transition-all">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2.5 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-white text-red-500 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={cn(
            "px-3 py-1 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest border",
            isMaintenance ? "bg-amber-600/60 border-amber-400/30" : "bg-black/40 border-white/20"
          )}>
            {vehicle.plate}
          </span>
        </div>
        {isMaintenance && (
          <div className="absolute inset-0 bg-amber-900/10 pointer-events-none flex items-center justify-center">
            <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/20">
              Em Manutenção
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className={cn("text-lg font-black tracking-tight leading-tight", isMaintenance && "text-amber-900")}>
            {vehicle.brand} {vehicle.model}
          </h4>
          <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mt-0.5">{vehicle.color} · {vehicle.year}</p>
        </div>

        {/* Motorista Vinculado */}
        {vehicle.assigned_driver_id && vehicle.assigned_driver_id !== '' ? (
          <div className={cn(
            "flex items-center justify-between p-4 rounded-2xl border",
            isMaintenance ? "bg-amber-100/50 border-amber-200" : "bg-slate-50 border-slate-100"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden",
                isMaintenance ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
              )}>
                {driverInfo?.photo_url ? (
                  <img src={normalizeStorageUrl(driverInfo.photo_url)} alt={driverInfo?.name || 'Motorista'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Motorista</p>
                <p className={cn("font-black text-on-surface", isMaintenance && "text-amber-900")}>
                  {driverInfo?.name || "Carregando..."}
                </p>
              </div>
            </div>
            <button
              onClick={onUnassignDriver}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-black uppercase tracking-wider border border-red-200 shadow-sm"
              title="DESVINCULAR MOTORISTA DESTE VEÍCULO"
            >
              DESVINCULAR
            </button>
          </div>
        ) : (
          <div className={cn(
            "flex items-center gap-2 p-4 rounded-2xl border border-dashed text-on-surface-variant/50",
            isMaintenance ? "border-amber-300 bg-amber-50/50" : "border-slate-300 bg-slate-50"
          )}>
            <User className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">SEM MOTORISTA</span>
            <span className="text-[10px] text-on-surface-variant/30 ml-auto">vinculação via app</span>
          </div>
        )}

        <div className={cn(
          "flex items-center justify-between p-4 rounded-2xl border",
          isMaintenance ? "bg-amber-100/50 border-amber-200" : "bg-slate-50 border-slate-100"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              isMaintenance ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
            )}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Hodômetro</p>
              <p className={cn("font-black text-on-surface", isMaintenance && "text-amber-900")}>
                {(vehicle.current_km ?? 0).toLocaleString()} <span className="text-[10px] opacity-40">KM</span>
              </p>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
            vehicle.status === 'Ativo' ? "bg-green-100 text-green-700" : 
            vehicle.status === 'Manutenção' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
            "bg-slate-100 text-slate-700"
          )}>
            {vehicle.status}
          </div>
        </div>

        <div className={cn("space-y-4 pt-2", isMaintenance && "opacity-50 grayscale")}>
          <FuelProgressBar fuelLevel={vehicle.fuel_level} />
          <MaintenanceProgressBar
            label="Troca de Óleo"
            icon={Droplets}
            current={vehicle.current_km ?? 0}
            target={vehicle.next_oil_change_km ?? (vehicle.current_km ?? 0) + (vehicle.oil_change_interval || 10000)}
            interval={vehicle.oil_change_interval ?? 10000}
            color="bg-primary/10 text-primary"
          />
          <MaintenanceProgressBar
            label="Manutenção Preventiva"
            icon={History}
            current={vehicle.current_km ?? 0}
            target={vehicle.next_revision_km ?? (vehicle.current_km ?? 0) + (vehicle.revision_interval || 20000)}
            interval={vehicle.revision_interval ?? 20000}
            color="bg-secondary/10 text-secondary"
          />
        </div>
        
        {isMaintenance && (
          <button 
            onClick={onToggleStatus}
            className="w-full py-3 bg-white border-2 border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Finalizar Manutenção
          </button>
        )}
      </div>
    </motion.div>
  );
};
// â”€â”€â”€ Página Principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function Vehicles() {
  const [region, setRegion] = useState<Region>('Recife');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [driverMap, setDriverMap] = useState<Record<string, { name: string; photo_url?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'frota' | 'checklists' | 'combustivel'>('frota');

  // â”€â”€ Checklist States â”€â”€
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [checklistSearch, setChecklistSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'problem'>('all');
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // ── Fuel Registration States ──
  const [fuelRegistrations, setFuelRegistrations] = useState<FuelRegistration[]>([]);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [fuelSearch, setFuelSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
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
    const unsub = subscribeToTable('vehicles', { region }, async (data) => {
      setVehicles(data as Vehicle[]);
      
      // Buscar dados dos motoristas vinculados
      const driverIds = (data as Vehicle[]).map(v => v.assigned_driver_id).filter(Boolean) as string[];
      if (driverIds.length > 0) {
        const { data: drivers } = await supabase
          .from('app_users')
          .select('id, name, photo_url')
          .in('id', driverIds);
        const map: Record<string, { name: string; photo_url?: string }> = {};
        drivers?.forEach(d => {
          map[d.id] = { name: d.name, photo_url: d.photo_url };
        });
        setDriverMap(map);
      } else {
        setDriverMap({});
      }
      setLoading(false);
    });
    return () => unsub();
  }, [region]);

  // â”€â”€ Subscription de Checklists â”€â”€
  useEffect(() => {
    setChecklistLoading(true);
    const unsub = subscribeToTable('vehicle_checklists', { region }, (data) => {
      setChecklists(data);
      setChecklistLoading(false);
    }, 'created_at', false);
    return () => unsub();
  }, [region]);

  // ── Subscription de Fuel Registrations ──
  useEffect(() => {
    setFuelLoading(true);
    const unsub = subscribeToTable('fuel_registrations', { region }, (data) => {
      setFuelRegistrations(data);
      setFuelLoading(false);
    }, 'created_at', false);
    return () => unsub();
  }, [region]);

  // ── Polling Backup para Vehicles (V1 → V2 realtime fallback) ──
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('region', region)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
          setVehicles(data as Vehicle[]);
          // Atualizar driver map também
          const driverIds = (data as Vehicle[]).map(v => v.assigned_driver_id).filter(Boolean) as string[];
          if (driverIds.length > 0) {
            const { data: drivers } = await supabase
              .from('app_users')
              .select('id, name, photo_url')
              .in('id', driverIds);
            const map: Record<string, { name: string; photo_url?: string }> = {};
            drivers?.forEach(d => { map[d.id] = { name: d.name, photo_url: d.photo_url }; });
            setDriverMap(map);
          } else {
            setDriverMap({});
          }
        }
      } catch (e) {
        console.error('[Polling] Erro ao buscar vehicles:', e);
      }
    }, 15000); // a cada 15 segundos
    return () => clearInterval(interval);
  }, [region]);

  const filteredFuelRegistrations = useMemo(() => {
    return fuelRegistrations.filter(f => {
      const matchesSearch = f.vehicle_name.toLowerCase().includes(fuelSearch.toLowerCase()) ||
                           f.vehicle_plate.toLowerCase().includes(fuelSearch.toLowerCase());
      return matchesSearch;
    });
  }, [fuelRegistrations, fuelSearch]);

  const fuelStats = useMemo(() => ({
    total: fuelRegistrations.length,
    totalValue: fuelRegistrations.reduce((acc, f) => acc + (f.total_value || 0), 0),
    totalVolume: fuelRegistrations.reduce((acc, f) => acc + (f.volume || 0), 0),
    today: fuelRegistrations.filter(f => new Date(f.created_at).toDateString() === new Date().toDateString()).length,
  }), [fuelRegistrations]);

  const filteredChecklists = useMemo(() => {
    return checklists.filter(c => {
      const matchesSearch = c.vehicle.toLowerCase().includes(checklistSearch.toLowerCase()) ||
                           (c.driver_name && c.driver_name.toLowerCase().includes(checklistSearch.toLowerCase()));
      const matchesStatus = filterStatus === 'all' ? true : c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [checklists, checklistSearch, filterStatus]);

  const checklistStats = useMemo(() => ({
    total: checklists.length,
    ok: checklists.filter(c => c.status === 'ok').length,
    problem: checklists.filter(c => c.status === 'problem').length,
    today: checklists.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length,
  }), [checklists]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vehicles, searchQuery]);

  const stats = useMemo(() => ({
    total: vehicles.length,
    maintenance: vehicles.filter(v => v.status === 'Manutenção').length,
  }), [vehicles]);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente remover este veículo da frota?')) {
      await deleteRow('vehicles', id);
    }
  };

  const handleToggleStatus = async (vehicle: Vehicle) => {
    const newStatus = vehicle.status === 'Manutenção' ? 'Ativo' : 'Manutenção';
    const confirmMsg = newStatus === 'Manutenção' 
      ? `Deseja sinalizar parada para o veículo ${vehicle.brand} ${vehicle.model}? Ele ficará indisponível para os motoristas.`
      : `Deseja finalizar a manutenção do veículo ${vehicle.brand} ${vehicle.model} e torná-lo ativo novamente?`;

    if (confirm(confirmMsg)) {
      try {
        await updateRow('vehicles', vehicle.id, { status: newStatus });
      } catch (error) {
        console.error('Erro ao atualizar status do veículo:', error);
        alert('Erro ao atualizar status do veículo.');
      }
    }
  };

  const handleUnassignDriver = async (vehicle: Vehicle) => {
    if (!vehicle.assigned_driver_id) return;

    if (confirm(`Deseja desvincular o motorista deste veículo ${vehicle.brand} ${vehicle.model}? O veículo ficará disponível para outros motoristas. Se o motorista tiver uma viagem ativa no módulo V1, ela será finalizada forçadamente e o motorista será deslogado automaticamente.`)) {
      try {
        console.log('[Vehicles] Iniciando desvinculação do veículo:', vehicle.id, 'Motorista:', vehicle.assigned_driver_id);

        // 1. Forçar finalização de viagem ativa no V1 (routes/route_points)
        try {
          console.log('[Vehicles] Buscando rotas ativas para o motorista:', vehicle.assigned_driver_id);
          const { data: activeRoutes, error: routesError } = await supabase
            .from('routes')
            .select('id, driver_id')
            .eq('driver_id', vehicle.assigned_driver_id)
            .is('completed_at', null);

          if (routesError) {
            console.error('[Vehicles] Erro ao buscar rotas ativas:', routesError);
          } else {
            console.log('[Vehicles] Rotas ativas encontradas:', activeRoutes?.length || 0, activeRoutes);

            if (activeRoutes && activeRoutes.length > 0) {
              console.log('[Vehicles] Forçando finalização de', activeRoutes.length, 'rota(s) ativa(s)');
              
              // Marcar rota como finalizada
              const { error: updateRoutesError } = await supabase
                .from('routes')
                .update({ completed_at: new Date().toISOString() })
                .in('id', activeRoutes.map(r => r.id));
              
              if (updateRoutesError) {
                console.error('[Vehicles] Erro ao atualizar routes:', updateRoutesError);
              } else {
                console.log('[Vehicles] Routes atualizadas com sucesso');
              }

              // Marcar todos os pontos da rota como completados
              const { error: updatePointsError } = await supabase
                .from('route_points')
                .update({ status: 'completed' })
                .in('route_id', activeRoutes.map(r => r.id));
              
              if (updatePointsError) {
                console.error('[Vehicles] Erro ao atualizar route_points:', updatePointsError);
              } else {
                console.log('[Vehicles] Route points atualizados com sucesso');
              }
            }
          }
        } catch (routeError: any) {
          console.error('[Vehicles] Erro ao finalizar rota no V1:', routeError);
          console.error('[Vehicles] Stack:', routeError.stack);
        }

        // 2. Forçar logout do motorista (revogar sessão)
        try {
          console.log('[Vehicles] Revogando sessão do motorista:', vehicle.assigned_driver_id);
          const { error: logoutError } = await supabase
            .from('app_users')
            .update({ session_revoked: true, vehicle: null })
            .eq('id', vehicle.assigned_driver_id);
          
          if (logoutError) {
            console.error('[Vehicles] Erro ao revogar sessão:', logoutError);
          } else {
            console.log('[Vehicles] Motorista marcado para logout forçado com sucesso');
          }
        } catch (logoutError: any) {
          console.error('[Vehicles] Erro ao marcar logout forçado:', logoutError);
        }

        // 3. Desvincular motorista do veículo no V2 (liberar para V1)
        console.log('[Vehicles] Desvinculando motorista do veículo:', vehicle.id);
        try {
          await updateRow('vehicles', vehicle.id, {
            assigned_driver_id: null,
            driver_name: null,
            status: 'available'
          });
          console.log('[Vehicles] Motorista desvinculado e veículo liberado:', vehicle.id);
        } catch (updateError: any) {
          console.error('[Vehicles] Erro ao desvincular veículo:', updateError);
          throw updateError;
        }

        // Sucesso
        console.log('[Vehicles] Desvinculação concluída com sucesso!');
      } catch (error: any) {
        console.error('[Vehicles] Erro ao desvincular motorista:', error);
        console.error('[Vehicles] Stack:', error.stack);
        alert('Erro ao desvincular motorista. Verifique o console para mais detalhes.');
      }
    }
  };

  const handleAssignDriver = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowAssignModal(true);

    // Buscar motoristas disponíveis (sem veículo)
    try {
      const { data: drivers } = await supabase
        .from('app_users')
        .select('id, name, photo_url, role, vehicle')
        .eq('role', 'motorista')
        .or('vehicle.is.null,vehicle.eq.\'\'');
      
      // Safety net: excluir motoristas que já têm veículo (string não-vazia)
      const trulyAvailable = (drivers || []).filter((d: any) => !d.vehicle || d.vehicle === '' || d.vehicle === 'null');
      setAvailableDrivers(trulyAvailable);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
    }
  };

  const handleConfirmAssignDriver = async (driverId: string) => {
    if (!selectedVehicle) return;

    try {
      // Vincular motorista ao veículo
      await updateRow('vehicles', selectedVehicle.id, { assigned_driver_id: driverId });
      
      // Atualizar veículo do motorista
      await supabase
        .from('app_users')
        .update({ vehicle: selectedVehicle.id })
        .eq('id', driverId);

      setShowAssignModal(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Erro ao vincular motorista:', error);
      alert('Erro ao vincular motorista.');
    }
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Gestão de Frota</h2>
          </div>
          <p className="text-on-surface-variant font-medium">Controle de manutenção e inventário de veículos da rede.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-2xl flex">
            {(['Recife', 'Salvador'] as Region[]).map(r => (
              <button 
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "px-6 py-2.5 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all",
                  region === r ? "bg-white text-primary shadow-sm" : "text-on-surface-variant opacity-60 hover:opacity-100"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ Barra de Abas â”€â”€ */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('frota')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-[14px] text-sm font-black uppercase tracking-wider transition-all",
            activeTab === 'frota' 
              ? "bg-white text-primary shadow-md" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
          )}
        >
          <Car className="w-4 h-4" />
          Frota
        </button>
        <button
          onClick={() => setActiveTab('checklists')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-[14px] text-sm font-black uppercase tracking-wider transition-all",
            activeTab === 'checklists' 
              ? "bg-white text-primary shadow-md" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
          )}
        >
          <ClipboardCheck className="w-4 h-4" />
          Checklists
          {checklistStats.problem > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">
              {checklistStats.problem}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('combustivel')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-[14px] text-sm font-black uppercase tracking-wider transition-all",
            activeTab === 'combustivel' 
              ? "bg-white text-primary shadow-md" 
              : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
          )}
        >
          <Fuel className="w-4 h-4" />
          Combustível
        </button>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* â•â• ABA FROTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'frota' && (
        <>
          {/* Header da Frota */}
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por placa ou modelo..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-primary text-white font-black text-xs uppercase tracking-[0.15em] px-8 py-4 rounded-[20px] shadow-xl shadow-primary/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Adicionar Veículo
            </button>
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Frota Total</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-primary leading-none">{stats.total}</span>
                <span className="text-xs font-bold text-primary/60 mb-1">VEÍCULOS</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-6">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Atenção Manutenção</p>
              <div className="flex items-end gap-3">
                <span className={cn("text-5xl font-black leading-none", stats.maintenance > 0 ? "text-amber-600" : "text-on-surface-variant/40")}>
                  {stats.maintenance}
                </span>
                <span className="text-xs font-bold text-amber-600/60 mb-1">UNIDADES</span>
              </div>
            </div>

            <div className="bg-slate-500/5 border border-slate-500/10 rounded-[32px] p-6 col-span-2 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Documentação e Seguros</p>
                <p className="text-sm font-bold">Todos os veículos em dia</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Grid de Veículos */}
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Sincronizando Frota...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200">
              <Car className="w-16 h-16 text-on-surface-variant/20 mx-auto mb-4" />
              <p className="text-on-surface-variant font-bold">Nenhum veículo encontrado para esta pesquisa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map(vehicle => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  driverInfo={vehicle.assigned_driver_id ? driverMap[vehicle.assigned_driver_id] : undefined}
                  onEdit={() => setEditingVehicle(vehicle)}
                  onDelete={() => handleDelete(vehicle.id)}
                  onToggleStatus={() => handleToggleStatus(vehicle)}
                  onUnassignDriver={vehicle.assigned_driver_id ? () => handleUnassignDriver(vehicle) : () => handleAssignDriver(vehicle)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* â•â• ABA CHECKLISTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'checklists' && (
        <>
          {/* Filtros dos Checklists */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar por veículo ou motorista..."
                value={checklistSearch}
                onChange={(e) => setChecklistSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              {(['all', 'ok', 'problem'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-5 py-3 rounded-[14px] font-black text-xs uppercase tracking-wider transition-all",
                    filterStatus === status
                      ? status === 'problem' ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-100 text-on-surface-variant hover:bg-slate-200"
                  )}
                >
                  {status === 'all' ? 'Todos' : status === 'ok' ? 'OK' : 'Problemas'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats dos Checklists */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <span className="text-3xl font-black text-primary">{checklistStats.total}</span>
              </div>
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">Total Checklists</p>
            </div>
            
            <div className="bg-green-500/5 border border-green-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-3xl font-black text-green-600">{checklistStats.ok}</span>
              </div>
              <p className="text-[10px] font-black text-green-600/60 uppercase tracking-[0.2em]">Sem Problemas</p>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-3xl font-black text-red-600">{checklistStats.problem}</span>
              </div>
              <p className="text-[10px] font-black text-red-600/60 uppercase tracking-[0.2em]">Com Problemas</p>
            </div>
            
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-3xl font-black text-amber-600">{checklistStats.today}</span>
              </div>
              <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-[0.2em]">Hoje</p>
            </div>
          </div>

          {/* Tabela de Checklists */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Status</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Veículo</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">KM</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Itens Verificados</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Fotos</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Data</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {checklistLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Carregando checklists...</p>
                      </td>
                    </tr>
                  ) : filteredChecklists.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <ClipboardCheck className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                        <p className="text-on-surface-variant font-bold">Nenhum checklist encontrado.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredChecklists.map((checklist) => (
                      <tr key={checklist.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
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
                          <p className="font-bold text-on-surface">{checklist.km.toLocaleString()} km</p>
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
                            <span className="text-sm font-bold">{checklist.photos?.length || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-on-surface">
                            {new Date(checklist.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/60 font-bold">
                            {new Date(checklist.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedChecklist(checklist);
                              setCurrentPhotoIndex(0);
                            }}
                            className="text-primary font-black text-xs uppercase tracking-wider hover:underline"
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
        </>
      )}

      {/* ══ ABA COMBUSTÍVEL ══ */}
      {activeTab === 'combustivel' && (
        <>
          {/* Filtros de Combustível */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Buscar por veículo ou placa..."
                value={fuelSearch}
                onChange={(e) => setFuelSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Stats de Combustível */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Fuel className="w-5 h-5 text-primary" />
                </div>
                <span className="text-3xl font-black text-primary">{fuelStats.total}</span>
              </div>
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">Total Registros</p>
            </div>
            <div className="bg-green-500/5 border border-green-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-2xl font-black text-green-600">{fuelStats.totalVolume.toFixed(1)}L</span>
              </div>
              <p className="text-[10px] font-black text-green-600/60 uppercase tracking-[0.2em]">Volume Total</p>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-amber-600">R$ {fuelStats.totalValue.toFixed(2)}</span>
              </div>
              <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-[0.2em]">Valor Total</p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-3xl font-black text-blue-600">{fuelStats.today}</span>
              </div>
              <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-[0.2em]">Hoje</p>
            </div>
          </div>

          {/* Tabela de Registros */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Nível</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Veículo</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">KM</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Volume</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Valor</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">R$/L</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Comprovante</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fuelLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Carregando registros...</p>
                      </td>
                    </tr>
                  ) : filteredFuelRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <Fuel className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-3" />
                        <p className="text-on-surface-variant font-bold">Nenhum registro de combustível encontrado.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredFuelRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              reg.fuel_level >= 75 ? "bg-green-100 text-green-600" :
                              reg.fuel_level >= 50 ? "bg-amber-100 text-amber-600" :
                              reg.fuel_level >= 25 ? "bg-orange-100 text-orange-600" :
                              "bg-red-100 text-red-600"
                            )}>
                              <Fuel className="w-4 h-4" />
                            </div>
                            <span className="font-black text-sm">{reg.fuel_status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{reg.vehicle_name}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold">{reg.vehicle_plate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{reg.km ? reg.km.toLocaleString() + ' km' : '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{reg.volume ? reg.volume.toFixed(1) + ' L' : '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{reg.total_value ? 'R$ ' + reg.total_value.toFixed(2) : '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{reg.price_per_liter ? 'R$ ' + reg.price_per_liter.toFixed(2) : '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          {reg.receipt_url ? (
                            <button
                              onClick={() => setSelectedReceipt(reg.receipt_url)}
                              className="text-primary font-black text-xs uppercase tracking-wider hover:underline"
                            >
                              Ver Foto
                            </button>
                          ) : (
                            <span className="text-on-surface-variant/40 text-xs font-bold">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-on-surface">
                            {new Date(reg.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/60 font-bold">
                            {new Date(reg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Comprovante */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full"
            >
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={normalizeStorageUrl(selectedReceipt)}
                alt="Comprovante de abastecimento"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â•â•â• Modal de Detalhes do Checklist â•â•â• */}
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
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    selectedChecklist.status === 'ok' ? "bg-green-100" : "bg-red-100"
                  )}>
                    {selectedChecklist.status === 'ok' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Checklist {selectedChecklist.vehicle}</h3>
                    <p className="text-xs text-on-surface-variant font-bold">
                      {new Date(selectedChecklist.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChecklist(null)}
                  className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* KM */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Quilometragem</p>
                    <p className="text-xl font-black">{selectedChecklist.km.toLocaleString()} km</p>
                  </div>
                </div>

                {/* Check Items */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] mb-3">Itens Verificados</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedChecklist.checks).map(([item, status]) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-2xl",
                          status === 'ok' ? "bg-green-50" : "bg-red-50"
                        )}
                      >
                        {status === 'ok' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={cn(
                          "font-bold",
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
                    <h4 className="text-xs font-black uppercase tracking-[0.15em] mb-3">Fotos do Veículo</h4>
                    <div className="relative">
                      <div 
                        className="aspect-video rounded-2xl overflow-hidden bg-slate-100 cursor-pointer"
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
                            onClick={() => setCurrentPhotoIndex(i => i > 0 ? i - 1 : selectedChecklist.photos.length - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setCurrentPhotoIndex(i => i < selectedChecklist.photos.length - 1 ? i + 1 : 0)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <div className="flex justify-center gap-2 mt-3">
                        {selectedChecklist.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPhotoIndex(idx)}
                            className={cn(
                              "w-2.5 h-2.5 rounded-full transition-all",
                              idx === currentPhotoIndex ? "bg-primary scale-125" : "bg-slate-300"
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
                    <h4 className="text-xs font-black uppercase tracking-[0.15em] mb-3">Observações</h4>
                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-800 font-medium">
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

      {/* â•â•â• Modal de Cadastro/Edição de Veículo â•â•â• */}
      <AnimatePresence>
        {(isAdding || editingVehicle) && (
          <VehicleFormModal
            key={editingVehicle?.id || 'new-vehicle'}
            region={region}
            vehicle={editingVehicle || undefined}
            onClose={() => {
              setIsAdding(false);
              setEditingVehicle(null);
            }}
            onSave={(savedData) => {
              setVehicles(prev => {
                const idx = prev.findIndex(v => v.id === savedData.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = savedData as Vehicle;
                  return next;
                }
                return [savedData as Vehicle, ...prev];
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* â•â•â• Modal de Vinculação de Motorista â•â•â• */}
      <AnimatePresence>
        {showAssignModal && selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Vincular Motorista</h3>
                    <p className="text-xs text-on-surface-variant">
                      {selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.plate}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAssignModal(false)} 
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {availableDrivers.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Nenhum motorista disponível</p>
                    <p className="text-sm mt-1">Todos os motoristas já estão vinculados a veículos.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableDrivers.map(driver => (
                      <button
                        key={driver.id}
                        onClick={() => handleConfirmAssignDriver(driver.id)}
                        className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {driver.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-on-surface">{driver.name}</p>
                          <p className="text-xs text-on-surface-variant">Motorista</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-on-surface-variant/30" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
