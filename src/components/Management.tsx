import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Mail, Phone, Award, Star } from 'lucide-react';
import { supabase } from '../constants';

const Management = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    // Rolü Üye olmayanları (Yönetim kadrosunu) çek
    const { data } = await supabase
      .from('members')
      .select('*')
      .neq('role', 'Üye')
      .order('role', { ascending: true });

    if (data) setManagers(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Yönetim Kurulu
          </h1>
          <p className="text-slate-500 font-medium">Patnoslular Derneği yetkili yönetim kadrosu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">Yönetim listesi hazırlanıyor...</div>
        ) : managers.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">Henüz yönetim kadrosu atanmadı.</h3>
            <p className="text-slate-400 text-sm">Üyeler sayfasından üye rolünü "Başkan" veya "Yönetim" yaparak buraya ekleyebilirsiniz.</p>
          </div>
        ) : managers.map((manager: any) => (
          <div key={manager.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            {/* Arka plan süsü */}
            <div className="absolute -right-4 -top-4 text-blue-50 opacity-10 group-hover:scale-150 transition-transform duration-500">
              <ShieldCheck size={120} />
            </div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <User size={40} className="text-white" />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">{manager.name}</h3>
              <div className="inline-flex items-center gap-1 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Star size={12} fill="currentColor" />
                {manager.role}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
                  <Mail size={16} className="text-blue-400" />
                  {manager.email || 'E-posta belirtilmedi'}
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
                  <Phone size={16} className="text-blue-400" />
                  {manager.phone || 'Telefon belirtilmedi'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bilgi Notu */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-6">
        <div className="p-4 bg-white/10 rounded-2xl">
          <Award size={32} className="text-blue-400" />
        </div>
        <div>
          <h4 className="font-bold text-lg">Yönetim Kadrosu Nasıl Güncellenir?</h4>
          <p className="text-slate-400 text-sm italic">
            "Üyeler" sayfasına giderek bir üyenin rolünü "Başkan", "Başkan Yardımcısı" veya "Yönetim" olarak güncellediğinizde o kişi otomatik olarak bu sayfada listelenir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Management;
