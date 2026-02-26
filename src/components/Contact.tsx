import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Share2, Send, AlertCircle } from 'lucide-react';
import { supabase } from '../constants';

const Contact = () => {
  const [debtors, setDebtors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebtors();
  }, []);

  const fetchDebtors = async () => {
    setLoading(true);
    // Bu basit mantıkta: Toplam aidatı 2500 TL kabul edip, ödemesi olmayanları çekiyoruz
    // İleride burayı daha karmaşık borç hesaplarına göre geliştirebiliriz
    const { data: members } = await supabase.from('members').select('*');
    const { data: trans } = await supabase.from('transactions').select('member_id, amount').eq('type', 'income');

    if (members) {
      const list = members.map(m => {
        const totalPaid = trans?.filter(t => t.member_id === m.id).reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        return { ...m, totalPaid, debt: 2500 - totalPaid }; // Örnek: 2500 TL yıllık aidat üzerinden
      }).filter(m => m.debt > 0);
      
      setDebtors(list);
    }
    setLoading(false);
  };

  const sendWhatsApp = (phone: string, name: string, amount: number) => {
    const message = `Selamlar Sayın ${name}, Patnoslular Derneği aidat ödemenizde ${amount} TL bakiye görünmektedir. Müsait olduğunuzda ödemenizi rica ederiz.`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* İletişim Kartları Sol */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Phone className="text-blue-600" /> Dernek İletişim
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <MapPin className="text-red-500" />
                  <span className="text-sm font-bold text-slate-600">Patnos, Ağrı</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Mail className="text-blue-500" />
                  <span className="text-sm font-bold text-slate-600">info@patnosdernegi.org</span>
                </div>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <h3 className="font-black mb-4 flex items-center gap-2 italic">
                <Clock className="text-blue-400" /> Mesai Saatleri
              </h3>
              <p className="text-sm text-slate-400 font-medium">Hafta içi: 09:00 - 18:00</p>
              <p className="text-sm text-slate-400 font-medium">Cumartesi: 10:00 - 15:00</p>
           </div>
        </div>

        {/* WhatsApp Borç Hatırlatma Sağ */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 bg-green-50 border-b border-green-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-green-800 flex items-center gap-2">
                <MessageCircle size={28} /> WhatsApp Aidat Takibi
              </h2>
              <p className="text-green-700 font-medium text-sm">Borcu olan üyelere hızlıca mesaj gönderin.</p>
            </div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg">
              {debtors.length} Üye
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white shadow-sm text-xs font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Üye</th>
                  <th className="px-8 py-4">Borç Durumu</th>
                  <th className="px-8 py-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={3} className="p-10 text-center text-slate-400">Yükleniyor...</td></tr>
                ) : debtors.length === 0 ? (
                  <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold">Borcu olan üye bulunamadı. Maaşallah!</td></tr>
                ) : debtors.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800">{m.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{m.phone}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-red-600 font-black">
                        <AlertCircle size={14} />
                        {m.debt.toLocaleString('tr-TR')} TL
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => sendWhatsApp(m.phone, m.name, m.debt)}
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-black transition-all shadow-md shadow-green-100 active:scale-95"
                      >
                        <Send size={14} /> Mesaj At
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
