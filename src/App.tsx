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
  Lock,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase, SYSTEM_CONFIG, MENU_ITEMS } from './constants';
import Members from './components/Members';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, balance: 0, income: 0, expense: 0 });

  // Veritabanından özet bilgileri çek
  useEffect(() => {
    if (isLoggedIn) {
      const getStats = async () => {
        const { count } = await supabase.from('members').select('*', { count: 'exact', head: true });
        // Şimdilik örnek değerler, tablolar doldukça buralar otomatik güncellenecek
        setStats(prev => ({ ...prev, totalMembers: count || 0 }));
      };
      getStats();
    }
  }, [isLoggedIn]);

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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Patnos Dernek Takip</h2>
          <p className="text-slate-500 text-center mb-8">Yönetici girişi yapın</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Giriş Şifresi"
              className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200">
              Sisteme Gir
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Yan Menü */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col text-slate-400 border-r border-slate-800 shadow-2xl`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-900">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">{SYSTEM_CONFIG.PROJECT_NAME}</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsLoggedIn(false)} className="m-4 flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span className="font-bold">Güvenli Çıkış</span>}
        </button>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100 text-green-700 text-sm font-bold animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Sistem Çevrimiçi (Supabase Bağlı)
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'home' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Üye" value={stats.totalMembers} icon={Users} color="blue" />
                <StatCard title="Kasa Mevcudu" value={`${stats.balance} TL`} icon={Wallet} color="emerald" />
                <StatCard title="Aylık Gelir" value={`${stats.income} TL`} icon={ArrowUpRight} color="blue" />
                <StatCard title="Aylık Gider" value={`${stats.expense} TL`} icon={ArrowDownRight} color="red" />
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center py-16">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LayoutDashboard size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoş Geldiniz!</h2>
                <p className="text-slate-500 max-w-md mx-auto">Dernek yönetim paneli şu an aktif. Sol menüden üye ekleyebilir, aidat tahsilatlarını yönetebilir ve raporları inceleyebilirsiniz.</p>
              </div>
            </div>
          ) : activeTab === 'members' ? (
            <Members />
          ) : (
            <div className="text-center py-20 text-slate-400">Bu sayfa çok yakında veritabanına bağlanacak...</div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-600 shadow-blue-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    red: "bg-red-500 shadow-red-100"
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl text-white transition-transform group-hover:scale-110 ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
