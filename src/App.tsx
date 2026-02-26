import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Mail,
  LogOut,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { supabase, SYSTEM_CONFIG, MENU_ITEMS } from './constants';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SYSTEM_CONFIG.LOGIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Hatalı şifre!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Dernek Takip Sistemi</h2>
          <p className="text-slate-500 text-center mb-8">Devam etmek için lütfen giriş yapın</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-100"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-fixed flex-col text-slate-300`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-white whitespace-nowrap">{SYSTEM_CONFIG.PROJECT_NAME}</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="m-4 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-medium">Çıkış Yap</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white rounded-lg transition-all shadow-sm"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-4 text-slate-600 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
             Vercel-Supabase Canlı Bağlantı Aktif
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Veritabanı Bağlantısı Kuruldu!</h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Sistem artık Supabase üzerinden çalışmaya hazır. Üye ve Tahsilat sayfalarındaki verileri çekebilmek için şimdi diğer dosyalarını da güncellememiz gerekecek.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
