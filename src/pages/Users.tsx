import React, { useState, useEffect, Suspense } from 'react';

const DriverMap = React.lazy(() =>
  import('@/components/OrderMap').then(m => ({ default: m.DriverMap }))
);
import {
  UserPlus,
  Search,
  Bell,
  UserCircle,
  Edit2,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Eye,
  EyeOff,
  Truck,
  Trash2,
  MapPin,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase, getSupabaseAdmin, subscribeToTable, insertRow, signUpWithEmail, resetUserPassword, normalizeStorageUrl } from '@/supabase';
import { type User, type Region } from '@/types';

type FilterType = 'todos' | 'ativos' | 'admins' | 'motoristas';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | 'Todas'>('Todas');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [showModal, setShowModal] = useState(false);
  const [mapUser, setMapUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [cleaningAuth, setCleaningAuth] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'usuario' as 'admin' | 'usuario' | 'motorista',
    region: 'Recife' as Region,
    phone: '',
    vehicle: '',
  });

  const resetForm = () => {
    setForm({ id: '', name: '', email: '', password: '', role: 'usuario', region: 'Recife', phone: '', vehicle: '' });
    setFormError(null);
    setShowPassword(false);
  };

  const handleEdit = (user: User) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Senha não é retornada/editada aqui por segurança
      role: user.role,
      region: user.region,
      phone: user.phone || '',
      vehicle: user.vehicle || '',
    });
    setShowModal(true);
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return;
    if (newPassword.length < 6) {
      setResetMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setResetLoading(true);
    setResetMsg(null);
    try {
      await resetUserPassword(resetPasswordUser.id, newPassword);
      setResetMsg('✅ Senha redefinida com sucesso!');
      setTimeout(() => {
        setResetPasswordUser(null);
        setNewPassword('');
        setResetMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error('[Users V2] Erro ao redefinir senha:', err);
      setResetMsg(`❌ ${err.message || 'Erro ao redefinir senha.'}`);
    } finally {
      setResetLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
      const { error } = await supabase
        .from('app_users')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) throw error;
      await reloadUsers();
    } catch (err: any) {
      console.error('Erro ao alterar status:', err);
      alert('Erro ao alterar status do usuário.');
    }
  };

  const handleDelete = async (user: User) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`);
    if (!confirmDelete) return;

    try {
      // Remover do Supabase Auth
      if (user.email) {
        const { error: rpcError } = await supabase.rpc('delete_auth_user_by_email', { user_email: user.email });
        if (rpcError) console.warn('[Users] Auth delete aviso:', rpcError.message);
      }
      // Remover da tabela app_users
      const { error } = await supabase.from('app_users').delete().eq('id', user.id);
      if (error) throw error;

      await reloadUsers();
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      alert('Erro ao excluir usuário: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email || (!form.id && !form.password)) {
      setFormError('Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (!form.id && form.password.length < 6) {
      setFormError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (form.id) {
        // ── Editar usuário existente ─────────────────────────────
        const { error } = await supabase
          .from('app_users')
          .update({
            name: form.name,
            role: form.role,
            region: form.region,
            phone: form.phone,
            vehicle: form.vehicle,
          })
          .eq('id', form.id);
        if (error) throw error;

        resetForm();
        setShowModal(false);
        // Feedback visual de sucesso (toast temporário)
        alert('✅ Usuário atualizado com sucesso!');
      } else {
        // ── Criar novo usuário ───────────────────────────────────
        // 1. Verificar se já existe na app_users para evitar duplicata
        const { data: existing } = await supabase
          .from('app_users')
          .select('id')
          .eq('email', form.email)
          .maybeSingle();

        if (existing) {
          setFormError('Este e-mail já está cadastrado. Use "Editar" para alterar os dados.');
          return;
        }

        // 2. Criar no Supabase Auth (cria conta de login)
        let authUserId: string | null = null;
        try {
          const authData = await signUpWithEmail(form.email, form.password);
          authUserId = authData?.user?.id ?? null;
        } catch (authErr: any) {
          // Se já existe no Auth mas não em app_users, continua sem auth_uid
          if (
            authErr.message?.includes('already registered') ||
            authErr.message?.includes('already exists') ||
            authErr.code === 'user_already_exists'
          ) {
            console.warn('[Users] Auth já existe, tentando reaproveitá-lo via RPC...');
            // Tentar buscar o auth_uid via email no banco
            try {
              const { data: rpcData } = await supabase.rpc('get_auth_uid_by_email', {
                user_email: form.email,
              });
              authUserId = rpcData ?? null;
            } catch {}
          } else {
            throw authErr;
          }
        }

        // 3. Inserir perfil em app_users
        const { error: insertErr } = await supabase.from('app_users').insert({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          region: form.region,
          phone: form.phone || null,
          vehicle: form.vehicle || null,
          status: 'Ativo',
          auth_uid: authUserId,
        });

        if (insertErr) {
          // Duplicate key no banco — e-mail já existe
          if (insertErr.code === '23505') {
            setFormError('Este e-mail já está cadastrado no sistema.');
            return;
          }
          throw insertErr;
        }

        resetForm();
        setShowModal(false);
        await reloadUsers();
        alert('✅ Usuário cadastrado com sucesso!');
      }
    } catch (err: any) {
      console.error('[Users] Erro ao salvar:', err);
      let msg = err.message ?? 'Erro ao salvar usuário.';
      if (msg.includes('unique') || msg.includes('duplicate') || err.code === '23505') {
        msg = 'Este e-mail já está cadastrado no sistema.';
      } else if (msg.includes('Unauthorized')) {
        msg = 'Sem permissão. Faça logout e entre novamente.';
      } else if (err.code === 'weak_password') {
        msg = 'A senha é muito fraca (mínimo 6 caracteres).';
      } else if (err.code === 'email_address_invalid') {
        msg = 'Endereço de e-mail inválido.';
      }
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };


  // Function to clean up orphan users (in Supabase Auth but not in app_users)
  const handleCleanOrphanUsers = async () => {
    if (!confirm('ATENÇÃO: Isso vai excluir todos os usuários do Supabase Auth que não estão mais no banco de dados.\n\nContinuar?')) return;

    setCleaningAuth(true);
    try {
      const { data, error } = await supabase.rpc('delete_orphan_auth_users');
      if (error) throw error;
      await reloadUsers();
      alert(`Limpeza concluída! ${data} usuários órfãos excluídos do Supabase Auth.`);
    } catch (err: any) {
      alert('Erro ao limpar: ' + err.message);
    }
    setCleaningAuth(false);
  };


  const reloadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .in('role', ['admin', 'usuario', 'motorista'])
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[Users] Erro ao buscar usuários:', error);
        return;
      }
      // Safety net: client-side filter caso o servidor falhe
      const filtered = (data || []).filter((u: any) =>
        ['admin', 'usuario', 'motorista'].includes(u.role?.toLowerCase?.() || u.role)
      );
      console.log('[Users] Carregados:', filtered.length, 'usuários (filtrado de', (data || []).length, ')');
      setUsers(filtered);
    } catch (e) {
      console.error('[Users] Erro ao recarregar lista:', e);
    }
  };

  useEffect(() => {
    // Carga inicial
    reloadUsers().then(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Gestão de Usuários</h2>
          <p className="text-on-surface-variant font-body">Administre os acessos e permissões da equipe operacional.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCleanOrphanUsers}
            disabled={cleaningAuth}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {cleaningAuth ? 'Limpando...' : 'Limpar Órfãos'}
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 primary-gradient text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
        {(['Todas', 'Recife', 'Salvador'] as (Region | 'Todas')[]).map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={cn('px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200',
              region === r ? 'primary-gradient text-white shadow-md' : 'text-slate-500 hover:text-primary')}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Usuários', value: users.filter(u => region === 'Todas' || u.region === region).length.toString(), color: 'border-primary', filter: 'todos' as FilterType },
          { label: 'Ativos Agora', value: users.filter(u => (region === 'Todas' || u.region === region) && u.status === 'Ativo').length.toString(), color: 'border-secondary', filter: 'ativos' as FilterType },
          { label: 'Administradores', value: users.filter(u => (region === 'Todas' || u.region === region) && u.role === 'admin').length.toString(), color: 'border-tertiary', filter: 'admins' as FilterType },
          { label: 'Motoristas', value: users.filter(u => (region === 'Todas' || u.region === region) && u.role === 'motorista').length.toString(), color: 'border-primary-container', filter: 'motoristas' as FilterType },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(stat.filter)}
            className={cn(
              "bg-white p-6 rounded-xl border-l-4 shadow-sm text-left transition-all hover:shadow-md",
              stat.color,
              activeFilter === stat.filter ? 'ring-2 ring-primary/20 bg-primary/5' : ''
            )}
          >
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black mt-2 font-headline">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-on-surface-variant">
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Papel</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Região</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">Carregando usuários...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-on-surface-variant">Nenhum usuário encontrado.</td>
              </tr>
            ) : users.filter(u => {
              if (region !== 'Todas' && u.region !== region) return false;
              if (activeFilter === 'ativos') return u.status === 'Ativo';
              if (activeFilter === 'admins') return u.role === 'admin';
              if (activeFilter === 'motoristas') return u.role === 'motorista';
              return true;
            }).map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={normalizeStorageUrl(user.photoUrl) || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    user.role === 'admin' ? "bg-red-100 text-red-900" :
                      user.role === 'motorista' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {user.role === 'admin' ? 'Administrador' : user.role === 'motorista' ? 'Motorista' : 'Usuário'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-tertiary">{user.region}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", user.status === 'Ativo' ? "bg-emerald-500" : "bg-slate-300")}></div>
                    <span className="text-xs font-medium">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.role === 'motorista' && (
                      <button
                        onClick={() => setMapUser(user)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-on-surface-variant transition-colors"
                        title="Ver Localização em Tempo Real"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => { setResetPasswordUser(user); setNewPassword(''); setResetMsg(null); }}
                      className="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg text-on-surface-variant transition-colors"
                      title="Redefinir Senha"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 hover:bg-slate-200 rounded-lg text-on-surface-variant transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={cn(
                        "p-2 hover:bg-slate-200 rounded-lg transition-colors",
                        user.status === 'Ativo' ? "text-orange-600" : "text-emerald-600"
                      )}
                      title={user.status === 'Ativo' ? 'Inativar Usuário' : 'Ativar Usuário'}
                    >
                      {user.status === 'Ativo' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-on-surface-variant transition-colors"
                      title="Excluir Permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <p className="text-xs font-medium text-on-surface-variant">Exibindo {users.filter(u => u.region === region).length} de {users.length} usuários ({region})</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-white border border-slate-200 text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-slate-200 text-on-surface-variant hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Modal Redefinir Senha */}
      <AnimatePresence>
        {resetPasswordUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onMouseDown={() => { setResetPasswordUser(null); setNewPassword(''); setResetMsg(null); }}
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
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Redefinir Senha</h3>
                    <p className="text-xs text-on-surface-variant">{resetPasswordUser.name}</p>
                  </div>
                </div>
                <button onClick={() => { setResetPasswordUser(null); setNewPassword(''); setResetMsg(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {resetMsg && (
                  <div className={cn(
                    "text-sm px-4 py-3 rounded-xl font-medium",
                    resetMsg.startsWith('✅') ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"
                  )}>
                    {resetMsg}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Nova Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-primary/30"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  Esta senha será usada pelo usuário para logar no app mobile.
                </p>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => { setResetPasswordUser(null); setNewPassword(''); setResetMsg(null); }}
                  className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading || !newPassword}
                  className="px-6 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-50"
                >
                  {resetLoading ? 'Salvando...' : 'Redefinir Senha'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Novo Motorista */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onMouseDown={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{form.id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                    <p className="text-xs text-on-surface-variant">
                      {form.id ? 'Atualize as informações do usuário' : 'O usuário poderá logar no app mobile'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Nome Completo *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">E-mail (login no app) *</label>
                    <input
                      type="email"
                      disabled={!!form.id}
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className={cn(
                        "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30",
                        form.id && "opacity-60 cursor-not-allowed"
                      )}
                      placeholder="motorista@domempada.com"
                    />
                  </div>
                  {!form.id && (
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Senha (app mobile) *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-primary/30"
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Telefone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30"
                      placeholder="(81) 99999-0000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Veículo</label>
                    <input
                      value={form.vehicle}
                      onChange={(e) => setForm(f => ({ ...f, vehicle: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30"
                      placeholder="Ex: Fiorino ABC-1234"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Função</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm(f => ({ ...f, role: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="usuario">Usuário</option>
                      <option value="motorista">Motorista</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Região</label>
                    <select
                      value={form.region}
                      onChange={(e) => setForm(f => ({ ...f, region: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Recife">Recife</option>
                      <option value="Salvador">Salvador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 primary-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : form.id ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Mapa GPS */}
      <AnimatePresence>
        {mapUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onMouseDown={() => setMapUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on-surface">Localização do Motorista</h3>
                    <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {mapUser.name} • {mapUser.vehicle || 'Veículo não informado'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMapUser(null)}
                  className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative" style={{ height: '60vh' }}>
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <p className="text-on-surface-variant font-bold text-sm animate-pulse">Carregando Google Maps...</p>
                  </div>
                }>
                  <DriverMap
                    lat={mapUser.lat}
                    lng={mapUser.lng}
                    name={mapUser.name}
                    vehicle={mapUser.vehicle}
                  />
                </Suspense>
                {(!mapUser.lat || !mapUser.lng) && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-10">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium whitespace-nowrap">Aguardando sinal real do GPS. Mostrando localização padrão.</p>
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
