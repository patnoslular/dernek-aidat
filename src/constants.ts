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
  payments: boolean[];
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

// GÜNCELLENEN AİDAT KURALLARI
export const DEFAULT_DUES_RULES: DuesRules = {
  president: 30000,
  vicePresident: 30000,
  management: 18000,
  member: 2500,
};

export const INCOME_CATEGORIES = ['Aidat', 'Bağış', 'Etkinlik Geliri', 'Diğer'];
export const EXPENSE_CATEGORIES = ['Kira', 'Fatura', 'Mutfak', 'Etkinlik Gideri', 'Ofis Malzemeleri', 'Diğer'];

export const MENU_ITEMS = [
  { id: 'home', label: 'Anasayfa', icon: 'Home' },
  { id: 'members', label: 'Üye Listesi', icon: 'Users' },
  { id: 'management', label: 'Yönetim Kurulu', icon: 'ShieldCheck' },
  { id: 'income', label: 'Gelirler', icon: 'TrendingUp' },
  { id: 'expenses', label: 'Giderler', icon: 'TrendingDown' },
  { id: 'reports', label: 'Raporlar', icon: 'BarChart3' },
  { id: 'contact', label: 'İletişim & WhatsApp', icon: 'Phone' },
];

// Uygulama ilk açıldığında boş görünmesin diye örnek veriler
export const DUMMY_MEMBERS: Member[] = [];
export const DUMMY_TRANSACTIONS: Transaction[] = [];
