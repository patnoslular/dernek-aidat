/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './index.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Management from './components/Management';
import Login from './components/Login';
import { Member, Transaction, DuesRules, DEFAULT_DUES_RULES, BulkMemberInput, supabase } from './constants';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Contact from './components/Contact';

const formatName = (name: string) => {
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => {
      const firstLetter = part.charAt(0).toLocaleUpperCase('tr-TR');
      const rest = part.slice(1).toLocaleLowerCase('tr-TR');
      return firstLetter + rest;
    })
    .join(' ');
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duesRules, setDuesRules] = useState<DuesRules>(DEFAULT_DUES_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // VERİLERİ SUPABASE'DEN ÇEK
  const fetchData = async () => {
    const { data: memberData } = await supabase.from('members').select('*');
    const { data: transData } = await supabase.from('transactions').select('*');
    
    if (memberData) setMembers(memberData);
    if (transData) setTransactions(transData);
    
    const now = new Date();
    setLastUpdated(`Bugün ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    const auth = localStorage.getItem('dernek_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
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

  const handleAddMembers = async (data: BulkMemberInput[]) => {
    if (!isAuthenticated) return;
    const newMembers = data.map((item) => {
      const formattedName = formatName(item.name);
      return {
        name: formattedName,
        email: `${formattedName.toLowerCase().replace(/\s/g, '.')}@example.com`,
        phone: item.phone || '0555 000 0000',
        role: 'Üye',
        status: 'active',
        totalPaid: 0
      };
    });
    
    await supabase.from('members').insert(newMembers);
    fetchData();
  };

  const handleUpdateMember = async (updatedMember: Member) => {
    if (!isAuthenticated) return;
    const formattedMember = { ...updatedMember, name: formatName(updatedMember.name) };
    await supabase.from('members').update(formattedMember).eq('id', updatedMember.id);
    fetchData();
  };

  const handleDeleteMember = async (id: string) => {
    if (!isAuthenticated) return;
    await supabase.from('members').delete().eq('id', id);
    fetchData();
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!isAuthenticated) return;
    await supabase.from('members').delete().in('id', ids);
    fetchData();
  };

  const handleToggleStatus = async (id: string) => {
    if (!isAuthenticated) return;
    const member = members.find(m => m.id === id);
    if (member) {
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      await supabase.from('members').update({ status: newStatus }).eq('id', id);
      fetchData();
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isAuthenticated) return;
    await supabase.from('transactions').insert([transaction]);
    fetchData();
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    if (!isAuthenticated) return;
    await supabase.from('transactions').update(updatedTransaction).eq('id', updatedTransaction.id);
    fetchData();
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!isAuthenticated) return;
    await supabase.from('transactions').delete().eq('id', id);
    fetchData();
  };

  const handleUpdateDuesRules = (newRules: DuesRules) => {
    if (!isAuthenticated) return;
    setDuesRules(newRules);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            members={members} 
            transactions={transactions} 
            duesRules={duesRules}
            onUpdateDuesRules={handleUpdateDuesRules}
          />
        );
      case 'members':
        return (
          <Members 
            members={members} 
            duesRules={duesRules}
            onAddMembers={handleAddMembers}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onBulkDelete={handleBulkDelete}
            onToggleStatus={handleToggleStatus}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'management':
        return (
          <Management 
            members={members} 
            duesRules={duesRules}
            onAddMembers={handleAddMembers}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onBulkDelete={handleBulkDelete}
            onToggleStatus={handleToggleStatus}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'income':
        return (
          <Income 
            transactions={transactions.filter(t => t.type === 'income')}
            onAdd={handleAddTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            transactions={transactions.filter(t => t.type === 'expense')}
            onAdd={handleAddTransaction}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        );
      case 'reports':
        return (
          <Reports 
            members={members} 
            transactions={transactions} 
            duesRules={duesRules}
          />
        );
      case 'contact':
        return (
          <Contact 
            members={members} 
            duesRules={duesRules}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
              <span className="text-2xl font-bold">?</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Henüz Hazır Değil</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                "{activeTab}" sayfası şu anda geliştirme aşamasındadır.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-night-950 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header 
          onMenuToggle={() => setIsSidebarOpen(true)} 
          lastUpdated={lastUpdated}
        />
        
        <div className="p-4 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-6 md:p-8 border-t border-slate-800/50 text-center">
          <p className="text-[10px] md:text-xs text-slate-600">
            &copy; 2026 Dernek Aidat Takip Sistemi. Tüm hakları saklıdır.
          </p>
        </footer>
      </main>
    </div>
  );
}
