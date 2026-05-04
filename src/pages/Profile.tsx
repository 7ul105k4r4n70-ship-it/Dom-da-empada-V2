import React, { useState, useEffect } from 'react';
import {
  UserCircle,
  Camera,
  Save,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, normalizeStorageUrl } from '@/supabase';
import { cn } from '@/lib/utils';

export function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo_url: '',
    role: '',
    region: '',
  });
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    if (type === 'success') setTimeout(() => setMessage(null), 4000);
  };

  const loadProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // ── Caminho 1: Admin Master (sem Supabase Auth) ──────────────
      if (localStorage.getItem('admin_master_auth') === 'true') {
        setProfile({
          name: 'Administrador Master',
          email: 'admin.master@domdaempada.com.br',
          photo_url: '',
          role: 'Admin Master',
          region: 'Geral',
        });
        setLoading(false);
        return;
      }

      // ── Caminho 2: Sessão portal customizada (sem JWT Auth) ──────
      let userEmail: string | null = localStorage.getItem('portal_user_email');

      // ── Caminho 3: Sessão ativa no Supabase Auth ──────────────────
      if (!userEmail) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email) {
          userEmail = sessionData.session.user.email;
        }
      }

      // Fallback: scan do localStorage (sessão persistida)
      if (!userEmail) {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || '';
          if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
            try {
              const raw = localStorage.getItem(k);
              if (raw) {
                const sess = JSON.parse(raw);
                userEmail = sess?.user?.email ?? null;
              }
            } catch {}
            break;
          }
        }
      }

      if (!userEmail) {
        navigate('/login');
        return;
      }

      // ── Buscar perfil na tabela app_users pelo email ─────────────
      const { data, error } = await supabase
        .from('app_users')
        .select('id, name, email, photo_url, role, region')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAppUserId(data.id);
        setProfile({
          name: data.name || '',
          email: data.email || '',
          photo_url: data.photo_url || '',
          role: data.role || '',
          region: data.region || '',
        });
      } else {
        // Usuário existe no Auth mas não em app_users (raro)
        setProfile({
          name: userEmail.split('@')[0],
          email: userEmail,
          photo_url: '',
          role: 'Usuário',
          region: 'Não definida',
        });
      }
    } catch (err: any) {
      console.error('[Profile] Erro ao carregar:', err);
      showMsg('error', 'Erro ao carregar perfil: ' + (err.message || 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  // Upload de foto para o Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `profile_${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('delivery-photos')
        .upload(`profiles/${fileName}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('delivery-photos')
        .getPublicUrl(uploadData.path);

      setProfile(p => ({ ...p, photo_url: urlData.publicUrl }));
      showMsg('success', 'Foto enviada! Clique em "Salvar Alterações" para confirmar.');
    } catch (err: any) {
      // Fallback: preview local se Storage falhar
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
      console.warn('[Profile] Storage upload falhou, usando preview local:', err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (appUserId) {
        const { error } = await supabase
          .from('app_users')
          .update({ name: profile.name, photo_url: profile.photo_url })
          .eq('id', appUserId);
        if (error) throw error;
      }

      // Atualizar metadados do Supabase Auth (opcional)
      await supabase.auth.updateUser({
        data: { name: profile.name, photo_url: profile.photo_url },
      });

      showMsg('success', 'Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error('[Profile] Erro ao salvar:', err);
      showMsg('error', err.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showMsg('error', 'As senhas não coincidem.');
      return;
    }
    if (passwords.new.length < 6) {
      showMsg('error', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Atualizar no Supabase Auth
      const { error: authErr } = await supabase.auth.updateUser({ password: passwords.new });
      if (authErr) throw authErr;

      // Manter senha em sync na tabela app_users para o login por nome
      if (appUserId) {
        await supabase.from('app_users').update({ password: passwords.new }).eq('id', appUserId);
      }

      setPasswords({ new: '', confirm: '' });
      showMsg('success', 'Senha alterada com sucesso!');
    } catch (err: any) {
      console.error('[Profile] Erro ao alterar senha:', err);
      showMsg('error', err.message || 'Erro ao alterar senha.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const photoSrc = normalizeStorageUrl(profile.photo_url) ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Meu Perfil</h2>
          <p className="text-on-surface-variant text-sm">Gerencie suas informações pessoais e segurança.</p>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={cn(
          'flex items-center gap-3 px-6 py-4 rounded-2xl border',
          message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        )}>
          {message.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Foto de Perfil */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <img
                src={photoSrc}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-50 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop';
                }}
              />
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingPhoto
                  ? <Loader2 className="w-8 h-8 text-white animate-spin" />
                  : <Camera className="w-8 h-8 text-white" />}
                <span className="text-white text-[10px] font-bold mt-1">
                  {uploadingPhoto ? 'Enviando...' : 'Alterar foto'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            <div>
              <h3 className="text-xl font-black text-on-surface">{profile.name || 'Usuário'}</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1 capitalize">
                {profile.role}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs font-medium text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Ativo em {profile.region || '—'}
              </div>
            </div>

            {/* URL manual da foto (fallback) */}
            <div className="w-full pt-4 border-t border-slate-100 space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-left block">
                URL da Foto (opcional)
              </label>
              <input
                type="text"
                value={profile.photo_url}
                onChange={(e) => setProfile(p => ({ ...p, photo_url: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
          </div>
        </div>

        {/* Formulários */}
        <div className="md:col-span-2 space-y-8">
          {/* Informações Básicas */}
          <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-lg text-on-surface">Informações Pessoais</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  E-mail (não editável)
                </label>
                <input
                  type="email"
                  readOnly
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-4 primary-gradient text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Alterações
            </button>
          </form>

          {/* Alterar Senha */}
          <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-bold text-lg text-on-surface">Segurança da Conta</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-amber-400/30 transition-all outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-amber-400/30 transition-all outline-none"
                  placeholder="Repita a nova senha"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Alterar Senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
