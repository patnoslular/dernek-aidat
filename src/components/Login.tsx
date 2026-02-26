import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => boolean;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dernek Takip Sistemi</h1>
          <p className="text-slate-500 text-sm mt-2">Lütfen yönetici şifresini girerek devam edin.</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Yönetici Şifresi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${error ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-rose-500/50' : 'focus:ring-indigo-500/50'} transition-all`}
              />
              {error && (
                <p className="text-rose-500 text-xs font-medium mt-1">Hatalı şifre. Lütfen tekrar deneyin.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 group"
            >
              Giriş Yap
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          &copy; 2026 Dernek Aidat Takip Sistemi. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
}
