import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { supabase } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePie, Pie, Cell, Legend 
} from 'recharts';

const Reports = () => {
  const [data, setData] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    const { data: trans } = await supabase.from('transactions').select('*');

    if (trans) {
      let inc = 0, exp = 0;
      const cats: any = {};

      trans.forEach(t => {
        if (t.type === 'income') inc += Number(t.amount);
        else {
          exp += Number(t.amount);
          cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
        }
      });

      setData({ income: inc, expense: exp });
      setCategoryData(Object.keys(cats).map(name => ({ name, value: cats[name] })));
    }
    setLoading(false);
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

  const chartData = [
    { name: 'Gelirler', miktar: data.income },
    { name: 'Giderler', miktar: data.expense }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" /> Mali Raporlar ve Analiz
        </h1>
        <p className="text-slate-500 font-medium">Dernek gelir-gider dengesinin görsel özeti.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gelir-Gider Karşılaştırma Grafiği */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter">Genel Denge (TL)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="miktar" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gider Dağılımı Pasta Grafiği */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter">Gider Dağılımı</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePie>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </RePie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
        <div className="space-y-2">
          <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">Net Durum</p>
          <h2 className="text-5xl font-black">{(data.income - data.expense).toLocaleString('tr-TR')} TL</h2>
          <p className="text-blue-100 opacity-80 italic">Veritabanındaki tüm işlemlerin sonucudur.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <TrendingUp className="mb-2" />
            <p className="text-xs font-bold uppercase opacity-60">Toplam Gelir</p>
            <p className="text-xl font-black">{data.income.toLocaleString('tr-TR')} TL</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <TrendingDown className="mb-2" />
            <p className="text-xs font-bold uppercase opacity-60">Toplam Gider</p>
            <p className="text-xl font-black">{data.expense.toLocaleString('tr-TR')} TL</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
