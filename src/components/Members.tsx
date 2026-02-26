import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '../constants';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: 'Üye' });

  // Veritabanından üyeleri çek
  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Yeni üye ekle
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('members')
      .insert([newMember]);

    if (error) {
      alert('Hata: ' + error.message);
    } else {
      setShowAddModal(false);
      setNewMember({ name: '', email: '', phone: '', role: 'Üye' });
      fetchMembers();
    }
  };

  // Üye sil
  const deleteMember = async (id: string) => {
    if (window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (!error) fetchMembers();
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Üye Yönetimi</h1>
          <p className="text-slate-500">Toplam {members.length} kayıtlı üye bulunuyor.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus size={20} /> Yeni Üye Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Üye ara..."
            className="flex-1 outline-none text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Ad Soyad</th>
                <th className="px-6 py-4 font-semibold">İletişim</th>
                <th className="px-6 py-4 font-semibold">Görev</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Yükleniyor...</td></tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{member.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Mail size={14} /> {member.email}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Phone size={14} /> {member.phone}</div>
                  </td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{member.role}</span></td>
                  <td className="px-6 py-4"><span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block mr-2"></span> Aktif</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteMember(member.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Yeni Üye Kaydı</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                <input required className="w-full px-4 py-2 border rounded-xl" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                <input type="email" className="w-full px-4 py-2 border rounded-xl" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                <input className="w-full px-4 py-2 border rounded-xl" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-xl hover:bg-slate-50">Vazgeç</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
