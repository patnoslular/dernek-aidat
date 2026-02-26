import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck,
  UserX,
  ShieldCheck,
  TrendingUp, 
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Settings
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Member, Transaction, DuesRules } from '../constants';
import { useState } from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex flex-col gap-4 border-l-4"
    style={{ borderLeftColor: `var(--color-${color}-500)` }}
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          %{Math.abs(trend)}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
  </motion.div>
);

export default function Dashboard({ 
  members, 
  transactions, 
  duesRules,
  onUpdateDuesRules
}: { 
  members: Member[], 
  transactions: Transaction[],
  duesRules: DuesRules,
  onUpdateDuesRules: (rules: DuesRules) => void
}) {
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [tempRules, setTempRules] = useState(duesRules);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const passiveMembers = members.filter(m => m.status === 'inactive').length;
  const managementMembers = members.filter(m => m.role === 'Başkan' || m.role === 'Başkan Yardımcısı' || m.role === 'Yönetim').length;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleSaveRules = () => {
    onUpdateDuesRules(tempRules);
    setIsEditingRules(false);
  };

  // Örnek grafik verisi (Gerçek verilerle dinamikleştirilebilir)
  const barData = [
    { name: 'Oca', gelir: 4500, gider: 2100 },
    { name: 'Şub', gelir: 5200, gider: 1800 },
    { name: 'Mar', gelir: 4800, gider: 3200 },
    { name: 'Nis', gelir: 6100, gider: 2400 },
    { name: 'May', gelir: 5500, gider: 2900 },
    { name: 'Haz', gelir: 6700, gider: 3100 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Anasayfa</h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Derneğinizin finansal ve üyelik performansına hızlı bir bakış.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800 w-fit">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          Otomatik Güncelleme Aktif
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Üye" value={totalMembers.toString()} icon={Users} color="indigo" />
        <StatCard title="Aktif Üye" value={activeMembers.toString()} icon={UserCheck} color="emerald" />
        <StatCard title="Pasif Üye" value={passiveMembers.toString()} icon={UserX} color="rose" />
        <StatCard title="Yönetim Kurulu" value={managementMembers.toString()} icon={ShieldCheck} color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Toplam Gelir" value={`₺${totalIncome.toLocaleString()}`} icon={TrendingUp} color="sky" />
        <StatCard title="Toplam Gider" value={`₺${totalExpense.toLocaleString()}`} icon={TrendingDown} color="rose" />
        <StatCard title="Kasa Durumu" value={`₺${balance.toLocaleString()}`} icon={Wallet} color="violet" />
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Yıllık Aidat Kuralları</h3>
          </div>
          <button 
            onClick={() => setIsEditingRules(!isEditingRules)}
            className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {isEditingRules ? 'İptal' : 'Kuralları Düzenle'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Başkan & Yrd.</span>
              {isEditingRules ? (
                <input 
                  type="number" 
                  value={tempRules.president}
                  onChange={(e) => setTempRules({...tempRules, president: Number(e.target.value), vicePresident: Number(e.target.value)})}
                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <span className="text-lg font-bold text-white">₺{duesRules.president.toLocaleString()}</span>
              )}
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 italic">Aylık: ₺{(duesRules.president / 12).toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Yönetim Kurulu</span>
              {isEditingRules ? (
                <input 
                  type="number" 
                  value={tempRules.management}
                  onChange={(e) => setTempRules({...tempRules, management: Number(e.target.value)})}
                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <span className="text-lg font-bold text-white">₺{duesRules.management.toLocaleString()}</span>
              )}
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-2/3"></div>
            </div>
            <p className="text-[10px] text-slate-500 italic">Aylık: ₺{(duesRules.management / 12).toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Üyeler</span>
              {isEditingRules ? (
                <input 
                  type="number" 
                  value={tempRules.member}
                  onChange={(e) => setTempRules({...tempRules, member: Number(e.target.value)})}
                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              ) : (
                <span className="text-lg font-bold text-white">₺{duesRules.member.toLocaleString()}</span>
              )}
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-1/3"></div>
            </div>
            <p className="text-[10px] text-slate-500 italic">Aylık: ₺{(duesRules.member / 12).toFixed(2)}</p>
          </div>
        </div>

        {isEditingRules && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSaveRules}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              Kuralları Kaydet
            </button>
          </div>
        )}
      </div>

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Gelir - Gider Dengesi</h3>
            <p className="text-sm text-slate-500 mt-1">Finansal hareketlerin karşılaştırmalı analizi.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gelir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-700"></div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gider</span>
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₺${value}`} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: '500' }}
              />
              <Bar 
                dataKey="gelir" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
              <Bar 
                dataKey="gider" 
                fill="#334155" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
