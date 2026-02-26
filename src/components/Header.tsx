import { Search, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  lastUpdated: string;
}

export default function Header({ onMenuToggle, lastUpdated }: HeaderProps) {
  const [year, setYear] = useState(2026);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const years = Array.from({ length: 10 }, (_, i) => 2026 + i);

  return (
    <header className="border-b border-slate-800 bg-night-950/80 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-4">
      <div className="flex items-center justify-between w-full md:w-auto">
        <button 
          onClick={onMenuToggle}
          className="p-2 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Mobile Logo/Title (visible only on mobile) */}
        <div className="flex flex-col items-center md:hidden flex-1">
          <img 
            src="https://static.wixstatic.com/media/7e2174_63be697a3dd64d06b050165599965a9a~mv2.png" 
            alt="Logo" 
            className="h-8 w-auto mb-1"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-white font-bold text-xs">İzmir Patnoslular Derneği</h2>
          <span className="text-[8px] text-slate-500">(Son güncelleme: {lastUpdated})</span>
        </div>

        {/* Mobile Actions (visible only on mobile) */}
        <div className="flex items-center gap-2 md:hidden">
          <button className="p-2 text-slate-400">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Centered Logo and Titles */}
      <div className="hidden md:flex flex-col items-center text-center flex-1">
        <img 
          src="https://static.wixstatic.com/media/7e2174_63be697a3dd64d06b050165599965a9a~mv2.png" 
          alt="İzmir Patnoslular Derneği Logo" 
          className="h-12 w-auto mb-1"
          referrerPolicy="no-referrer"
        />
        <h2 className="text-white font-extrabold text-lg tracking-tight">İzmir Patnoslular Derneği</h2>
        <div className="flex items-center gap-4 w-full max-w-md mt-1">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500/50"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] whitespace-nowrap">Dernek Takip Sistemi</span>
            <span className="text-[9px] text-slate-500 font-medium mt-0.5">(Son güncelleme: {lastUpdated})</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500/50"></div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-center md:justify-end">
        <div className="relative">
          <div 
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 md:px-3 py-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs md:text-sm font-medium text-slate-300">{year}</span>
            <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-slate-500 transition-transform ${isYearOpen ? 'rotate-180' : ''}`} />
          </div>

          {isYearOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-night-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    setIsYearOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    year === y ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {y} Çalışma Yılı
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-night-950"></span>
          </button>
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
