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
import { createClient } from '@supabase/supabase-js';

// --- VERİTABANI BAĞLANTISI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// --- AYARLAR VE SABİTLER ---
export const SYSTEM_CONFIG = {
  CURRENCY: 'TL',
  PROJECT_NAME: 'Patnoslular Derneği',
  LOGIN_PASSWORD: '04patnos'
};

export const DEFAULT_DUES_RULES = {
  president: 30000,
  vicePresident: 30000,
  management: 18000,
  member: 2500
};

export const INCOME_CATEGORIES = ['Bağış', 'Diğer'];
export const EXPENSE_CATEGORIES = ['Kira', 'Mutfak', 'Fatura', 'Diğer'];

export const MENU_ITEMS = [
  { id: 'home', label: 'Anasayfa', icon: Home },
  { id: 'members', label: 'Üyeler', icon: Users },
  { id: 'management', label: 'Yönetim', icon: ShieldCheck },
  { id: 'income', label: 'Gelirler', icon: TrendingUp },
  { id: 'expenses', label: 'Giderler', icon: TrendingDown },
  { id: 'reports', label: 'Raporlar', icon: BarChart3 },
  { id: 'contact', label: 'İletişim', icon: Mail },
];

// Not: Eskiden burada olan DUMMY_MEMBERS ve DUMMY_TRANSACTIONS silindi. 
// Artık veriler doğrudan Supabase veritabanından gelecek.
