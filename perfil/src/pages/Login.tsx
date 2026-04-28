import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, googleProvider, signInWithPopup } from '@/firebase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Falha na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-2xl shadow-primary/30 mb-6 rotate-3">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight font-headline uppercase">Dom da Empada</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-2">Sistema de Excelência Operacional</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-on-surface">Bem-vindo de volta</h2>
              <p className="text-sm text-on-surface-variant mt-1">Acesse sua conta corporativa</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white border border-slate-200 text-on-surface rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all group disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {loading ? "AUTENTICANDO..." : "ENTRAR COM GOOGLE"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-on-surface-variant font-bold">Acesso Restrito</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-on-surface-variant leading-relaxed">
              Ao acessar o sistema, você concorda com as políticas de segurança e privacidade da Dom da Empada Franquias.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs text-on-surface-variant font-medium">
              Problemas com o acesso? Contate o TI.<br />
              <span className="text-[10px] opacity-50">© 2023 Dom da Empada Franquias</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
