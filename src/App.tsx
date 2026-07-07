import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// IMAGE & ASSET CONSTANTS
// ==========================================
const HERO_IMAGE = '/assets/jenny_hero.jpg';
const DENTIST_PORTRAIT = '/assets/jenny_about.jpg';

const DENTISTRY_CARD_BG = '/assets/dentistry_bg.jpg';
const DERMATOLOGY_CARD_BG = '/assets/dermatology_bg.jpg';

const GALLERY_ITEM_1 = '/assets/gallery_1.jpg';
const GALLERY_ITEM_2 = '/assets/gallery_2.jpg';
const GALLERY_ITEM_3 = '/assets/gallery_3.jpg';

// ==========================================
// TACTILE CLICK SYNTHESIZER
// ==========================================
const playPopSound = () => {
  try {
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.025);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  } catch (e) {
    // Fail silently
  }
};

// ==========================================
// CUSTOM HOOKS
// ==========================================
interface StaggeredReveal {
  containerRef: React.RefObject<HTMLElement | null>;
  getAnimStyle: (index: number) => React.CSSProperties;
}

function useStaggeredReveal(threshold = 0.15): StaggeredReveal {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(el);
      }
    }, { threshold });

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  const getAnimStyle = (index: number): React.CSSProperties => {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    };
  };

  return { containerRef, getAnimStyle };
}

// ==========================================
// SPLASH SCREEN COMPONENT
// ==========================================
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);
      setCount(currentCount);

      if (progress >= 1) {
        clearInterval(timer);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 150);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-[#f6f7f1] z-[100] flex items-center justify-center transition-all duration-700 ${exiting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6">
        {/* Soft Neumorphic Loading Circle */}
        <div className="w-40 h-40 rounded-full bg-[#f6f7f1] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.8)] flex items-center justify-center relative animate-[pulse_2s_infinite]">
          <div className="w-28 h-28 rounded-full bg-[#f6f7f1] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.85)] flex items-center justify-center">
            <span className="text-4xl font-extrabold text-neutral-800 tabular-nums">{count}%</span>
          </div>
        </div>
        <div className="text-center flex flex-col items-center gap-2 animate-[scaleUp_0.5s_ease-out]">
          <img src="/assets/logo_monogram.png" alt="Dr. Jenny Logo" className="w-20 h-auto object-contain filter drop-shadow-[3px_3px_5px_rgba(163,177,198,0.85)] drop-shadow-[-1px_-1px_2px_rgba(255,255,255,0.9)]" />
          <div className="flex flex-col items-center mt-2 select-none">
            <span className="text-2xl font-black text-neutral-800 tracking-tight leading-none">Dr. Jenny</span>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] mt-1.5">DENTAL & CARE</span>
          </div>
          <span className="block text-[9px] font-black text-neutral-400 uppercase tracking-[0.3em] mt-3">QUALITY CLINIC</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// NAVBAR COMPONENT
// ==========================================
interface NavbarProps {
  lang: 'ka' | 'en';
  setLang: (lang: 'ka' | 'en') => void;
  t: (en: string, ka: string) => string;
  onBookClick: () => void;
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t, onBookClick, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinksEn = ['Home', 'Services', 'About Me', 'Results', 'Contact'];
  const navLinksKa = ['მთავარი', 'სერვისები', 'ჩემს შესახებ', 'შედეგები', 'კონტაქტი'];
  const activeNavLinks = lang === 'en' ? navLinksEn : navLinksKa;
  const hashLinks = ['home', 'services', 'about', 'results', 'contact'];

  return (
    <>
      {/* Neumorphic floating pill navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-[#f6f7f1]/85 backdrop-blur-md rounded-full shadow-[6px_6px_15px_rgba(163,177,198,0.4),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20">
        {/* Logo Monogram & Name */}
        <div className="flex items-center gap-2 select-none cursor-pointer hover:scale-102 transition-transform">
          <img 
            src="/assets/logo_monogram.png" 
            alt="Dr. Jenny Logo Icon" 
            className="w-10 h-10 object-contain filter drop-shadow-[2px_2px_4px_rgba(163,177,198,0.7)]" 
          />
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black uppercase tracking-tight leading-none text-neutral-800">
              {t('Jenny', 'ჯენი')}
            </span>
            <span className="text-sm md:text-base font-black uppercase tracking-tight leading-none text-neutral-800 -mt-0.5">
              {t('Pirtskhalava', 'ფირცხალავა')}
            </span>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-4">
          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 mr-4">
            {activeNavLinks.map((link, i) => {
              const isActive = activeSection === hashLinks[i];
              return (
                <a 
                  key={link}
                  href={`#${hashLinks[i]}`}
                  className={`font-bold text-xs md:text-sm transition-all pb-1 ${isActive ? 'border-b-2 border-[#F5D061] text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  {link}
                </a>
              );
            })}
          </nav>

          {/* Neumorphic Language Switcher */}
          <div className="flex gap-1 bg-[#f6f7f1] p-1 rounded-full shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]">
            <button 
              onClick={() => setLang('ka')} 
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'ka' ? 'bg-neutral-800 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              KA
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'en' ? 'bg-neutral-800 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-800'}`}
            >
              EN
            </button>
          </div>

          {/* CTA & Drawer Trigger */}
          <div className="flex items-center gap-4">
            {/* Neumorphic styled Booking Button */}
            <button 
              onClick={onBookClick}
              className="px-5 py-2.5 bg-[#f6f7f1] rounded-full text-xs font-black text-neutral-800 shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.85)] border border-white/20 hover:scale-105 active:shadow-inner transition-all"
            >
              {t('Book Appointment', 'ვიზიტის დაჯავშნა')}
            </button>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 bg-[#f6f7f1] rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] border border-white/20 text-neutral-700 hover:text-black lg:hidden"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-neutral-900/10 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        />
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#f6f7f1] shadow-2xl border-l border-white/20 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col justify-center h-full px-8 gap-4 pt-16">
            {activeNavLinks.map((link, i) => (
              <a 
                key={link}
                href={`#${hashLinks[i]}`}
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-black text-neutral-800 hover:text-neutral-500 transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// INTERACTIVE BOOKING MODAL
// ==========================================
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ka' | 'en';
  t: (en: string, ka: string) => string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, lang, t }) => {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState<'dentistry' | 'dermatology'>('dentistry');
  const [treatment, setTreatment] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSpecialty('dentistry');
      setTreatment('');
      setSelectedDay(null);
      setSelectedTime('');
      setName('');
      setPhone('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const dentistryTreatments = lang === 'en' 
    ? ['Dental Veneers', 'Dental Crowns', 'Teeth Whitening', 'Dental Implants']
    : ['ესთეტიკური ვინირები', 'სამკურნალო გვირგვინები', 'კბილების გათეთრება', 'კბილის იმპლანტები'];

  const dermatologyTreatments = lang === 'en'
    ? ['Skin Rejuvenation', 'Skin Diagnostics', 'Aesthetic Procedures', 'Laser Therapy']
    : ['კანის გაახალგაზრდავება', 'კანის დიაგნოსტიკა', 'ესთეტიკური პროცედურები', 'ლაზერული თერაპია'];

  const activeTreatmentsList = specialty === 'dentistry' ? dentistryTreatments : dermatologyTreatments;
  const timeSlots = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekdays = lang === 'en' 
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['კვ', 'ორ', 'სამ', 'ოთხ', 'ხუ', 'პარ', 'შაბ'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f6f7f1]/60 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#f6f7f1] rounded-[36px] w-full max-w-5xl overflow-hidden shadow-[20px_20px_40px_rgba(163,177,198,0.7),-20px_-20px_40px_rgba(255,255,255,0.9)] border border-white/30 flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-[#f6f7f1] hover:shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5)] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/20 rounded-full flex items-center justify-center text-neutral-700 z-20 font-black text-sm transition-all"
        >
          ✕
        </button>

        {/* Left Column: Form Flow */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex gap-3 mb-8">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= num ? 'bg-neutral-800 shadow-sm' : 'bg-[#f6f7f1] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5)]'}`}
                />
              ))}
            </div>

            {/* Step 1: Select Specialty & Treatment */}
            {step === 1 && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl md:text-2xl font-black text-neutral-800 mb-4">
                  {t('Select Direction', 'აირჩიეთ მიმართულება')}
                </h3>
                
                {/* Specialty Toggle */}
                <div className="flex gap-2 bg-[#f6f7f1] p-1.5 rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] mb-6">
                  <button 
                    onClick={() => { setSpecialty('dentistry'); setTreatment(''); }}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${specialty === 'dentistry' ? 'bg-neutral-800 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    {t('🦷 Dentistry', '🦷 სტომატოლოგია')}
                  </button>
                  <button 
                    onClick={() => { setSpecialty('dermatology'); setTreatment(''); }}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${specialty === 'dermatology' ? 'bg-neutral-800 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    {t('✨ Dermatology', '✨ დერმატოლოგია')}
                  </button>
                </div>

                <span className="block text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-widest">
                  {t('Available Procedures', 'ხელმისაწვდომი პროცედურები')}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTreatmentsList.map((tItem) => (
                    <button
                      key={tItem}
                      onClick={() => {
                        setTreatment(tItem);
                        setStep(2);
                      }}
                      className={`p-5 text-left rounded-2xl border border-white/20 transition-all font-bold text-sm text-neutral-800 ${treatment === tItem ? 'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-neutral-100/40' : 'shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.85)] hover:scale-[1.01]'}`}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date Grid */}
            {step === 2 && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-black text-neutral-800 mb-4">
                  {t('Select Date & Time', 'აირჩიეთ თარიღი და დრო')}
                </h3>
                <div className="text-center font-bold text-xs text-neutral-500 uppercase tracking-widest mb-3">
                  {t('July 2026', 'ივლისი 2026')}
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-[#f6f7f1] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.85)] border border-white/25">
                  <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-[10px] md:text-xs text-neutral-400 mb-3">
                    {weekdays.map((w) => <div key={w}>{w}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={`offset-${idx}`} className="aspect-square" />
                    ))}
                    {calendarDays.map((day) => {
                      const isPast = day < 6;
                      const isSelected = selectedDay === day;
                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDay(day)}
                          className={`aspect-square text-xs md:text-sm font-black rounded-full flex items-center justify-center transition-all ${isPast ? 'text-neutral-300 cursor-not-allowed shadow-none' : isSelected ? 'bg-neutral-800 text-white shadow-inner scale-[0.93]' : 'bg-[#f6f7f1] text-neutral-800 shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:scale-105 border border-white/20'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDay && (
                  <div className="animate-[fadeIn_0.2s_ease-out]">
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl text-xs md:text-sm font-black transition-all ${selectedTime === time ? 'bg-neutral-800 text-white shadow-inner scale-[0.95]' : 'bg-[#f6f7f1] text-neutral-800 shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/20 hover:scale-[1.02]'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Form */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl md:text-2xl font-black text-neutral-800 mb-6">
                  {t('Confirm Booking Info', 'დაადასტურეთ ჯავშანი')}
                </h3>
                <div className="flex flex-col gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">
                      {t('Patient Name', 'პაციენტის სახელი და გვარი')}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('Giorgi Kalandadze', 'მაგ: გიორგი კალანდაძე')}
                      className="w-full px-5 py-4 rounded-2xl bg-[#f6f7f1] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] focus:outline-none text-sm font-bold text-neutral-800 border border-white/10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">
                      {t('Phone Number', 'ტელეფონის ნომერი')}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="593567998"
                      className="w-full px-5 py-4 rounded-2xl bg-[#f6f7f1] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] focus:outline-none text-sm font-bold text-neutral-800 border border-white/10"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-100/40 border border-white/20 text-xs font-bold text-neutral-600 flex flex-col gap-2">
                  <div>📋 {t('Specialty:', 'მიმართულება:')} <span className="text-neutral-800 font-extrabold">{specialty === 'dentistry' ? t('Dentistry', 'სტომატოლოგია') : t('Dermatology', 'დერმატოლოგია')}</span></div>
                  <div>🦷 {t('Service:', 'მომსახურება:')} <span className="text-neutral-800 font-extrabold">{treatment}</span></div>
                  <div>📅 {t('Date:', 'თარიღი:')} <span className="text-neutral-800 font-extrabold">{t(`July ${selectedDay}, 2026`, `${selectedDay} ივლისი, 2026`)}</span></div>
                  <div>🕒 {t('Time Slot:', 'დრო:')} <span className="text-neutral-800 font-extrabold">{selectedTime}</span></div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4.5 bg-neutral-800 text-white text-sm font-bold rounded-full hover:bg-neutral-700 shadow-md transition-colors mt-6"
                >
                  {t('Confirm Booking', 'ჯავშნის დადასტურება')}
                </button>
              </form>
            )}

            {/* Step 4: Success Message */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-[scaleUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="w-20 h-20 bg-[#f6f7f1] rounded-full shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center text-green-500 mb-6 text-3xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-neutral-800 mb-3">
                  {t('Booking Confirmed!', 'ვიზიტი წარმატებით დაიჯავშნა!')}
                </h3>
                <p className="text-neutral-500 text-xs max-w-[280px] md:max-w-md mb-8 leading-relaxed font-bold">
                  {t(
                    `Thank you, ${name}. We look forward to seeing you on July ${selectedDay} at ${selectedTime}.`,
                    `გმადლობთ, ${name}. გელოდებით კლინიკაში ${selectedDay} ივლისს, ${selectedTime} საათზე.`
                  )}
                </p>
                <button
                  onClick={onClose}
                  className="px-10 py-3.5 bg-neutral-800 text-white text-xs font-bold rounded-full hover:bg-neutral-700 shadow-md transition-colors"
                >
                  {t('Close', 'დახურვა')}
                </button>
              </div>
            )}
          </div>

          {step > 1 && step < 4 && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 text-xs font-black text-neutral-700 hover:scale-105 transition-transform"
              >
                {t('Back', 'უკან')}
              </button>
              {step === 2 && selectedDay && selectedTime && (
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-neutral-800 text-white text-xs font-bold rounded-full shadow-md hover:bg-neutral-700 transition-colors"
                >
                  {t('Continue', 'გაგრძელება')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Contact info & map */}
        <div className="w-full md:w-[400px] bg-[#f6f7f1]/80 border-t md:border-t-0 md:border-l border-neutral-300 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#f6f7f1] p-1 shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] border border-white/30 shrink-0 overflow-hidden">
              <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Pirtskhalava" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h4 className="font-black text-base text-neutral-800 leading-tight">{t('Dr. Jenny Pirtskhalava', 'ჯენი ფირცხალავა')}</h4>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">{t('Dentist & Dermatologist', 'სტომატოლოგი და დერმატოლოგი')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs font-black text-neutral-600 mb-6">
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#f6f7f1] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">📞</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Phone', 'ტელეფონი')}</p>
                <a href="tel:+995593567998" className="text-neutral-800 font-black hover:underline">+995 593 56-79-98</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#f6f7f1] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">✉️</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Email', 'ელ-ფოსტა')}</p>
                <a href="mailto:info@jenny.ge" className="text-neutral-800 font-black hover:underline">info@jenny.ge</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#f6f7f1] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">📍</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Address', 'მისამართი')}</p>
                <span className="text-neutral-800 font-black">{t('14 Meliton and Andria Balanchivadze St, Tbilisi', 'მელიტონ და ანდრია ბალანჩივაძეების ქ. 14, თბილისი')}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[180px] rounded-3xl overflow-hidden shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20">
            <iframe 
              src="https://maps.google.com/maps?q=14%20Meliton%20and%20Andria%20Balanchivadze%20St,%20Tbilisi&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(90%) contrast(1.1) brightness(0.95)' }} 
              allowFullScreen={false} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clinic location map"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CHATBOT ASSISTANT WIDGET
// ==========================================
interface ChatbotWidgetProps {
  lang: 'ka' | 'en';
  t: (en: string, ka: string) => string;
  onBookClick: () => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ lang, t, onBookClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  interface Message {
    sender: 'bot' | 'user';
    text: string;
    options?: { label: string; action: string }[];
  }

  const initChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: t(
          'Hello! I am Dr. Jenny Pirtskhalava\'s digital assistant. How can I help you today?',
          'მოგესალმებით! მე ვარ ექიმი ჯენი ფირცხალავას ციფრული ასისტენტი. რით შემიძლია დაგეხმაროთ?'
        ),
        options: [
          { label: t('📅 Book Appointment', '📅 ვიზიტის დაჯავშნა'), action: 'book' },
          { label: t('📞 Contact Info', '📞 კონტაქტები'), action: 'contact' },
          { label: t('🕒 Working Hours', '🕒 სამუშაო საათები'), action: 'hours' },
        ]
      }
    ]);
  };

  useEffect(() => {
    initChat();
  }, [lang]);

  useEffect(() => {
    const hasClosed = sessionStorage.getItem('chat_closed');
    if (!hasClosed) {
      const timer = setTimeout(() => {
        initChat();
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleAction = (action: string, label: string) => {
    const userMsg: Message = { sender: 'user', text: label };
    let botReply: Message = { sender: 'bot', text: '' };

    if (action === 'book') {
      botReply = {
        sender: 'bot',
        text: t('Opening the booking calendar for you now...', 'ხსნით საჯავშნო კალენდარს...')
      };
      setMessages((prev) => [...prev, userMsg, botReply]);
      setTimeout(() => {
        setIsOpen(false);
        onBookClick();
      }, 700);
      return;
    } else if (action === 'contact') {
      botReply = {
        sender: 'bot',
        text: t(
          '📞 Phone: +995 593 56-79-98\n✉️ Email: info@jenny.ge\n📍 Address: 14 Meliton and Andria Balanchivadze St, Tbilisi',
          '📞 ტელეფონი: +995 593 56-79-98\n✉️ ელ-ფოსტა: info@jenny.ge\n📍 მისამართი: მელიტონ და ანდრია ბალანჩივაძეების ქ. 14, თბილისი'
        ),
        options: [
          { label: t('📅 Book Appointment', '📅 ვიზიტის დაჯავშნა'), action: 'book' },
          { label: t('✈️ Comprehensive Info (Telegram)', '✈️ ამომწურავი ინფორმაცია (Telegram)'), action: 'telegram' },
          { label: t('🏠 Back to Options', '🏠 საწყისი მენიუ'), action: 'reset' }
        ]
      };
    } else if (action === 'hours') {
      botReply = {
        sender: 'bot',
        text: t(
          '🕒 Monday - Friday: 10:00 - 19:00\nSaturday: 11:00 - 16:00\nSunday: Closed',
          '🕒 ორშაბათი - პარასკევი: 10:00 - 19:00\nშაბათი: 11:00 - 16:00\nკვირა: დასვენება'
        ),
        options: [
          { label: t('📅 Book Appointment', '📅 ვიზიტის დაჯავშნა'), action: 'book' },
          { label: t('✈️ Comprehensive Info (Telegram)', '✈️ ამომწურავი ინფორმაცია (Telegram)'), action: 'telegram' },
          { label: t('🏠 Back to Options', '🏠 საწყისი მენიუ'), action: 'reset' }
        ]
      };
    } else if (action === 'reset') {
      botReply = {
        sender: 'bot',
        text: t('How else can I help you?', 'რით შემიძლია კიდევ დაგეხმაროთ?'),
        options: [
          { label: t('📅 Book Appointment', '📅 ვიზიტის დაჯავშნა'), action: 'book' },
          { label: t('📞 Contact Info', '📞 კონტაქტები'), action: 'contact' },
          { label: t('🕒 Working Hours', '🕒 სამუშაო საათები'), action: 'hours' }
        ]
      };
    } else if (action === 'telegram') {
      botReply = {
        sender: 'bot',
        text: t(
          'For comprehensive information and automated direct assistant, you can transition to our Telegram Bot:',
          'ამომწურავი ინფორმაციისა და ავტომატური ასისტენტის მომსახურებისთვის შეგიძლიათ ისარგებლოთ ჩვენი ტელეგრამ ბოტით:'
        ),
        options: [
          { label: t('✈️ Open Telegram Chat', '✈️ ტელეგრამზე გადასვლა'), action: 'open_tg' },
          { label: t('🏠 Back to Options', '🏠 საწყისი მენიუ'), action: 'reset' }
        ]
      };
      // Auto-open in new window
      setTimeout(() => {
        window.open('https://t.me/JennyDentbot', '_blank');
      }, 700);
    } else if (action === 'open_tg') {
      window.open('https://t.me/JennyDentbot', '_blank');
      return;
    }

    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  return (
    <div className="fixed bottom-20 right-20 z-50 flex flex-col items-end">
      {/* Glow effect styles for gray tactile collapsed button */}
      <style>{`
        @keyframes pulse-gray {
          0%, 100% {
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.08), 6px 6px 12px rgba(163, 177, 198, 0.45);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.16), 6px 6px 12px rgba(163, 177, 198, 0.45);
            transform: scale(1.04);
          }
        }
      `}</style>

      {isOpen && (
        <div className="w-[320px] md:w-[350px] h-[450px] bg-[#f6f7f1] border border-white/30 rounded-[32px] overflow-hidden shadow-[10px_10px_25px_rgba(163,177,198,0.6),-10px_-10px_25px_rgba(255,255,255,0.85)] flex flex-col mb-4 animate-[scaleUp_0.25s_ease-out]">
          <div className="bg-black text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 bg-black p-1">
                <img src="/assets/logo_monogram.png" alt="Dr. Jenny Avatar" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs leading-none">{t('Jenny\'s Assistant', 'ჯენის ასისტენტი')}</h4>
                <span className="text-[9px] text-green-400 font-bold uppercase mt-0.5 block">{t('Online', 'ონლაინ')}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                sessionStorage.setItem('chat_closed', 'true');
              }}
              className="text-white hover:text-neutral-300 font-bold text-sm focus:outline-none"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#f6f7f1]">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed ${msg.sender === 'user' ? 'bg-neutral-800 text-white rounded-tr-none shadow-md' : 'bg-[#f6f7f1] border border-white/30 text-neutral-800 rounded-tl-none shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.85)]'}`}
                >
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.action}
                        onClick={() => handleAction(opt.action, opt.label)}
                        className="w-full py-3 px-4 bg-[#f6f7f1] border border-white/20 hover:scale-[1.02] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] rounded-xl text-left text-xs font-black text-neutral-800 transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <button 
        onClick={() => {
          if (isOpen) {
            sessionStorage.setItem('chat_closed', 'true');
          } else {
            initChat();
          }
          setIsOpen(!isOpen);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/20 transition-all relative ${
          isOpen 
            ? 'bg-[#f6f7f1] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.85)] hover:scale-105' 
            : 'bg-neutral-200 text-neutral-800 animate-[pulse-gray_2.5s_infinite] shadow-lg'
        }`}
        aria-label="Open chat assistant"
      >
        {isOpen ? (
          <span className="text-xl font-bold text-neutral-700">✕</span>
        ) : (
          <div className="w-11 h-11 rounded-full overflow-hidden p-1">
            <img src="/assets/logo_monogram.png" alt="Dr. Jenny Chat Assistant" className="w-full h-full object-contain" />
          </div>
        )}
      </button>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<'ka' | 'en'>('ka');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const t = (en: string, ka: string) => (lang === 'en' ? en : ka);

  const s1Reveal = useStaggeredReveal();
  const s2Reveal = useStaggeredReveal();
  const s3Reveal = useStaggeredReveal();
  const s4Reveal = useStaggeredReveal();

  useEffect(() => {
    const sections = ['home', 'services', 'about', 'results', 'contact'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.15, rootMargin: '-10% 0px -55% 0px' }
      );
      
      observer.observe(el);
      return { el, observer };
    });
    
    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') || 
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      if (isInteractive) {
        playPopSound();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f1] text-neutral-800 select-none font-sans overflow-x-hidden" style={{ backgroundImage: "url('/assets/paper_texture.jpg')", backgroundRepeat: "repeat" }}>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onBookClick={() => setIsBookingOpen(true)} 
        activeSection={activeSection}
      />

      {/* Extremely faint, hand-sketched scroll-following calligraphic guide line */}
      <ScrollDrawingAnimation />

      <main className="pt-24">
        {/* ==========================================
            SECTION 1 - HERO
            ========================================== */}
        <section 
          id="home"
          ref={s1Reveal.containerRef}
          className="relative min-h-[85vh] flex items-center overflow-hidden py-12 px-6 max-w-[1200px] mx-auto"
        >
          {/* Faint Calligraphic Fireworks in Hero background */}
          <CalligraphicFirework className="absolute left-[10%] top-[15%] w-96 h-96 opacity-[0.03] text-neutral-800 -z-10" />
          <CalligraphicFirework className="absolute right-[5%] bottom-[10%] w-80 h-80 opacity-[0.025] text-neutral-800 -z-10 animate-[spin_120s_linear_infinite]" />
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div 
              style={s1Reveal.getAnimStyle(0)}
              className="flex flex-col gap-6 items-start z-10 relative"
            >
              {/* Hand-drawn dental tools watermark sketch behind text */}
              <img 
                src="/assets/hands_drawing.png" 
                alt="Hands holding dental tools watermark" 
                className="absolute -left-16 top-16 w-[420px] max-w-none pointer-events-none select-none opacity-[0.22] -z-10"
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f6f7f1] rounded-full text-xs font-black text-neutral-800 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.85)] border border-white/10 select-none">
                ✨ DENTAL & CARE
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight">
                {t('Healthy Smile & Glandular Skin', 'ჯანსაღი ღიმილი და მოვლილი კანი —')}
                <span className="block text-neutral-500 font-extrabold text-2xl md:text-4xl mt-2">
                  {t('The Foundation of Confidence', 'თქვენი თავდაჯერებულობის საფუძველი')}
                </span>
              </h1>

              <p className="text-xs md:text-sm font-bold text-neutral-500 max-w-md leading-relaxed">
                {t(
                  'Premium dental and dermatological services, tailored precisely to meet current technology benchmarks and clinical excellence.',
                  'უმაღლესი ხარისხის სტომატოლოგიური და დერმატოლოგიური მომსახურება, რომელიც პასუხობს უახლეს ტექნოლოგიურ გამოწვევებს.'
                )}
              </p>

              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 py-4 bg-[#f6f7f1] hover:scale-105 rounded-full font-black text-neutral-800 shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20 active:shadow-inner transition-all text-xs uppercase tracking-wider"
                >
                  {t('Book Visit Now', 'ვიზიტის დაჯავშნა')}
                </button>
                <a
                  href="#services"
                  className="px-8 py-4 bg-transparent border-2 border-dashed border-neutral-300 hover:border-neutral-500 rounded-full font-black text-neutral-700 text-xs flex items-center justify-center transition-all"
                >
                  {t('Services', 'მომსახურებები')}
                </a>
              </div>
            </div>

            {/* Right Interactive Circle Frame */}
            <div 
              style={s1Reveal.getAnimStyle(1)}
              className="relative flex justify-center items-center w-full aspect-square"
            >
              <div className="absolute -z-10 w-[90%] h-[90%] bg-[#f6f7f1] rounded-full blur-3xl opacity-40" />
              <div id="hero-portrait-container" className="relative w-[80%] aspect-square">
                {/* Hand-drawn delicate calligraphic orbit */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_50s_linear_infinite] opacity-[0.18] pointer-events-none select-none" viewBox="0 0 100 100">
                  <path 
                    d="M 50 2 C 76.5 2, 98 23.5, 98 50 C 98 76.5, 76.5 98, 50 98 C 23.5 98, 2 76.5, 2 50 C 2 23.5, 23.5 2, 50 2 Z M 48 4 C 74 2, 96 24, 94 48 C 92 72, 70 94, 48 94 C 24 94, 4 72, 6 48 C 8 24, 24 6, 48 4 Z" 
                    fill="none" 
                    stroke="#404040" 
                    strokeWidth="0.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 52 1 C 79 3, 99 23, 97 52 C 95 79, 75 99, 52 97 C 23 95, 3 75, 5 52 C 7 23, 23 5, 52 1 Z" 
                    fill="none" 
                    stroke="#F5D061" 
                    strokeWidth="0.3" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full overflow-hidden shadow-[10px_10px_25px_rgba(163,177,198,0.5),-10px_-10px_25px_rgba(255,255,255,0.9)] border-[8px] border-white">
                  <img src={HERO_IMAGE} alt="Jenny clinical portrait" className="w-full h-full object-cover scale-105" />
                </div>

                {/* Floating Glass Badges */}
                <div className="absolute top-[10%] -left-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 hidden md:block hover:-translate-y-2 hover:scale-105 hover:bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <p className="text-xs font-black text-neutral-800">{t('Expertise', 'ექსპერტული ცოდნა')}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{t('15+ Years Practice', '15+ წლიანი გამოცდილება')}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[10%] -right-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 hidden md:block hover:-translate-y-2 hover:scale-105 hover:bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#F5D061] flex items-center justify-center text-white text-xl font-black shrink-0 shadow-[0_2px_8px_rgba(245,208,97,0.4)]">
                      ★
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs font-black text-neutral-800 leading-none">{t('5.0 Rating', '5.0 რეიტინგი')}</p>
                      <div className="flex text-[#F5D061] text-[11px] tracking-tight leading-none mt-1">
                        ★★★★★
                      </div>
                      <p className="text-[9px] font-bold text-neutral-400 mt-1">{t('Google Reviews', 'Google Reviews')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 2 - DUAL DIRECTIONS
            ========================================== */}
        <section 
          id="services"
          ref={s2Reveal.containerRef}
          className="relative py-20 px-6 max-w-[1200px] mx-auto bg-[#f6f7f1] rounded-[36px] shadow-[inset_4px_4px_10px_rgba(163,177,198,0.5),inset_-4px_-4px_10px_rgba(255,255,255,0.85)] border border-white/20"
        >
          {/* Extremely faint Calligraphic float ornament in margin */}
          <CalligraphicFloat left={20} top={40} />
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight">
              {t('Our Specializations', 'ჩვენი მიმართულებები')}
            </h2>
            <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mt-2 max-w-lg mx-auto">
              {t('Integrated approach to dentistry and advanced aesthetic skin care.', 'ინტეგრირებული მიდგომა ჯანმრთელობასა და სილამაზესთან.')}
            </p>
          </div>

          <div 
            style={s2Reveal.getAnimStyle(0)}
            className="grid md:grid-cols-2 gap-8 w-full"
          >
            {/* Dentistry Direction Card */}
            <div className="group relative overflow-hidden rounded-[28px] shadow-lg h-[460px] bg-neutral-100">
              <img src={DENTISTRY_CARD_BG} alt="Dentistry showcase" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col items-start gap-4">
                {/* Neumorphic accent label */}
                <span className="px-4 py-2 bg-[#F5D061] text-neutral-800 font-black text-[10px] rounded-full shadow-md uppercase tracking-wider">
                  {t('Dentistry', 'სტომატოლოგია')}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-none">
                  {t('Aesthetic Dentistry', 'ესთეტიკური და აღდგენითი სტომატოლოგია')}
                </h3>
                <p className="text-neutral-300 text-xs md:text-sm font-semibold max-w-sm">
                  {t('Implants, porcelain veneers, crowns and aesthetic smile makeovers.', 'იმპლანტოლოგია, ორთოდონტია და ჰოლივუდის ღიმილი.')}
                </p>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 bg-[#f6f7f1] hover:scale-105 hover:bg-neutral-800 hover:text-white hover:-translate-y-0.5 text-neutral-800 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  {t('Book slots', 'სრულად ნახვა')}
                </button>
              </div>
            </div>

            {/* Dermatology Direction Card */}
            <div className="group relative overflow-hidden rounded-[28px] shadow-lg h-[460px] bg-neutral-100">
              <img src={DERMATOLOGY_CARD_BG} alt="Dermatology showcase" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col items-start gap-4">
                {/* Neumorphic accent label */}
                <span className="px-4 py-2 bg-[#f6f7f1] text-neutral-800 font-black text-[10px] rounded-full shadow-md uppercase tracking-wider">
                  {t('Dermatology', 'დერმატოლოგია')}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-none">
                  {t('Advanced Dermatology', 'თანამედროვე სამედიცინო დერმატოლოგია')}
                </h3>
                <p className="text-neutral-300 text-xs md:text-sm font-semibold max-w-sm">
                  {t('Skin diagnostics, anti-aging therapies and aesthetic procedures.', 'კანის გაახალგაზრდავება, დიაგნოსტიკა და ესთეტიკური პროცედურები.')}
                </p>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3.5 bg-[#f6f7f1] hover:scale-105 hover:bg-neutral-800 hover:text-white hover:-translate-y-0.5 text-neutral-800 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  {t('Book slots', 'სრულად ნახვა')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 3 - ABOUT JENNY
            ========================================== */}
        <section 
          id="about"
          ref={s3Reveal.containerRef}
          className="relative py-20 px-6 max-w-[1200px] mx-auto grid md:grid-cols-12 gap-12 items-center"
        >
          {/* Contour 3: Tooth and braces next to portrait (Enlarged format) */}
          <img 
            src="/assets/tooth_braces.png" 
            alt="Tooth and braces watermark" 
            className="absolute -left-24 top-4 w-[380px] h-auto pointer-events-none select-none opacity-[0.22] -z-10"
          />
          {/* Contour 2: Hands and tools next to biography text */}
          <img 
            src="/assets/hands_drawing.png" 
            alt="Hands and tools watermark" 
            className="absolute right-4 bottom-4 w-[300px] h-auto pointer-events-none select-none opacity-[0.20] -z-10"
          />
          {/* Portrait frame */}
          <div 
            style={s3Reveal.getAnimStyle(0)}
            className="md:col-span-5 relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-lg border-[12px] border-white">
              <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Pirtskhalava" className="w-full grayscale-0 hover:scale-102 transition-transform duration-500" />
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#F5D061] p-6 rounded-2xl shadow-lg border border-white/20 hidden md:block select-none">
              <p className="text-3xl font-black text-neutral-900 leading-none">15+</p>
              <p className="text-[10px] font-black text-neutral-900/80 uppercase tracking-widest mt-1">{t('Years Practice', 'წლიანი გამოცდილება')}</p>
            </div>
          </div>

          {/* Details Content */}
          <div 
            style={s3Reveal.getAnimStyle(1)}
            className="md:col-span-7 flex flex-col gap-6"
          >
            <div>
              <span className="text-[#F5D061] font-black tracking-widest text-[10px] uppercase block mb-1">
                {t('Personal Approach', 'პერსონალური მიდგომა')}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight">
                {t('Dr. Jenny Pirtskhalava', 'ჯენი ფირცხალავა')}
              </h2>
            </div>

            <p className="text-xs md:text-sm font-bold text-neutral-500 leading-relaxed max-w-xl">
              {t(
                'My goal is to establish a relaxing, safe and welcoming atmosphere for each patient. Our clinical experience allows us to provide comprehensive solutions across both general and aesthetic dentistry, as well as dermatological procedures.',
                'ჩემი მიზანია შევქმნა გარემო, სადაც პაციენტი გრძნობს თავს კომფორტულად და უსაფრთხოდ. ჩემი განათლება და მრავალწლიანი პრაქტიკა საშუალებას მაძლევს შემოგთავაზოთ კომპლექსური გადაწყვეტილებები როგორც სტომატოლოგიაში, ასევე დერმატოლოგიაში.'
              )}
            </p>

            {/* Checklist of 4 advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('International Certifications', 'საერთაშორისო სერტიფიკატები')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Advanced Equipment', 'თანამედროვე აპარატურა')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Personalized Treatment Plans', 'პერსონალური მკურნალობის გეგმა')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Guaranteed Results', 'გარანტირებული შედეგი')}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsBookingOpen(true)}
              className="self-start px-8 py-4 bg-[#262626] hover:bg-neutral-800 hover:-translate-y-1 text-white text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300"
            >
              {t('Contact Me', 'დაწვრილებით ჩემს შესახებ')}
            </button>
          </div>
        </section>

        {/* ==========================================
            SECTION 4 - RESULTS GALLERY
            ========================================== */}
        <section 
          id="results"
          ref={s4Reveal.containerRef}
          className="relative py-20 px-6 max-w-[1200px] mx-auto"
        >
          {/* Extremely faint Calligraphic float ornament in margin */}
          <CalligraphicFloat left={20} top={20} delay={4} />
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight">
                {t('Our Results', 'ჩვენი შედეგები')}
              </h2>
              <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mt-2">
                {t('Observe real patient smile transformations and aesthetic restorations.', 'ნახეთ, როგორ ვცვლით ღიმილს და კანის მდგომარეობას ყოველდღიურად.')}
              </p>
            </div>
            
            {/* Arrows */}
            <div className="flex gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-[#f6f7f1] flex items-center justify-center font-bold text-xs transition-colors">←</button>
              <button className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-[#f6f7f1] flex items-center justify-center font-bold text-xs transition-colors">→</button>
            </div>
          </div>

          <div 
            style={s4Reveal.getAnimStyle(0)}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
          >
            {/* Gallery Item 1 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100">
              <img src={GALLERY_ITEM_1} alt="Dental Restoration Case" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Implantology', 'იმპლანტოლოგია')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('Full mouth restoration', 'სრული რესტავრაცია')}</p>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100">
              <img src={GALLERY_ITEM_2} alt="Veneers Transformation Case" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Aesthetic Smile', 'ესთეტიკური ღიმილი')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('After ceramic veneers placement', 'ვენირების შემდეგ')}</p>
              </div>
            </div>

            {/* Gallery Item 3 - See More Card */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100">
              <img src={GALLERY_ITEM_3} alt="Full Orthodontic teeth model" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-transparent p-6 flex flex-col justify-end items-start gap-3 w-full">
                <div>
                  <h4 className="font-black text-lg text-white mb-1 tracking-tight">{t('See More Cases', 'იხილეთ მეტი')}</h4>
                  <p className="text-neutral-300 text-[11px] font-bold">{t('500+ successful cosmetic cases', '500+ წარმატებული შემთხვევა')}</p>
                </div>
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-3 bg-[#f6f7f1] hover:scale-105 hover:bg-neutral-800 hover:text-white hover:-translate-y-0.5 text-neutral-800 font-black text-xs rounded-xl shadow-md transition-all duration-300"
                >
                  {t('Gallery', 'გალერეა')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 5 - CLIENT REVIEWS
            ========================================== */}
        <section className="py-20 px-6 bg-[#f6f7f1] border-t border-b border-white/10">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col gap-4">
              <div className="text-yellow-500 font-bold text-lg">★★★★★</div>
              <p className="text-xs md:text-sm font-bold text-neutral-500 italic leading-relaxed">
                {t(
                  '"Amazing service and extremely warm environment. Jenny is a true professional, I am highly satisfied with my veneer restoration."',
                  '"საოცარი მომსახურება და ძალიან თბილი გარემო. ჯენი ნამდვილი პროფესიონალია, შედეგით ძალიან კმაყოფილი ვარ."'
                )}
              </p>
              <span className="text-xs font-black text-neutral-800">{t('Mariam Beridze', 'მარიამ ბერიძე')}</span>
            </div>

            {/* Review 2 */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col gap-4">
              <div className="text-yellow-500 font-bold text-lg">★★★★★</div>
              <p className="text-xs md:text-sm font-bold text-neutral-500 italic leading-relaxed">
                {t(
                  '"Everything is at the highest level in the clinic, starting from state-of-the-art equipment to the care and support of the medical team."',
                  '"კლინიკაში ყველაფერი უმაღლეს დონეზეა, დაწყებული აპარატურით, დამთავრებული პერსონალის დამოკიდებულებით."'
                )}
              </p>
              <span className="text-xs font-black text-neutral-800">{t('Levan Giorgadze', 'ლევან გიორგაძე')}</span>
            </div>

            {/* Review 3 */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60 flex flex-col gap-4">
              <div className="text-yellow-500 font-bold text-lg">★★★★★</div>
              <p className="text-xs md:text-sm font-bold text-neutral-500 italic leading-relaxed">
                {t(
                  '"The best choice to resolve any dental and dermatological issues. Highly recommend Dr. Jenny Pirtskhalava to everyone."',
                  '"საუკეთესო არჩევანი სტომატოლოგიური და ესთეტიკური პრობლემების მოსაგვარებლად. გირჩევთ ყველას!"'
                )}
              </p>
              <span className="text-xs font-black text-neutral-800">{t('Ana Metreveli', 'ანა მეტრეველი')}</span>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer id="contact" className="bg-[#f6f7f1] border-t border-white/20 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 max-w-[1200px] mx-auto">
          {/* Logo brand & socials */}
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3 select-none hover:scale-102 transition-transform">
              <img 
                src="/assets/logo_monogram.png" 
                alt="Dr. Jenny Logo Icon" 
                className="w-12 h-12 object-contain filter drop-shadow-[2px_2px_4px_rgba(163,177,198,0.7)]" 
              />
              <div className="flex flex-col">
                <span className="text-lg font-black text-neutral-800 leading-none">Dr. Jenny</span>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">DENTAL & CARE</span>
              </div>
            </div>
            <p className="text-xs font-bold text-neutral-500 max-w-sm leading-relaxed mt-2">
              {t(
                'Your health and visual aesthetic are our priorities. Call or write us to schedule an online diagnostic appointment.',
                'თქვენი ჯანმრთელობა და სილამაზე ჩვენი პრიორიტეტია. დაგვიკავშირდით ნებისმიერ დროს.'
              )}
            </p>
            
            {/* Social icons row */}
            <div className="flex gap-3.5 mt-4">
              <a href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@jennypirtskhalava?_r=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="TikTok">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.41-.33-.25-.63-.53-.9-.85-.02 2.22.01 4.43-.02 6.65-.09 1.91-.73 3.86-2.07 5.24-1.63 1.76-4.22 2.62-6.57 2.23-2.31-.34-4.54-1.92-5.46-4.14-1.07-2.43-.65-5.5 1.12-7.51 1.5-1.77 3.96-2.63 6.22-2.22v4.18c-1.34-.34-2.88-.02-3.89.93-.97.9-.99 2.52-.16 3.55.77.99 2.14 1.34 3.32.96 1.07-.31 1.83-1.33 1.89-2.45.06-2.95.02-5.91.04-8.86v-.03z"/>
                </svg>
              </a>
              <a href="https://t.me/JennyDentbot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Telegram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6.15-.15 2.72-2.5 2.77-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.85 1.17-5.23 3.45-.5.34-.95.5-1.35.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.47.97-.73 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.53 4.4-1.8 4.89-1.8.11 0 .35.03.5.15.13.1.17.24.18.35-.01.07.01.19 0 .28z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3.5 items-start">
            <span className="font-black text-neutral-800 text-sm mb-1">{t('Services Offered', 'მომსახურებები')}</span>
            <a href="#services" className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors">{t('General Dentistry', 'სტომატოლოგია')}</a>
            <a href="#services" className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors">{t('Dermatology Care', 'დერმატოლოგია')}</a>
            <a href="#contact" className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors">{t('Clinic Location', 'კლინიკის მდებარეობა')}</a>
          </div>

          {/* Working hours */}
          <div className="flex flex-col gap-3.5 items-start">
            <span className="font-black text-neutral-800 text-sm mb-1">{t('Working Hours', 'სამუშაო საათები')}</span>
            <div className="text-xs font-bold text-neutral-500 flex flex-col gap-2 w-full">
              <div className="flex justify-between gap-4"><span>{t('Mon - Fri:', 'ორშაბათი - პარასკევი:')}</span> <span className="text-neutral-800 font-black">10:00 - 19:00</span></div>
              <div className="flex justify-between gap-4"><span>{t('Saturday:', 'შაბათი:')}</span> <span className="text-neutral-800 font-black">11:00 - 16:00</span></div>
              <div className="flex justify-between gap-4"><span>{t('Sunday:', 'კვირა:')}</span> <span className="text-red-500 font-black uppercase tracking-wider">{t('Closed', 'დასვენება')}</span></div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] font-bold text-neutral-400 mt-12 pt-6 border-t border-neutral-300 max-w-[1200px] mx-auto">
          © 2026 Jenny Pirtskhalava. {t('All rights reserved.', 'ყველა უფლება დაცულია.')}
        </div>
      </footer>

      {/* Booking Dialog */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        lang={lang} 
        t={t} 
      />

      {/* Chatbot Widget */}
      <ChatbotWidget 
        lang={lang} 
        t={t} 
        onBookClick={() => setIsBookingOpen(true)} 
      />
    </div>
  );
};

export default App;

// ==========================================
// SCROLL DRAWING ANIMATION (Calligraphic Brush Path)
// ==========================================
const ScrollDrawingAnimation: React.FC = () => {
  const [pathD, setPathD] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  
  const calculatePath = () => {
    try {
      const heroEl = document.getElementById('hero-portrait-container');
      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about-portrait-container');
      const footerLogoEl = document.getElementById('footer-logo-container');
      
      if (!heroEl || !servicesEl || !aboutEl || !footerLogoEl) return;
      
      const getCoords = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
          x: rect.left + scrollLeft + rect.width / 2,
          y: rect.top + scrollTop + rect.height / 2,
          width: rect.width,
          height: rect.height,
          left: rect.left + scrollLeft,
          top: rect.top + scrollTop,
        };
      };
      
      const hero = getCoords(heroEl);
      const services = getCoords(servicesEl);
      const about = getCoords(aboutEl);
      const footer = getCoords(footerLogoEl);
      
      // Start in the top header center, slightly offset
      const startX = window.innerWidth / 2;
      const startY = 110;
      
      // Segment 1: Calligraphic curve from header to Hero Portrait orbit
      const r = hero.width / 2 + 10;
      const circleTopX = hero.x;
      const circleTopY = hero.y - r;
      
      let d = `M ${startX} ${startY} `;
      d += `C ${startX - 60} ${startY + 80}, ${circleTopX - 140} ${circleTopY - 100}, ${circleTopX} ${circleTopY} `;
      
      // Loop around hero portrait circle twice to simulate calligraphic thread overlays
      d += `A ${r} ${r} 0 1 1 ${circleTopX - 0.1} ${circleTopY} `;
      d += `A ${r - 4} ${r - 4} 0 1 0 ${circleTopX + 0.1} ${circleTopY + 4} `;
      
      // Segment 2: Curve out of loop down to the Directions section
      const dirTopY = services.top;
      const dirCenterX = services.x;
      const dirBottomY = services.top + services.height;
      const midY1 = (hero.y + r + dirTopY) / 2;
      
      // Calligraphic cursive loop-de-loop
      d += `C ${hero.x + 80} ${hero.y + r + 60}, ${dirCenterX + 120} ${midY1 - 60}, ${dirCenterX + 50} ${midY1} `;
      d += `C ${dirCenterX - 40} ${midY1 + 60}, ${dirCenterX - 80} ${dirTopY - 80}, ${dirCenterX} ${dirTopY - 20} `;
      
      // Segment 3: Pass down between direction cards with wave flow
      const midY2 = (dirTopY + dirBottomY) / 2;
      d += `C ${dirCenterX + 40} ${dirTopY + 60}, ${dirCenterX - 40} ${midY2 - 60}, ${dirCenterX} ${midY2} `;
      d += `C ${dirCenterX + 40} ${midY2 + 60}, ${dirCenterX - 40} ${dirBottomY - 60}, ${dirCenterX} ${dirBottomY - 40} `;
      
      // Segment 4: Curve to the left towards About photo container
      const aboutX = about.left - 40;
      const aboutY = about.top + about.height / 2;
      const midY3 = (dirBottomY + about.top) / 2;
      
      d += `C ${dirCenterX + 80} ${dirBottomY + 30}, ${aboutX - 160} ${midY3 - 40}, ${aboutX - 60} ${midY3} `;
      // Cursive loop flourish in empty space
      d += `C ${aboutX + 20} ${midY3 + 40}, ${aboutX - 100} ${aboutY - 120}, ${aboutX} ${aboutY} `;
      
      // Segment 5: Wave down towards the Footer logo
      const footerX = footer.x;
      const footerY = footer.top - 40;
      const midY4 = (aboutY + footerY) / 2;
      
      d += `C ${aboutX + 80} ${aboutY + 220}, ${footerX - 220} ${midY4 - 80}, ${footerX - 60} ${midY4} `;
      d += `C ${footerX + 60} ${midY4 + 80}, ${footerX - 100} ${footerY - 80}, ${footerX} ${footerY} `;
      
      // Segment 6: Loop around the footer logo twice (calligraphic overlap)
      const fr = footer.width / 2 + 12;
      const logoTopX = footer.x;
      const logoTopY = footer.y - fr;
      
      d += `C ${footer.x - 30} ${footerY}, ${logoTopX - 35} ${logoTopY - 10}, ${logoTopX} ${logoTopY} `;
      d += `A ${fr} ${fr} 0 1 1 ${logoTopX - 0.1} ${logoTopY} `;
      d += `A ${fr - 4} ${fr - 4} 0 1 0 ${logoTopX + 0.1} ${logoTopY + 4} `;
      
      // Segment 7: Calligraphic wave underlines underneath the logo
      const lineY1 = footer.y + fr + 10;
      const lineY2 = lineY1 + 8;
      d += `M ${footer.x - 60} ${lineY1} C ${footer.x - 20} ${lineY1 - 4}, ${footer.x + 20} ${lineY1 + 4}, ${footer.x + 60} ${lineY1} `;
      d += `M ${footer.x - 45} ${lineY2} C ${footer.x - 15} ${lineY2 - 3}, ${footer.x + 15} ${lineY2 + 3}, ${footer.x + 45} ${lineY2} `;
      
      setPathD(d);
    } catch (e) {
      console.warn("Calligraphic path calculation failed:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(calculatePath, 600);
    window.addEventListener('resize', calculatePath);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePath);
    };
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    setPathLength(length);
  }, [pathD]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal <= 0) return;
      
      const scrollPercent = window.scrollY / scrollTotal;
      const drawPercent = Math.min(scrollPercent * 1.12, 1.0);
      setDashOffset(pathLength * (1 - drawPercent));
      
      const aboutEl = document.getElementById('about-portrait-container');
      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.7 && rect.bottom > 0;
        setShowFireworks(isInView);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathLength]);

  return (
    <>
      {/* Keyframe float animations block */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(4deg) scale(1.02); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1.02); }
          50% { transform: translateY(15px) rotate(-4deg) scale(1); }
        }
      `}</style>

      <svg className="absolute top-0 left-0 w-full pointer-events-none select-none z-0" style={{ height: document.documentElement.scrollHeight }}>
        <defs>
          <filter id="rough-pencil" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        
        {pathD && (
          <path 
            ref={pathRef}
            d={pathD} 
            fill="none" 
            stroke="#404040" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#rough-pencil)"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-150 ease-out opacity-[0.08]"
          />
        )}
      </svg>
      
      {showFireworks && <FireworkEffect />}
    </>
  );
};

// ==========================================
// RADIAL FIREWORKS EXPLOSION EFFECT (Subtle Outline)
// ==========================================
const FireworkEffect: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const aboutEl = document.getElementById('about-portrait-container');
    if (aboutEl) {
      const rect = aboutEl.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setCoords({
        x: rect.right + scrollLeft - 10,
        y: rect.top + scrollTop - 15,
      });
    }
  }, []);
  
  if (coords.x === 0) return null;
  
  return (
    <>
      <style>{`
        @keyframes spark {
          0% {
            stroke-dasharray: 0, 100;
            stroke-dashoffset: 0;
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          65% {
            stroke-dasharray: 20, 100;
            stroke-dashoffset: -15;
            opacity: 0.7;
          }
          100% {
            stroke-dasharray: 0, 100;
            stroke-dashoffset: -40;
            opacity: 0;
          }
        }
      `}</style>
      
      <svg 
        className="absolute pointer-events-none select-none z-10 w-40 h-40 -translate-x-1/2 -translate-y-1/2" 
        style={{ left: coords.x, top: coords.y }}
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="firework-pencil" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        
        <g filter="url(#firework-pencil)" stroke="#F5D061" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const x1 = 50 + Math.cos(angle) * 10;
            const y1 = 50 + Math.sin(angle) * 10;
            const x2 = 50 + Math.cos(angle) * 36;
            const y2 = 50 + Math.sin(angle) * 36;
            return (
              <line 
                key={i} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                className="animate-[spark_1.4s_ease-out_infinite]"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            );
          })}
        </g>
      </svg>
    </>
  );
};

// ==========================================
// FLOATING CALLIGRAPHIC ORNAMENT BACKGROUNDS
// ==========================================
interface CalligraphicFloatProps {
  top?: number;
  left?: number;
  right?: number;
  delay?: number;
  reverse?: boolean;
}

const CalligraphicFloat: React.FC<CalligraphicFloatProps> = ({ top = 20, left, right, delay = 0, reverse = false }) => {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, { threshold: 0.05 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${top}px`,
    left: left !== undefined ? `${left}px` : 'auto',
    right: right !== undefined ? `${right}px` : 'auto',
    animation: `${reverse ? 'float-reverse' : 'float-slow'} 25s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  };
  
  return (
    <div 
      ref={containerRef}
      style={style}
      className="pointer-events-none select-none z-0 hidden lg:block opacity-[0.035] text-neutral-800 transition-opacity duration-1000"
    >
      <svg className="w-56 h-auto" viewBox="0 0 100 160" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <filter id="float-pencil" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        
        <g filter="url(#float-pencil)">
          <path 
            d="M 50 35 C 38 18, 25 22, 28 45 C 32 68, 45 75, 50 78 C 55 75, 68 68, 72 45 C 75 22, 62 18, 50 35 Z" 
            className="transition-all duration-[2000ms] ease-out"
            style={{
              strokeDasharray: '400',
              strokeDashoffset: inView ? '0' : '400'
            }}
          />
          <path 
            d="M 42 30 C 46 25, 54 25, 58 30" 
            className="transition-all duration-[2000ms] ease-out delay-300"
            style={{
              strokeDasharray: '100',
              strokeDashoffset: inView ? '0' : '100'
            }}
          />
          <path 
            d="M 35 40 C 45 42, 55 42, 65 40" 
            className="transition-all duration-[2000ms] ease-out delay-500"
            style={{
              strokeDasharray: '150',
              strokeDashoffset: inView ? '0' : '150'
            }}
          />
          <path 
            d="M 50 78 C 45 88, 55 98, 50 108 C 45 118, 55 128, 50 138 C 45 145, 52 148, 50 152" 
            className="transition-all duration-[2500ms] ease-out delay-700"
            style={{
              strokeDasharray: '300',
              strokeDashoffset: inView ? '0' : '300'
            }}
          />
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// CALLIGRAPHIC FIREWORK SPARKLE BACKGROUND
// ==========================================
interface CalligraphicFireworkProps {
  className?: string;
  style?: React.CSSProperties;
}

const CalligraphicFirework: React.FC<CalligraphicFireworkProps> = ({ className, style }) => (
  <svg className={`${className} pointer-events-none select-none`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" style={style}>
    <defs>
      <filter id="firework-bg-pencil" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <g filter="url(#firework-bg-pencil)">
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const c1x = 50 + Math.cos(angle) * 12;
        const c1y = 50 + Math.sin(angle) * 12;
        const c2x = 50 + Math.cos(angle + 0.25) * 28;
        const c2y = 50 + Math.sin(angle + 0.25) * 28;
        const x2 = 50 + Math.cos(angle) * 45;
        const y2 = 50 + Math.sin(angle) * 45;
        return (
          <path 
            key={i} 
            d={`M 50 50 Q ${c1x} ${c1y}, ${c2x} ${c2y} T ${x2} ${y2}`} 
          />
        );
      })}
    </g>
  </svg>
);

