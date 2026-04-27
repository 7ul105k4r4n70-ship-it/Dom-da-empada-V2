import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithEmail, supabase } from '@/supabase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [tab, setTab] = useState<'email'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudLogo, setCloudLogo] = useState('/logocloud.png');

  useEffect(() => {
    // Em dev, nao processar canvas para nao bloquear a UI
    if (!import.meta.env.PROD && window.location.hostname === 'localhost') {
      setCloudLogo('/logocloud.png');
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setCloudLogo(canvas.toDataURL('image/png'));
    };
    img.src = '/logocloud.png';
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) {
      setError('Preencha nome e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Admin master - bypass local
      if (name.toLowerCase() === 'admin.master' && password === 'T05122020d*') {
        localStorage.setItem('admin_master_auth', 'true');
        onLogin();
        setLoading(false);
        return;
      }

      // Buscar usuário pelo nome
      const { data: userData, error: userError } = await supabase
        .from('app_users')
        .select('id, name, email, status')
        .ilike('name', name)
        .single();
      
      if (userError || !userData) {
        setError('Nome de usuário não encontrado.');
        setLoading(false);
        return;
      }

      if (userData.status === 'Inativo') {
        setError('Usuário inativo. Contate o administrador.');
        setLoading(false);
        return;
      }

      // Tentar login via Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });

      if (authError) {
        console.warn('[Login V2] signIn falhou, recriando auth user...', authError.message);
        // Auto-correção: tentar deletar auth user antigo (ignora erro)
        try {
          await supabase.rpc('delete_auth_user_by_email', { user_email: userData.email });
        } catch {}
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: userData.email,
          password,
        });
        if (signUpErr) {
          setError('Senha incorreta. Verifique sua senha e tente novamente.');
          setLoading(false);
          return;
        }
        // Atualizar auth_uid
        if (signUpData?.user?.id) {
          await supabase.from('app_users').update({ 
            auth_uid: signUpData.user.id, 
            password 
          }).eq('id', userData.id);
        }
        // Login de novo com a sessão criada pelo signUp
        const { error: retryErr } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password,
        });
        if (retryErr) {
          setError('Falha na autenticação. Tente novamente.');
          setLoading(false);
          return;
        }
      }

      // Salvar senha em app_users (sync)
      await supabase.from('app_users').update({ password }).eq('id', userData.id);
      onLogin();
    } catch (err: any) {
      setError(err.message ?? 'Falha na autenticação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-8 relative z-10"
      >
        {/* Logo da empresa */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-4"
          >
            <img src="/logo.png" alt="Dom da Empada" className="h-28 w-auto drop-shadow-2xl" />
          </motion.div>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">
            A Melhor Empada do Brasil
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Portal Administrativo
              </span>
              <h2 className="text-xl font-bold text-on-surface">Bem-vindo de volta</h2>
              <p className="text-sm text-on-surface-variant mt-1">Digite seu nome e senha</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100 mb-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.form
                  key="email"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                >
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Senha"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 primary-gradient text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'AUTENTICANDO...' : 'ENTRAR'}
                  </button>
                </motion.form>
            </AnimatePresence>

            <p className="text-[10px] text-center text-on-surface-variant leading-relaxed mt-6">
              Ao acessar, você concorda com as políticas de segurança da Dom da Empada Franquias.
            </p>
          </div>

          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-on-surface-variant/50">
              Problemas? Contate o TI &nbsp;·&nbsp; © 2026 Dom da Empada
            </p>
          </div>
        </div>

        {/* Marca d'água */}
        <div className="mt-8 flex justify-center pb-4 select-none">
          <img
            src={cloudLogo}
            alt="SK4R4N70 Cloud"
            className="h-24 w-auto opacity-60"
          />
        </div>
      </motion.div>
    </div>
  );
}
