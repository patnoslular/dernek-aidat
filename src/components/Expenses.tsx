import TransactionManager from './TransactionManager';
import { Transaction, EXPENSE_CATEGORIES } from '../constants';

interface ExpensesProps {
  transactions: Transaction[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function Expenses({ transactions, onAdd, onUpdate, onDelete }: ExpensesProps) {
  return (
    <TransactionManager 
      title="Gider Yönetimi"
      type="expense"
      categories={EXPENSE_CATEGORIES}
      transactions={transactions}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}
