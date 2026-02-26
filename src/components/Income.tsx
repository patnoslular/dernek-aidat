import TransactionManager from './TransactionManager';
import { Transaction, INCOME_CATEGORIES } from '../constants';

interface IncomeProps {
  transactions: Transaction[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function Income({ transactions, onAdd, onUpdate, onDelete }: IncomeProps) {
  return (
    <TransactionManager 
      title="Gelir Yönetimi"
      type="income"
      categories={INCOME_CATEGORIES}
      transactions={transactions}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}
