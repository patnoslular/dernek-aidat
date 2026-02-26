import { useState, FormEvent } from 'react';
import Modal from './Modal';
import { Users } from 'lucide-react';
import { BulkMemberInput } from '../constants';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BulkMemberInput[]) => void;
}

export default function BulkAddModal({ isOpen, onClose, onAdd }: BulkAddModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lines = text.split('\n').filter(line => line.trim());
    const data: BulkMemberInput[] = lines.map(line => {
      const [name, phone] = line.split(',').map(s => s.trim());
      return {
        name: name || 'İsimsiz Üye',
        phone: phone || '0555 000 0000'
      };
    });

    if (data.length > 0) {
      onAdd(data);
    }
    onClose();
    setText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Toplu Üye Ekle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Üye Bilgileri (İsim, Telefon şeklinde her satıra bir kayıt)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Örn:&#10;Adem Keşan,0532 051 47 15&#10;Adem Tunç,0538 250 63 61"
            className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
          />
          <p className="text-[10px] text-slate-500 italic">
            * İsim ve telefon numarasını virgül (,) ile ayırarak alt alta ekleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
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
            Üyeleri Ekle
          </button>
        </div>
      </form>
    </Modal>
  );
}
