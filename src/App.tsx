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
import Income from './components/Income';
import Expenses from './components/Expenses';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, balance: 0, income: 0, expense: 0 });

  useEffect(() => {
    if (isLoggedIn) {
      calculateStats();
    }
  }, [isLoggedIn, activeTab]);

  const calculateStats = async () => {
    // 1. Toplam Üye Sayısı
    const { count } = await supabase.from('members').select('*', { count: 'exact', head: true });
    
    // 2. Tüm Hareketleri Çek (Gelir/Gider)
    const { data: trans } = await supabase.from('transactions').select('amount, type');
    
    let totalIncome = 0;
    let totalExpense = 0;

    if (trans) {
      trans.forEach(t => {
        if (t.type === 'income') totalIncome += Number(t.amount);
        if (t.type === 'expense') totalExpense += Number(t.amount);
      });
    }

    setStats({
      totalMembers: count || 0,
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    });
  };

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
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2 tracking-tight">Patnos Dernek Takip</h2>
          <p className="text-slate-500 text-center mb-8 font-medium">Lütfen yönetici şifresini girin</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Giriş Şifresi"
              className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-center tracking-widest text-lg"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 uppercase tracking-wider">
              Sisteme Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-slate-900 transition-all duration-300 flex flex-col text-slate-400 border-r border-slate-800 shadow-2xl overflow-hidden`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/20">
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
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
              {isSidebarOpen && <span className="font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsLoggedIn(false)} className="m-4 flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all font-bold">
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span>Güvenli Çıkış</span>}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100 text-green-700 text-sm font-black uppercase tracking-tighter">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Bulut Veritabanı Aktif
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'home' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Üye" value={stats.totalMembers} icon={Users} color="blue" />
                <StatCard title="Kasa Mevcudu" value={`${stats.balance.toLocaleString('tr-TR')} TL`} icon={Wallet} color="emerald" />
                <StatCard title="Toplam Gelir" value={`${stats.income.toLocaleString('tr-TR')} TL`} icon={ArrowUpRight} color="blue" />
                <StatCard title="Toplam Gider" value={`${stats.expense.toLocaleString('tr-TR')} TL`} icon={ArrowDownRight} color="red" />
              </div>
              
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
                  <LayoutDashboard size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Hoş Geldiniz, Başkan!</h2>
                <p className="text-slate-500 max-w-lg mx-auto font-medium text-lg leading-relaxed">
                  Şu an dernek kasasında <span className="text-emerald-600 font-black">{stats.balance.toLocaleString('tr-TR')} TL</span> bulunuyor. 
                  Sistemdeki tüm veriler güvenli bir şekilde Supabase bulut sunucularında saklanmaktadır.
                </p>
              </div>
            </div>
          ) : activeTab === 'members' ? (
            <Members />
          ) : activeTab === 'income' ? (
            <Income />
          ) : activeTab === 'expenses' ? (
            <Expenses />
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <BarChart3 size={64} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Bu Sayfa Geliştiriliyor...</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-600 shadow-blue-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    red: "bg-red-500 shadow-red-200"
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl text-white transition-all group-hover:scale-110 shadow-lg ${colors[color]}`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
