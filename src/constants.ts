export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Başkan' | 'Başkan Yardımcısı' | 'Yönetim' | 'Üye';
  joinDate: string;
  status: 'active' | 'inactive';
  lastPaymentDate: string;
  totalPaid: number;
  payments: boolean[]; // 12 ay için [true, false, ...]
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  memberId?: string;
}

export interface DuesRules {
  president: number;
  vicePresident: number;
  management: number;
  member: number;
}

export interface BulkMemberInput {
  name: string;
  phone: string;
}

export const DEFAULT_DUES_RULES: DuesRules = {
  president: 2400,
  vicePresident: 1800,
  management: 1200,
  member: 600,
};

// Hata buradaydı, başına "export" ekledik:
export const DUMMY_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'M. Maşallah Utkan',
    email: 'm.masallah@dernek.com',
    phone: '0532 000 00 00',
    role: 'Yönetim',
    joinDate: '2024-01-10',
    status: 'active',
    lastPaymentDate: '2024-02-15',
    totalPaid: 200,
    payments: [true, true, false, false, false, false, false, false, false, false, false, false],
  },
  {
    id: '2',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@dernek.com',
    phone: '0544 000 00 00',
    role: 'Üye',
    joinDate: '2024-02-01',
    status: 'active',
    lastPaymentDate: '-',
    totalPaid: 0,
    payments: Array(12).fill(false),
  }
];

// Hata buradaydı, başına "export" ekledik:
export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    category: 'Aidat',
    amount: 100,
    date: '2024-02-15',
    description: 'Şubat ayı aidatı - M. Maşallah Utkan',
    memberId: '1',
  },
  {
    id: 't2',
    type: 'expense',
    category: 'Kira',
    amount: 5000,
    date: '2024-02-01',
    description: 'Dernek binası kira ödemesi',
  }
];
