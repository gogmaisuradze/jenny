import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// IMAGE & ASSET CONSTANTS
// ==========================================
const HERO_IMAGE = '/assets/jenny_hero.jpg';
const DENTIST_PORTRAIT = '/assets/jenny_about.jpg';

const DENTISTRY_CARD_BG = '/assets/dentistry_bg.jpg';
const COSMETOLOGY_CARD_BG = '/assets/cosmetology_bg.jpg';

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

const openFacebookPhotos = (e?: React.MouseEvent) => {
  if (e) {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();
  }
  const fbUrl = 'https://www.facebook.com/profile.php?id=100042099562926&sk=photos';
  window.open(fbUrl, '_blank', 'noopener,noreferrer');
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

  const scrollTo = (id: string) => {
    if (id === 'results') {
      openFacebookPhotos();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Neumorphic floating pill navbar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-[#f6f7f1]/85 backdrop-blur-md rounded-full shadow-[6px_6px_15px_rgba(163,177,198,0.4),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20">
        {/* Logo Monogram & Name */}
        <div 
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2 select-none cursor-pointer hover:scale-102 transition-transform"
        >
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
                <button 
                  key={link}
                  type="button"
                  onClick={() => scrollTo(hashLinks[i])}
                  className={`font-bold text-xs md:text-sm transition-all pb-1 ${isActive ? 'border-b-2 border-[#F5D061] text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  {link}
                </button>
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
              className="hidden md:inline-block px-5 py-2.5 bg-[#f6f7f1] rounded-full text-xs font-black text-neutral-800 shadow-[3px_3px_7px_rgba(163,177,198,0.5),-3px_-3px_7px_rgba(255,255,255,0.85)] border border-white/20 hover:scale-105 active:shadow-inner transition-all"
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
              <button 
                key={link}
                type="button"
                onClick={() => {
                  scrollTo(hashLinks[i]);
                  setIsOpen(false);
                }}
                className={`text-3xl font-black text-neutral-800 hover:text-neutral-500 text-left transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                {link}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onBookClick();
              }}
              className="mt-6 px-6 py-3.5 bg-neutral-900 text-white rounded-full text-sm font-black text-center shadow-lg active:scale-95 transition-all"
            >
              {t('Book Appointment', 'ვიზიტის დაჯავშნა')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// DETAILED SERVICES MODAL (Knowledge Base)
// ==========================================
interface ServicesDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ka' | 'en';
  t: (en: string, ka: string) => string;
  onBookVisit: (serviceName?: string) => void;
  initialCategory?: string;
}

const ServicesDetailsModal: React.FC<ServicesDetailsModalProps> = ({
  isOpen,
  onClose,
  lang,
  t,
  onBookVisit,
  initialCategory = 'all'
}) => {
  const [activeDomain, setActiveDomain] = useState<'all' | 'dentistry' | 'cosmetology'>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (
        initialCategory === 'cosmetology' || 
        initialCategory === 'botox' || 
        initialCategory === 'fillers' || 
        initialCategory === 'biorevitalization' || 
        initialCategory === 'mesotherapy' || 
        initialCategory === 'biostimulation'
      ) {
        setActiveDomain('cosmetology');
        setActiveTab(initialCategory === 'cosmetology' ? 'all' : initialCategory);
      } else if (
        initialCategory === 'dentistry' || 
        initialCategory === 'restoration' || 
        initialCategory === 'cleaning' || 
        initialCategory === 'therapy' || 
        initialCategory === 'surgery' || 
        initialCategory === 'tech'
      ) {
        setActiveDomain('dentistry');
        setActiveTab(initialCategory === 'dentistry' ? 'all' : initialCategory);
      } else {
        setActiveDomain('all');
        setActiveTab('all');
      }
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const dentalCategories = [
    { id: 'all', labelKa: 'ყველა სტომატოლოგია', labelEn: 'All Dentistry' },
    { id: 'restoration', labelKa: 'მხატვრული რესტავრაცია', labelEn: 'Restoration' },
    { id: 'cleaning', labelKa: 'წმენდა და გათეთრება', labelEn: 'Cleaning & Whitening' },
    { id: 'therapy', labelKa: 'თერაპია და ორთოპედია', labelEn: 'Therapy & Crowns' },
    { id: 'surgery', labelKa: 'იმპლანტები და ორთოდონტია', labelEn: 'Surgery & Ortho' },
    { id: 'tech', labelKa: 'ციფრული ტექნოლოგიები', labelEn: 'Digital Tech' },
  ];

  const cosmetologyCategories = [
    { id: 'all', labelKa: 'ყველა პროცედურა', labelEn: 'All Procedures' },
    { id: 'botox', labelKa: '1. ბოტოქსი', labelEn: '1. Botox' },
    { id: 'fillers', labelKa: '2. ფილერები', labelEn: '2. Fillers' },
    { id: 'biorevitalization', labelKa: '3. ბიორევიტალიზაცია', labelEn: '3. Biorevitalization' },
    { id: 'mesotherapy', labelKa: '4. მეზოთერაპია', labelEn: '4. Mesotherapy' },
    { id: 'biostimulation', labelKa: '5. კოლაგენოსტიმულატორები', labelEn: '5. Biostimulation' },
  ];

  const allCategories = [
    { id: 'all', labelKa: 'ყველა სერვისი', labelEn: 'All Services' },
    { id: 'restoration', labelKa: 'რესტავრაცია', labelEn: 'Restoration' },
    { id: 'cleaning', labelKa: 'წმენდა & გათეთრება', labelEn: 'Cleaning & Whitening' },
    { id: 'botox', labelKa: 'ბოტოქსი', labelEn: 'Botox' },
    { id: 'fillers', labelKa: 'ფილერები', labelEn: 'Fillers' },
    { id: 'biorevitalization', labelKa: 'ბიორევიტალიზაცია', labelEn: 'Biorevitalization' },
    { id: 'mesotherapy', labelKa: 'მეზოთერაპია', labelEn: 'Mesotherapy' },
    { id: 'biostimulation', labelKa: 'კოლაგენოსტიმულატორები', labelEn: 'Biostimulation' },
    { id: 'surgery', labelKa: 'იმპლანტები', labelEn: 'Implants' },
  ];

  const categories = 
    activeDomain === 'dentistry' ? dentalCategories :
    activeDomain === 'cosmetology' ? cosmetologyCategories :
    allCategories;

  const services = [
    // ---------------- DENTISTRY ----------------
    {
      id: 'consultation',
      domain: 'dentistry',
      category: 'restoration',
      titleKa: 'პირველადი კონსულტაცია',
      titleEn: 'Initial Oral Consultation',
      priceKa: 'უფასო',
      priceEn: 'Free',
      badgeKa: 'სრული დიაგნოსტიკა',
      badgeEn: 'Full Diagnostics',
      featuresKa: [
        'პირის ღრუს სრული კომპლექსური შეფასება',
        'პაციენტის ანკეტის შედგენა და დაავადებების შესახებ ინფორმაციის დაფიქსირება',
        'ფოტოპროტოკოლის გადაღება ციფრული ფიქსაციით'
      ],
      featuresEn: [
        'Comprehensive clinical oral assessment',
        'Medical history charting & records registration',
        'Digital high-resolution photo protocol'
      ]
    },
    {
      id: 'restoration',
      domain: 'dentistry',
      category: 'restoration',
      titleKa: 'მხატვრული რესტავრაცია (ერთი კბილი)',
      titleEn: 'Artistic Dental Restoration (Per Tooth)',
      priceKa: '250 ₾ – 350 ₾',
      priceEn: '250 ₾ – 350 ₾',
      badgeKa: '2-თვიანი გარანტია',
      badgeEn: '2-Month Warranty',
      subPricesKa: [
        { name: 'საღებავების გარეშე', price: '250 ₾' },
        { name: 'მხატვრული საღებავებით', price: '350 ₾' }
      ],
      subPricesEn: [
        { name: 'Without tints', price: '250 ₾' },
        { name: 'With artistic tints', price: '350 ₾' }
      ],
      featuresKa: [
        'ფოტოპროტოკოლი — სამუშაო პროცესისა და შედეგის ფოტოგადაღება',
        'კბილის ბუნებრივი ფორმისა და ანატომიის ინდივიდუალური დაგეგმვა',
        'კბილთა რკალის პროპორციების ინდივიდუალური გამოთვლა სპეციალური ფორმულით',
        'პრემიუმ კლასის კომპოზიტით (Estelite Asteria) და მხატვრული საღებავებით შესრულებული რესტავრაცია',
        'ფინალური დამუშავება — ფინირება და პოლირება',
        '2-თვიანი გარანტია (საჭიროების შემთხვევაში კორექცია უფასოა)'
      ],
      featuresEn: [
        'High-resolution photo protocol before and after',
        'Individual tooth anatomy and shape design',
        'Personalized dental arch proportion formula',
        'Premium Estelite Asteria composite & artistic layering',
        'Fine finishing and high-gloss polishing',
        '2-month warranty with free touch-ups'
      ]
    },
    {
      id: 'cleaning',
      domain: 'dentistry',
      category: 'cleaning',
      titleKa: 'პროფესიული წმენდა',
      titleEn: 'Professional Teeth Cleaning',
      priceKa: '150 ₾ – 230 ₾',
      priceEn: '150 ₾ – 230 ₾',
      badgeKa: 'Air Flow & ჰიგიენა',
      badgeEn: 'Air Flow & Hygiene',
      subPricesKa: [
        { name: 'საბაზისო (ნადების შეღებვა, ქვებისა და ნადების მოცილება, პოლირება)', price: '150 ₾' },
        { name: 'ღრმა (+ Air Flow აირჭავლით წმენდა, ენის წმენდა)', price: '180 ₾' },
        { name: 'პაროდონტოლოგიური (+ ფტორირება, ღრძილების მკურნალობა 1 სეანსი)', price: '230 ₾' }
      ],
      subPricesEn: [
        { name: 'Basic (plaque indicator, tartar & plaque removal, polish)', price: '150 ₾' },
        { name: 'Deep (+ Air Flow spray, tongue cleaning, polish)', price: '180 ₾' },
        { name: 'Periodontal (+ fluoridation, gum therapy 1 session)', price: '230 ₾' }
      ],
      featuresKa: [
        'ინდიკატორით ნადების შეღებვა და დიაგნოსტიკა',
        'ულტრაბგერითი სკალინგი — ქვებისა და ნადების უმტკივნეულო მოცილება',
        'Air Flow აირჭავლით მიკრონაწილაკების უსაფრთხო მოცილება',
        'ენის ჰიგიენა და მინანქრის სარკისებური პოლირება'
      ],
      featuresEn: [
        'Plaque indicator application and hygiene scoring',
        'Ultrasonic scaling for painless tartar removal',
        'Air Flow gentle polish with soft micro-particles',
        'Tongue cleansing and enamel glaze polishing'
      ]
    },
    {
      id: 'whitening',
      domain: 'dentistry',
      category: 'cleaning',
      titleKa: 'კბილების პროფესიონალური გათეთრება',
      titleEn: 'Professional Teeth Whitening',
      priceKa: '450 ₾ – 800 ₾',
      priceEn: '450 ₾ – 800 ₾',
      badgeKa: 'Zoom & Boost',
      badgeEn: 'Zoom & Boost',
      subPricesKa: [
        { name: 'Zoom-ით გათეთრება (მოიცავს პროფესიულ წმენდას + Zoom სისტემა)', price: '450 ₾' },
        { name: 'ბუსტით გათეთრება (მოიცავს პროფესიულ წმენდას + 45-წუთიანი ბუსტი)', price: '550 ₾' },
        { name: 'კაპებით გათეთრება სახლში (ინდ. კაპები + 2 გელი + წმენდა)', price: '800 ₾' }
      ],
      subPricesEn: [
        { name: 'Zoom Whitening (includes cleaning + Zoom device)', price: '450 ₾' },
        { name: 'Boost Whitening (includes cleaning + 45-min boost)', price: '550 ₾' },
        { name: 'Home Whitening Trays (custom trays + 2 gels + cleaning)', price: '800 ₾' }
      ],
      featuresKa: [
        'ყველა პაკეტი მოიცავს წინასწარ პროფესიულ წმენდას',
        'მინანქრისთვის უსაფრთხო, კლინიკურად დამტკიცებული ტექნოლოგია',
        'დეტალური პერსონალური ინსტრუქცია შემდგომი მოვლისა და თეთრი დიეტისთვის'
      ],
      featuresEn: [
        'Every package includes complimentary prior cleaning',
        'Clinically proven enamel-safe whitening protocols',
        'Detailed aftercare advice and white diet instructions'
      ]
    },
    {
      id: 'therapy',
      domain: 'dentistry',
      category: 'therapy',
      titleKa: 'თერაპიული და ენდოდონტიური მკურნალობა',
      titleEn: 'Therapeutic Dentistry & Endodontics',
      priceKa: '120 ₾ – 250 ₾',
      priceEn: '120 ₾ – 250 ₾',
      badgeKa: 'Guttafusion & SybronEndo',
      badgeEn: 'Guttafusion & SybronEndo',
      subPricesKa: [
        { name: 'კბილის დაბჟენვა (გერმანული / იაპონური მასალით)', price: '150 – 250 ₾' },
        { name: 'ფესვის არხების მკურნალობა (ენდოდონტია)', price: '120 – 250 ₾' }
      ],
      subPricesEn: [
        { name: 'Tooth filling (German / Japanese composites)', price: '150 – 250 ₾' },
        { name: 'Root canal therapy (endodontics)', price: '120 – 250 ₾' }
      ],
      featuresKa: [
        'უმაღლესი ხარისხის ნანოჰიბრიდული ბჟენები',
        'არხების 3D ჰერმეტული დაბჟენა Guttafusion Oven და SybronEndo აპარატურით',
        'სრულიად უმტკივნეულო კომპიუტერული ანესთეზია'
      ],
      featuresEn: [
        'Top-grade Japanese & German nanohybrid composites',
        'Hermetic 3D canal filling with Guttafusion & SybronEndo',
        'Completely painless modern anesthesia techniques'
      ]
    },
    {
      id: 'prosthetics',
      domain: 'dentistry',
      category: 'therapy',
      titleKa: 'ორთოპედიული სტომატოლოგია და ვინირები',
      titleEn: 'Prosthodontics & Veneers',
      priceKa: '150 ₾ – 600 ₾',
      priceEn: '150 ₾ – 600 ₾',
      badgeKa: 'ცირკონო-კერამიკა',
      badgeEn: 'Zirconia & Ceramics',
      subPricesKa: [
        { name: 'მეტალო-კერამიკის გვირგვინი', price: '150 – 220 ₾' },
        { name: 'ცირკონო-კერამიკის გვირგვინი (უმაღლესი ესთეტიკა)', price: '350 – 500 ₾' },
        { name: 'კერამიკული ვინირი', price: '400 – 600 ₾' }
      ],
      subPricesEn: [
        { name: 'Metal-ceramic crown', price: '150 – 220 ₾' },
        { name: 'Zirconia-ceramic crown (highest aesthetics)', price: '350 – 500 ₾' },
        { name: 'Ceramic veneer', price: '400 – 600 ₾' }
      ],
      featuresKa: [
        'იდეალური ანატომიური თანხვედრა Planmeca Emerald S ციფრული სკანერით',
        'ბუნებრივი გამჭვირვალობა, ფერი და გამძლეობა',
        'ანაბეჭდის აღება უსიამოვნო მასების გარეშე'
      ],
      featuresEn: [
        'Precise digital design via Planmeca Emerald S scanner',
        'Natural optical translucency and superior durability',
        'Clean process with no uncomfortable impression molds'
      ]
    },
    {
      id: 'surgery',
      domain: 'dentistry',
      category: 'surgery',
      titleKa: 'ქირურგია და იმპლანტაცია',
      titleEn: 'Oral Surgery & Implants',
      priceKa: '50 ₾ – 1 500 ₾',
      priceEn: '50 ₾ – 1,500 ₾',
      badgeKa: 'პრემიუმ იმპლანტები',
      badgeEn: 'Premium Implants',
      subPricesKa: [
        { name: 'კბილის ექსტრაქცია (მარტივი / რთული)', price: '50 – 150 ₾' },
        { name: 'სიბრძნის კბილის ექსტრაქცია (რეტენირებული)', price: '100 – 300 ₾' },
        { name: 'დენტალური იმპლანტი (პრემიუმ სისტემები)', price: '700 – 1 500 ₾' }
      ],
      subPricesEn: [
        { name: 'Tooth extraction (simple / complex)', price: '50 – 150 ₾' },
        { name: 'Wisdom tooth extraction (impacted)', price: '100 – 300 ₾' },
        { name: 'Dental implant (premium systems)', price: '700 – 1,500 ₾' }
      ],
      featuresKa: [
        'ატრავმული ქირურგია ძვლის მაქსიმალური შენარჩუნებით',
        'Planmeca ProMax 3D Plus რენტგენოგრაფიული დაგეგმარება',
        'მსოფლიო წამყვანი იმპლანტოლოგიური ბრენდები'
      ],
      featuresEn: [
        'Atraumatic bone-preserving surgical techniques',
        'High-precision 3D planning with Planmeca ProMax 3D Plus',
        'World-leading certified implant systems'
      ]
    },
    {
      id: 'ortho',
      domain: 'dentistry',
      category: 'surgery',
      titleKa: 'ორთოდონტია და ბავშვთა სტომატოლოგია',
      titleEn: 'Orthodontics & Pediatric Dentistry',
      priceKa: '60 ₾ – 2 000 ₾+',
      priceEn: '60 ₾ – 2,000 ₾+',
      badgeKa: 'ბრეკეტები და ადაპტაცია',
      badgeEn: 'Braces & Child Care',
      subPricesKa: [
        { name: 'მეტალის ბრეკეტ-სისტემა (ორივე ყბა)', price: '1 200 ₾-დან' },
        { name: 'კერამიკული / საფირონის ბრეკეტები (ორივე ყბა)', price: '2 000 ₾-დან' },
        { name: 'ბავშვთა დაბჟენა (ფერადი ან სტანდარტული)', price: '60 – 150 ₾' },
        { name: 'სარძევე კბილის ექსტრაქცია', price: '30 – 50 ₾' },
        { name: 'ფტორირება / რემინერალიზაცია', price: '50 – 80 ₾' }
      ],
      subPricesEn: [
        { name: 'Metal braces system (both jaws)', price: 'from 1,200 ₾' },
        { name: 'Ceramic / Sapphire braces (both jaws)', price: 'from 2,000 ₾' },
        { name: 'Pediatric filling (colored or standard)', price: '60 – 150 ₾' },
        { name: 'Baby tooth extraction', price: '30 – 50 ₾' },
        { name: 'Fluoridation / remineralization', price: '50 – 80 ₾' }
      ],
      featuresKa: [
        'თანკბილვის გასწორება მოზარდებსა და მოზრდილებში',
        'ბავშვებთან თბილი, მეგობრული ადაპტაციური მიდგომა უსტრესო გარემოში',
        'კარიესის ადრეული პრევენცია და მინანქრის გამაგრება'
      ],
      featuresEn: [
        'Bite correction with advanced orthodontic systems',
        'Warm child adaptation and stress-free appointment pacing',
        'Caries prevention and enamel strengthening therapies'
      ]
    },
    {
      id: 'tech',
      domain: 'dentistry',
      category: 'tech',
      titleKa: 'მსოფლიო დონის ციფრული ტექნოლოგიები',
      titleEn: 'State-of-the-Art Digital Technologies',
      priceKa: 'ციფრული ცენტრი',
      priceEn: 'Digital Center',
      badgeKa: 'Planmeca ციფრული ცენტრი',
      badgeEn: 'Planmeca Suite',
      featuresKa: [
        'Planmeca ProMax 3D Plus — უახლესი თაობის 3D რენტგენოგრაფია მაქსიმალური სიზუსტით',
        'Planmeca Emerald S — შიდაპირის ციფრული სკანერი (აღარ არის საჭირო მასით ანაბეჭდის დისკომფორტული აღება)',
        'Guttafusion Oven და SybronEndo — არხების უმაღლესი ხარისხით და სრული ჰერმეტულობით მკურნალობა',
        'Estelite Asteria — უმაღლესი კლასის იაპონური კომპოზიტი მხატვრული რესტავრაციისთვის'
      ],
      featuresEn: [
        'Planmeca ProMax 3D Plus — Latest generation ultra-precise 3D CBCT',
        'Planmeca Emerald S — High-speed intraoral scanner (no uncomfortable paste molds)',
        'Guttafusion Oven & SybronEndo — Gold standard hermetic 3D root canal obturation',
        'Estelite Asteria — Premium Japanese aesthetic composite for natural artistic smiles'
      ]
    },

    // ---------------- INJECTION COSMETOLOGY ----------------
    {
      id: 'botox',
      domain: 'cosmetology',
      category: 'botox',
      titleKa: '1. ბოტულინოთერაპია (ბოტოქსი)',
      titleEn: '1. Botulinum Toxin Therapy (Botox)',
      priceKa: '150 ₾ – 1 000 ₾',
      priceEn: '150 ₾ – 1,000 ₾',
      badgeKa: 'Allergan / Xeomin / Nabota / Dysport',
      badgeEn: 'Allergan / Xeomin / Nabota / Dysport',
      subPricesKa: [
        { name: '1 ზონა (თვალის ირგვლივ ან წარბებს შორის)', price: '150 – 250 ₾' },
        { name: 'მთლიანი სახე (3 ზონა: შუბლი, წარბთაშუა, თვალები)', price: '350 – 500 ₾' },
        { name: 'Dysport (ერთეულებით, საშუალოდ 30–60 ერთ. ზონაზე)', price: '4 – 6 ₾ / ერთეული' },
        { name: 'ჰიპერჰიდროზი — ჭარბი ოფლიანობა (იღლიები / ხელები)', price: '600 – 1 000 ₾' }
      ],
      subPricesEn: [
        { name: '1 Zone (e.g. eye area or glabella)', price: '150 – 250 ₾' },
        { name: 'Full Face (3 zones: forehead, glabella, eyes)', price: '350 – 500 ₾' },
        { name: 'Dysport (per unit, avg 30–60 units/zone)', price: '4 – 6 ₾ / unit' },
        { name: 'Hyperhidrosis — excessive sweating (underarms / hands)', price: '600 – 1,000 ₾' }
      ],
      featuresKa: [
        'გამოიყენება მიმიკური ნაოჭების გასასწორებლად (შუბლი, თვალის ირგვლივ, წარბებს შორის)',
        'ჰიპერჰიდროზის (ჭარბი ოფლიანობის) ეფექტური და უსაფრთხო მკურნალობა',
        'პრეპარატები: Botox (Allergan, აშშ), Xeomin (Merz, გერმანია), Nabota (სამხრეთ კორეა), Dysport',
        'ბუნებრივი მიმიკის შენარჩუნება, დასვენებული და გაახალგაზრდავებული იერი'
      ],
      featuresEn: [
        'Used to smooth dynamic mimic wrinkles (forehead, crow\'s feet, frown lines)',
        'Effective and safe clinical treatment for hyperhidrosis (excessive sweating)',
        'FDA-approved preparations: Botox (Allergan, USA), Xeomin (Merz, Germany), Nabota (Korea), Dysport',
        'Preservation of natural facial expressions with refreshed youthful aesthetic'
      ]
    },
    {
      id: 'fillers',
      domain: 'cosmetology',
      category: 'fillers',
      titleKa: '2. კონტურული პლასტიკა (ფილერები)',
      titleEn: '2. Facial Contouring & Dermal Fillers',
      priceKa: '350 ₾ – 800 ₾',
      priceEn: '350 ₾ – 800 ₾',
      badgeKa: 'Juvederm / Restylane / Teosyal',
      badgeEn: 'Juvederm / Restylane / Teosyal',
      subPricesKa: [
        { name: 'პრემიუმ სეგმენტი (1.0 მლ შპრიცი)', price: '500 – 800 ₾' },
        { name: 'სტანდარტული / ევროპული–კორეული ბრენდები (1.0 მლ)', price: '350 – 500 ₾' }
      ],
      subPricesEn: [
        { name: 'Premium Segment (1.0 ml syringe)', price: '500 – 800 ₾' },
        { name: 'Standard / European-Korean Brands (1.0 ml)', price: '350 – 500 ₾' }
      ],
      featuresKa: [
        'ჰიალურონის მჟავის ბაზაზე დამზადებული შემავსებლები მოცულობის აღსადგენად',
        'ზონები: ტუჩის აუგმენტაცია, ყვრიმალები, ნიკაპი, ყბის ხაზი, ნასოლაბიალური ნაოჭი',
        'პრეპარატები: Juvederm (Voluma, Volift, Ultra), Restylane, Cytosial, Teosyal და სხვა',
        'უსაფრთხო, ჰარმონიული შედეგი ანატომიური პროპორციების მაქსიმალური დაცვით'
      ],
      featuresEn: [
        'Hyaluronic acid-based volumizers designed to restore and sculpt natural contours',
        'Target areas: Lips, cheekbones, chin, jawline angle, nasolabial folds',
        'Certified preparations: Juvederm (Voluma, Volift, Ultra), Restylane, Cytosial, Teosyal & more',
        'Harmonious enhancement preserving natural individual anatomy'
      ]
    },
    {
      id: 'biorevitalization',
      domain: 'cosmetology',
      category: 'biorevitalization',
      titleKa: '3. ბიორევიტალიზაცია',
      titleEn: '3. Biorevitalization & Deep Hydration',
      priceKa: '150 ₾ – 700 ₾',
      priceEn: '150 ₾ – 700 ₾',
      badgeKa: 'Profhilo & PDRN',
      badgeEn: 'Profhilo & PDRN',
      subPricesKa: [
        { name: 'Profhilo (პროფაილო - 2 მლ, 1 პროცედურა)', price: '500 – 700 ₾' },
        { name: 'სხვა ბიორევიტალიზანტები (1.5 – 2 მლ)', price: '150 – 450 ₾' },
        { name: 'PDRN (პოლინუკლეოტიდები)', price: '250 ₾' }
      ],
      subPricesEn: [
        { name: 'Profhilo (2 ml, 1 procedure)', price: '500 – 700 ₾' },
        { name: 'Other Biorevitalizants (1.5 – 2 ml)', price: '150 – 450 ₾' },
        { name: 'PDRN (Polynucleotides)', price: '250 ₾' }
      ],
      featuresKa: [
        'კანის ღრმა დატენიანება და ჰიდრობალანსის სრული აღდგენა',
        'ელასტიურობის ამაღლება და წვრილი ნაოჭების პრევენცია კონცენტრირებული ჰიალურონის მჟავით',
        'PDRN პოლინუკლეოტიდები — უჯრედული რეგენერაცია და ქსოვილთა განახლება',
        'ხავერდოვანი, მბზინვარე და ხანგრძლივად ჯანსაღი კანის ეფექტი'
      ],
      featuresEn: [
        'Deep dermal hydration and complete moisture barrier restoration',
        'Elasticity recovery and fine wrinkle prevention with concentrated hyaluronic acid',
        'PDRN polynucleotides for cellular regeneration and tissue repair',
        'Velvet texture, luminous glow, and long-lasting vitality'
      ]
    },
    {
      id: 'mesotherapy',
      domain: 'cosmetology',
      category: 'mesotherapy',
      titleKa: '4. მეზოთერაპია',
      titleEn: '4. Mesotherapy',
      priceKa: '80 ₾ – 250 ₾',
      priceEn: '80 ₾ – 250 ₾',
      badgeKa: 'ვიტამინური კოქტეილები',
      badgeEn: 'Vitamin Cocktails',
      subPricesKa: [
        { name: '1 პროცედურა (სახე)', price: '120 – 250 ₾' },
        { name: 'თვალის ირგვლივ ზონა', price: '80 – 150 ₾' }
      ],
      subPricesEn: [
        { name: '1 Procedure (Full Face)', price: '120 – 250 ₾' },
        { name: 'Periorbital Eye Zone', price: '80 – 150 ₾' }
      ],
      featuresKa: [
        'ვიტამინების, ამინომჟავების, პეპტიდებისა და მიკროელემენტების "კოქტეილები"',
        'კანის ტონუსის, ფერისა და ტექსტურის საგრძნობი გაუმჯობესება',
        'პიგმენტაციასთან, დაღლილობასთან და მუქ წრეებთან ეფექტური ბრძოლა',
        'უჯრედული მეტაბოლიზმისა და მიკროცირკულაციის სტიმულაცია'
      ],
      featuresEn: [
        'Therapeutic cocktails of vitamins, amino acids, peptides, and trace minerals',
        'Noticeable improvement in skin firmness, complexion, and micro-texture',
        'Fights hyperpigmentation, fatigue, and periorbital dark circles',
        'Boosts cellular metabolism and microcirculation'
      ]
    },
    {
      id: 'biostimulation',
      domain: 'cosmetology',
      category: 'biostimulation',
      titleKa: '5. კოლაგენოსტიმულატორები (ბიოსტიმულაცია)',
      titleEn: '5. Collagen Stimulators (Biostimulation)',
      priceKa: '750 ₾ – 1 200 ₾',
      priceEn: '750 ₾ – 1,200 ₾',
      badgeKa: 'Radiesse & Sculptra',
      badgeEn: 'Radiesse & Sculptra',
      subPricesKa: [
        { name: 'Radiesse (1.5 მლ, კალციუმის ჰიდროქსიაპატიტი)', price: '750 – 900 ₾' },
        { name: 'Sculptra (პოლი-L-რძემჟავა) / AestheFill', price: '850 – 1 200 ₾' }
      ],
      subPricesEn: [
        { name: 'Radiesse (1.5 ml, Calcium Hydroxylapatite)', price: '750 – 900 ₾' },
        { name: 'Sculptra (Poly-L-lactic acid) / AestheFill', price: '850 – 1,200 ₾' }
      ],
      featuresKa: [
        'პრეპარატები, რომლებიც კანში საკუთარი კოლაგენის გამომუშავებას ასტიმულირებენ',
        'უზრუნველყოფენ ხანგრძლივ ლიფტინგ-ეფექტს (1.5 – 2 წელი)',
        'პრეპარატები: Sculptra (პოლი-L-რძემჟავა), Radiesse (კალციუმის ჰიდროქსიაპატიტი), AestheFill',
        'კანის სტრუქტურული გამკვრივება, ოვალის გამოკვეთა და ქსოვილთა გაახალგაზრდავება'
      ],
      featuresEn: [
        'Advanced formulations that trigger neocollagenesis deep within the dermis',
        'Provides sustained, natural lifting and firming effect lasting 1.5–2 years',
        'Top preparations: Sculptra (PLLA), Radiesse (CaHA), AestheFill',
        'Structural skin thickening, refined jawline contour, and deep tissue rejuvenation'
      ]
    }
  ];

  const domainServices = activeDomain === 'all' 
    ? services 
    : services.filter(s => s.domain === activeDomain);

  const filteredServices = activeTab === 'all' 
    ? domainServices 
    : domainServices.filter(s => s.category === activeTab || s.id === activeTab);

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#f6f7f1] rounded-t-[28px] sm:rounded-[28px] md:rounded-[36px] w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-[20px_20px_40px_rgba(163,177,198,0.7),-20px_-20px_40px_rgba(255,255,255,0.9)] border border-white/40 flex flex-col relative animate-[scaleUp_0.2s_ease-out]">
        
        {/* Header */}
        <div className="p-5 md:p-7 pb-4 bg-[#f6f7f1] border-b border-neutral-200/80 flex items-start justify-between relative flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f6f7f1] p-1.5 shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/30 flex items-center justify-center shrink-0">
              <img src="/assets/logo_monogram.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 border border-white/40 text-[10px] font-black text-neutral-600 uppercase tracking-wider mb-1">
                {t('Dr. Jenny Pirtskhalava', 'ექიმი ჯენი ფირცხალავა')}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-neutral-900 leading-tight">
                {t('Services & Estimated Pricing', 'სერვისები და საორიენტაციო ფასები')}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 bg-[#f6f7f1] hover:shadow-[inset_2px_2px_5px_rgba(163,177,198,0.5)] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/20 rounded-full flex items-center justify-center text-neutral-700 hover:text-black font-black text-sm transition-all shrink-0 ml-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-5 md:px-7 py-2.5 bg-[#fbfbf8] border-b border-neutral-200/60 flex items-center gap-2 flex-shrink-0">
          <span className="text-base shrink-0">ℹ️</span>
          <p className="text-[11px] md:text-xs font-bold text-neutral-600 leading-snug">
            {t(
              'Prices are indicative. Exact treatment plan and costs are determined during free initial consultation with Dr. Jenny.',
              'ფასები საორიენტაციოა. ზუსტი ღირებულება დგინდება ექიმ ჯენი ფირცხალავასთან უფასო პირველად კონსულტაციაზე.'
            )}
          </p>
        </div>

        {/* Major Domain Switcher (Dentistry vs Injection Cosmetology) */}
        <div className="px-5 md:px-7 pt-3.5 pb-2.5 bg-[#f6f7f1] flex items-center gap-2 border-b border-neutral-200/60 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            type="button"
            onClick={() => { setActiveDomain('dentistry'); setActiveTab('all'); }}
            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeDomain === 'dentistry'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-[#f6f7f1] text-neutral-700 hover:text-neutral-900 shadow-[2px_2px_5px_rgba(163,177,198,0.4),-2px_-2px_5px_rgba(255,255,255,0.85)] border border-white/30'
            }`}
          >
            <span>🦷</span>
            <span>{t('Dentistry', 'სტომატოლოგია')}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeDomain === 'dentistry' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>9</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveDomain('cosmetology'); setActiveTab('all'); }}
            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeDomain === 'cosmetology'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-[#f6f7f1] text-neutral-700 hover:text-neutral-900 shadow-[2px_2px_5px_rgba(163,177,198,0.4),-2px_-2px_5px_rgba(255,255,255,0.85)] border border-white/30'
            }`}
          >
            <span>✨</span>
            <span>{t('Injection Cosmetology', 'ინექციური კოსმეტოლოგია')}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeDomain === 'cosmetology' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>5</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveDomain('all'); setActiveTab('all'); }}
            className={`px-3.5 md:px-4 py-2 md:py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeDomain === 'all'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-[#f6f7f1] text-neutral-500 hover:text-neutral-900 shadow-[2px_2px_5px_rgba(163,177,198,0.35),-2px_-2px_5px_rgba(255,255,255,0.85)] border border-white/30'
            }`}
          >
            <span>{t('All', 'ყველა')}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeDomain === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>14</span>
          </button>
        </div>

        {/* Subcategories Tabs Filter */}
        <div className="px-5 md:px-7 py-2.5 bg-[#fbfbf8] border-b border-neutral-200/60 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] md:text-xs font-black transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#F5D061] text-neutral-900 shadow-sm'
                    : 'bg-[#f6f7f1] text-neutral-600 hover:text-neutral-900 shadow-[1px_1px_3px_rgba(163,177,198,0.3),-1px_-1px_3px_rgba(255,255,255,0.8)] border border-white/30'
                }`}
              >
                {lang === 'en' ? cat.labelEn : cat.labelKa}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((svc) => {
              const isSelected = selectedServiceId === svc.id;
              const svcTitle = lang === 'en' ? svc.titleEn : svc.titleKa;
              return (
                <div 
                  key={svc.id}
                  onClick={() => setSelectedServiceId(isSelected ? null : svc.id)}
                  className={`bg-[#f6f7f1] rounded-2xl p-5 border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#F5D061] ring-2 ring-[#F5D061]/60 shadow-[6px_6px_16px_rgba(245,208,97,0.25),-4px_-4px_12px_rgba(255,255,255,0.95)]'
                      : 'border-white/50 shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[6px_6px_14px_rgba(163,177,198,0.45),-6px_-6px_14px_rgba(255,255,255,0.95)]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm md:text-base text-neutral-900 leading-snug">
                          {svcTitle}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#F5D061] shrink-0" />
                        )}
                      </div>
                      <span className="px-3 py-1 bg-[#F5D061] text-neutral-900 font-black text-xs rounded-full shadow-sm whitespace-nowrap shrink-0">
                        {lang === 'en' ? svc.priceEn : svc.priceKa}
                      </span>
                    </div>

                    {svc.badgeKa && (
                      <span className="inline-block px-2.5 py-0.5 bg-neutral-200/70 text-neutral-700 text-[10px] font-extrabold rounded-md mb-3">
                        {lang === 'en' ? svc.badgeEn : svc.badgeKa}
                      </span>
                    )}

                    {/* Sub-prices if applicable */}
                    {svc.subPricesKa && (
                      <div className="flex flex-col gap-1.5 mb-3 p-3 bg-white/60 rounded-xl border border-white/40">
                        {(lang === 'en' && svc.subPricesEn ? svc.subPricesEn : svc.subPricesKa).map((sp, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold">
                            <span className="text-neutral-700">{sp.name}</span>
                            <span className="text-neutral-900 font-black shrink-0 ml-2">{sp.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullet points */}
                    <ul className="flex flex-col gap-1.5 text-xs font-semibold text-neutral-600">
                      {(lang === 'en' ? svc.featuresEn : svc.featuresKa).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#d89f18] font-black shrink-0">✓</span>
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Direct booking button on the card */}
                  <div className="pt-3.5 mt-4 border-t border-neutral-200/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookVisit(svcTitle);
                      }}
                      className={`w-full py-2.5 px-4 font-black text-xs rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                        isSelected 
                          ? 'bg-[#F5D061] text-neutral-900 hover:bg-neutral-900 hover:text-white' 
                          : 'bg-neutral-900 hover:bg-[#F5D061] text-white hover:text-neutral-900'
                      }`}
                    >
                      <span>📅</span>
                      <span>{t('Book with Bot', 'დაჯავშნა ბოტთან')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 md:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] bg-[#f6f7f1] border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs font-bold text-neutral-600">
            <span>📍 {t('14 Balanchivadze St, Tbilisi', 'მელიტონ და ანდრია ბალანჩივაძეების ქ. 14, თბილისი')}</span>
            <span className="hidden sm:inline">•</span>
            <span>📞 <a href="tel:+995593567998" className="text-neutral-900 font-black hover:underline">593 56 79 98</a></span>
          </div>

          <button
            onClick={() => {
              const selectedSvc = services.find(s => s.id === selectedServiceId);
              const svcTitle = selectedSvc ? (lang === 'en' ? selectedSvc.titleEn : selectedSvc.titleKa) : undefined;
              onBookVisit(svcTitle);
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900 hover:bg-[#F5D061] text-white hover:text-neutral-900 rounded-full font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>📅</span>
            <span>
              {selectedServiceId
                ? t('Book Selected Service with Bot', 'მონიშნულის დაჯავშნა ბოტთან')
                : t('Book Appointment in Chat', 'ვიზიტის დაჯავშნა ექიმთან')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// CHATBOT ASSISTANT WIDGET (Knowledge Base)
// ==========================================
interface ChatbotWidgetProps {
  lang: 'ka' | 'en';
  t: (en: string, ka: string) => string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookingTrigger?: number;
  bookingService?: string | null;
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ 
  lang, 
  t, 
  isOpen, 
  setIsOpen, 
  bookingTrigger = 0,
  bookingService = null
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const prevTriggerRef = useRef(bookingTrigger);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    const updateHeight = () => {
      if (window.visualViewport && chatContainerRef.current && window.innerWidth < 768) {
        chatContainerRef.current.style.height = `${window.visualViewport.height}px`;
        chatContainerRef.current.style.top = `${window.visualViewport.offsetTop}px`;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
      updateHeight();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
    };
  }, [isOpen]);
  const getSessionId = () => {
    if (sessionIdRef.current) return sessionIdRef.current;
    let s = '';
    try {
      s = localStorage.getItem('jenny_chat_sid') || '';
      if (!s) {
        s = 'web-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        localStorage.setItem('jenny_chat_sid', s);
      }
    } catch {
      s = 'web-' + Date.now();
    }
    sessionIdRef.current = s;
    return s;
  };

  const initChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: t(
          'Hello! 🦷 I am Dr. Jenny\'s virtual assistant. How can I help you?',
          'მოგესალმებით! 🦷 მე ვარ ექიმ ჯენის ვირტუალური ასისტენტი. რით დაგეხმაროთ?'
        )
      }
    ]);
  };

  useEffect(() => {
    initChat();
  }, [lang]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('chat_closed', 'true');
    localStorage.setItem('chat_closed_manual', 'true');
  };

  // 5-second automatic popup on first visit
  useEffect(() => {
    const isClosed = sessionStorage.getItem('chat_closed') || localStorage.getItem('chat_closed_manual');
    if (!isClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // When external booking button is clicked
  useEffect(() => {
    if (bookingTrigger > 0 && bookingTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = bookingTrigger;
      setIsOpen(true);
      setTimeout(() => {
        const text = bookingService
          ? (lang === 'en'
              ? `I would like to book an appointment for: ${bookingService}`
              : `მსურს ვიზიტის დაჯავშნა სერვისზე: ${bookingService}`)
          : t('I would like to book an appointment with Dr. Jenny', 'მსურს ექიმ ჯენისთან ვიზიტის დაჯავშნა');
        handleUserText(text);
      }, 200);
    }
  }, [bookingTrigger, bookingService, lang]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleUserText = async (rawText: string) => {
    const userMsg: ChatMessage = { sender: 'user', text: rawText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('https://meticulous-oyster.pikapod.net/webhook/jeni-website-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: rawText, 
          sessionId: getSessionId() 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      let botReply = '';
      if (typeof data === 'string') {
        botReply = data;
      } else if (Array.isArray(data) && data.length > 0) {
        botReply = data[0]?.output || data[0]?.text || data[0]?.message || data[0]?.response || '';
      } else if (data && typeof data === 'object') {
        botReply = data.output || data.text || data.message || data.response || '';
      }

      if (!botReply) {
        botReply = t(
          'Thank you for your message. How else can I assist you?',
          'გმადლობთ შეტყობინებისთვის. რით შემიძლია კიდევ დაგეხმაროთ?'
        );
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error('Chat webhook error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: t(
            'Sorry, I am temporarily unable to connect to the server. Please call us directly: 593 56 79 98',
            'ბოდიშს გიხდით, კავშირის დროებითი შეფერხებაა. გთხოვთ დაგვიკავშირდეთ ნომერზე: 593 56 79 98'
          ),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col items-end ${isOpen ? 'inset-0 md:inset-auto md:bottom-20 md:right-20' : 'bottom-6 right-6 md:bottom-20 md:right-20'}`}>
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
        <div 
          ref={chatContainerRef}
          className="w-full h-full md:w-[360px] md:h-[520px] md:max-h-[85vh] bg-[#f6f7f1] md:border md:border-white/30 md:rounded-[32px] overflow-hidden shadow-[10px_10px_25px_rgba(163,177,198,0.6),-10px_-10px_25px_rgba(255,255,255,0.85)] flex flex-col md:mb-4 animate-[scaleUp_0.25s_ease-out]"
        >
          <div className="bg-black text-white p-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-4 flex items-center justify-between shadow-sm flex-shrink-0">
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
              onClick={handleClose}
              className="text-white hover:text-neutral-300 font-bold text-lg md:text-sm focus:outline-none p-1"
              aria-label="Close chat"
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
                  className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-neutral-800 text-white rounded-tr-none shadow-md' : 'bg-[#f6f7f1] border border-white/30 text-neutral-800 rounded-tl-none shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.85)]'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col max-w-[85%] self-start items-start">
                <div className="p-3 rounded-2xl text-xs font-bold leading-relaxed bg-[#f6f7f1] border border-white/30 text-neutral-500 rounded-tl-none shadow-[3px_3px_6px_rgba(163,177,198,0.4),-3px_-3px_6px_rgba(255,255,255,0.85)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!inputText.trim()) return;
              const text = inputText.trim();
              setInputText('');
              handleUserText(text);
            }}
            className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3 bg-[#f6f7f1] border-t border-white/40 flex items-center gap-2 flex-shrink-0"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('Type a message...', 'დაწერეთ შეტყობინება...')}
              className="flex-1 bg-white/90 border border-neutral-200/90 rounded-full px-4 py-2.5 text-base md:text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F5D061]/50 focus:bg-white transition-all shadow-[inset_2px_2px_4px_rgba(163,177,198,0.25)]"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-[#F5D061] hover:text-neutral-900 disabled:opacity-35 disabled:hover:bg-neutral-900 disabled:hover:text-white transition-all shadow-md active:scale-95 flex-shrink-0"
              aria-label={t('Send message', 'შეტყობინების გაგზავნა')}
            >
              <svg className="w-4 h-4 -rotate-45 -translate-y-0.5 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className={`w-14 h-14 rounded-full items-center justify-center border border-white/20 transition-all relative ${
          isOpen 
            ? 'hidden md:flex bg-[#f6f7f1] shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.85)] hover:scale-105' 
            : 'flex bg-neutral-200 text-neutral-800 animate-[pulse-gray_2.5s_infinite] shadow-lg'
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
// ROTATING SOCIAL MEDIA BADGE (Hero Section)
// ==========================================
const SOCIAL_NETWORKS_HERO = [
  {
    name: 'Instagram',
    handle: '@dr.jenny_pirtskhalava',
    url: 'https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr',
    bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    shadowColor: 'rgba(220,39,67,0.45)',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    handle: 'Jenny Pirtskhalava',
    url: 'https://www.facebook.com/MaRiAm.jenni.pirtskhalava',
    bgClass: 'bg-[#1877F2]',
    shadowColor: 'rgba(24,119,242,0.45)',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
      </svg>
    )
  },
  {
    name: 'TikTok',
    handle: '@jennypirtskhalava',
    url: 'https://www.tiktok.com/@jennypirtskhalava?_r=1',
    bgClass: 'bg-neutral-950',
    shadowColor: 'rgba(0,0,0,0.4)',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#25F4EE]" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.41-.33-.25-.63-.53-.9-.85-.02 2.22.01 4.43-.02 6.65-.09 1.91-.73 3.86-2.07 5.24-1.63 1.76-4.22 2.62-6.57 2.23-2.31-.34-4.54-1.92-5.46-4.14-1.07-2.43-.65-5.5 1.12-7.51 1.5-1.77 3.96-2.63 6.22-2.22v4.18c-1.34-.34-2.88-.02-3.89.93-.97.9-.99 2.52-.16 3.55.77.99 2.14 1.34 3.32.96 1.07-.31 1.83-1.33 1.89-2.45.06-2.95.02-5.91.04-8.86v-.03z"/>
      </svg>
    )
  },
  {
    name: 'Telegram',
    handle: '@JennyDentbot',
    url: 'https://t.me/JennyDentbot',
    bgClass: 'bg-[#229ED9]',
    shadowColor: 'rgba(34,158,217,0.45)',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6.15-.15 2.72-2.5 2.77-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.85 1.17-5.23 3.45-.5.34-.95.5-1.35.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.47.97-.73 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.53 4.4-1.8 4.89-1.8.11 0 .35.03.5.15.13.1.17.24.18.35-.01.07.01.19 0 .28z"/>
      </svg>
    )
  }
];

const SocialRotatingBadge: React.FC<{ t: (en: string, ka: string) => string }> = ({ t }) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobileAutoFollow, setIsMobileAutoFollow] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const showFollowMe = isHovered || isMobileExpanded || isMobileAutoFollow;

  useEffect(() => {
    if (isHovered || isMobileExpanded) return;
    const interval = setInterval(() => {
      const isTouch = window.matchMedia('(max-width: 767px), (hover: none)').matches;
      setIsFlipping(true);
      setTimeout(() => {
        if (isTouch) {
          if (isMobileAutoFollow) {
            setIsMobileAutoFollow(false);
            setIndex(0);
          } else if (index === SOCIAL_NETWORKS_HERO.length - 1) {
            setIsMobileAutoFollow(true);
          } else {
            setIndex((prev) => (prev + 1) % SOCIAL_NETWORKS_HERO.length);
          }
        } else {
          setIndex((prev) => (prev + 1) % SOCIAL_NETWORKS_HERO.length);
        }
        setIsFlipping(false);
      }, 250);
    }, 2400);

    return () => clearInterval(interval);
  }, [isHovered, isMobileExpanded, isMobileAutoFollow, index]);

  // Close mobile expanded state when tapping outside
  useEffect(() => {
    if (!isMobileExpanded) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMobileExpanded]);

  const current = SOCIAL_NETWORKS_HERO[index];

  const handleBadgeClick = () => {
    const isTouch = window.matchMedia('(max-width: 767px), (hover: none)').matches;
    if (isTouch && !isMobileExpanded) {
      setIsMobileExpanded(true);
      return;
    }
    window.open(current.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={badgeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBadgeClick}
      className="absolute bottom-[2%] -right-[8%] md:bottom-[10%] md:-right-[14%] bg-white/85 backdrop-blur-md p-2.5 md:p-3.5 rounded-2xl shadow-lg border border-white/50 block hover:-translate-y-2 hover:scale-105 hover:bg-white/95 transition-all duration-300 cursor-pointer select-none z-20 group"
      style={{
        boxShadow: showFollowMe
          ? `0 14px 32px rgba(0,0,0,0.12), 0 4px 14px ${current.shadowColor}`
          : '0 10px 25px rgba(163,177,198,0.45), -6px -6px 15px rgba(255,255,255,0.9)'
      }}
    >
      {!showFollowMe ? (
        <div className="flex items-center gap-2.5 md:gap-3 min-w-[150px] md:min-w-[190px]">
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${current.bgClass} flex items-center justify-center text-white shrink-0 shadow-md transition-all duration-300 ${
              isFlipping ? 'scale-75 rotate-180 opacity-40' : 'scale-100 rotate-0 opacity-100'
            }`}
          >
            <span className="scale-90 md:scale-100">{current.icon}</span>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] md:text-xs font-black text-neutral-800 leading-tight">
                {current.name}
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 truncate max-w-[105px] md:max-w-[130px] mt-0.5">
              {current.handle}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 min-w-[175px] md:min-w-[205px]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="text-sm md:text-base animate-bounce">👋</span>
              <div>
                <p className="text-[11px] md:text-xs font-black text-neutral-900 leading-tight">
                  {t('Follow Me', 'დამიმეგობრდი')}
                </p>
                <p className="text-[8px] md:text-[9px] font-bold text-neutral-400 leading-none mt-0.5">
                  {t('Connect on Social Media', 'გამოიწერეთ გვერდები')}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#d89f18] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              ↗
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 pt-1.5 md:pt-2 border-t border-neutral-200/70">
            {SOCIAL_NETWORKS_HERO.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full ${soc.bgClass} flex items-center justify-center text-white shadow-sm hover:scale-125 active:scale-110 hover:shadow-md transition-all duration-200`}
                title={soc.name}
              >
                <span className="scale-[0.65] md:scale-75">{soc.icon}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// RATING & EXPERTISE BADGE (Hero Top-Left)
// ==========================================
const RatingExpertiseBadge: React.FC<{ t: (en: string, ka: string) => string }> = ({ t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileAlt, setIsMobileAlt] = useState(false);

  // On mobile/touch devices, automatically cycle between 5.0 Rating and 15+ Years Expertise
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (hover: none)');
    if (!mediaQuery.matches) return;

    const interval = setInterval(() => {
      setIsMobileAlt((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showExpertise = isHovered || isMobileAlt;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsMobileAlt((prev) => !prev)}
      className="absolute top-[2%] -left-[4%] md:top-[10%] md:-left-[5%] bg-white/85 backdrop-blur-md p-2.5 md:p-4 rounded-2xl shadow-lg border border-white/50 block hover:-translate-y-2 hover:scale-105 hover:bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer select-none z-20"
    >
      {!showExpertise ? (
        <div className="flex items-center gap-2.5 md:gap-3">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#F5D061] flex items-center justify-center text-white text-base md:text-xl font-black shrink-0 shadow-[0_2px_8px_rgba(245,208,97,0.4)]">
            ★
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] md:text-xs font-black text-neutral-800 leading-none">
              {t('5.0 Rating', '5.0 რეიტინგი')}
            </p>
            <div className="flex text-[#F5D061] text-[10px] md:text-[11px] tracking-tight leading-none mt-1">
              ★★★★★
            </div>
            <p className="text-[8px] md:text-[9px] font-bold text-neutral-400 mt-1">
              {t('Google Reviews', 'Google Reviews')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 md:gap-3 py-0.5">
          <span className="text-xl md:text-2xl leading-none">🏆</span>
          <div>
            <p className="text-[11px] md:text-xs font-black text-neutral-800 leading-tight">
              {t('Expertise', 'ექსპერტული ცოდნა')}
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 mt-0.5">
              {t('15+ Years Practice', '15+ წლიანი გამოცდილება')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<'ka' | 'en'>('ka');
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [servicesModalCategory, setServicesModalCategory] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bookingTrigger, setBookingTrigger] = useState(0);
  const [bookingService, setBookingService] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  const handleOpenServices = (category = 'all') => {
    setServicesModalCategory(category);
    setIsServicesModalOpen(true);
  };

  const handleStartBooking = (serviceName?: string | React.MouseEvent) => {
    const validService = typeof serviceName === 'string' && serviceName.trim() ? serviceName.trim() : null;
    setBookingService(validService);
    setIsServicesModalOpen(false);
    setIsChatOpen(true);
    setBookingTrigger(prev => prev + 1);
  };

  const [visitorCount, setVisitorCount] = useState<string>('00001');

  const t = (en: string, ka: string) => (lang === 'en' ? en : ka);

  useEffect(() => {
    const STORAGE_KEY = 'jenny_unique_visitors_total_v2';
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setVisitorCount(cached);
    }

    // Real-time global counter across all visitors and devices
    fetch('https://hits.dwyl.com/gogmaisuradze/jenny.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.message) {
          const num = parseInt(data.message, 10);
          if (!isNaN(num) && num > 0) {
            const formatted = String(num).padStart(5, '0');
            setVisitorCount(formatted);
            localStorage.setItem(STORAGE_KEY, formatted);
          }
        }
      })
      .catch(() => {
        try {
          let count = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
          if (isNaN(count)) count = 1;
          count += 1;
          const formatted = String(count).padStart(5, '0');
          setVisitorCount(formatted);
          localStorage.setItem(STORAGE_KEY, formatted);
        } catch {
          setVisitorCount('00001');
        }
      });
  }, []);

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
        onBookClick={handleStartBooking} 
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
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div 
              style={s1Reveal.getAnimStyle(0)}
              className="flex flex-col gap-6 items-start z-10 relative"
            >
              {/* Hand-drawn dental tools watermark sketch behind text (Enlarged) */}
              <img 
                src="/assets/hands_drawing.png" 
                alt="Hands holding dental tools watermark" 
                className="absolute -left-16 md:-left-24 -top-12 md:-top-16 w-[560px] md:w-[720px] max-w-none pointer-events-none select-none opacity-[0.24] z-0"
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
                  onClick={handleStartBooking}
                  className="px-8 py-4 bg-[#f6f7f1] hover:scale-105 rounded-full font-black text-neutral-800 shadow-[6px_6px_15px_rgba(163,177,198,0.5),-6px_-6px_15px_rgba(255,255,255,0.85)] border border-white/20 active:shadow-inner transition-all text-xs uppercase tracking-wider"
                >
                  {t('Book Visit Now', 'ვიზიტის დაჯავშნა')}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenServices('all')}
                  className="px-8 py-4 bg-transparent border-2 border-dashed border-neutral-300 hover:border-neutral-500 rounded-full font-black text-neutral-700 text-xs flex items-center justify-center transition-all cursor-pointer hover:bg-neutral-900 hover:text-white"
                >
                  {t('Services', 'მომსახურებები')}
                </button>
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
                <RatingExpertiseBadge t={t} />
                <SocialRotatingBadge t={t} />
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
          <div className="text-center mb-10 md:mb-12">
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
            <div 
              onClick={() => handleOpenServices('dentistry')}
              className="group relative overflow-hidden rounded-[28px] shadow-lg h-[460px] bg-neutral-100 cursor-pointer"
            >
              <img src={DENTISTRY_CARD_BG} alt="Dentistry showcase" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/35 to-neutral-950/90" />
              <div className="absolute inset-0 p-6 md:p-8 w-full flex flex-col justify-between items-start">
                {/* Top content: Badge, Title & Description */}
                <div className="flex flex-col items-start gap-3 md:gap-3.5 max-w-md">
                  {/* Neumorphic accent label */}
                  <span className="px-4 py-2 bg-[#F5D061] text-neutral-800 font-black text-[10px] rounded-full shadow-md uppercase tracking-wider">
                    {t('Dentistry', 'სტომატოლოგია')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {t('Aesthetic Dentistry', 'ესთეტიკური და აღდგენითი სტომატოლოგია')}
                  </h3>
                  <p className="text-neutral-200 text-xs md:text-sm font-semibold max-w-sm">
                    {t('Implants, porcelain veneers, crowns and artistic restoration.', 'იმპლანტოლოგია, ორთოდონტია, ვინირები და მხატვრული რესტავრაცია.')}
                  </p>
                </div>

                {/* Bottom CTA Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenServices('dentistry');
                    }}
                    className="px-5 py-3 bg-[#f6f7f1] hover:scale-105 hover:bg-neutral-800 hover:text-white hover:-translate-y-0.5 text-neutral-800 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                  >
                    {t('View Services', 'სრულად ნახვა')}
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartBooking(t('Aesthetic Dentistry', 'ესთეტიკური და აღდგენითი სტომატოლოგია'));
                    }}
                    className="px-5 py-3 bg-[#F5D061] hover:scale-105 hover:bg-white hover:-translate-y-0.5 text-neutral-900 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>{t('Book with Bot', 'დაჯავშნა ბოტთან')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Injection Cosmetology Direction Card */}
            <div 
              onClick={() => handleOpenServices('cosmetology')}
              className="group relative overflow-hidden rounded-[28px] shadow-lg h-[460px] bg-neutral-100 cursor-pointer"
            >
              <img src={COSMETOLOGY_CARD_BG} alt="Injection cosmetology showcase" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/35 to-neutral-950/90" />
              <div className="absolute inset-0 p-6 md:p-8 w-full flex flex-col justify-between items-start">
                {/* Top content: Badge, Title & Description */}
                <div className="flex flex-col items-start gap-3 md:gap-3.5 max-w-md">
                  {/* Neumorphic accent label */}
                  <span className="px-4 py-2 bg-[#f6f7f1] text-neutral-800 font-black text-[10px] rounded-full shadow-md uppercase tracking-wider">
                    {t('Injection Cosmetology', 'ინექციური კოსმეტოლოგია')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {t('Injection Cosmetology & Aesthetics', 'ინექციური კოსმეტოლოგია და დერმატოლოგია')}
                  </h3>
                  <p className="text-neutral-200 text-xs md:text-sm font-semibold max-w-sm">
                    {t('Botox, dermal fillers, biorevitalization, mesotherapy & biostimulation.', 'ბოტოქსი, კონტურული პლასტიკა, ბიორევიტალიზაცია და ბიოსტიმულაცია.')}
                  </p>
                </div>

                {/* Bottom CTA Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenServices('cosmetology');
                    }}
                    className="px-5 py-3 bg-[#f6f7f1] hover:scale-105 hover:bg-neutral-800 hover:text-white hover:-translate-y-0.5 text-neutral-800 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                  >
                    {t('View Services', 'სრულად ნახვა')}
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartBooking(t('Injection Cosmetology & Aesthetics', 'ინექციური კოსმეტოლოგია და დერმატოლოგია'));
                    }}
                    className="px-5 py-3 bg-[#F5D061] hover:scale-105 hover:bg-white hover:-translate-y-0.5 text-neutral-900 font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>{t('Book with Bot', 'დაჯავშნა ბოტთან')}</span>
                  </button>
                </div>
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
          {/* Contour 3: Tooth and braces in top-right corner next to title */}
          <img 
            src="/assets/tooth_braces.png" 
            alt="Tooth and braces watermark" 
            className="absolute -right-16 md:-right-28 top-6 md:top-12 w-[240px] md:w-[340px] h-auto pointer-events-none select-none opacity-[0.36] z-0"
          />

          {/* Portrait frame */}
          <div 
            style={s3Reveal.getAnimStyle(0)}
            className="md:col-span-5 relative"
            id="about-portrait-container"
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
                <span className="text-xs font-bold text-neutral-800">{t('Planmeca 3D & Emerald S Scanner', 'Planmeca 3D & Emerald S სკანერი')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Restorations with 2-Month Warranty', 'მხატვრული რესტავრაცია 2-თვიანი გარანტიით')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Endodontics with Guttafusion & Sybron', 'არხების მკურნალობა Guttafusion & SybronEndo-ით')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-[2px_2px_5px_rgba(163,177,198,0.2)] hover:scale-105 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md transition-all duration-300 select-none cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-[#F5D061] text-[#F5D061] flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                <span className="text-xs font-bold text-neutral-800">{t('Free Consultation & Photo Protocol', 'უფასო პირველადი კონსულტაცია და ფოტოპროტოკოლი')}</span>
              </div>
            </div>

            <a 
              href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-8 py-4 bg-[#262626] hover:bg-neutral-800 hover:-translate-y-1 text-white text-xs font-black rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{t('Learn More (Facebook)', 'დაწვრილებით ჩემს შესახებ')}</span>
              <span>↗</span>
            </a>
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
            
            {/* Link to Facebook photos */}
            <div className="flex gap-2 shrink-0">
              <a 
                href="https://www.facebook.com/profile.php?id=100042099562926&sk=photos"
                target="_blank"
                rel="noopener noreferrer"
                onClick={openFacebookPhotos}
                className="px-4 py-2 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 hover:scale-105 font-black text-xs text-neutral-800 flex items-center gap-1.5 transition-all"
              >
                <span>{t('All Results (Facebook)', 'ყველა შედეგი (Facebook)')}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div 
            style={s4Reveal.getAnimStyle(0)}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
          >
            {/* Gallery Item 1 */}
            <a 
              href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100 cursor-pointer block"
            >
              <img src={GALLERY_ITEM_1} alt="Dental Restoration Case" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Instagram</span> <span>↗</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Implantology', 'იმპლანტოლოგია')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('Full mouth restoration', 'სრული რესტავრაცია')}</p>
              </div>
            </a>

            {/* Gallery Item 2 */}
            <a 
              href="https://www.instagram.com/dr.jenny_pirtskhalava?igsh=MW4xZmNhdXhoNHdw&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100 cursor-pointer block"
            >
              <img src={GALLERY_ITEM_2} alt="Veneers Transformation Case" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Instagram</span> <span>↗</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end items-start gap-1">
                <p className="text-white font-black text-sm">{t('Aesthetic Smile', 'ესთეტიკური ღიმილი')}</p>
                <p className="text-neutral-300 text-[11px] font-bold">{t('After ceramic veneers placement', 'ვენირების შემდეგ')}</p>
              </div>
            </a>

            {/* Gallery Item 3 - See More Card */}
            <a 
              href="https://www.facebook.com/profile.php?id=100042099562926&sk=photos"
              target="_blank"
              rel="noopener noreferrer"
              onClick={openFacebookPhotos}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md bg-neutral-100 cursor-pointer block"
            >
              <img src={GALLERY_ITEM_3} alt="Full Orthodontic teeth model" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-transparent p-6 flex flex-col justify-end items-start gap-3 w-full">
                <div>
                  <h4 className="font-black text-lg text-white mb-1 tracking-tight">{t('See More Cases', 'იხილეთ მეტი')}</h4>
                  <p className="text-neutral-300 text-[11px] font-bold">{t('500+ successful cosmetic cases', '500+ წარმატებული შემთხვევა')}</p>
                </div>
                <div 
                  className="w-full py-3 bg-[#f6f7f1] group-hover:bg-neutral-800 group-hover:text-white text-neutral-800 font-black text-xs rounded-xl shadow-md transition-all duration-300 text-center"
                >
                  {t('View on Facebook', 'გალერეა (Facebook)')} ↗
                </div>
              </div>
            </a>
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
      <footer id="contact" className="bg-[#f6f7f1] border-t border-white/20 pt-16 pb-12 relative overflow-hidden">
        {/* Contour 4: Tooth implant watermark in the bottom row */}
        <img 
          src="/assets/tooth_implant.png" 
          alt="Tooth implant watermark" 
          className="absolute left-1/2 bottom-[-110px] -translate-x-1/2 w-[300px] md:w-[420px] h-auto pointer-events-none select-none opacity-[0.32] z-0 rotate-[12deg]"
        />
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
            {/* Social icons row */}
            <div className="flex gap-3.5 mt-4">
              <a 
                href="https://www.facebook.com/MaRiAm.jenni.pirtskhalava" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_4px_14px_rgba(24,119,242,0.5)] transition-all duration-300 hover:scale-110 active:scale-95" 
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
                className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_4px_14px_rgba(220,39,67,0.5)] transition-all duration-300 hover:scale-110 active:scale-95" 
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
                className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-[#25F4EE] hover:bg-neutral-950 hover:border-black hover:shadow-[0_4px_14px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95" 
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
                className="w-10 h-10 rounded-full bg-[#f6f7f1] shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.85)] border border-white/20 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#229ED9] hover:border-[#229ED9] hover:shadow-[0_4px_14px_rgba(34,158,217,0.5)] transition-all duration-300 hover:scale-110 active:scale-95" 
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6.15-.15 2.72-2.5 2.77-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.85 1.17-5.23 3.45-.5.34-.95.5-1.35.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.47.97-.73 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.53 4.4-1.8 4.89-1.8.11 0 .35.03.5.15.13.1.17.24.18.35-.01.07.01.19 0 .28z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3.5 items-start">
            <span className="font-black text-neutral-800 text-sm mb-1">{t('Services Offered', 'მომსახურებები')}</span>
            <button 
              type="button"
              onClick={() => { const el = document.getElementById('services'); el?.scrollIntoView({ behavior: 'smooth' }); }} 
              className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors text-left cursor-pointer"
            >
              {t('General Dentistry', 'სტომატოლოგია')}
            </button>
            <button 
              type="button"
              onClick={() => { const el = document.getElementById('services'); el?.scrollIntoView({ behavior: 'smooth' }); }} 
              className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors text-left cursor-pointer"
            >
              {t('Injection Cosmetology', 'ინექციური კოსმეტოლოგია')}
            </button>
            <button 
              type="button"
              onClick={() => { const el = document.getElementById('contact'); el?.scrollIntoView({ behavior: 'smooth' }); }} 
              className="text-neutral-500 font-bold text-xs hover:text-neutral-800 transition-colors text-left cursor-pointer"
            >
              {t('Clinic Location', 'კლინიკის მდებარეობა')}
            </button>
          </div>

          {/* Working hours */}
          <div className="flex flex-col gap-3.5 items-start">
            <span className="font-black text-neutral-800 text-sm mb-1">{t('Working Hours', 'სამუშაო საათები')}</span>
            <div className="text-xs font-bold text-neutral-500 flex flex-col gap-2 w-full">
              <div className="flex justify-between gap-4"><span>{t('Mon, Tue, Thu, Fri:', 'ორშ, სამშ, ხუთ, პარ:')}</span> <span className="text-neutral-800 font-black">15:00 - 20:00</span></div>
              <div className="flex justify-between gap-4"><span>{t('Wednesday:', 'ოთხშაბათი:')}</span> <span className="text-neutral-800 font-black">11:00 - 15:00</span></div>
              <div className="flex justify-between gap-4"><span>{t('Saturday, Sunday:', 'შაბათი, კვირა:')}</span> <span className="text-red-500 font-black uppercase tracking-wider">{t('Closed', 'დასვენება')}</span></div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] font-bold text-neutral-400 mt-12 pt-6 border-t border-neutral-300 max-w-[1200px] mx-auto flex flex-col items-center gap-2.5">
          <div>© 2026 Jenny Pirtskhalava. {t('All rights reserved.', 'ყველა უფლება დაცულია.')}</div>
          <div className="flex items-center gap-2 select-none">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {t('Unique Visitors:', 'უნიკალური ვიზიტორი:')}
            </span>
            <div className="inline-flex items-center px-2.5 py-0.5 bg-[#f6f7f1] rounded-md shadow-[inset_2px_2px_4px_rgba(163,177,198,0.45),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
              <span className="font-mono text-xs font-black tracking-[0.25em] text-neutral-800 tabular-nums">
                {visitorCount}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Services Details Modal */}
      <ServicesDetailsModal 
        isOpen={isServicesModalOpen} 
        onClose={() => setIsServicesModalOpen(false)} 
        lang={lang} 
        t={t} 
        onBookVisit={handleStartBooking}
        initialCategory={servicesModalCategory}
      />

      {/* Chatbot Widget */}
      <ChatbotWidget 
        lang={lang} 
        t={t} 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        bookingTrigger={bookingTrigger}
        bookingService={bookingService}
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



