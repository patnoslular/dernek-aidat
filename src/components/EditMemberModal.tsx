import { useState, useEffect, FormEvent } from 'react';
import Modal from './Modal';
import { User, Phone, Shield } from 'lucide-react';
import { Member } from '../constants';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSave: (member: Member) => void;
}

export default function EditMemberModal({ isOpen, onClose, member, onSave }: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'Üye' as Member['role']
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        phone: member.phone,
        role: member.role
      });
    }
  }, [member]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (member) {
      onSave({
        ...member,
        ...formData
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Üye Düzenle">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            Ad Soyad
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Telefon Numarası
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Görev / Rol
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Member['role'] })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
          >
            <option value="Başkan">Başkan</option>
            <option value="Başkan Yardımcısı">Başkan Yardımcısı</option>
            <option value="Yönetim">Yönetim Kurulu</option>
            <option value="Üye">Üye</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </Modal>
  );
}
