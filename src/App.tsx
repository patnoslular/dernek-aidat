/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
// Tasarımın yüklenmesi için gerekli olan CSS bağlantısını buraya ekledim
import './index.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Management from './components/Management';
import Login from './components/Login';
import { DUMMY_MEMBERS, Member, Transaction, DuesRules, DEFAULT_DUES_RULES, DUMMY_TRANSACTIONS, BulkMemberInput } from './constants';
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
  const [members, setMembers] = useState<Member[]>(() => 
    DUMMY_MEMBERS.map(m => ({ ...m, name: formatName(m.name) }))
  );
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);
  const [duesRules, setDuesRules] = useState<DuesRules>(DEFAULT_DUES_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const now = new Date();
    return `Bugün ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  // Update lastUpdated whenever data changes
  useEffect(() => {
    const now = new Date();
    setLastUpdated(`Bugün ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  }, [members, transactions, duesRules]);

  // Check if already authenticated (simple local storage)
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

  const handleAddMembers = (data: BulkMemberInput[]) => {
    if (!isAuthenticated) return;
    const newMembers: Member[] = data.map((item, index) => {
      const formattedName = formatName(item.name);
      return {
        id: (members.length + index + 1).toString(),
        name: formattedName,
        email: `${formattedName.toLowerCase().replace(/\s/g, '.')}@example.com`,
        phone: item.phone || '0555 000 0000',
        role: 'Üye',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        lastPaymentDate: '-',
        totalPaid: 0,
        payments: Array(12).fill(false)
      };
    });
    setMembers([...members, ...newMembers]);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    if (!isAuthenticated) return;
    const formattedMember = { ...updatedMember, name: formatName(updatedMember.name) };
    setMembers(members.map(m => m.id === formattedMember.id ? formattedMember : m));
  };

  const handleDeleteMember = (id: string) => {
    if (!isAuthenticated) return;
    setMembers(members.filter(m => m.id !== id));
  };

  const handleBulkDelete = (ids: string[]) => {
    if (!isAuthenticated) return;
    setMembers(members.filter(m => !ids.includes(m.id)));
  };

  const handleToggleStatus = (id: string) => {
    if (!isAuthenticated) return;
    setMembers(members.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!isAuthenticated) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    if (!isAuthenticated) return;
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const handleDeleteTransaction = (id: string) => {
    if (!isAuthenticated) return;
    setTransactions(transactions.filter(t => t.id !== id));
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
                "{activeTab}" sayfası şu anda geliştirme aşamasındadır. Lütfen Anasayfa veya Üyeler sekmesini deneyin.
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