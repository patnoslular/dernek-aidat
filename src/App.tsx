import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './index.css';
import { supabase } from './lib/supabase';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Management from './components/Management';
import Login from './components/Login';
import { 
  Member, 
  Transaction, 
  DuesRules, 
  DEFAULT_DUES_RULES, 
  BulkMemberInput 
} from './constants';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Contact from './components/Contact';

const formatName = (name: string) => {
  return name.split(' ').filter(part => part.length > 0).map(part => {
    const firstLetter = part.charAt(0).toLocaleUpperCase('tr-TR');
    const rest = part.slice(1).toLocaleLowerCase('tr-TR');
    return firstLetter + rest;
  }).join(' ');
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duesRules, setDuesRules] = useState<DuesRules>(DEFAULT_DUES_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // VERİLERİ SUPABASE'DEN ÇEKME FONKSİYONU
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      // Üyeleri çek
      const { data: memberData, error: mError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (mError) throw mError;

      // İşlemleri çek
      const { data: transData, error: tError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (tError) throw tError;

      if (memberData) setMembers(memberData);
      if (transData) setTransactions(transData);

    } catch (error: any) {
      console.error('Veri çekme hatası:', error.message);
      alert('Veriler yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const auth = localStorage.getItem('dernek_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (password: string) => {
    if (password === '04patnos') {
      setIsAuthenticated(true);
      localStorage.setItem('dernek_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dernek_auth');
  };

  // ÜYE EKLEME
  const handleAddMembers = async (data: BulkMemberInput[]) => {
    const newMembers = data.map(item => ({
      name: formatName(item.name),
      phone: item.phone,
      role: 'Üye',
      status: 'active',
      join_date: new Date().toISOString().split('T')[0],
      payments: Array(12).fill(false),
      total_paid: 0
    }));

    const { error } = await supabase.from('members').insert(newMembers);
    
    if (error) {
      alert('Üye eklenirken hata oluştu: ' + error.message);
    } else {
      await fetchAllData(); // Veritabanından güncel listeyi tekrar çek
    }
  };

  // ÜYE GÜNCELLEME (AİDAT VB.)
  const handleUpdateMember = async (updatedMember: Member) => {
    const { error } = await supabase
      .from('members')
      .update({
        name: formatName(updatedMember.name),
        role: updatedMember.role,
        status: updatedMember.status,
        payments: updatedMember.payments,
        total_paid: updatedMember.totalPaid
      })
      .eq('id', updatedMember.id);
    
    if (error) {
      alert('Güncelleme hatası: ' + error.message);
    } else {
      await fetchAllData();
    }
  };

  // GELİR/GİDER EKLEME
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const { error } = await supabase.from('transactions').insert([transaction]);
    if (error) {
      alert('İşlem kaydedilemedi: ' + error.message);
    } else {
      await fetchAllData();
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Verileriniz güvenli şekilde yükleniyor...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard members={members} transactions={transactions} duesRules={duesRules} onUpdateDuesRules={setDuesRules} />;
      case 'members': return <Members members={members} duesRules={duesRules} onAddMembers={handleAddMembers} onUpdateMember={handleUpdateMember} onDeleteMember={() => {}} onBulkDelete={() => {}} onToggleStatus={() => {}} onAddTransaction={handleAddTransaction} />;
      case 'income': return <Income transactions={transactions.filter(t => t.type === 'income')} onAdd={handleAddTransaction} onUpdate={() => {}} onDelete={() => {}} />;
      case 'expenses': return <Expenses transactions={transactions.filter(t => t.type === 'expense')} onAdd={handleAddTransaction} onUpdate={() => {}} onDelete={() => {}} />;
      case 'reports': return <Reports members={members} transactions={transactions} duesRules={duesRules} />;
      case 'contact': return <Contact members={members} duesRules={duesRules} />;
      default: return <div className="text-white">Sayfa seçiniz.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} lastUpdated="Canlı Senkronize" />
        <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
