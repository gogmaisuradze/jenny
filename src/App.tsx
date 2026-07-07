import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// IMAGE & ASSET CONSTANTS
// ==========================================
const HERO_IMAGE = '/assets/jenny_hero.jpg';
const DENTIST_PORTRAIT = '/assets/jenny_hero.jpg';

const DENTISTRY_CARD_BG = '/assets/dentistry_bg.jpg';
const DERMATOLOGY_CARD_BG = '/assets/dermatology_bg.jpg';

const GALLERY_ITEM_1 = '/assets/gallery_1.jpg';
const GALLERY_ITEM_2 = '/assets/gallery_2.jpg';

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
    <div className={`fixed inset-0 bg-[#e0e8f3] z-[100] flex items-center justify-center transition-all duration-700 ${exiting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6">
        {/* Soft Neumorphic Loading Circle */}
        <div className="w-40 h-40 rounded-full bg-[#e0e8f3] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.8)] flex items-center justify-center relative animate-[pulse_2s_infinite]">
          <div className="w-28 h-28 rounded-full bg-[#e0e8f3] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.85)] flex items-center justify-center">
            <span className="text-4xl font-extrabold text-neutral-800 tabular-nums">{count}%</span>
          </div>
        </div>
        <div className="text-center flex flex-col items-center gap-3 animate-[scaleUp_0.5s_ease-out]">
          <img src="/assets/logo.png" alt="Dr. Jenny Dental Care Logo" className="w-64 h-auto object-contain filter drop-shadow-[4px_4px_8px_rgba(163,177,198,0.95)] drop-shadow-[-2px_-2px_4px_rgba(255,255,255,0.95)]" />
          <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">QUALITY CLINIC</span>
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

  const navLinksEn = ['Home', 'Services', 'About', 'Results', 'Contact'];
  const navLinksKa = ['მთავარი', 'სერვისები', 'ჩვენს შესახებ', 'შედეგები', 'კონტაქტი'];
  const activeNavLinks = lang === 'en' ? navLinksEn : navLinksKa;
  const hashLinks = ['home', 'services', 'about', 'results', 'contact'];

  return (
    <>
      {/* Neumorphic floating pill navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-[#e0e8f3] rounded-full shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20">
        {/* Logo */}
        <div className="flex items-center select-none cursor-pointer hover:scale-105 transition-all">
          <img 
            src="/assets/logo.png" 
            alt="Dr. Jenny Dental Care" 
            className="h-16 w-auto object-contain filter drop-shadow-[3px_3px_5px_rgba(163,177,198,0.9)] drop-shadow-[-1px_-1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all duration-300" 
          />
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
          <div className="flex gap-1 bg-[#e0e8f3] p-1 rounded-full shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]">
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
              className="px-5 py-2.5 bg-[#e0e8f3] rounded-full text-xs font-black text-neutral-800 shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.85)] border border-white/20 hover:scale-105 active:shadow-inner transition-all"
            >
              {t('Book Appointment', 'ვიზიტის დაჯავშნა')}
            </button>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 bg-[#e0e8f3] rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] border border-white/20 text-neutral-700 hover:text-black lg:hidden"
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
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#e0e8f3] shadow-2xl border-l border-white/20 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
    <div className="fixed inset-0 bg-[#e0e8f3]/60 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#e0e8f3] rounded-[36px] w-full max-w-5xl overflow-hidden shadow-[20px_20px_40px_rgba(163,177,198,0.7),-20px_-20px_40px_rgba(255,255,255,0.9)] border border-white/30 flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-[#e0e8f3] hover:shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5)] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/20 rounded-full flex items-center justify-center text-neutral-700 z-20 font-black text-sm transition-all"
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
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= num ? 'bg-neutral-800 shadow-sm' : 'bg-[#e0e8f3] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5)]'}`}
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
                <div className="flex gap-2 bg-[#e0e8f3] p-1.5 rounded-2xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] mb-6">
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

                <div className="mb-6 p-4 rounded-2xl bg-[#e0e8f3] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.85)] border border-white/25">
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
                          className={`aspect-square text-xs md:text-sm font-black rounded-full flex items-center justify-center transition-all ${isPast ? 'text-neutral-300 cursor-not-allowed shadow-none' : isSelected ? 'bg-neutral-800 text-white shadow-inner scale-[0.93]' : 'bg-[#e0e8f3] text-neutral-800 shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:scale-105 border border-white/20'}`}
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
                          className={`py-3 rounded-xl text-xs md:text-sm font-black transition-all ${selectedTime === time ? 'bg-neutral-800 text-white shadow-inner scale-[0.95]' : 'bg-[#e0e8f3] text-neutral-800 shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/20 hover:scale-[1.02]'}`}
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
                      className="w-full px-5 py-4 rounded-2xl bg-[#e0e8f3] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] focus:outline-none text-sm font-bold text-neutral-800 border border-white/10"
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
                      className="w-full px-5 py-4 rounded-2xl bg-[#e0e8f3] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] focus:outline-none text-sm font-bold text-neutral-800 border border-white/10"
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
                <div className="w-20 h-20 bg-[#e0e8f3] rounded-full shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center text-green-500 mb-6 text-3xl font-black">
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
                className="px-6 py-2.5 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 text-xs font-black text-neutral-700 hover:scale-105 transition-transform"
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
        <div className="w-full md:w-[400px] bg-[#e0e8f3]/80 border-t md:border-t-0 md:border-l border-neutral-300 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#e0e8f3] p-1 shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] border border-white/30 shrink-0 overflow-hidden">
              <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Pirtskhalava" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h4 className="font-black text-base text-neutral-800 leading-tight">{t('Dr. Jenny Pirtskhalava', 'ჯენი ფირცხალავა')}</h4>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">{t('Dentist & Dermatologist', 'სტომატოლოგი და დერმატოლოგი')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs font-black text-neutral-600 mb-6">
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#e0e8f3] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">📞</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Phone', 'ტელეფონი')}</p>
                <a href="tel:+995593567998" className="text-neutral-800 font-black hover:underline">+995 593 56-79-98</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#e0e8f3] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">✉️</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Email', 'ელ-ფოსტა')}</p>
                <a href="mailto:info@jenny.ge" className="text-neutral-800 font-black hover:underline">info@jenny.ge</a>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#e0e8f3] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">📍</span>
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
      }, 1500);
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
          { label: t('🕒 Working Hours', '🕒 სამუშაო საათები'), action: 'hours' },
        ]
      };
    }

    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[320px] md:w-[350px] h-[450px] bg-[#e0e8f3] border border-white/30 rounded-[32px] overflow-hidden shadow-[10px_10px_25px_rgba(163,177,198,0.6),-10px_-10px_25px_rgba(255,255,255,0.85)] flex flex-col mb-4 animate-[scaleUp_0.25s_ease-out]">
          <div className="bg-neutral-800 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-neutral-700">
                <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Avatar" className="w-full h-full object-cover" />
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

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-[#e0e8f3]">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed ${msg.sender === 'user' ? 'bg-neutral-800 text-white rounded-tr-none shadow-md' : 'bg-[#e0e8f3] border border-white/30 text-neutral-800 rounded-tl-none shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.85)]'}`}
                >
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="flex flex-col gap-2 mt-3 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.action}
                        onClick={() => handleAction(opt.action, opt.label)}
                        className="w-full py-3 px-4 bg-[#e0e8f3] border border-white/20 hover:scale-[1.02] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] rounded-xl text-left text-xs font-black text-neutral-800 transition-all"
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
        className="w-14 h-14 bg-[#e0e8f3] hover:scale-105 rounded-full flex items-center justify-center shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.85)] border border-white/20 transition-all relative"
        aria-label="Open chat assistant"
      >
        {isOpen ? (
          <span className="text-xl font-bold text-neutral-700">✕</span>
        ) : (
          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/30">
            <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Chat Assistant" className="w-full h-full object-cover rounded-full" />
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
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 select-none font-sans overflow-x-hidden">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onBookClick={() => setIsBookingOpen(true)} 
        activeSection={activeSection}
      />

      <main className="pt-24">
        {/* ==========================================
            SECTION 1 - HERO
            ========================================== */}
        <section 
          id="home"
          ref={s1Reveal.containerRef}
          className="relative min-h-[85vh] flex items-center overflow-hidden py-12 px-6 max-w-[1200px] mx-auto"
        >
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div 
              style={s1Reveal.getAnimStyle(0)}
              className="flex flex-col gap-6 items-start z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e0e8f3] rounded-full text-xs font-black text-neutral-800 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.85)] border border-white/10">
                ✨ {t('Jenny Pirtskhalava Clinic', 'ჯენი ფირცხალავას კლინიკა')}
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
                  className="px-8 py-4 bg-[#e0e8f3] hover:scale-105 rounded-full font-black text-neutral-800 shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20 active:shadow-inner transition-all text-xs uppercase tracking-wider"
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
              <div className="absolute -z-10 w-[90%] h-[90%] bg-[#e0e8f3] rounded-full blur-3xl opacity-40" />
              <div className="relative w-[80%] aspect-square">
                <div className="absolute inset-0 rounded-full border border-dashed border-neutral-300 animate-[spin_60s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full overflow-hidden shadow-[10px_10px_25px_rgba(163,177,198,0.5),-10px_-10px_25px_rgba(255,255,255,0.9)] border-[8px] border-white">
                  <img src={HERO_IMAGE} alt="Jenny clinical portrait" className="w-full h-full object-cover scale-105" />
                </div>

                {/* Floating Glass Badges */}
                <div className="absolute top-[10%] -left-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 hidden md:block">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <p className="text-xs font-black text-neutral-800">{t('Expertise', 'ექსპერტული ცოდნა')}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{t('15+ Years Practice', '15+ წლიანი გამოცდილება')}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[10%] -right-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5D061]/25 flex items-center justify-center text-[#F5D061] text-lg font-black shrink-0">
                      ★
                    </div>
                    <div>
                      <p className="text-xs font-black text-neutral-800">{t('5.0 Rating', '5.0 რეიტინგი')}</p>
                      <p className="text-[10px] font-bold text-neutral-400">{t('Google Reviews', 'Google Reviews')}</p>
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
          className="py-20 px-6 max-w-[1200px] mx-auto bg-white rounded-[36px] shadow-sm border border-neutral-100/50"
        >
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
                  className="px-6 py-3.5 bg-[#e0e8f3] hover:scale-105 text-neutral-800 font-black text-xs rounded-full shadow-md transition-all active:shadow-inner"
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
                <span className="px-4 py-2 bg-[#e0e8f3] text-neutral-800 font-black text-[10px] rounded-full shadow-md uppercase tracking-wider">
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
                  className="px-6 py-3.5 bg-[#e0e8f3] hover:scale-105 text-neutral-800 font-black text-xs rounded-full shadow-md transition-all active:shadow-inner"
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
          className="py-20 px-6 max-w-[1200px] mx-auto grid md:grid-cols-12 gap-12 items-center"
        >
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
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)]">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('International Certifications', 'საერთაშორისო სერტიფიკატები')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)]">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Advanced Equipment', 'თანამედროვე აპარატურა')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)]">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Personalized Treatment Plans', 'პერსონალური მკურნალობის გეგმა')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)]">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Guaranteed Results', 'გარანტირებული შედეგი')}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsBookingOpen(true)}
              className="self-start px-8 py-4 bg-[#262626] hover:bg-neutral-800 text-white text-xs font-black rounded-2xl shadow-md hover:scale-102 transition-all"
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
          className="py-20 px-6 max-w-[1200px] mx-auto"
        >
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
              <button className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-[#e0e8f3] flex items-center justify-center font-bold text-xs transition-colors">←</button>
              <button className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-[#e0e8f3] flex items-center justify-center font-bold text-xs transition-colors">→</button>
            </div>
          </div>

          <div 
            style={s4Reveal.getAnimStyle(0)}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
          >
            {/* Gallery Item 1 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100">
              <img src={GALLERY_ITEM_1} alt="Dental Restoration Case" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Implantology', 'იმპლანტოლოგია')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('Full mouth restoration', 'სრული რესტავრაცია')}</p>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100">
              <img src={GALLERY_ITEM_2} alt="Veneers Transformation Case" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Aesthetic Smile', 'ესთეტიკური ღიმილი')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('After ceramic veneers placement', 'ვენირების შემდეგ')}</p>
              </div>
            </div>

            {/* Gallery Item 3 - See More Card */}
            <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#e0e8f3] shadow-md p-8 flex flex-col justify-between items-center text-center">
              <span className="text-4xl mt-6">🖼️</span>
              <div>
                <h4 className="font-black text-lg text-neutral-800 mb-1">{t('See More Cases', 'იხილეთ მეტი')}</h4>
                <p className="text-neutral-400 text-xs font-bold">{t('500+ successful cosmetic cases', '500+ წარმატებული შემთხვევა')}</p>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 bg-[#e0e8f3] hover:scale-102 text-neutral-800 font-black text-xs rounded-xl shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.85)] border border-white/20 active:shadow-inner transition-all mb-4"
              >
                {t('Gallery', 'გალერეა')}
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 5 - CLIENT REVIEWS
            ========================================== */}
        <section className="py-20 px-6 bg-neutral-100/50 border-t border-b border-neutral-200/40">
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
      <footer id="contact" className="bg-[#e0e8f3] border-t border-white/20 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 max-w-[1200px] mx-auto">
          {/* Logo brand & socials */}
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center select-none hover:scale-102 transition-all">
              <img 
                src="/assets/logo.png" 
                alt="Dr. Jenny Dental Care" 
                className="w-52 h-auto object-contain filter drop-shadow-[3px_3px_6px_rgba(163,177,198,0.9)] drop-shadow-[-1px_-1px_2px_rgba(255,255,255,0.9)]" 
              />
            </div>
            <p className="text-xs font-bold text-neutral-500 max-w-sm leading-relaxed mt-2">
              {t(
                'Your health and visual aesthetic are our priorities. Call or write us to schedule an online diagnostic appointment.',
                'თქვენი ჯანმრთელობა და სილამაზე ჩვენი პრიორიტეტია. დაგვიკავშირდით ნებისმიერ დროს.'
              )}
            </p>
            
            {/* Social icons row */}
            <div className="flex gap-3.5 mt-4">
              <a href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@jennypirtskhalava?_r=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="TikTok">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.41-.33-.25-.63-.53-.9-.85-.02 2.22.01 4.43-.02 6.65-.09 1.91-.73 3.86-2.07 5.24-1.63 1.76-4.22 2.62-6.57 2.23-2.31-.34-4.54-1.92-5.46-4.14-1.07-2.43-.65-5.5 1.12-7.51 1.5-1.77 3.96-2.63 6.22-2.22v4.18c-1.34-.34-2.88-.02-3.89.93-.97.9-.99 2.52-.16 3.55.77.99 2.14 1.34 3.32.96 1.07-.31 1.83-1.33 1.89-2.45.06-2.95.02-5.91.04-8.86v-.03z"/>
                </svg>
              </a>
              <a href="https://t.me/JennyDentbot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105" aria-label="Telegram">
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
