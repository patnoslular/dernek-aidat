import MemberTable from './MemberTable';
import { Member, DuesRules, BulkMemberInput, Transaction } from '../constants';

interface MembersProps {
  members: Member[];
  duesRules: DuesRules;
  onAddMembers: (data: BulkMemberInput[]) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function Members({ 
  members, 
  duesRules, 
  onAddMembers, 
  onUpdateMember, 
  onDeleteMember, 
  onBulkDelete, 
  onToggleStatus,
  onAddTransaction
}: MembersProps) {
  return (
    <MemberTable 
      title="Üye Listesi" 
      subtitle="Derneğe kayıtlı tüm üyelerin aidat ve iletişim yönetimi." 
      members={members} 
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
