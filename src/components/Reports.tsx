import { motion } from 'motion/react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Member, Transaction, DuesRules } from '../constants';

interface ReportsProps {
  members: Member[];
  transactions: Transaction[];
  duesRules: DuesRules;
}

export default function Reports({ members, transactions, duesRules }: ReportsProps) {
  const currentMonth = new Date().getMonth();
  
  const getMonthlyDues = (role: Member['role']) => {
    switch (role) {
      case 'Başkan': return duesRules.president / 12;
      case 'Başkan Yardımcısı': return duesRules.vicePresident / 12;
      case 'Yönetim': return duesRules.management / 12;
      default: return duesRules.member / 12;
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  
  const activeMembers = members.filter(m => m.status === 'active').length;
  const passiveMembers = members.filter(m => m.status === 'inactive').length;

  // Calculate total expected dues and total debt
  let totalExpectedDues = 0;
  let totalDebt = 0;
  
  members.filter(m => m.status === 'active').forEach(member => {
    const monthlyAmount = getMonthlyDues(member.role);
    totalExpectedDues += monthlyAmount * (currentMonth + 1);
    
    for (let i = 0; i <= currentMonth; i++) {
      if (!member.payments[i]) {
        totalDebt += monthlyAmount;
      }
    }
  });

  const collectionRate = totalExpectedDues > 0 ? ((totalExpectedDues - totalDebt) / totalExpectedDues) * 100 : 0;

  const memberStatusData = [
    { name: 'Aktif Üye', value: activeMembers, color: '#10b981' },
    { name: 'Pasif Üye', value: passiveMembers, color: '#f43f5e' },
  ];

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const expenseData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Finansal & Üye Analizi</h2>
          <p className="text-slate-500 text-sm">Derneğinizin mali durumunu ve üye katılımını detaylı grafiklerle takip edin.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          PDF Rapor İndir
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-indigo-500">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Toplam Gelir</p>
          <h3 className="text-xl font-bold text-white mt-1">₺{totalIncome.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-emerald-500 text-[10px] font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>Tahsil Edilen</span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-rose-500">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Toplam Gider</p>
          <h3 className="text-xl font-bold text-white mt-1">₺{totalExpense.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-rose-500 text-[10px] font-bold">
            <TrendingDown className="w-3 h-3" />
            <span>Harcanan</span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-amber-500">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Bekleyen Alacak</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">₺{totalDebt.toLocaleString()}</h3>
          <p className="text-slate-500 text-[10px] mt-2">Ödenmemiş Aidatlar</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-emerald-500">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Tahsilat Oranı</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">%{collectionRate.toFixed(1)}</h3>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expense Bar Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Nakit Akışı Özeti</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Gelir', tutar: totalIncome, fill: '#6366f1' },
                { name: 'Gider', tutar: totalExpense, fill: '#f43f5e' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: number) => [`₺${value.toLocaleString()}`, 'Tutar']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="tutar" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Status Pie Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Üye Dağılımı</h3>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {memberStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 pr-8">
              {memberStatusData.map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-white">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 pl-5">{item.value} Kişi (%{((item.value / (members.length || 1)) * 100).toFixed(0)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Categories Pie Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">Gider Dağılımı (Kategori)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₺${value.toLocaleString()}`, 'Tutar']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Genel Özet</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs text-slate-400">Kasa Mevcudu</span>
              <span className={`text-sm font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₺{(totalIncome - totalExpense).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs text-slate-400">Tahsil Edilmeyi Bekleyen</span>
              <span className="text-sm font-bold text-amber-400">₺{totalDebt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
              <span className="text-xs text-slate-400">Ortalama Üye Ödemesi</span>
              <span className="text-sm font-bold text-white">
                ₺{(totalIncome / (activeMembers || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
            <p className="text-[10px] text-indigo-300 font-medium leading-relaxed">
              * Veriler anlık olarak güncellenmektedir. Tahsilat oranı aktif üyelerin yıl başından bu yana yapması gereken ödemeler üzerinden hesaplanmıştır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
