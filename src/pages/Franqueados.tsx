import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Edit2, Trash2, ChevronDown, Search, Plus, X, Save, Loader2, Trash, Link, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase, subscribeToTable, insertRow, updateRow, deleteRow, setFranchiseePassword } from '@/supabase';

// ─── Estados do Brasil ───────────────────────────────────────────────────────
const BRASIL_ESTADOS = [
  { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' }, { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Pará' }, { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' }, { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' }, { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' }, { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
];

// ─── Hook para buscar municípios via IBGE ────────────────────────────────────
function useCidades(uf: string) {
  const [cidades, setCidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!uf) { setCidades([]); return; }
    setLoading(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(r => r.json())
      .then((data: { nome: string }[]) => {
        setCidades(data.map(d => d.nome));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uf]);
  return { cidades, loading };
}


// ─── Tipos ───────────────────────────────────────────────────────────────────
interface DeliveryPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
  region?: 'Recife' | 'Salvador';
}

interface Franchisee {
  id: string;
  name: string;
  phone: string;
  points: DeliveryPoint[];
  region: 'Recife' | 'Salvador';
  initials: string;
  uf?: string;
  city?: string;
  state?: string;
  email?: string;
}

interface Activity {
  id: string;
  type: 'registration' | 'update' | 'activation';
  title: string;
  description: string;
  time: string;
}

// ─── Dados Mock ──────────────────────────────────────────────────────────────
const MOCK_FRANCHISEES: Franchisee[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+55 81 99999-0000',
    region: 'Recife',
    initials: 'JS',
    points: [
      { id: 'p1', name: 'Unidade Boa Viagem - Quiosque A', city: 'Recife', uf: 'PE' },
      { id: 'p2', name: 'Ponto de Venda Shopping Recife', city: 'Recife', uf: 'PE' },
    ]
  },
  {
    id: '2',
    name: 'Maria Freitas',
    phone: '+55 71 98888-1111',
    region: 'Salvador',
    initials: 'MF',
    points: [
      { id: 'p3', name: 'Unidade Barra', city: 'Salvador', uf: 'BA' },
    ]
  },
  {
    id: '3',
    name: 'Ricardo Souza',
    phone: '+55 81 97777-2222',
    region: 'Recife',
    initials: 'RS',
    points: [
      { id: 'p4', name: 'Unidade Piedade', city: 'Jaboatão', uf: 'PE' },
      { id: 'p5', name: 'Unidade Olinda', city: 'Olinda', uf: 'PE' },
    ]
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'registration', title: 'Novo Ponto Cadastrado', description: "JS Salgados adicionou 'Loja Shopping'", time: 'HÁ 12 MINUTOS' },
  { id: 'a2', type: 'update', title: 'Alteração de Contato', description: 'Rede Sul atualizou telefone principal', time: 'HÁ 2 HORAS' },
  { id: 'a3', type: 'activation', title: 'Franqueado Ativado', description: 'Alimentos Freitas validou contrato', time: 'HÁ 5 HORAS' },
];

// ─── Modal de Edição de Ponto ────────────────────────────────────────────────
interface EditPointModalProps {
  point: DeliveryPoint;
  onSave: (updated: DeliveryPoint) => void;
  onClose: () => void;
  isNew?: boolean;
  franchiseeRegion?: 'Recife' | 'Salvador';
}

const EditPointModal: React.FC<EditPointModalProps> = ({ point, onSave, onClose, isNew = false, franchiseeRegion }) => {
  const [form, setForm] = useState({ ...point, region: point.region || franchiseeRegion || ('Recife' as 'Recife' | 'Salvador') });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      onMouseDown={onClose}
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {isNew ? <Plus className="w-5 h-5 text-primary" /> : <Edit2 className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <h3 className="text-lg font-bold">{isNew ? 'Adicionar Ponto de Entrega' : 'Editar Ponto de Entrega'}</h3>
              <p className="text-xs text-on-surface-variant">{isNew ? 'Novo ponto para este franqueado' : 'Atualize os dados do ponto'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Nome do Ponto</label>
            <input
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Cidade</label>
              <input
                value={form.city}
                onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">UF</label>
              <input
                value={form.uf}
                onChange={(e) => setForm(f => ({ ...f, uf: e.target.value }))}
                maxLength={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Região de Entrega</label>
            <p className="text-[10px] text-on-surface-variant mb-1">Define qual operação recebe os pedidos e e-mails deste ponto.</p>
            <div className="flex gap-2">
              {(['Recife', 'Salvador'] as const).map(r => (
                <button key={r} type="button"
                  onClick={() => setForm(f => ({ ...f, region: r }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${
                    form.region === r ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-500 hover:border-primary/40'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── FranchiseeCard ──────────────────────────────────────────────────────────
interface FranchiseeCardProps {
  franchisee: Franchisee;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdatePoints: (franchiseeId: string, updatedPoints: DeliveryPoint[]) => void;
  onDeleteFranchisee: (id: string) => void;
  onEditFranchisee: (franchisee: Franchisee) => void;
}

const FranchiseeCard: React.FC<FranchiseeCardProps> = ({ franchisee, isExpanded, onToggle, onUpdatePoints, onDeleteFranchisee, onEditFranchisee }) => {
  const [editingPoint, setEditingPoint] = useState<DeliveryPoint | null>(null);
  const [deletingPointId, setDeletingPointId] = useState<string | null>(null);

  const handleSavePoint = (updated: DeliveryPoint) => {
    const exists = franchisee.points.find(p => p.id === updated.id);
    const newPoints = exists 
      ? franchisee.points.map(p => p.id === updated.id ? updated : p)
      : [...franchisee.points, updated];
      
    onUpdatePoints(franchisee.id, newPoints);
    setEditingPoint(null);
  };

  const handleDeletePoint = (pointId: string) => {
    const newPoints = franchisee.points.filter(p => p.id !== pointId);
    onUpdatePoints(franchisee.id, newPoints);
    setDeletingPointId(null);
  };

  return (
    <>
      <div className={`bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border-l-4 transition-all ${isExpanded ? 'border-primary' : 'border-transparent hover:border-outline-variant/30'}`}>
        <div
          onClick={onToggle}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-container-lowest/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
              {franchisee.initials}
            </div>
            <div>
              <h4 className="font-bold text-on-surface">{franchisee.name}</h4>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {franchisee.region}
                </span>
                {franchisee.phone && (
                  <span className="flex items-center gap-1">
                    {franchisee.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onEditFranchisee(franchisee); }}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                title="Editar Franqueado"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteFranchisee(franchisee.id); }}
                className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Excluir Franqueado"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <span className="text-[10px] block font-bold text-on-surface-variant uppercase">Pontos</span>
              <span className={`text-lg font-black ${isExpanded ? 'text-primary' : 'text-on-surface-variant'}`}>
                {franchisee.points.length.toString().padStart(2, '0')}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-surface-container p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-on-surface flex items-center gap-2">
                  <Link className="w-4 h-4 text-primary" /> Pontos de Entrega Logística
                </h5>
                <button 
                  onClick={() => setEditingPoint({ id: crypto.randomUUID(), name: '', city: franchisee.city || '', uf: franchisee.uf || '', region: franchisee.region, isNew: true } as any)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Adicionar Ponto
                </button>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest rounded-xl p-4">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Telefone</p>
                  <p className="font-bold text-sm text-on-surface">{franchisee.phone}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-4">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Região</p>
                  <p className="font-bold text-sm text-on-surface">{franchisee.city || '—'}, {franchisee.uf || '—'}</p>
                </div>
              </div>

              {/* Lista de Pontos */}
              <div className="space-y-2">
                {franchisee.points.map(point => (
                  <div key={point.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl hover:translate-x-1 transition-transform cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-10 bg-secondary rounded-full"></div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">{point.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[11px] text-on-surface-variant">{point.city}, {point.uf}</p>
                          {point.region && point.region !== franchisee.region && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase tracking-wider">{point.region}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Botão Google Maps */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.name + ', ' + point.city + ', ' + point.uf)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-colors"
                        title="Ver no Google Maps"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapPin className="w-4 h-4" />
                      </a>

                      {/* Botão Editar */}
                      <button
                        className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Editar ponto"
                        onClick={(e) => { e.stopPropagation(); setEditingPoint(point); }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* Botão Excluir */}
                      <button
                        className="p-2 rounded-lg text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Excluir ponto"
                        onClick={(e) => { e.stopPropagation(); setDeletingPointId(point.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {franchisee.points.length === 0 && (
                  <p className="text-center text-sm text-on-surface-variant py-6">Nenhum ponto cadastrado.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Edição */}
      <AnimatePresence>
        {editingPoint && (
          <EditPointModal
            point={editingPoint}
            onSave={handleSavePoint}
            onClose={() => setEditingPoint(null)}
            isNew={!(editingPoint as any).name}
            franchiseeRegion={franchisee.region}
          />
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {deletingPointId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onMouseDown={() => setDeletingPointId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Tem certeza que deseja remover este ponto de entrega? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingPointId(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeletePoint(deletingPointId)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Página Principal ────────────────────────────────────────────────────────
// ─── Tipo para pontos no formulário ─────────────────────────────────────────
interface FormPoint {
  id: string;
  name: string;
  city: string;
  uf: string;
  region: 'Recife' | 'Salvador';
}

const emptyPoint = (region: 'Recife' | 'Salvador' = 'Recife'): FormPoint => ({ id: crypto.randomUUID(), name: '', city: '', uf: '', region });

// ─── Sub-componente: linha de ponto com selects de Estado/Cidade ─────────────
interface PointFormRowProps {
  pt: FormPoint;
  idx: number;
  canRemove: boolean;
  onRemove: () => void;
  onChangeName: (v: string) => void;
  onChangeUf: (uf: string) => void;
  onChangeCity: (city: string) => void;
  onChangeRegion: (r: 'Recife' | 'Salvador') => void;
}

const PointFormRow: React.FC<PointFormRowProps> = ({ pt, idx, canRemove, onRemove, onChangeName, onChangeUf, onChangeCity, onChangeRegion }) => {
  const { cidades, loading: loadingCidades } = useCidades(pt.uf);

  const handleUfChange = (uf: string) => {
    onChangeUf(uf);
    onChangeCity(''); // reset cidade ao trocar estado
  };

  return (
    <div className="bg-surface-container rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-primary uppercase">Ponto {idx + 1}</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="p-1 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Nome do Ponto */}
      <div>
        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Nome do Ponto *</label>
        <input
          value={pt.name}
          onChange={e => onChangeName(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-2.5 px-3 outline-none"
          placeholder="Ex: Quiosque Shopping Center"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Estado */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Estado</label>
          <div className="relative">
            <select
              value={pt.uf}
              onChange={e => handleUfChange(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-2.5 px-3 outline-none pr-8 cursor-pointer"
            >
              <option value="">Estado...</option>
              {BRASIL_ESTADOS.map(s => (
                <option key={s.uf} value={s.uf}>{s.uf} — {s.nome}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">
            Cidade {loadingCidades && <span className="normal-case font-normal text-on-surface-variant/60">(carregando...)</span>}
          </label>
          <div className="relative">
            {loadingCidades ? (
              <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 px-3 flex items-center gap-2 text-sm text-on-surface-variant">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...
              </div>
            ) : (
              <>
                <select
                  value={pt.city}
                  onChange={e => onChangeCity(e.target.value)}
                  disabled={!pt.uf || cidades.length === 0}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-2.5 px-3 outline-none pr-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{pt.uf ? 'Selecione...' : 'Primeiro o estado'}</option>
                  {cidades.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Região de Entrega */}
      <div>
        <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Região de Entrega</label>
        <div className="flex gap-2">
          {(['Recife', 'Salvador'] as const).map(r => (
            <button key={r} type="button"
              onClick={() => onChangeRegion(r)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                pt.region === r ? 'bg-primary text-white border-primary' : 'border-outline-variant/30 text-slate-500 hover:border-primary/40'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Franqueados() {
  const [region, setRegion] = useState<'Recife' | 'Salvador'>('Recife');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingFranchisee, setIsAddingFranchisee] = useState(false);
  const [expandedFranchisee, setExpandedFranchisee] = useState<string | null>(null);
  const [franchisees, setFranchisees] = useState<Franchisee[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingFranchisee, setEditingFranchisee] = useState<Franchisee | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', uf: '', city: '', region: 'Recife' as 'Recife' | 'Salvador' });
  const [editPoints, setEditPoints] = useState<DeliveryPoint[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [deletingFranchiseeId, setDeletingFranchiseeId] = useState<string | null>(null);
  const { cidades: editCidades, loading: loadingEditCidades } = useCidades(editForm.uf);

  // Supabase Sync - Filtra franqueados por região
  useEffect(() => {
    const unsubscribe = subscribeToTable('franchisees', { region }, (data) => {
      const normalized = data.map((f: any) => ({
        ...f,
        points: Array.isArray(f.points) ? f.points : [],
        initials: f.initials || f.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??',
      }));
      setFranchisees(normalized as Franchisee[]);
    });
    return () => unsubscribe();
  }, [region]);

  // Estado do formulário de cadastro
  const [formUf, setFormUf] = useState('');
  const [formCity, setFormCity] = useState('');
  const { cidades, loading: loadingCidades } = useCidades(formUf);

  // Pontos no formulário de cadastro
  const [formPoints, setFormPoints] = useState<FormPoint[]>([emptyPoint()]);

  const addFormPoint = () => setFormPoints(pts => [...pts, emptyPoint(region)]);
  const removeFormPoint = (id: string) => setFormPoints(pts => pts.filter(p => p.id !== id));
  const updateFormPoint = (id: string, field: keyof FormPoint, value: string) =>
    setFormPoints(pts => pts.map(p => p.id === id ? { ...p, [field]: value } : p));

  const filteredFranchisees = useMemo(() => {
    return franchisees.filter(f =>
      f.region === region &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [franchisees, region, searchQuery]);

  const totalPoints = useMemo(() => {
    return franchisees.reduce((acc, f) => acc + f.points.length, 0);
  }, [franchisees]);

  const handleAddFranchisee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get('name') as string;
    const password = formData.get('password') as string;
    const estadoSelecionado = BRASIL_ESTADOS.find(s => s.uf === formUf);
    
    if (!nome || !password || password.length < 6) {
      alert("Nome e senha são obrigatórios (mínimo 6 caracteres).");
      return;
    }

    // Email interno único (obrigatório pelo schema, não usado para login)
    const sanitizedName = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const internalEmail = `${sanitizedName}.${Date.now()}@franquia.domempada.app`;

    // Validar pontos: pelo menos o nome é obrigatório
    const validPoints = formPoints.filter(p => p.name.trim() !== '');

    setSaving(true);
    try {
      // 1. Criar perfil em app_users com senha (para login no V3)
      await insertRow('app_users', {
        name: nome,
        email: internalEmail,
        role: 'franqueado',
        region,
        phone: formData.get('phone') as string,
        status: 'Ativo',
        password,
      });

      const finalPoints = validPoints.map(p => ({ ...p, id: crypto.randomUUID() }));
      const initials = nome.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

      // 2. Criar registro na tabela franchisees e capturar o registro retornado
      const newRow = await insertRow('franchisees', {
        name: nome,
        phone: formData.get('phone') as string,
        region: region,
        initials,
        uf: formUf,
        city: formCity,
        state: estadoSelecionado?.nome || '',
        points: finalPoints,
      });

      // Adiciona imediatamente ao estado local (sem esperar o Realtime)
      if (newRow) {
        const newFranchisee: Franchisee = {
          ...newRow,
          points: Array.isArray(newRow.points) ? newRow.points : finalPoints,
          initials: newRow.initials || initials,
        };
        setFranchisees(prev => [newFranchisee, ...prev]);
      }

      setIsAddingFranchisee(false);
      setFormUf('');
      setFormCity('');
      setFormPoints([emptyPoint()]);
    } catch (error: any) {
      console.error("Erro ao cadastrar franqueado:", error);
      alert(error.message || "Não foi possível salvar o franqueado.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePoints = async (franchiseeId: string, updatedPoints: DeliveryPoint[]) => {
    // Atualiza imediatamente no estado local (sem esperar Realtime)
    setFranchisees(prev =>
      prev.map(f => f.id === franchiseeId ? { ...f, points: updatedPoints } : f)
    );
    try {
      await updateRow('franchisees', franchiseeId, { points: updatedPoints });
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error);
    }
  };

  const handleDeleteFranchisee = (id: string) => {
    setDeletingFranchiseeId(id);
  };

  const confirmDeleteFranchisee = async () => {
    if (!deletingFranchiseeId) return;
    const id = deletingFranchiseeId;
    setDeletingFranchiseeId(null);
    // Remove imediatamente do estado local (sem precisar recarregar)
    setFranchisees(prev => prev.filter(f => f.id !== id));
    try {
      await deleteRow('franchisees', id);
    } catch (error) {
      console.error("Erro ao excluir franqueado:", error);
      // Em caso de erro, recarrega ao receber update do realtime
    }
  };

  const handleOpenEditFranchisee = (f: Franchisee) => {
    setEditingFranchisee(f);
    setEditForm({ name: f.name, phone: f.phone || '', uf: f.uf || '', city: f.city || '', region: f.region || 'Recife' });
    setEditPoints(Array.isArray(f.points) ? f.points : []);
    setNewPassword('');
    setShowNewPass(false);
  };

  const handleResetPassword = async () => {
    if (!editingFranchisee || !newPassword || newPassword.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setSavingPass(true);
    try {
      await setFranchiseePassword(editingFranchisee.name, newPassword);
      alert('Senha redefinida com sucesso!');
      setNewPassword('');
    } catch (err: any) {
      alert(err.message || 'Erro ao redefinir senha.');
    } finally {
      setSavingPass(false);
    }
  };

  const handleSaveEditFranchisee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFranchisee) return;
    try {
      const estadoSelecionado = BRASIL_ESTADOS.find(s => s.uf === editForm.uf);
      await updateRow('franchisees', editingFranchisee.id, {
        name: editForm.name,
        phone: editForm.phone,
        uf: editForm.uf,
        city: editForm.city,
        region: editForm.region,
        state: estadoSelecionado?.nome || '',
        initials: editForm.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        points: editPoints,
      });
      setEditingFranchisee(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar.');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Rede de Franqueados</h2>
          <p className="text-on-surface-variant mt-1">Gerencie parceiros, contratos e pontos de distribuição regional.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex items-center bg-surface-container px-4 py-2 rounded-full w-56">
            <Search className="w-4 h-4 mr-2 text-on-surface-variant" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant outline-none"
              placeholder="Buscar franqueado..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Region Toggle */}
          <div className="inline-flex p-1 bg-surface-container-high rounded-full">
            <button
              onClick={() => setRegion('Recife')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${region === 'Recife' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              {region === 'Recife' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
              Recife
            </button>
            <button
              onClick={() => setRegion('Salvador')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${region === 'Salvador' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              {region === 'Salvador' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
              Salvador
            </button>
          </div>
          {/* Add button */}
          <button
            onClick={() => setIsAddingFranchisee(true)}
            className="bg-primary text-white py-2.5 px-5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Franqueado
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Registration Form */}
          <AnimatePresence>
            {isAddingFranchisee && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-surface-container">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" /> Cadastro de Novo Franqueado
                    </h3>
                    <button
                      onClick={() => setIsAddingFranchisee(false)}
                      className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleAddFranchisee} className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Nome do Franqueado</label>
                    <input name="name" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 outline-none" placeholder="Ex: João Silva" type="text" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Telefone</label>
                    <input name="phone" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 outline-none" placeholder="(00) 00000-0000" type="text" />
                  </div>

                  {/* Senha e Estado */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Senha de Acesso</label>
                    <input name="password" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 outline-none" placeholder="Mínimo 6 caracteres" type="password" />
                  </div>

                  {/* Estado */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Estado</label>
                    <div className="relative">
                      <select
                        value={formUf}
                        onChange={(e) => { setFormUf(e.target.value); setFormCity(''); }}
                        required
                        className="w-full appearance-none bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 outline-none pr-10 cursor-pointer"
                      >
                        <option value="">Selecione o Estado...</option>
                        {BRASIL_ESTADOS.map(s => (
                          <option key={s.uf} value={s.uf}>{s.uf} — {s.nome}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">
                      Cidade {loadingCidades && <span className="normal-case font-normal text-on-surface-variant/60">(carregando...)</span>}
                    </label>
                    <div className="relative">
                      {loadingCidades ? (
                        <div className="w-full bg-surface-container rounded-lg py-3 px-4 flex items-center gap-2 text-sm text-on-surface-variant">
                          <Loader2 className="w-4 h-4 animate-spin" /> Buscando municípios...
                        </div>
                      ) : (
                        <>
                          <select
                            value={formCity}
                            onChange={(e) => setFormCity(e.target.value)}
                            required
                            disabled={!formUf || cidades.length === 0}
                            className="w-full appearance-none bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 outline-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">{formUf ? 'Selecione a Cidade...' : 'Selecione o Estado primeiro'}</option>
                            {cidades.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Pontos de Entrega ── */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase px-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Pontos de Entrega
                      </label>
                      <button
                        type="button"
                        onClick={addFormPoint}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Adicionar Ponto
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formPoints.map((pt, idx) => (
                        <PointFormRow
                          key={pt.id}
                          pt={pt}
                          idx={idx}
                          canRemove={formPoints.length > 1}
                          onRemove={() => removeFormPoint(pt.id)}
                          onChangeName={v => updateFormPoint(pt.id, 'name', v)}
                          onChangeUf={uf => setFormPoints(pts => pts.map(p => p.id === pt.id ? { ...p, uf, city: '' } : p))}
                          onChangeCity={city => updateFormPoint(pt.id, 'city', city)}
                          onChangeRegion={r => setFormPoints(pts => pts.map(p => p.id === pt.id ? { ...p, region: r } : p))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingFranchisee(false); setFormUf(''); setFormCity(''); setFormPoints([emptyPoint()]); }}
                      className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-2.5 rounded-lg text-sm font-bold bg-primary text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Franqueado'
                      )}
                    </button>
                  </div>
                </form>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Franchisee List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2">Franqueados Ativos — {region}</h3>
            {filteredFranchisees.map((f: Franchisee) => (
              <FranchiseeCard
                key={f.id}
                franchisee={f}
                isExpanded={expandedFranchisee === f.id}
                onToggle={() => setExpandedFranchisee(expandedFranchisee === f.id ? null : f.id)}
                onUpdatePoints={handleUpdatePoints}
                onDeleteFranchisee={handleDeleteFranchisee}
                onEditFranchisee={handleOpenEditFranchisee}
              />
            ))}
            {filteredFranchisees.length === 0 && (
              <div className="p-12 text-center bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/30">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-on-surface-variant font-medium">Nenhum franqueado encontrado para esta região.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* KPI Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-secondary">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Métrica de Rede</h3>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-black text-primary">{totalPoints}</span>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Pontos de entrega ativos</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-surface-container">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-on-surface-variant">Crescimento Mensal</span>
                <span className="text-emerald-600 font-bold">+8% ↑</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Total Recife</p>
              <p className="text-2xl font-black text-primary">{franchisees.filter(f => f.region === 'Recife').length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">Total Salvador</p>
              <p className="text-2xl font-black text-secondary">{franchisees.filter(f => f.region === 'Salvador').length}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center justify-between">
              Atividade Recente
              <span className="text-on-surface-variant">🕐</span>
            </h3>
            <div className="space-y-6">
              {MOCK_ACTIVITIES.map(activity => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ring-4 ${
                      activity.type === 'registration' ? 'bg-primary ring-primary/10' :
                      activity.type === 'update' ? 'bg-secondary ring-secondary/10' :
                      'bg-emerald-500 ring-emerald-500/10'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{activity.title}</p>
                    <p className="text-[11px] text-on-surface-variant">{activity.description}</p>
                    <p className="text-[10px] text-primary/60 mt-1 font-bold">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm relative h-48 group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500"
              style={{ backgroundImage: "url('https://picsum.photos/seed/map/800/400')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-bold text-sm">Visualizar Malha Logística</p>
              <p className="text-white/80 text-[10px]">{region} e Região Metropolitana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar Franqueado */}
      <AnimatePresence>
        {editingFranchisee && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onMouseDown={() => setEditingFranchisee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Editar Franqueado</h3>
                    <p className="text-xs text-on-surface-variant">Atualize os dados do franqueado</p>
                  </div>
                </div>
                <button onClick={() => setEditingFranchisee(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveEditFranchisee} className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Nome do Franqueado</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Telefone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Estado</label>
                  <div className="relative">
                    <select
                      value={editForm.uf}
                      onChange={(e) => setEditForm(f => ({ ...f, uf: e.target.value, city: '' }))}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none pr-10"
                    >
                      <option value="">Selecione...</option>
                      {BRASIL_ESTADOS.map(s => (
                        <option key={s.uf} value={s.uf}>{s.uf} — {s.nome}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Cidade {loadingEditCidades && <span className="normal-case font-normal text-on-surface-variant/60">(carregando...)</span>}
                  </label>
                  <div className="relative">
                    <select
                      value={editForm.city}
                      onChange={(e) => setEditForm(f => ({ ...f, city: e.target.value }))}
                      disabled={!editForm.uf || loadingEditCidades}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none pr-10 disabled:opacity-50"
                    >
                      <option value="">{editForm.uf ? 'Selecione...' : 'Escolha o estado primeiro'}</option>
                      {/* Garantir que a cidade atual sempre aparece como opção */}
                      {editForm.city && !editCidades.includes(editForm.city) && (
                        <option value={editForm.city}>{editForm.city}</option>
                      )}
                      {editCidades.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                {/* Região */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Região</label>
                  <div className="flex gap-2">
                    {(['Recife', 'Salvador'] as const).map(r => (
                      <button key={r} type="button"
                        onClick={() => setEditForm(f => ({ ...f, region: r }))}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${editForm.region === r ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-500 hover:border-primary/40'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pontos de Entrega */}
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Pontos de Entrega
                    </label>
                    <button type="button"
                      onClick={() => setEditPoints(pts => [...pts, { id: crypto.randomUUID(), name: '', city: editForm.city || '', uf: editForm.uf || '', region: editForm.region }])}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {editPoints.map((pt, idx) => (
                      <div key={pt.id} className="bg-slate-50 rounded-lg p-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-on-surface-variant w-5 text-center">{idx + 1}</span>
                          <input
                            value={pt.name}
                            onChange={(e) => setEditPoints(pts => pts.map(p => p.id === pt.id ? { ...p, name: e.target.value } : p))}
                            placeholder="Nome do ponto"
                            className="flex-1 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none"
                          />
                          <input
                            value={pt.city}
                            onChange={(e) => setEditPoints(pts => pts.map(p => p.id === pt.id ? { ...p, city: e.target.value } : p))}
                            placeholder="Cidade"
                            className="w-20 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none"
                          />
                          <input
                            value={pt.uf}
                            onChange={(e) => setEditPoints(pts => pts.map(p => p.id === pt.id ? { ...p, uf: e.target.value.toUpperCase().slice(0,2) } : p))}
                            placeholder="UF"
                            maxLength={2}
                            className="w-10 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary/20 outline-none"
                          />
                          <button type="button"
                            onClick={() => setEditPoints(pts => pts.filter(p => p.id !== pt.id))}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-1 pl-7">
                          {(['Recife', 'Salvador'] as const).map(r => (
                            <button key={r} type="button"
                              onClick={() => setEditPoints(pts => pts.map(p => p.id === pt.id ? { ...p, region: r } : p))}
                              className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all ${
                                (pt.region || editForm.region) === r
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-slate-200 text-slate-400 hover:border-primary/40'
                              }`}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {editPoints.length === 0 && (
                      <p className="text-xs text-on-surface-variant text-center py-3">Nenhum ponto cadastrado</p>
                    )}
                  </div>
                </div>

                {/* Redefinir Senha */}
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Redefinir Senha de Acesso</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova senha (mín. 6 caracteres)"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <button type="button" onClick={() => setShowNewPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={savingPass || newPassword.length < 6}
                      className="px-4 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1 whitespace-nowrap"
                    >
                      {savingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Redefinir
                    </button>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditingFranchisee(null)}
                    className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão de Franqueado */}
      <AnimatePresence>
        {deletingFranchiseeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4"
            onMouseDown={() => setDeletingFranchiseeId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Excluir Franqueado</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Tem certeza que deseja excluir este franqueado? Todos os pontos serão perdidos e esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingFranchiseeId(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteFranchisee}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
