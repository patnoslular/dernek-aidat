import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Search, Calendar, User, Wallet, ArrowUpRight } from 'lucide-react';
import { supabase } from '../constants';

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    member_id: '',
    amount: '',
    category: 'Aidat',
    description: '',
    type: 'income',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Üyeleri çek (Seçim kutusu için)
    const { data: mData } = await supabase.from('members').select('id, name');
    if (mData) setMembers(mData);

    // Gelirleri çek (Üye ismiyle birlikte)
    const { data: tData } = await supabase
      .from('transactions')
      .select(`
        *,
        members (
          name
        )
      `)
      .eq('type', 'income')
      .order('date', { ascending: false });
    
    if (tData) setTransactions(tData);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('transactions').insert([
      {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }
    ]);
    
    if (error) {
      alert("Hata oluştu: " + error.message);
    } else {
      setShowModal(false);
      setNewTransaction({ 
        member_id: '', 
        amount: '', 
        category: 'Aidat', 
        description: '', 
        type: 'income',
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
            <TrendingUp className="text-blue-600" /> Gelirler ve Tahsilat
          </h1>
          <p className="text-slate-500 font-medium">Dernek kasasına giren tüm aidat ve bağışlar.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all font-bold"
        >
          <Plus size={20} /> Yeni Tahsilat Yap
        </button>
      </div>

      {/* Liste Paneli */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5">Üye / Kaynak</th>
                <th className="px-6 py-5">Kategori</th>
                <th className="px-6 py-5">Miktar</th>
                <th className="px-6 py-5">Tarih</th>
                <th className="px-6 py-5">Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400">Veriler getiriliyor...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Henüz bir tahsilat kaydı bulunmuyor.</td></tr>
              ) : transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        {(t.members?.name || 'G').substring(0,2)}
                      </div>
                      <span className="font-bold text-slate-700">{t.members?.name || 'Genel Gelir'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">{t.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-blue-600 font-black text-lg">
                      <ArrowUpRight size={16} />
                      {t.amount.toLocaleString('tr-TR')} TL
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium text-sm">
                    {new Date(t.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-5 text-slate-400 text-sm italic italic">
                    {t.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kayıt Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl text-white">
                <Wallet size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tahsilat Yap</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tighter">Üye Seçimi</label>
                <select 
                  required
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  value={newTransaction.member_id}
                  onChange={e => setNewTransaction({...newTransaction, member_id: e.target.value})}
                >
                  <option value="">Ödemeyi yapanı seçin...</option>
                  {members.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tighter">Tutar (TL)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tighter">İşlem Tarihi</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={newTransaction.date}
                    onChange={e => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase tracking-tighter">Kategori</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  value={newTransaction.category}
                  onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
                >
                  <option value="Aidat">Aylık Aidat</option>
                  <option value="Bağış">Bağış</option>
                  <option value="Diğer">Diğer Gelir</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Vazgeç</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-black shadow-lg shadow-blue-200 transition-all uppercase tracking-tighter">Kaydı Tamamla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
