import MemberTable from './MemberTable';
import { Member, DuesRules, BulkMemberInput, Transaction } from '../constants';

interface ManagementProps {
  members: Member[];
  duesRules: DuesRules;
  onAddMembers: (data: BulkMemberInput[]) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function Management({ 
  members, 
  duesRules, 
  onAddMembers, 
  onUpdateMember, 
  onDeleteMember, 
  onBulkDelete, 
  onToggleStatus,
  onAddTransaction
}: ManagementProps) {
  // Sadece yönetim rollerindeki üyeleri filtrele
  const managementMembers = members.filter(m => 
    m.role === 'Başkan' || 
    m.role === 'Başkan Yardımcısı' || 
    m.role === 'Yönetim'
  );

  return (
    <MemberTable 
      title="Yönetim Kurulu" 
      subtitle="Yönetim kurulu üyelerinin aidat takibi ve yetki yönetimi." 
      members={managementMembers} 
      duesRules={duesRules}
      onAddMembers={onAddMembers}
      onUpdateMember={onUpdateMember}
      onDeleteMember={onDeleteMember}
      onBulkDelete={onBulkDelete}
      onToggleStatus={onToggleStatus}
      onAddTransaction={onAddTransaction}
    />
  );
}
