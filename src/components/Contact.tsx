import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Member, DuesRules } from '../constants';

interface ContactProps {
  members: Member[];
  duesRules: DuesRules;
}

export default function Contact({ members, duesRules }: ContactProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const currentMonth = new Date().getMonth(); // 0-11

  const getMonthlyDues = (role: Member['role']) => {
    switch (role) {
      case 'Başkan': return duesRules.president / 12;
      case 'Başkan Yardımcısı': return duesRules.vicePresident / 12;
      case 'Yönetim': return duesRules.management / 12;
      default: return duesRules.member / 12;
    }
  };

  const calculateDebt = (member: Member) => {
    let debt = 0;
    const monthlyAmount = getMonthlyDues(member.role);
    
    // Calculate debt from January (0) to current month
    for (let i = 0; i <= currentMonth; i++) {
      if (!member.payments[i]) {
        debt += monthlyAmount;
      }
    }
    return debt;
  };

  const debtorMembers = members
    .filter(m => m.status === 'active')
    .map(m => ({
      ...m,
      debt: calculateDebt(m)
    }))
    .filter(m => m.debt > 0)
    .filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
    );

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const getRoleGreeting = (role: string) => {
    switch (role) {
      case 'Başkan': return 'Değerli Başkanımız';
      case 'Başkan Yardımcısı': return 'Değerli Başkan Yardımcımız';
      case 'Yönetim': return 'Değerli Yönetim Kurulu Üyemiz';
      default: return 'Değerli Üyemiz';
    }
  };

  const generateWhatsAppMessage = (member: any) => {
    const currentYear = new Date().getFullYear();
    const monthlyAmount = getMonthlyDues(member.role);
    const unpaidMonths = [];
    const breakdownParts = [];
    
    for (let i = 0; i <= currentMonth; i++) {
      if (!member.payments[i]) {
        unpaidMonths.push(monthNames[i]);
        breakdownParts.push(`${monthNames[i]} ${monthlyAmount.toLocaleString()} TL`);
      }
    }

    const greeting = getRoleGreeting(member.role);
    
    let monthsText = "";
    const monthsForText = [...unpaidMonths];
    if (monthsForText.length === 1) {
      monthsText = monthsForText[0];
    } else if (monthsForText.length > 1) {
      const lastMonth = monthsForText.pop();
      monthsText = `${monthsForText.join(', ')} ve ${lastMonth}`;
    }

    const breakdownText = breakdownParts.join(' + ');
    
    const message = `${greeting} ${member.name}

${currentYear} yılı itibari ile ${monthsText} aylarına ait ödenmemiş aidat borcunuz bulunmaktadır. Toplam borç miktarınız: ${member.debt.toLocaleString()} TL’dir (${breakdownText}).

Derneğimizin faaliyetlerini sürdürebilmesi, etkinliklerimizi düzenli şekilde gerçekleştirebilmemiz ve siz değerli üyelerimize daha iyi hizmet sunabilmemiz için aidat ödemeleri büyük önem taşımaktadır.

Aidat borcu bulunan üyelerimizin ödemelerini, Dernek Saymanımız M. Maşallah Utkan adına kayıtlı
T.C. Ziraat Bankası
IBAN: TR19 0001 0007 1162 5394 0550 03

numaralı hesaba yatırmalarını rica ederiz.

Desteğiniz ve anlayışınız için teşekkür eder, hayırlı kazançlar dileriz.`;

    const encodedMessage = encodeURIComponent(message);
    const phone = member.phone.replace(/\s/g, '');
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const handleBulkSend = async () => {
    if (debtorMembers.length === 0) return;
    
    const confirm = window.confirm(`${debtorMembers.length} üyeye WhatsApp mesajı gönderilecek. Tarayıcınızın çoklu pencere açmasına izin vermeniz gerekebilir. Devam etmek istiyor musunuz?`);
    
    if (confirm) {
      // To avoid browser blocking too many popups at once, we open them with a slight delay
      // and only a limited number at a time if possible, but here we'll try to open all
      // with a 1-second interval to be safer.
      for (let i = 0; i < debtorMembers.length; i++) {
        const member = debtorMembers[i];
        const url = generateWhatsAppMessage(member);
        
        // Open in a new tab
        window.open(url, '_blank');
        
        // Wait a bit before next one to reduce chance of being blocked as spam/popup
        if (i < debtorMembers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      alert('Tüm mesajlar WhatsApp Web üzerinden gönderilmek üzere kuyruğa alındı. Lütfen açılan pencerelerde "Gönder" butonuna basarak işlemi tamamlayın.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">İletişim & Borç Takibi</h2>
          <p className="text-slate-500 text-sm">Borçlu üyeleri listeleyin ve WhatsApp üzerinden hatırlatma gönderin.</p>
        </div>
        <button 
          onClick={handleBulkSend}
          disabled={debtorMembers.length === 0}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Toplu Mesaj Gönder ({debtorMembers.length})</span>
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Borçlu üye ara..." 
            className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debtorMembers.map((member) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={member.id}
            className="glass-card p-5 flex flex-col gap-4 border-l-4 border-rose-500"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{member.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Toplam Borç</p>
                <p className="text-lg font-bold text-rose-400">₺{member.debt.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              {member.phone}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <a 
                href={generateWhatsAppMessage(member)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {debtorMembers.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Borçlu Üye Bulunmuyor</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                Harika! Şu anda aidat borcu olan herhangi bir aktif üye bulunmamaktadır.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
