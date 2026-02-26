import { 
  Home, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Mail,
  CreditCard,
  UserPlus,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Calendar
} from 'lucide-react';

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
  payments: boolean[]; // 12 months, true if paid
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface BulkMemberInput {
  name: string;
  phone: string;
}

export interface DuesRules {
  president: number;
  vicePresident: number;
  management: number;
  member: number;
}

export const DEFAULT_DUES_RULES: DuesRules = {
  president: 30000,
  vicePresident: 30000,
  management: 18000,
  member: 2500
};

export const INCOME_CATEGORIES = ['Bağış', 'Diğer'];
export const EXPENSE_CATEGORIES = ['Kira', 'Mutfak', 'Fatura', 'Diğer'];

export const DUMMY_MEMBERS: Member[] = [
  { 
    id: '1', 
    name: 'Ahmet Yılmaz', 
    email: 'ahmet@example.com', 
    phone: '0555 111 2233', 
    role: 'Başkan',
    joinDate: '2023-01-15', 
    status: 'active', 
    lastPaymentDate: '2024-02-10', 
    totalPaid: 2400,
    payments: [true, true, false, false, false, false, false, false, false, false, false, false]
  },
  { 
    id: '2', 
    name: 'Mehmet Demir', 
    email: 'mehmet@example.com', 
    phone: '0555 222 3344', 
    role: 'Yönetim',
    joinDate: '2023-03-20', 
    status: 'active', 
    lastPaymentDate: '2024-01-15', 
    totalPaid: 2200,
    payments: [true, false, false, false, false, false, false, false, false, false, false, false]
  },
  { 
    id: '3', 
    name: 'Ayşe Kaya', 
    email: 'ayse@example.com', 
    phone: '0555 333 4455', 
    role: 'Üye',
    joinDate: '2023-06-10', 
    status: 'active', 
    lastPaymentDate: '2024-02-05', 
    totalPaid: 1800,
    payments: [true, true, true, false, false, false, false, false, false, false, false, false]
  },
  { 
    id: '4', 
    name: 'Fatma Şahin', 
    email: 'fatma@example.com', 
    phone: '0555 444 5566', 
    role: 'Üye',
    joinDate: '2023-08-05', 
    status: 'inactive', 
    lastPaymentDate: '2023-11-20', 
    totalPaid: 1200,
    payments: [true, true, false, false, false, false, false, false, false, false, false, false]
  },
  { 
    id: '5', 
    name: 'Can Özkan', 
    email: 'can@example.com', 
    phone: '0555 555 6677', 
    role: 'Yönetim',
    joinDate: '2024-01-02', 
    status: 'active', 
    lastPaymentDate: '2024-02-15', 
    totalPaid: 400,
    payments: [true, true, false, false, false, false, false, false, false, false, false, false]
  },
];

export const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 5000, date: '2024-02-10', category: 'Bağış', description: 'Yıllık bağış', type: 'income' },
  { id: 't2', amount: 1200, date: '2024-02-15', category: 'Fatura', description: 'Elektrik faturası', type: 'expense' },
  { id: 't3', amount: 2500, date: '2024-02-20', category: 'Kira', description: 'Şubat ayı kirası', type: 'expense' },
];

export const MENU_ITEMS = [
  { id: 'home', label: 'Anasayfa', icon: Home },
  { id: 'members', label: 'Üyeler', icon: Users },
  { id: 'management', label: 'Yönetim', icon: ShieldCheck },
  { id: 'income', label: 'Gelirler', icon: TrendingUp },
  { id: 'expenses', label: 'Giderler', icon: TrendingDown },
  { id: 'reports', label: 'Raporlar', icon: BarChart3 },
  { id: 'contact', label: 'İletişim', icon: Mail },
];
