import { motion } from 'motion/react';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  UserX, 
  Trash2, 
  Phone, 
  Check
} from 'lucide-react';
import { useState } from 'react';
import { Member, DuesRules, BulkMemberInput, Transaction } from '../constants';
import BulkAddModal from './BulkAddModal';
import EditMemberModal from './EditMemberModal';

interface MemberTableProps {
  title: string;
  subtitle: string;
  members: Member[];
  duesRules: DuesRules;
  onAddMembers: (data: BulkMemberInput[]) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function MemberTable({ 
  title, 
  subtitle, 
  members, 
  duesRules,
  onAddMembers, 
  onUpdateMember, 
  onDeleteMember, 
  onBulkDelete,
  onToggleStatus,
  onAddTransaction
}: MemberTableProps) {
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const getMonthlyDues = (role: Member['role']) => {
    switch (role) {
      case 'Başkan': return duesRules.president / 12;
      case 'Başkan Yardımcısı': return duesRules.vicePresident / 12;
      case 'Yönetim': return duesRules.management / 12;
      default: return duesRules.member / 12;
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleToggleMemberPayment = (member: Member, monthIdx: number) => {
    const newPayments = [...member.payments];
    const isPaying = !newPayments[monthIdx];
    newPayments[monthIdx] = isPaying;
    
    const monthlyAmount = getMonthlyDues(member.role);

    if (isPaying) {
      onAddTransaction({
        amount: monthlyAmount,
        date: new Date().toISOString().split('T')[0],
        category: 'Aidat',
        description: `${member.name} - ${monthIdx + 1}. Ay Aidat Ödemesi`,
        type: 'income'
      });
    }

    const newTotalPaid = isPaying 
      ? member.totalPaid + monthlyAmount 
      : Math.max(0, member.totalPaid - monthlyAmount);

    onUpdateMember({ 
      ...member, 
      payments: newPayments,
      totalPaid: newTotalPaid,
      lastPaymentDate: isPaying ? new Date().toISOString().split('T')[0] : member.lastPaymentDate
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map(m => m.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`${selectedIds.length} üyeyi silmek istediğinize emin misiniz?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{selectedIds.length} Üyeyi Sil</span>
            </button>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim veya telefon ara..." 
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsBulkAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span className="sm:inline">Toplu Üye Ekle</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 md:px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={filteredMembers.length > 0 && selectedIds.length === filteredMembers.length}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Üye / Telefon</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Görev</th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  12 Aylık Aidat Takibi
                  <div className="flex justify-center gap-0.5 md:gap-1 mt-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="w-4 md:w-5 text-[8px] md:text-[9px] text-slate-600 font-bold">{i + 1}</span>
                    ))}
                  </div>
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredMembers.map((member) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={member.id} 
                  className={`hover:bg-slate-800/30 transition-colors group ${
                    member.status === 'inactive' 
                      ? 'bg-rose-500/5 text-rose-200/70' 
                      : selectedIds.includes(member.id) ? 'bg-indigo-600/5' : ''
                  }`}
                >
                  <td className="px-4 md:px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(member.id)}
                      onChange={() => handleToggleSelect(member.id)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-xs md:text-sm ${
                        member.status === 'active' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs md:text-sm font-semibold truncate ${member.status === 'active' ? 'text-white' : 'text-rose-200/60'}`}>{member.name}</p>
                        <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-500 mt-0.5">
                          <Phone className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          <span className="truncate">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 md:py-1 rounded-lg text-[9px] md:text-[11px] font-bold uppercase tracking-wider ${
                      member.role === 'Başkan' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      member.role === 'Başkan Yardımcısı' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      member.role === 'Yönetim' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex justify-center gap-0.5 md:gap-1">
                      {member.payments.map((isPaid, idx) => (
                        <button
                          key={idx}
                          disabled={member.status === 'inactive'}
                          onClick={() => handleToggleMemberPayment(member, idx)}
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-sm md:rounded-md flex items-center justify-center transition-all ${
                            isPaid 
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                              : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                          } ${member.status === 'inactive' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          title={`${idx + 1}. Ay (₺${getMonthlyDues(member.role).toFixed(0)})`}
                        >
                          {isPaid && <Check className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button 
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 md:p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" 
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => onToggleStatus(member.id)}
                        className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                          member.status === 'active' 
                            ? 'hover:bg-amber-500/10 text-slate-400 hover:text-amber-500' 
                            : 'hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500'
                        }`} 
                        title={member.status === 'active' ? 'Pasife Al' : 'Aktif Et'}
                      >
                        <UserX className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1.5 md:p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors" 
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 md:px-6 py-4 border-t border-slate-800 bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] md:text-xs text-slate-500 order-2 sm:order-1">Toplam {filteredMembers.length} kayıt listeleniyor</p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-slate-800 text-[10px] md:text-xs text-slate-400 disabled:opacity-50" disabled>Önceki</button>
            <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-indigo-600 text-[10px] md:text-xs text-white font-bold">1</button>
            <button className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-slate-800 text-[10px] md:text-xs text-slate-400">Sonraki</button>
          </div>
        </div>
      </div>

      <BulkAddModal 
        isOpen={isBulkAddOpen} 
        onClose={() => setIsBulkAddOpen(false)} 
        onAdd={onAddMembers}
      />
      
      <EditMemberModal 
        isOpen={!!editingMember} 
        onClose={() => setEditingMember(null)} 
        member={editingMember}
        onSave={onUpdateMember}
      />
    </div>
  );
}
