import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, LogOut } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-night-900 border-r border-slate-800 z-[60] flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4 lg:hidden">
            <div className="w-8" /> {/* Spacer */}
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center w-full">
            <img 
              src="https://static.wixstatic.com/media/7e2174_63be697a3dd64d06b050165599965a9a~mv2.png" 
              alt="Logo" 
              className="h-14 w-auto mb-2"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-white font-extrabold text-sm tracking-tight leading-tight mb-2">
              İzmir Patnoslular Derneği
            </h2>
            <div className="flex items-center gap-2 w-full px-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500/50"></div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                Dernek Takip Sistemi
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500/50"></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin Panel</p>
              <p className="text-xs text-slate-500 truncate">Yönetici</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
}
