import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Search, Calendar, Wallet, ArrowDownRight, Tag } from 'lucide-react';
import { supabase } from '../constants';

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Kira',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'expense')
      .order('date', { ascending: false });
    
    if (data) setTransactions(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('transactions').insert([
      {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }
    ]);
    
    if (error) {
      alert("Hata: " + error.message);
    } else {
      setShowModal(false);
      setNewExpense({ 
        amount: '', 
        category: 'Kira', 
        description: '', 
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown className="text-red-600" /> Giderler ve Ödemeler
          </h1>
          <p className="text-slate-500 font-medium">Dernek kasasından çıkan tüm harcamalar.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-200 transition-all font-bold"
        >
          <Plus size={20} /> Yeni Gider Ekle
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5">Kategori</th>
                <th className="px-6 py-5">Açıklama</th>
                <th className="px-6 py-5">Miktar</th>
                <th className="px-6 py-5">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">Giderler yükleniyor...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-medium">Kayıtlı gider bulunamadı.</td></tr>
              ) : transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <Tag size={14} />
                      </div>
                      <span className="font-bold text-slate-700">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{t.description || '-'}</td>
                  <td className="px-6 py-5 text-red-600 font-black text-lg">
                    -{t.amount.toLocaleString('tr-TR')} TL
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm font-medium">
                    {new Date(t.date).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
                <ArrowDownRight size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Harcama Kaydet</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">Kategori</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="Kira">Kira</option>
                  <option value="Mutfak">Mutfak / İkram</option>
                  <option value="Fatura">Elektrik / Su / İnternet</option>
                  <option value="Temizlik">Temizlik Malzemeleri</option>
                  <option value="Etkinlik">Organizasyon / Etkinlik</option>
                  <option value="Diğer">Diğer Harcama</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">Tutar (TL)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-lg text-red-600"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">Tarih</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">Harcama Detayı</label>
                <textarea 
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-medium min-h-[100px]"
                  placeholder="Harcama hakkında kısa bilgi..."
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Vazgeç</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-black shadow-lg shadow-red-200 transition-all uppercase tracking-tighter">Gideri İşle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
