import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// IMAGE URLS (from prompt & local assets)
// ==========================================
const HERO_IMAGE = '/assets/jenny_hero.jpg';
const DENTIST_PORTRAIT = '/assets/jenny_hero.jpg'; // Jenny's dark photo for chatbot/widgets

const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';
const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';

// ==========================================
// SERVICES CONFIGURATION
// ==========================================
interface Service {
  name: string;
  num: string;
  desc: string;
  img: string;
  color: string; // Accent color hex for orbit crescents
  icon: string;
}

const servicesEn: Service[] = [
  {
    name: 'Dental Veneers',
    num: '01',
    desc: 'Transform your smile with custom ultra-thin porcelain veneers, crafted for a natural look.',
    img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85',
    color: '#f5d061', // Yellow
    icon: '🦷',
  },
  {
    name: 'Dental Crowns',
    num: '02',
    desc: 'Restore function and beauty to damaged teeth with durable, natural-looking ceramic crowns.',
    img: '/assets/before_smile.jpg',
    color: '#f36b6b', // Coral
    icon: '👑',
  },
  {
    name: 'Teeth Whitening',
    num: '03',
    desc: 'Achieve a brighter, radiant smile with our safe and advanced clinical teeth whitening.',
    img: '/assets/after_smile.jpg',
    color: '#ec5890', // Pink
    icon: '✨',
  },
  {
    name: 'Dental Implants',
    num: '04',
    desc: 'Permanent and highly reliable implant solutions to restore missing teeth and confidence.',
    img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85',
    color: '#7048a3', // Purple
    icon: '🦾',
  },
];

const servicesKa: Service[] = [
  {
    name: 'ესთეტიკური ვინირები',
    num: '01',
    desc: 'შეცვალეთ თქვენი ღიმილი ულტრათხელი ფაიფურის ვინირებით, რომლებიც ბუნებრივად ერწყმის კბილებს.',
    img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85',
    color: '#f5d061', // ყვითელი
    icon: '🦷',
  },
  {
    name: 'სამკურნალო გვირგვინები',
    num: '02',
    desc: 'აღადგინეთ დაზიანებული კბილების ფუნქცია და ესთეტიკა გამძლე მეტალო-კერამიკული გვიგვინებით.',
    img: '/assets/before_smile.jpg',
    color: '#f36b6b', // მარჯნისფერი
    icon: '👑',
  },
  {
    name: 'კბილების გათეთრება',
    num: '03',
    desc: 'გაიუმჯობესეთ ღიმილი პროფესიონალური კლინიკური გათეთრების უსაფრთხო და სწრაფი მეთოდით.',
    img: '/assets/after_smile.jpg',
    color: '#ec5890', // ვარდისფერი
    icon: '✨',
  },
  {
    name: 'კბილის იმპლანტები',
    num: '04',
    desc: 'უმაღლესი ხარისხის იმპლანტაციის სისტემები დაკარგული კბილების აღსადგენად უვადო გარანტიით.',
    img: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85',
    color: '#7048a3', // იასამნისფერი
    icon: '🦾',
  },
];

// ==========================================
// CUSTOM HOOKS
// ==========================================


// useStaggeredReveal hook
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
const SplashScreen: React.FC<{ onComplete: () => void; t: (en: string, ka: string) => string }> = ({ onComplete, t }) => {
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
        <div className="text-center">
          <span className="text-2xl font-black uppercase tracking-wider text-neutral-800">{t('JENNY PIRTSKHALAVA', 'ჯენი ფირცხალავა')}</span>
          <span className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">QUALITY CLINIC</span>
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
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t, onBookClick }) => {
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

  const navLinksEn = ['Home', 'Services', 'About', 'Contact'];
  const navLinksKa = ['მთავარი', 'სერვისები', 'შესახებ', 'კონტაქტი'];
  const activeNavLinks = lang === 'en' ? navLinksEn : navLinksKa;
  const hashLinks = ['home', 'services', 'about', 'contact'];

  return (
    <>
      {/* Neumorphic floating pill navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-[#e0e8f3] rounded-full shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20">
        {/* Logo */}
        <div className="flex flex-col select-none cursor-pointer">
          <span className="text-lg md:text-xl font-black uppercase tracking-tight leading-none text-neutral-800">
            {t('Jenny', 'ჯენი')}
          </span>
          <span className="text-lg md:text-xl font-black uppercase tracking-tight leading-none text-neutral-800 -mt-1">
            {t('Pirtskhalava', 'ფირცხალავა')}
          </span>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-4">
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onBookClick}
              className="px-5 py-2.5 bg-neutral-800 text-white rounded-full text-xs font-bold shadow-md hover:bg-neutral-700 transition-colors"
            >
              {t('Book Appointment', 'ვიზიტის დაჯავშნა')}
            </button>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 bg-[#e0e8f3] rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] border border-white/20 text-neutral-700 hover:text-black"
            >
              ☰
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 bg-[#e0e8f3] rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.8)] border border-white/20 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <span className={`h-0.5 w-5 bg-neutral-700 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
              <span className={`h-0.5 w-5 bg-neutral-700 rounded-full transition-all duration-300 my-1 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
              <span className={`h-0.5 w-5 bg-neutral-700 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-neutral-900/10 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Neumorphic Side Panel */}
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
            
            {/* Bottom section */}
            <div className={`mt-8 pt-8 border-t border-neutral-300 transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '350ms' }}>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onBookClick();
                }}
                className="w-full py-4 bg-neutral-800 text-white rounded-2xl text-sm font-bold shadow-md hover:bg-neutral-700 transition-colors"
              >
                {t('Book Appointment', 'ვიზიტის დაჯავშნა')}
              </button>
              
              {/* Social links row */}
              <div className="flex gap-3.5 mt-8 justify-start items-center">
                <a 
                  href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>

                <a 
                  href="https://www.tiktok.com/@jennypirtskhalava?_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.41-.33-.25-.63-.53-.9-.85-.02 2.22.01 4.43-.02 6.65-.09 1.91-.73 3.86-2.07 5.24-1.63 1.76-4.22 2.62-6.57 2.23-2.31-.34-4.54-1.92-5.46-4.14-1.07-2.43-.65-5.5 1.12-7.51 1.5-1.77 3.96-2.63 6.22-2.22v4.18c-1.34-.34-2.88-.02-3.89.93-.97.9-.99 2.52-.16 3.55.77.99 2.14 1.34 3.32.96 1.07-.31 1.83-1.33 1.89-2.45.06-2.95.02-5.91.04-8.86v-.03z"/>
                  </svg>
                </a>

                <a 
                  href="https://t.me/JennyDentbot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-transform hover:scale-105"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6.15-.15 2.72-2.5 2.77-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.85 1.17-5.23 3.45-.5.34-.95.5-1.35.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.47.97-.73 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.53 4.4-1.8 4.89-1.8.11 0 .35.03.5.15.13.1.17.24.18.35-.01.07.01.19 0 .28z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// INTERACTIVE BOOKING MODAL WITH NEUMORPHIC STYLE
// ==========================================
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ka' | 'en';
  t: (en: string, ka: string) => string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, lang, t }) => {
  const [step, setStep] = useState(1);
  const [treatment, setTreatment] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTreatment('');
      setSelectedDay(null);
      setSelectedTime('');
      setName('');
      setPhone('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const treatments = lang === 'en' 
    ? ['Dental Veneers', 'Dental Crowns', 'Teeth Whitening', 'Dental Implants']
    : ['ესთეტიკური ვინირები', 'სამკურნალო გვირგვინები', 'კბილების გათეთრება', 'კბილის იმპლანტები'];

  const timeSlots = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

  const daysInJuly = 31;
  const calendarDays = Array.from({ length: daysInJuly }, (_, i) => i + 1);
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
      {/* Neumorphic Modal Dialog Container */}
      <div className="bg-[#e0e8f3] rounded-[36px] w-full max-w-5xl overflow-hidden shadow-[20px_20px_40px_rgba(163,177,198,0.7),-20px_-20px_40px_rgba(255,255,255,0.9)] border border-white/30 flex flex-col md:flex-row relative animate-[scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-[#e0e8f3] hover:shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5)] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/20 rounded-full flex items-center justify-center text-neutral-700 z-20 font-black text-sm transition-all"
        >
          ✕
        </button>

        {/* Left Column: Flow Forms */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between min-h-[480px]">
          <div>
            {/* Step Progress Indicators */}
            <div className="flex gap-3 mb-8">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= num ? 'bg-neutral-800 shadow-sm' : 'bg-[#e0e8f3] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5)]'}`}
                />
              ))}
            </div>

            {/* Step 1: Select service */}
            {step === 1 && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl md:text-2xl font-black text-neutral-800 mb-6">
                  {t('Select Service', 'აირჩიეთ მომსახურება')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatments.map((tItem) => (
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

            {/* Step 2: Date Grid & Available Slots */}
            {step === 2 && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-black text-neutral-800 mb-4">
                  {t('Select Date & Time', 'აირჩიეთ თარიღი და დრო')}
                </h3>
                
                <div className="text-center font-bold text-xs text-neutral-500 uppercase tracking-widest mb-3">
                  {t('July 2026', 'ივლისი 2026')}
                </div>

                {/* Calendar Layout */}
                <div className="mb-6 p-4 rounded-2xl bg-[#e0e8f3] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.85)] border border-white/25">
                  <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-[10px] md:text-xs text-neutral-400 mb-3">
                    {weekdays.map((w) => <div key={w}>{w}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Wednesday starts at offset 3 */}
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

                {/* Available Hours */}
                {selectedDay && (
                  <div className="animate-[fadeIn_0.2s_ease-out]">
                    <span className="block text-[10px] font-black text-neutral-400 mb-3 uppercase tracking-widest">
                      {t('Available Slots', 'ხელმისაწვდომი საათები')}
                    </span>
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

            {/* Step 3: Patient Form Details */}
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
                      placeholder="+995 599 00-00-00"
                      className="w-full px-5 py-4 rounded-2xl bg-[#e0e8f3] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] focus:outline-none text-sm font-bold text-neutral-800 border border-white/10"
                    />
                  </div>
                </div>

                {/* Booking overview */}
                <div className="p-4 rounded-2xl bg-neutral-100/40 border border-white/20 text-xs font-bold text-neutral-600 flex flex-col gap-2 shadow-sm">
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

            {/* Step 4: Success message */}
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

          {/* Form navigate footer */}
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

        {/* Right Column: Contact Details, Grayscale Map */}
        <div className="w-full md:w-[400px] bg-[#e0e8f3]/80 border-t md:border-t-0 md:border-l border-neutral-300 p-6 md:p-10 flex flex-col justify-between">
          {/* Circular Frame Avatar of Jenny */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#e0e8f3] p-1 shadow-[4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.9)] border border-white/30 shrink-0 overflow-hidden">
              <img src={DENTIST_PORTRAIT} alt="Dr. Jenny Pirtskhalava" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h4 className="font-black text-base text-neutral-800 leading-tight">{t('Dr. Jenny Pirtskhalava', 'ჯენი ფირცხალავა')}</h4>
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">{t('Dentist & Therapist', 'თერაპევტი და ესთეტისტი')}</span>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="flex flex-col gap-4 text-xs font-black text-neutral-600 mb-6">
            <div className="flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[#e0e8f3] shadow-[2px_2px_5px_rgba(163,177,198,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center">📞</span>
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">{t('Phone', 'ტელეფონი')}</p>
                <a href="tel:+995599001122" className="text-neutral-800 font-black hover:underline">+995 599 00-11-22</a>
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
                <span className="text-neutral-800 font-black">{t('Chavchavadze Ave, Tbilisi', 'ჭავჭავაძის გამზირი, თბილისი')}</span>
              </div>
            </div>
          </div>

          {/* Grayscale Map with Neumorphic bezel */}
          <div className="relative w-full h-[180px] rounded-3xl overflow-hidden shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.8953181825835!2d44.75704177656363!3d41.7066060761614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd2be32e3cb%3A0xcad456e7e44be2!2sIlia%20Chavchavadze%20Avenue%2C%20T&#39;bilisi!5e0!3m2!1sen!2sge!4v1717320000000!5m2!1sen!2sge" 
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

// Synthesis helper for a satisfying Neumorphic tactile click ("tkup" pop sound)
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
    
    osc.type = 'sine';
    // Frequency slide from 280Hz to 80Hz in 0.05 seconds creates a clean acoustic pop
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Fail silently to prevent crashing UI if browser blocks context
  }
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

  // Auto-open chatbot once per session after 1.5 seconds delay
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
          '📞 Phone: +995 599 00-11-22\n✉️ Email: info@jenny.ge\n📍 Address: Chavchavadze Ave, Tbilisi',
          '📞 ტელეფონი: +995 599 00-11-22\n✉️ ელ-ფოსტა: info@jenny.ge\n📍 მისამართი: ჭავჭავაძის გამზირი, თბილისი'
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
          '🕒 Monday - Saturday: 10:00 - 19:00\nSunday: Closed',
          '🕒 ორშაბათი - შაბათი: 10:00 - 19:00\nკვირა: დასვენება'
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
          {/* Header */}
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

          {/* Message List */}
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

      {/* Launcher */}
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
// MAIN APP COMPONENT (NEUMORPHIC / ORBIT REBUILD)
// ==========================================
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<'ka' | 'en'>('ka');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const t = (en: string, ka: string) => (lang === 'en' ? en : ka);

  const activeServices = lang === 'en' ? servicesEn : servicesKa;
  const activeFeatureBars = lang === 'en' 
    ? ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff']
    : ['თანამედროვე სტომატოლოგია', 'უახლესი აპარატურა', 'მეგობრული გარემო'];

  const s1Reveal = useStaggeredReveal();
  const s2Reveal = useStaggeredReveal();
  const s3Reveal = useStaggeredReveal();

  // Attach global tactile "tkup" sound effect to all clickable element interactions
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
    <div className="min-h-screen bg-[#e0e8f3] text-neutral-700 select-none font-sans overflow-x-hidden">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} t={t} />}
      
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onBookClick={() => setIsBookingOpen(true)} 
      />

      {/* ==========================================
          SECTION 1 - HERO (CIRCULAR ORBITAL BADGES)
          ========================================== */}
      <section 
        id="home"
        ref={s1Reveal.containerRef}
        className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center pt-28 px-6 pb-12 gap-10 max-w-7xl mx-auto"
      >
        {/* Left Column: Neumorphic Header & Booking Details */}
        <div 
          style={s1Reveal.getAnimStyle(0)}
          className="flex-1 flex flex-col gap-6 items-start"
        >
          {/* Welcome Badge */}
          <div className="px-4 py-2 bg-[#e0e8f3] rounded-full shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.85)] text-[10px] font-black text-neutral-500 uppercase tracking-widest border border-white/10">
            ✨ {t('Jenny Pirtskhalava Clinic', 'ჯენი ფირცხალავას კლინიკა')}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-neutral-800 leading-[1.05] tracking-tight">
            {t('A Healthy Smile', 'ჯანსაღი ღიმილი')}
            <span className="block text-neutral-500 font-extrabold text-3xl md:text-5xl mt-2">
              {t('For Your Confidence', 'თქვენი თავდაჯერებულობისთვის')}
            </span>
          </h1>

          <p className="text-xs md:text-sm font-bold text-neutral-500 max-w-md leading-relaxed">
            {t(
              'We wish to provide professional dental services that match the current technologies and best healthcare practices.',
              'ჩვენი მიზანია შემოგთავაზოთ უმაღლესი ხარისხის სტომატოლოგიური მომსახურება, რომელიც პასუხობს უახლეს ტექნოლოგიურ გამოწვევებს.'
            )}
          </p>

          {/* Main Booking Button */}
          <button
            onClick={() => setIsBookingOpen(true)}
            className="mt-4 px-10 py-5 bg-[#e0e8f3] hover:scale-105 rounded-full font-black text-neutral-800 shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20 active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-all text-sm uppercase tracking-wider"
          >
            {t('Book Visit Now', 'ჩაეწერეთ ვიზიტზე')}
          </button>
        </div>

        {/* Right Column: Central Circle & Orbital Badges */}
        <div 
          style={s1Reveal.getAnimStyle(1)}
          className="flex-1 flex items-center justify-center relative w-full max-w-[400px] md:max-w-none aspect-square shrink-0"
        >
          {/* Dashed Orbital Paths */}
          <div className="absolute w-[80%] aspect-square rounded-full border-2 border-dashed border-neutral-300 animate-[spin_50s_linear_infinite]" />
          <div className="absolute w-[60%] aspect-square rounded-full border border-dashed border-neutral-300 animate-[spin_30s_linear_infinite_reverse]" />

          {/* Central Portrait Hub Circle */}
          <div className="w-[50%] aspect-square rounded-full bg-[#e0e8f3] p-3 shadow-[12px_12px_24px_rgba(163,177,198,0.55),-12px_-12px_24px_rgba(255,255,255,0.9)] border border-white/30 z-10 overflow-hidden flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-inner">
              <img src={HERO_IMAGE} alt="Doctor Jenny Portrait" className="w-full h-full object-cover scale-105" />
            </div>
          </div>

          {/* Orbital Badges */}
          {/* Satellite 1: Advanced Dentistry */}
          <div className="absolute top-[8%] left-[10%] w-[32%] aspect-square rounded-full bg-[#e0e8f3] p-2.5 shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.9)] border-t-4 border-[#f5d061] z-20 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] md:text-xs font-black text-neutral-800 leading-tight">
              {activeFeatureBars[0]}
            </span>
          </div>

          {/* Satellite 2: Friendly Staff */}
          <div className="absolute top-[8%] right-[10%] w-[32%] aspect-square rounded-full bg-[#e0e8f3] p-2.5 shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.9)] border-t-4 border-[#f36b6b] z-20 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] md:text-xs font-black text-neutral-800 leading-tight">
              {activeFeatureBars[2]}
            </span>
          </div>

          {/* Satellite 3: Quality Equipment */}
          <div className="absolute bottom-[8%] left-[34%] w-[32%] aspect-square rounded-full bg-[#e0e8f3] p-2.5 shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.9)] border-t-4 border-[#ec5890] z-20 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] md:text-xs font-black text-neutral-800 leading-tight">
              {activeFeatureBars[1]}
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2 - SERVICES ORBIT DIAL (INFOGRAPHIC STYLE)
          ========================================== */}
      <section 
        id="services"
        ref={s2Reveal.containerRef}
        className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight">
            {t('Services & Smile Makeover', 'სერვისები და ესთეტიკა')}
          </h2>
          <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest mt-2">
            {t('Interactive Infographic Explorer', 'აღმოაჩინეთ ჩვენი მომსახურება')}
          </p>
        </div>

        {/* Orbit infographic container */}
        <div 
          style={s2Reveal.getAnimStyle(0)}
          className="w-full flex flex-col lg:flex-row items-center justify-center gap-16"
        >
          {/* Left Side: Central Interactive Hub */}
          <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full bg-[#e0e8f3] p-4 shadow-[12px_12px_30px_rgba(163,177,198,0.65),-12px_-12px_30px_rgba(255,255,255,0.9)] border border-white/20 flex items-center justify-center relative shrink-0">
            {/* Morphing color ring */}
            <div 
              className="absolute inset-2.5 rounded-full border-[6px] transition-colors duration-500" 
              style={{ borderColor: activeServices[activeServiceIdx].color }}
            />
            
            {/* Center Circle Content Mask */}
            <div className="absolute inset-5 rounded-full bg-[#e0e8f3] overflow-hidden shadow-inner flex items-center justify-center border-2 border-white">
              <img 
                src={activeServices[activeServiceIdx].img} 
                alt={activeServices[activeServiceIdx].name} 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
              />
              {/* Glassmorphic Description overlay at the bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-neutral-900/50 p-4 pt-6 text-white text-center backdrop-blur-[2px]">
                <h3 className="font-extrabold text-sm md:text-base leading-none mb-1">
                  {activeServices[activeServiceIdx].name}
                </h3>
                <p className="text-[10px] text-neutral-200 line-clamp-2 leading-relaxed">
                  {activeServices[activeServiceIdx].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Orbital Satellite Grid */}
          <div className="flex-1 flex flex-col gap-6 w-full max-w-xl">
            <h3 className="text-xl md:text-2xl font-black text-neutral-800 leading-none mb-2">
              {t('Interactive Services Dial', 'აირჩიეთ მომსახურება')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((svc, i) => {
                const isActive = activeServiceIdx === i;
                return (
                  <button
                    key={svc.num}
                    onClick={() => setActiveServiceIdx(i)}
                    className={`flex items-center gap-4 p-5 rounded-[24px] border border-white/20 transition-all ${isActive ? 'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-neutral-100/40' : 'shadow-[6px_6px_14px_rgba(163,177,198,0.5),-6px_-6px_14px_rgba(255,255,255,0.85)] hover:scale-[1.02]'}`}
                  >
                    {/* Satellite circle with crescent outline */}
                    <div 
                      className="w-12 h-12 rounded-full bg-[#e0e8f3] shadow-md border-r-4 flex items-center justify-center shrink-0 text-lg"
                      style={{ borderRightColor: svc.color }}
                    >
                      {svc.icon}
                    </div>

                    <div className="text-left">
                      <span className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        {t(`Step ${svc.num}`, `ეტაპი ${svc.num}`)}
                      </span>
                      <h4 className="font-black text-sm text-neutral-800 mt-0.5">
                        {svc.name}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Box */}
            <div className="p-5 bg-[#e0e8f3] rounded-3xl shadow-[inset_3px_3px_6px_rgba(163,177,198,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/10 text-xs font-bold text-neutral-500 leading-relaxed flex items-center justify-between mt-4">
              <span>
                {t('For free consultation on any service, book an online slot.', 'უფასო კონსულტაციისთვის გთხოვთ დაჯავშნოთ სასურველი საათი.')}
              </span>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3 bg-neutral-800 text-white rounded-full text-xs font-black shadow-md hover:bg-neutral-700 shrink-0 ml-4 transition-transform hover:scale-105"
              >
                {t('Book Slots', 'დაჯავშნა')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3 - WORKFLOW STEPS & RESTORATION
          ========================================== */}
      <section 
        id="about"
        ref={s3Reveal.containerRef}
        className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight">
            {t('Implantology & Restoration', 'იმპლანტოლოგია და კვლევა')}
          </h2>
          <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest mt-2">
            {t('Workflow & Clinical Case Study', 'მკურნალობის ეტაპები და მაგალითები')}
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-16">
          {/* Left Column: Infographic Steps List */}
          <div 
            style={s3Reveal.getAnimStyle(0)}
            className="flex-1 flex flex-col gap-4 w-full"
          >
            <h3 className="text-xl md:text-2xl font-black text-neutral-800 leading-none mb-2">
              {t('Workflow Steps', 'მკურნალობის ნაბიჯები')}
            </h3>

            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#e0e8f3] shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.85)] border border-white/20">
              <div className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-md border-r-4 border-[#f5d061] flex items-center justify-center text-xs font-black text-neutral-800 shrink-0">
                01
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-neutral-800 mb-1">{t('Consultation & Diagnostic', 'პირველადი კონსულტაცია და დიაგნოსტიკა')}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                  {t('Comprehensive evaluation of oral cavity conditions using 3D tomography scanners.', 'პირის ღრუს დეტალური კვლევა და 3D კომპიუტერული ტომოგრაფია.')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#e0e8f3] shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.85)] border border-white/20">
              <div className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-md border-r-4 border-[#f36b6b] flex items-center justify-center text-xs font-black text-neutral-800 shrink-0">
                02
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-neutral-800 mb-1">{t('Clinical Plan Formulation', 'ინდივიდუალური მკურნალობის გეგმა')}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                  {t('Drafting surgical templates and choosing specific implant types according to case geometry.', 'ქირურგიული შაბლონების მომზადება და ზუსტი გეომეტრიის დაგეგმვა.')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#e0e8f3] shadow-[4px_4px_10px_rgba(163,177,198,0.5),-4px_-4px_10px_rgba(255,255,255,0.85)] border border-white/20">
              <div className="w-10 h-10 rounded-full bg-[#e0e8f3] shadow-md border-r-4 border-[#ec5890] flex items-center justify-center text-xs font-black text-neutral-800 shrink-0">
                03
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-neutral-800 mb-1">{t('Surgical Implantation', 'ქირურგიული ეტაპი (იმპლანტაცია)')}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                  {t('Installation of premium titanium implants under localized sedation with 100% safety.', 'პრემიუმ კლასის ტიტანის იმპლანტის უმტკივნეულო და უსაფრთხო ჩასმა კლინიკაში.')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Case Showcase Gallery */}
          <div 
            style={s3Reveal.getAnimStyle(1)}
            className="flex-1 flex flex-col gap-6 w-full"
          >
            <h3 className="text-xl md:text-2xl font-black text-neutral-800 leading-none">
              {t('Aesthetic Transformations', 'ესთეტიკური შედეგები')}
            </h3>

            {/* Neumorphic double photo comparison block */}
            <div className="p-6 rounded-3xl bg-[#e0e8f3] shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20 flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/30 mb-2">
                  <img src={SECTION3_IMG1} alt="Before restoration" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t('Clinical Case', 'კლინიკური მდგომარეობა')}</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/30 mb-2">
                  <img src={SECTION3_IMG2} alt="After restoration" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t('Transformation', 'ესთეტიკური აღდგენა')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER / SOCIAL CHANNELS
          ========================================== */}
      <footer id="contact" className="py-12 bg-neutral-900 text-neutral-400 text-center flex flex-col items-center gap-6">
        <div className="flex flex-col select-none">
          <span className="text-2xl font-black uppercase tracking-widest text-white leading-none">JENNY PIRTSKHALAVA</span>
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mt-1">{t('premium dental care', 'პრემიუმ კლასის სტომატოლოგია')}</span>
        </div>

        {/* Social channels in footer */}
        <div className="flex gap-4">
          <a href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors" aria-label="Facebook">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors" aria-label="Instagram">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@jennypirtskhalava?_r=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors" aria-label="TikTok">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.41-.33-.25-.63-.53-.9-.85-.02 2.22.01 4.43-.02 6.65-.09 1.91-.73 3.86-2.07 5.24-1.63 1.76-4.22 2.62-6.57 2.23-2.31-.34-4.54-1.92-5.46-4.14-1.07-2.43-.65-5.5 1.12-7.51 1.5-1.77 3.96-2.63 6.22-2.22v4.18c-1.34-.34-2.88-.02-3.89.93-.97.9-.99 2.52-.16 3.55.77.99 2.14 1.34 3.32.96 1.07-.31 1.83-1.33 1.89-2.45.06-2.95.02-5.91.04-8.86v-.03z"/>
            </svg>
          </a>
          <a href="https://t.me/JennyDentbot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors" aria-label="Telegram">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6.15-.15 2.72-2.5 2.77-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.85 1.17-5.23 3.45-.5.34-.95.5-1.35.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.47.97-.73 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.53 4.4-1.8 4.89-1.8.11 0 .35.03.5.15.13.1.17.24.18.35-.01.07.01.19 0 .28z"/>
            </svg>
          </a>
        </div>

        <p className="text-xs text-neutral-600 mt-4 select-none">
          © 2026 Jenny Pirtskhalava. {t('All rights reserved.', 'ყველა უფლება დაცულია.')}
        </p>
      </footer>

      {/* ==========================================
          INTERACTIVE BOOKING MODAL WITH CALENDAR
          ========================================== */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        lang={lang} 
        t={t} 
      />

      {/* ==========================================
          CHATBOT ASSISTANT WIDGET
          ========================================== */}
      <ChatbotWidget 
        lang={lang} 
        t={t} 
        onBookClick={() => setIsBookingOpen(true)} 
      />
    </div>
  );
};

export default App;
