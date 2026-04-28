/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Franchisee, DeliveryPoint, Activity } from './types';

const MOCK_FRANCHISEES: Franchisee[] = [
  {
    id: '1',
    name: 'João Silva Salgados ME',
    cnpj: '12.345.678/0001-90',
    contact: 'João Silva',
    phone: '+55 81 99999-0000',
    region: 'Recife',
    initials: 'JS',
    points: [
      { id: 'p1', name: 'Unidade Boa Viagem - Quiosque A', city: 'Recife', uf: 'PE', whatsapp: '+55 81 98877-6655' },
      { id: 'p2', name: 'Ponto de Venda Shopping Recife', city: 'Recife', uf: 'PE', whatsapp: '+55 81 98822-1144' },
    ]
  },
  {
    id: '2',
    name: 'Alimentos Freitas Salvador S.A.',
    cnpj: '98.765.432/0001-10',
    contact: 'Maria Freitas',
    phone: '+55 71 98888-1111',
    region: 'Salvador',
    initials: 'AF',
    points: [
      { id: 'p3', name: 'Unidade Barra', city: 'Salvador', uf: 'BA', whatsapp: '+55 71 97777-6666' },
    ]
  },
  {
    id: '3',
    name: 'Rede Empada Sul Ltda',
    cnpj: '44.555.666/0001-22',
    contact: 'Ricardo Souza',
    phone: '+55 81 97777-2222',
    region: 'Recife',
    initials: 'RE',
    points: [
      { id: 'p4', name: 'Unidade Piedade', city: 'Jaboatão', uf: 'PE', whatsapp: '+55 81 96666-5555' },
      { id: 'p5', name: 'Unidade Olinda', city: 'Olinda', uf: 'PE', whatsapp: '+55 81 95555-4444' },
    ]
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'registration', title: 'Novo Ponto Cadastrado', description: "JS Salgados adicionou 'Loja Shopping'", time: 'HÁ 12 MINUTOS' },
  { id: 'a2', type: 'update', title: 'Alteração de Contato', description: 'Rede Sul atualizou telefone principal', time: 'HÁ 2 HORAS' },
  { id: 'a3', type: 'activation', title: 'Franqueado Ativado', description: 'Alimentos Freitas validou contrato', time: 'HÁ 5 HORAS' },
];

export default function App() {
  const [region, setRegion] = useState<'Recife' | 'Salvador'>('Recife');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingFranchisee, setIsAddingFranchisee] = useState(false);
  const [expandedFranchisee, setExpandedFranchisee] = useState<string | null>('1');
  const [franchisees, setFranchisees] = useState<Franchisee[]>(MOCK_FRANCHISEES);

  const filteredFranchisees = useMemo(() => {
    return franchisees.filter(f => 
      f.region === region && 
      (f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.cnpj.includes(searchQuery))
    );
  }, [franchisees, region, searchQuery]);

  const totalPoints = useMemo(() => {
    return franchisees.reduce((acc, f) => acc + f.points.length, 0);
  }, [franchisees]);

  const handleAddFranchisee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFranchisee: Franchisee = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      cnpj: formData.get('cnpj') as string,
      contact: formData.get('contact') as string,
      phone: formData.get('phone') as string,
      region: region,
      initials: (formData.get('name') as string).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      points: []
    };
    setFranchisees([...franchisees, newFranchisee]);
    setIsAddingFranchisee(false);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-surface-container dark:bg-[#1a1a1a] flex flex-col py-8 gap-4 shadow-none">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined">restaurant_menu</span>
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-primary leading-none text-lg">Artisan Ops</h2>
              <p className="text-[11px] text-on-surface-variant font-medium">Logistics Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem icon="dashboard" label="Dashboard" />
          <NavItem icon="group" label="Franqueados" active />
          <NavItem icon="local_shipping" label="Logística" />
          <NavItem icon="inventory_2" label="Pedidos" />
          <NavItem icon="analytics" label="Relatórios" />
          <NavItem icon="settings" label="Configurações" />
        </nav>
        <div className="mt-auto px-4 space-y-4">
          <button 
            onClick={() => setIsAddingFranchisee(true)}
            className="w-full bg-primary-container text-white py-3 px-4 rounded-xl font-headline font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Novo Franqueado
          </button>
          <div className="pt-4 border-t border-outline-variant/20">
            <div className="px-4 py-2 flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">support_agent</span>
              <span className="font-medium text-sm">Suporte</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 z-40 bg-surface dark:bg-[#121212] shadow-[0px_20px_40px_rgba(25,28,29,0.06)] flex justify-between items-center px-8 py-4 w-[calc(100%-16rem)]">
          <div className="flex items-center gap-4">
            <h1 className="font-headline font-black text-primary dark:text-[#ffb4a9] uppercase tracking-widest text-xl">Dom da Empada Control</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center bg-surface-container px-4 py-2 rounded-full w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant" 
                placeholder="Buscar franqueado..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container p-2 rounded-full transition-all">notifications</span>
              <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container p-2 rounded-full transition-all">help_outline</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                <img 
                  alt="User Profile" 
                  src="https://picsum.photos/seed/profile/100/100" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="pt-24 pb-12 px-8 min-h-screen">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                <span>Início</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-semibold">Gestão de Franqueados</span>
              </nav>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Rede de Franqueados</h2>
              <p className="text-on-surface-variant mt-1">Gerencie parceiros, contratos e pontos de distribuição regional.</p>
            </div>
            <div className="flex gap-3">
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
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main List (Left Column) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Registration Card */}
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
                        <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">person_add</span>
                          Cadastro de Novo Franqueado
                        </h3>
                        <button 
                          onClick={() => setIsAddingFranchisee(false)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleAddFranchisee} className="p-6 grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Nome da Franquia / Razão Social</label>
                        <input name="name" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3" placeholder="Ex: Empada Master Ltda" type="text"/>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">CNPJ</label>
                        <input name="cnpj" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3" placeholder="00.000.000/0000-00" type="text"/>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Contato Principal</label>
                        <input name="contact" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3" placeholder="Nome do Responsável" type="text"/>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1 px-1">Telefone / WhatsApp</label>
                        <input name="phone" required className="w-full bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm py-3" placeholder="(00) 00000-0000" type="text"/>
                      </div>
                      <div className="col-span-2 flex justify-end gap-3 mt-2">
                        <button 
                          type="button"
                          onClick={() => setIsAddingFranchisee(false)}
                          className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-2.5 rounded-lg text-sm font-bold bg-primary text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                        >
                          Salvar Franqueado
                        </button>
                      </div>
                    </form>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Franchisee List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2">Franqueados Ativos</h3>
                {filteredFranchisees.map((f: Franchisee) => (
                  <FranchiseeCard 
                    key={f.id} 
                    franchisee={f} 
                    isExpanded={expandedFranchisee === f.id}
                    onToggle={() => setExpandedFranchisee(expandedFranchisee === f.id ? null : f.id)}
                  />
                ))}
                {filteredFranchisees.length === 0 && (
                  <div className="p-12 text-center bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/30">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
                    <p className="text-on-surface-variant font-medium">Nenhum franqueado encontrado para esta região.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats & Insights (Right Column) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Quick Summary KPI */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-secondary">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Métrica de Rede</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-headline font-black text-primary">{totalPoints}</span>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">Pontos de entrega ativos</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-surface-container">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-on-surface-variant">Crescimento Mensal</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      +8% <span className="material-symbols-outlined text-sm">trending_up</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center justify-between">
                  Atividade Recente
                  <span className="material-symbols-outlined text-sm">history</span>
                </h3>
                <div className="space-y-6">
                  {MOCK_ACTIVITIES.map(activity => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ring-4 ${
                          activity.type === 'registration' ? 'bg-primary ring-primary/10' :
                          activity.type === 'update' ? 'bg-secondary ring-secondary/10' :
                          'bg-tertiary ring-tertiary/10'
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

              {/* Logistics Hub Map */}
              <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm relative h-48 group">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500" 
                  style={{ backgroundImage: "url('https://picsum.photos/seed/map/800/400')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-headline font-bold text-sm">Visualizar Malha Logística</p>
                  <p className="text-white/80 text-[10px]">{region} e Região Metropolitana</p>
                </div>
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-primary shadow-lg active:scale-95">
                  <span className="material-symbols-outlined">open_in_full</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`px-4 py-2 flex items-center gap-3 transition-all cursor-pointer group ${
      active 
        ? 'bg-white dark:bg-[#2c2c2c] text-primary dark:text-[#ffb4a9] shadow-sm rounded-l-full ml-4 font-bold' 
        : 'text-on-surface-variant hover:translate-x-1'
    }`}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

interface FranchiseeCardProps {
  franchisee: Franchisee;
  isExpanded: boolean;
  onToggle: () => void;
}

const FranchiseeCard: React.FC<FranchiseeCardProps> = ({ franchisee, isExpanded, onToggle }) => {
  return (
    <div className={`bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border-l-4 transition-all ${isExpanded ? 'border-primary' : 'border-transparent hover:border-outline-variant/30'}`}>
      <div 
        onClick={onToggle}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-container-lowest/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg ${isExpanded ? 'bg-primary-fixed-dim text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
            {franchisee.initials}
          </div>
          <div>
            <h4 className="font-bold text-on-surface">{franchisee.name}</h4>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">fingerprint</span> {franchisee.cnpj}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {franchisee.region}, PE</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] block font-bold text-on-surface-variant uppercase">Pontos</span>
            <span className={`text-lg font-headline font-black ${isExpanded ? 'text-primary' : 'text-on-surface-variant'}`}>
              {franchisee.points.length.toString().padStart(2, '0')}
            </span>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
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
              <h5 className="font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">hub</span>
                Pontos de Entrega Logística
              </h5>
              <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-sm">add_circle</span> Adicionar Ponto
              </button>
            </div>

            {/* List of Points */}
            <div className="space-y-2">
              {franchisee.points.map(point => (
                <div key={point.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl hover:translate-x-1 transition-transform cursor-default group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-secondary rounded-full"></div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{point.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{point.city}, {point.uf} • {point.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.city + ', ' + point.uf)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-on-surface-variant hover:text-secondary transition-colors"
                      title="Ver no Google Maps"
                    >
                      <span className="material-symbols-outlined text-lg">map</span>
                    </a>
                    <a 
                      href={`https://wa.me/${point.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-on-surface-variant hover:text-emerald-500 transition-colors"
                      title="Abrir WhatsApp"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                    </a>
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="p-2 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

