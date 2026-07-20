import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
  useLocation,
  Link,
  useNavigate
} from 'react-router-dom';
import { 
  Check, 
  Copy, 
  Send, 
  Youtube, 
  Download, 
  Wallet, 
  User, 
  Image as ImageIcon, 
  ChevronRight,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  IdCard,
  ImagePlus,
  ArrowRight,
  Upload,
  CheckCircle,
  Shield,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  Menu,
  Home,
  Plane,
  Apple,
  Flame,
  Zap,
  Key,
  LogIn,
  Lock,
  Play,
  Cpu,
  Radio,
  Terminal,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DotLottiePlayer } from '@dotlottie/react-player';

// --- Security Encryption Helper ---
const dUrl = (str: string) => str.split('').reverse().join('');

// --- Safe Fetch Proxy to fix CORS and "Load Failed" errors in browser / iframe environments ---
const apiFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  let urlStr = '';
  if (typeof input === 'string') {
    urlStr = input;
  } else if (input instanceof URL) {
    urlStr = input.href;
  } else if (input && typeof input === 'object' && 'url' in input) {
    urlStr = (input as any).url;
  }

  if (urlStr && (urlStr.startsWith('http://') || urlStr.startsWith('https://'))) {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(urlStr)}`;
    return window.fetch(proxyUrl, init);
  }
  return window.fetch(input, init);
};

// Shadow global fetch within this module
const fetch = apiFetch;

// --- Constants & Data ---

const LANGUAGES = [
  { id: 1, name: 'uz', img: 'https://brazzil10.lineorgs.com/img/UZ.png' },
  { id: 2, name: 'fr', img: 'https://brazzil10.lineorgs.com/img/FR.png' },
  { id: 3, name: 'en', img: 'https://brazzil10.lineorgs.com/img/br.png' },
  { id: 5, name: 'ar', img: 'https://brazzil10.lineorgs.com/img/AR.png' },
  { id: 6, name: 'ru', img: 'https://brazzil10.lineorgs.com/img/RU.png' },
  { id: 7, name: 'pt', img: 'https://brazzil10.lineorgs.com/img/PT.png' },
  { id: 8, name: 'bd', img: 'https://brazzil10.lineorgs.com/img/BD.png' },
];

const PAYMENT_METHODS = [
  { id: 1, name: 'all', imgs: ['https://brazzil10.lineorgs.com/img/pays/all/visa.svg', 'https://brazzil10.lineorgs.com/img/pays/all/mastercard.svg', 'https://brazzil10.lineorgs.com/img/pays/all/webmoney.svg', 'https://brazzil10.lineorgs.com/img/pays/all/gpay.svg'] },
  { id: 2, name: 'bd', imgs: ['https://brazzil10.lineorgs.com/img/pays/bang/bcash.svg', 'https://brazzil10.lineorgs.com/img/pays/bang/nogod.svg', 'https://brazzil10.lineorgs.com/img/pays/bang/rocket.svg', 'https://brazzil10.lineorgs.com/img/pays/bang/pay.svg', 'https://brazzil10.lineorgs.com/img/pays/bang/visa.svg', 'https://brazzil10.lineorgs.com/img/pays/bang/mastercard.svg'] },
  { id: 4, name: 'uz', imgs: ['https://brazzil10.lineorgs.com/img/pays/uz/humo.svg', 'https://brazzil10.lineorgs.com/img/pays/uz/uzcard.svg', 'https://brazzil10.lineorgs.com/img/pays/uz/visa.svg', 'https://brazzil10.lineorgs.com/img/pays/uz/mastercard.svg'] },
  { id: 6, name: 'ru', imgs: ['https://brazzil10.lineorgs.com/img/pays/rus/visa.svg', 'https://brazzil10.lineorgs.com/img/pays/rus/mastercard.svg', 'https://brazzil10.lineorgs.com/img/pays/rus/mir.svg', 'https://brazzil10.lineorgs.com/img/pays/rus/webmoney.svg', 'https://brazzil10.lineorgs.com/img/pays/rus/gpay.svg'] },
  { id: 7, name: 'sn', imgs: ['https://brazzil10.lineorgs.com/img/pays/senegal/or.svg', 'https://brazzil10.lineorgs.com/img/pays/senegal/fm.svg'] },
  { id: 8, name: 'ci', imgs: ['https://brazzil10.lineorgs.com/img/pays/coted/or.svg', 'https://brazzil10.lineorgs.com/img/pays/coted/mtn.svg', 'https://brazzil10.lineorgs.com/img/pays/coted/mm.svg'] },
];

const TRANSLATIONS: Record<string, any> = {
  ar: {
    heroTitle: '<span class="text-white">1x</span><span class="text-brand-blue">Bet</span><br/>احصل على مكافأة من',
    heroLeft: 'احصل على ما يصل <span class="text-brand-blue font-bold">إلى 100</span> دولار <br/> على إيداعك الأول',
    heroRight: '<span class="text-brand-blue font-bold">سهولة التسجيل والسحب السريع</span>',
    btnBonus: 'احصل على مكافأة',
    copied: 'تم النسخ',
    footerRights: 'جميع الحقوق محفوظة.',
    livePreview: 'المعاينة المباشرة للعبة',
    liveSync: 'مزامنة مباشرة',
    accessRequirements: 'متطلبات الوصول',
    stepPrefix: 'الخطوة',
    installApp: 'تثبيت تطبيق 1xbet',
    appRequired: 'تطبيق الهاتف الرسمي مطلوب',
    installBtn: 'تثبيت',
    registerAccount: 'تسجيل حساب',
    accessCode: 'استخدم كود الوصول الحصري',
    initialDeposit: 'الإيداع الأول',
    minDeposit: 'الحد الأدنى المطلوب: <span class="text-emerald-400 font-bold">5$</span> أو <span class="text-emerald-400 font-bold">250 ج.م</span>',
    verifyTransaction: 'التحقق من المعاملة',
    enterIdAndUpload: 'أدخل المعرف وارفع إثبات الإيداع',
    userIdPlaceholder: 'أدخل معرف المستخدم (10 أرقام فأكثر)',
    minDigits: 'أدنى حد 10 أرقام',
    changeImage: 'تغيير الصورة',
    depositProof: 'إثبات الإيداع',
    idProfile: 'هوية الحساب',
    verifyBtn: 'التحقق والوصول',
    systemVerification: 'التحقق من النظام',
    analyzingManifest: 'تحليل البيانات',
    validatingId: 'التحقق من المعرف:',
    adminApproved: 'تمت الموافقة من المسؤول',
    waitingAdmin: 'في انتظار المسؤول...',
    redirecting: 'جاري التوجيه...',
    connecting: 'جاري الاتصال بالعقد...',
    verificationComplete: 'اكتمل التحقق',
    onlineStatus: 'المستخدمون المتاحون حالياً للمكافأة',
    secureGateway: 'بوابة آمنة',
    accessRequirementsFoot: 'بالتحقق، فإنك تؤكد أنك أكملت جميع المتطلبات. نظام التحقق الآلي v1.3 نشط.',
    verificationSubmitted: 'تم تقديم طلب التحقق بنجاح!',
    tutorialVideo: 'فيديو تعليمي',
    getBonusLabel: 'احصل على مكافأة <span class="text-white">1X</span><span class="text-brand-blue">BET</span>',
    chooseGame: 'اختر لعبتك',
    closeMenu: 'إغلاق القائمة',
    totalLoss: 'مجموع خسائر اليوم',
    totalProfit: 'مجموع ربح اليوم',
    onlineUsers: 'المستخدمين الان',
    odds: 'الاحتمال',
    levelOne: 'المستوي الاول',
    start: 'بدأ',
    reset: 'اعاده بدأ',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    termsTitle: 'الشروط والاحكام',
    step1Title: 'التواصل الاجتماعي والتعليمات',
    step2Title: 'جاهزية النظام',
    step3Title: 'البروموكود VIP',
    step4Title: 'متطلبات الاستثمار',
    step5Title: 'تحديد الهوية',
    step6Title: 'أدلة التحقق (اختياري)',
    watchVideoFirst: 'شاهد الفيديو اولاً',
    vipPromoLabel: 'البروموكود VIP',
    enterIdInput: 'أدخل الـ ID الخاص بك',
    promoScreenshot: 'سكرين شوت البروموكود (اختياري)',
    depositScreenshot: 'سكرين شوت الإيداع (اختياري)',
    sendRequest: 'إرسال الطلب',
    verifyingImages: 'جاري التحقق من الصور...',
    socialTasks: [
      { label: "انضم لقناة التليجرام", icon: Send, color: "text-blue-400", link: dUrl("tob_1pivyzarc/em.t//:sptth") },
      { label: "انضم لقناة اليوتيوب", icon: Youtube, color: "text-red-500", link: dUrl("thGcHN0fN5_lf5FR5is?3111tebx1/@moc.ebutuoy//:sptth") }
    ],
    join: 'انضم',
    minDepositLabel: 'الحد الأدنى للإيداع',
    copiedSuccess: 'تم النسخ بنجاح',
    systemStatus: 'حالة النظام',
    authenticated: 'تم التوثيق',
    verifyingIdentity: 'جاري التحقق من الهوية...',
    unauthorizedMessage: 'انت غير مسجل بالبروموكود الخاص بينا',
    unauthorizedAccess: 'دخول غير مصرح به',
    liveSignalActive: 'إشارة مباشرة نشطة',
    onlineUsersLabel: 'المستخدمون نشطون:',
    back: 'رجوع',
    slides: [
      { title: 'CRASH', content: 'توقع متى ستتوقف الطائرة وضاعف أموالك في ثوانٍ.', icon: 'https://brazzil10.lineorgs.com/img/s1.png' },
      { title: 'APPLE OF FORTUNE', content: 'اختر الخلايا الصحيحة لتكبير أرباحك وتجنب التفاح الفاسد.', icon: 'https://brazzil10.lineorgs.com/img/s2.png' }
    ]
  },
  uz: {
    heroTitle: '<span class="text-white">1x</span><span class="text-brand-blue">Betdan</span><br/>bonusga ega bo\'ling',
    heroLeft: 'Birinchi depozitga <span class="text-brand-blue font-bold">1 300 000 UZS gacha</span> bonusga ega bo\'ling',
    heroRight: '<span class="text-brand-blue font-bold">Qulay ro\'yxatdan o\'tish va</span> mablag\'ni tez yechib olish.',
    btnBonus: 'Bonus olish',
    copied: 'Nusxalangan',
    footerRights: 'Barcha huquqlar himoyalangan.',
    totalLoss: 'Bugungi umumiy yo\'qotishlar',
    totalProfit: 'Bugungi umumiy foyda',
    onlineUsers: 'Hozirgi foydalanuvchilar',
    odds: 'Ehtimollik',
    levelOne: '1-daraja',
    start: 'Boshlash',
    reset: 'Qayta tiklash',
    hours: 'soat',
    minutes: 'daqiqa',
    seconds: 'soniya',
    termsTitle: 'Shartlar va qoidalar',
    step1Title: 'Ijtimoiy tarmoqlar va ko\'rsatmalar',
    step2Title: 'Tizim tayyorligi',
    step3Title: 'VIP Promokod',
    step4Title: 'Investitsiya talablari',
    step5Title: 'Identifikatsiya',
    step6Title: 'Tasdiqlash dalillari (Ixtiyoriy)',
    watchVideoFirst: 'Avval videoni ko\'ring',
    vipPromoLabel: 'VIP Promokod',
    enterIdInput: 'ID-ni kiriting',
    promoScreenshot: 'Promokod skrinshoti (Ixtiyoriy)',
    depositScreenshot: 'Depozit skrinshoti (Ixtiyoriy)',
    sendRequest: 'So\'rov yuborish',
    verifyingImages: 'Rasmlar tekshirilmoqda...',
    socialTasks: [
      { label: "Telegram kanalga qo'shiling", icon: Send, color: "text-blue-400", link: dUrl("tob_1pivyzarc/em.t//:sptth") },
      { label: "YouTube kanalga a'zo bo'ling", icon: Youtube, color: "text-red-500", link: dUrl("thGcHN0fN5_lf5FR5is?3111tebx1/@moc.ebutuoy//:sptth") }
    ],
    join: "Qo'shilish",
    minDepositLabel: 'Minimal depozit',
    copiedSuccess: 'Muvaffaqiyatli nusxalandi',
    systemStatus: 'Tizim holati',
    authenticated: 'Tasdiqlangan',
    verifyingIdentity: 'Shaxsni tasdiqlash...',
    unauthorizedMessage: 'Siz bizning promokodimiz bilan ro\'yxatdan o\'tmagansiz',
    unauthorizedAccess: 'Ruxsatsiz kirish',
    liveSignalActive: 'Jonli signal faol',
    onlineUsersLabel: 'onlayn foydalanuvchilar:',
    back: 'Orqaga',
    slides: [
      { title: 'CRASH', content: 'Samolyot qachon to\'xtashini taxmin qiling va pulingizni bir necha soniyada ko\'paytiring.', icon: 'https://brazzil10.lineorgs.com/img/s1.png' },
      { title: 'APPLE OF FORTUNE', content: 'To\'g\'ri katakchalarni tanlang va yutuqlaringizni oshiring, chirigan olmalardan ehtiyot bo\'ling.', icon: 'https://brazzil10.lineorgs.com/img/s2.png' }
    ]
  },
  en: {
    heroTitle: 'Get <span class="text-white">1x</span><span class="text-brand-blue">Bet</span> bonus',
    heroLeft: 'Get <span class="text-brand-blue font-bold">100$</span><br/> on the first deposit',
    heroRight: '<span class="text-brand-blue font-bold">Simple registration.</span><br/>Fast withdrawals.',
    btnBonus: 'Get Bonus',
    copied: 'Copied',
    footerRights: 'All rights reserved.',
    livePreview: 'Live Game Preview',
    liveSync: 'Live Sync',
    accessRequirements: 'Access Requirements',
    stepPrefix: 'STEP',
    installApp: 'Install 1xbet Application',
    appRequired: 'Official mobile application required',
    installBtn: 'Install',
    registerAccount: 'Register Account',
    accessCode: 'Use the exclusive access code',
    initialDeposit: 'Initial Deposit',
    minDeposit: 'Minimum required: <span class="text-emerald-400 font-bold">$5</span> or <span class="text-emerald-400 font-bold">250 EGP</span>',
    verifyTransaction: 'Verify Transaction',
    enterIdAndUpload: 'Enter ID & Upload proof of deposit',
    userIdPlaceholder: 'Enter 1xbet User ID (10+ digits)',
    minDigits: 'MIN 10 DIGITS',
    changeImage: 'Change Image',
    depositProof: 'Deposit Proof',
    idProfile: 'ID Profile',
    verifyBtn: 'VERIFY & ACCESS',
    systemVerification: 'System Verification',
    analyzingManifest: 'Analyzing Manifest',
    validatingId: 'Validating ID:',
    adminApproved: 'Admin Approved',
    waitingAdmin: 'Waiting for Admin...',
    redirecting: 'Redirecting to engine...',
    connecting: 'Connecting to nodes...',
    verificationComplete: 'Verification Complete',
    onlineStatus: 'Users Get Bonus Online',
    secureGateway: 'Secure Gateway',
    accessRequirementsFoot: 'By verifying, you confirm that you have completed all requirements. Automated verification system v1.3 is active.',
    verificationSubmitted: 'Verification submitted successfully!',
    tutorialVideo: 'Tutorial Video',
    getBonusLabel: 'GET <span class="text-white">1X</span><span class="text-brand-blue">BET</span> BONUS',
    chooseGame: 'CHOOSE YOUR GAME',
    closeMenu: 'Close Menu',
    totalLoss: 'Total loss of the day',
    totalProfit: 'Total profit of the day',
    onlineUsers: 'Online users',
    odds: 'Odds',
    levelOne: 'Level 1',
    start: 'Start',
    reset: 'Reset',
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
    termsTitle: 'Terms & Conditions',
    step1Title: 'Social & Instructions',
    step2Title: 'System Readiness',
    step3Title: 'VIP Promocode',
    step4Title: 'Investment Requirements',
    step5Title: 'Identification',
    step6Title: 'Evidence Check (Optional)',
    watchVideoFirst: 'Watch Video First',
    vipPromoLabel: 'VIP Promocode',
    enterIdInput: 'Enter your ID',
    promoScreenshot: 'Promocode Screenshot (Optional)',
    depositScreenshot: 'Deposit Screenshot (Optional)',
    sendRequest: 'Send Request',
    verifyingImages: 'Verifying images...',
    socialTasks: [
      { label: "Join Telegram Channel", icon: Send, color: "text-blue-400", link: dUrl("tob_1pivyzarc/em.t//:sptth") },
      { label: "Join YouTube Channel", icon: Youtube, color: "text-red-500", link: dUrl("thGcHN0fN5_lf5FR5is?3111tebx1/@moc.ebutuoy//:sptth") }
    ],
    join: 'Join',
    minDepositLabel: 'Minimum Deposit',
    copiedSuccess: 'Copied Successfully',
    systemStatus: 'System Status',
    authenticated: 'Authenticated',
    verifyingIdentity: 'Verifying Identity...',
    unauthorizedMessage: 'You are not registered with our promocode',
    unauthorizedAccess: 'Unauthorized Access',
    liveSignalActive: 'Live Signal Active',
    onlineUsersLabel: 'online users:',
    back: 'Back',
    slides: [
      { title: 'CRASH', content: 'Predict when the plane will stop and multiply your money in seconds.', icon: 'https://brazzil10.lineorgs.com/img/s1.png' },
      { title: 'APPLE OF FORTUNE', content: 'Pick the right cells to grow your wins and avoid the rotten apples.', icon: 'https://brazzil10.lineorgs.com/img/s2.png' }
    ]
  }
};
// Note: Other languages can be filled similarly, using English as fallback.
Object.keys(TRANSLATIONS).forEach(lang => {
  if (lang !== 'en' && lang !== 'ar' && lang !== 'uz') {
    TRANSLATIONS[lang] = { ...TRANSLATIONS.en, ...TRANSLATIONS[lang] };
  }
});

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-red-600/20 border border-red-500/30 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.3)] flex-shrink-0 flex items-center justify-center">
      <img 
        src="https://i.pinimg.com/736x/be/f7/a6/bef7a664b6a8334dbb87e7e61503b9af.jpg" 
        alt="1XBET Logo" 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover scale-[1.1]"
      />
    </div>
    <div className="font-display font-black text-2xl md:text-4xl flex items-center">
      <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">1X</span>
      <span className="text-brand-blue drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] font-extrabold">BET</span>
    </div>
  </div>
);

const VideoBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover scale-[1.02] opacity-90"
    >
      <source src="https://www.image2url.com/r2/default/videos/1784554343961-4ae8844f-687b-4cb6-86d6-ed3032ed0b61.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-50" />
  </div>
);

const OneXBetLogo = () => (
  <div className="w-11 h-11 rounded-xl bg-red-600 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.5)] flex items-center justify-center overflow-hidden">
    <img 
      src="https://i.pinimg.com/736x/be/f7/a6/bef7a664b6a8334dbb87e7e61503b9af.jpg" 
      alt="1XBET" 
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover scale-[1.1]" 
    />
  </div>
);

const Conditions = ({ t, promoHref = 'https://lb-aff.com//L?tag=d_3386416m_66803c_apk1&site=3386416&ad=66803' }: { t: any, promoHref?: string }) => {
  const [platform, setPlatform] = useState<"1xbet" | null>("1xbet");
  const [gameSelected, setGameSelected] = useState<"apple" | "crash" | null>(null);
  const [userID, setUserID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");

  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText("KAJO117");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!platform) return;
    
    setIsVerifying(true);
    setVerifyStatus("success");
    setIsSubmitting(true);
    
    let activeID = localStorage.getItem('validated_id');
    if (!activeID) {
      // Generate a random 10-digit ID as a fallback so they can still play
      activeID = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      localStorage.setItem('validated_id', activeID);
    }
    
    // Open Telegram immediately to bypass popup blockers
    try {
      window.open("https://t.me/crazyvip1_bot", "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Popup blocked or failed:", err);
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsVerifying(false);
      try {
        window.location.href = "https://t.me/crazyvip1_bot";
      } catch (err) {
        console.error("Navigation failed:", err);
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-transparent overflow-hidden relative pt-20">
      <VideoBackground />
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 space-y-8 scrollbar-hide relative z-10 no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full ring-1 ring-white/10 transition-all cursor-pointer">
            <RefreshCcw className="w-5 h-5 text-red-500" />
          </button>
          <h2 className="text-xl font-bold text-white/90">الشروط والاحكام</h2>
        </div>

        {/* 1. Platform Toggle */}
        <section className="space-y-4">
          <div className="flex items-center justify-end gap-2 mb-2">
            <h3 className="text-sm font-bold text-white/60 uppercase">اختر منصتك</h3>
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <span className="text-[10px] font-bold text-red-500">01</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-xs p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <div className="relative">
                <OneXBetLogo />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black text-[8px] text-white">✓</span>
              </div>
              <span className="text-base font-bold text-white tracking-wider">1XBET</span>
            </div>
          </div>
        </section>

        {/* Dynamic content showing on selection with animation */}
        <AnimatePresence mode="wait">
          {platform && (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* 1.5 Game Selection Toggle */}
              <section className="space-y-4">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white/60 uppercase">اختر اللعبة</h3>
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-[10px] font-bold text-blue-400">1.5</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setGameSelected("apple");
                      localStorage.setItem('selected_game', 'apple');
                    }}
                    className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gameSelected === "apple"
                        ? "bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src="https://cdn.phototourl.com/free/2026-07-17-388e2c51-99d0-4576-8b6d-420c7e8f7a3b.jpg" 
                        alt="Apple of fortune Logo" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                      />
                      {gameSelected === "apple" && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black text-[8px] text-white">✓</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white text-center leading-tight">Apple of Fortune</span>
                  </button>

                  <button
                    onClick={() => {
                      setGameSelected("crash");
                      localStorage.setItem('selected_game', 'crash');
                    }}
                    className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      gameSelected === "crash"
                        ? "bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src="https://cdn.phototourl.com/free/2026-07-17-bdde0a56-8095-4e40-9087-8bb52f52e3e0.jpg" 
                        alt="Crash Logo" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                      />
                      {gameSelected === "crash" && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black text-[8px] text-white">✓</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white text-center leading-tight">Crash</span>
                  </button>
                </div>
              </section>

              {gameSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* 2. Social Tasks */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white/60 uppercase">التواصل الاجتماعي</h3>
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-[10px] font-bold text-red-500">02</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: "انضم لقناة التليجرام", icon: Send, color: "text-red-500", link: "https://t.me/crazyvip1_bot" }
                      ].map((task, i) => (
                        <div key={i} className="flex flex-row-reverse items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:border-red-500/30 group">
                           <div className="flex flex-row-reverse items-center gap-3">
                            <task.icon className={`w-5 h-5 ${task.color}`} />
                            <span className="text-sm font-semibold">{task.label}</span>
                          </div>
                          <a 
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] font-black text-red-500 uppercase hover:bg-red-500 hover:text-white transition-all red-glow"
                          >
                            انضم
                          </a>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. Installation & Registration */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white/60 uppercase">جاهزية النظام</h3>
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-[10px] font-bold text-red-500">03</span>
                      </div>
                    </div>
                    <a 
                      href={promoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row-reverse items-center justify-between p-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors animate-pulse"
                    >
                      <div className="flex flex-row-reverse items-center gap-3">
                        <Download className="w-5 h-5 text-red-500 animate-bounce" />
                        <span className="text-sm font-semibold text-right leading-relaxed">
                          رابط تحميل وتسجيل 1XBET
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 rotate-180" />
                    </a>
                  </section>

                  {/* 4. Promocode */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white/60 uppercase">البروموكود VIP</h3>
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-[10px] font-bold text-red-500">04</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="p-1 bg-[#050c18] border border-red-500/10 rounded-2xl flex flex-row-reverse items-center gap-2 relative z-0">
                        <div className="flex-1 py-4 pr-6 font-mono text-2xl font-black tracking-[0.2em] text-white text-right">
                          KAJO117
                        </div>
                        <button 
                          onClick={handleCopy}
                          className={`ml-1 px-6 py-3 rounded-xl font-bold text-xs flex flex-row-reverse items-center gap-2 transition-all cursor-pointer ${
                            copied ? "bg-green-500 text-white animate-bounce" : "bg-red-600 text-white red-glow hover:brightness-110"
                          }`}
                        >
                          {copied ? "تم النسخ" : "نسخ"}
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {copied && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-red-600 rounded-2xl text-white font-black text-sm red-glow"
                          >
                            تم النسخ بنجاح
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>

                  {/* 5. Deposit Info */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white/60 uppercase">متطلبات الاستثمار</h3>
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                        <span className="text-[10px] font-bold text-red-500">05</span>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-red-500/20 via-white/5 to-white/5 rounded-3xl border border-white/10 flex flex-row-reverse items-center justify-between">
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-white/40 uppercase">الحد الأدنى للإيداع لتفعيل الحساب</p>
                        <p className="text-xl font-black text-white" dir="ltr">300 EGP <span className="text-red-500 mx-1">|</span> 5$</p>
                      </div>
                      <Wallet className="w-8 h-8 text-white/20" />
                    </div>
                  </section>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <AnimatePresence>
        {platform && gameSelected && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020510] via-[#020510] to-transparent border-t border-white/5 max-w-lg mx-auto z-[50]"
          >
            <button 
              onClick={handleSubmit}
              disabled={isVerifying}
              className="w-full py-5 bg-red-600 rounded-2xl font-black text-white red-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase cursor-pointer"
            >
              {isVerifying ? "جاري تفعيل الحساب..." : "إرسال طلب التفعيل"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dialog */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-[#020510]/95 backdrop-blur-2xl" />
            
            {/* Elegant glowing background design */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-500/10 blur-[80px]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-red-500/10 blur-[100px]" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className={`relative w-full max-w-[320px] bg-zinc-950/90 backdrop-blur-md px-5 py-6 rounded-[1.75rem] border flex flex-col items-center gap-5 overflow-hidden transition-all duration-500 ${
                verifyStatus === "error"
                  ? "border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.2)]"
                  : "border-red-500/30 shadow-[0_0_35px_rgba(239,68,68,0.2)]"
              }`}
            >
              {verifyStatus === "error" ? (
                <>
                  {/* Futuristic Accent Corner Lights (Red for Error) */}
                  <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-l from-red-500 to-transparent" />
                  <div className="absolute top-0 right-0 h-16 w-[2px] bg-gradient-to-b from-red-500 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-16 h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
                  <div className="absolute bottom-0 left-0 h-16 w-[2px] bg-gradient-to-t from-red-500 to-transparent" />

                  <div className="relative flex items-center justify-center w-20 h-20">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 border border-red-500/20 rounded-full blur-[2px]"
                    />
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <span className="text-red-500 text-2xl font-black">!</span>
                    </div>
                  </div>

                  <div className="text-center space-y-3 w-full">
                    <div className="space-y-1.5">
                      <span className="text-[9px] tracking-[0.2em] font-black text-red-400 uppercase block font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>فشل التحقق</span>
                      <h4 className="text-base font-bold text-white tracking-wide font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>
                        خطأ في تفعيل حسابك
                      </h4>
                      <p className="text-xs text-red-400/90 font-medium leading-relaxed font-sans px-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
                        خطأ في تفعيل حسابك يرجي التحقق من id الخاص بك
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-center gap-1.5 text-white/30">
                      <span className="text-[9px] tracking-widest font-black uppercase font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>جاري إعادة التوجيه...</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Futuristic Accent Corner Lights */}
                  <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-l from-red-500 to-transparent" />
                  <div className="absolute top-0 right-0 h-16 w-[2px] bg-gradient-to-b from-red-500 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-16 h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
                  <div className="absolute bottom-0 left-0 h-16 w-[2px] bg-gradient-to-t from-red-500 to-transparent" />

                  {/* Extremely elegant concentric animated rings and logo */}
                  <div className="relative flex items-center justify-center w-24 h-24">
                    
                    {/* Rotating Outer Ring (Red) */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-r-[1px] border-b-[1.5px] border-l-0 border-red-400 rounded-full opacity-80"
                    />

                    {/* Counter-Rotating Inner Ring (Dark Red) */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-b-2 border-l-[1px] border-t-[1.5px] border-r-0 border-red-500 rounded-full opacity-90"
                    />

                    {/* Pulse Ring */}
                    <motion.div
                      animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-1 border border-red-500/30 rounded-full blur-[1px]"
                    />

                    {/* Central Logo */}
                    <div className="relative w-15 h-15 rounded-full overflow-hidden border border-red-500/40 bg-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                      <img 
                        src={gameSelected === "apple" 
                          ? "https://cdn.phototourl.com/free/2026-07-17-388e2c51-99d0-4576-8b6d-420c7e8f7a3b.jpg"
                          : "https://cdn.phototourl.com/free/2026-07-17-bdde0a56-8095-4e40-9087-8bb52f52e3e0.jpg"
                        } 
                        alt={gameSelected === "apple" ? "Apple of Fortune" : "Crash"} 
                        referrerPolicy="no-referrer"
                        className="w-[88%] h-[88%] rounded-full object-cover relative z-10"
                      />
                      <div className="w-full h-full rounded-full bg-red-500/20 blur-sm absolute" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4 w-full">
                    <div className="space-y-0.5">
                      <span className="text-[9px] tracking-[0.2em] font-black text-red-400 uppercase block font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>رابط المعالجة الذكي</span>
                      <h4 className="text-sm font-bold font-sans text-white tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                        تفعيل حساب {gameSelected === "apple" ? "Apple of Fortune" : "Crash"}
                      </h4>
                      <p className="text-[10px] text-white/50 font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>جاري فحص وتأكيد تفعيل اشتراك الـ ID</p>
                    </div>
                    
                    {/* Custom Checklist Tracker */}
                    <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/5 text-right">
                      {[
                        { label: `جاري فحص الـ ID في سيرفر 1XBET`, delay: 0.3 },
                        { label: "التحقق من تفعيل البروموكود KAJO117", delay: 1.5 },
                        { label: "تحليل عمليات الإيداع النشطة بالشبكة", delay: 2.8 },
                        { label: "التحقق من تخطي الحد الأدنى للإيداع", delay: 3.8 }
                      ].map((step, idx) => (
                        <motion.div 
                           key={idx}
                           initial={{ opacity: 0, x: 15 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: step.delay, duration: 0.5 }}
                           className="flex flex-row-reverse items-center justify-between gap-2.5 text-right text-xs"
                        >
                           <div className="flex flex-row-reverse items-center gap-2">
                            <div className="relative flex items-center justify-center">
                              {/* Animated loading dot */}
                              <motion.div 
                                animate={{ 
                                  scale: [1, 1.4, 1],
                                  opacity: [0.6, 1, 0.6]
                                }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-red-400"
                              />
                            </div>
                            <span className="text-[10px] font-medium text-white/80 font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>{step.label}</span>
                          </div>
                          
                          {/* Live status ticker badge */}
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: step.delay + 0.6 }}
                            className="text-[7.5px] font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20"
                          >
                            نشط
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-1 flex flex-col items-center gap-2 w-full">
                      <a
                        href="https://t.me/crazyvip1_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-[0.98] cursor-pointer"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        <span>الانتقال للبوت تلقائياً أو اضغط هنا</span>
                      </a>
                      <div className="flex items-center justify-center gap-1.5 text-white/40">
                        <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
                        <span className="text-[8.5px] tracking-widest font-black uppercase font-mono">SECURE AGENT CONNECTED</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ currentLang, onLangChange }: { currentLang: string, onLangChange: (lang: string) => void }) => {
  const [showLangs, setShowLangs] = useState(false);
  const langObj = LANGUAGES.find(l => l.name === currentLang) || LANGUAGES[2];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 bg-black/55 backdrop-blur-2xl border border-white/15 rounded-2xl md:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300">
      <div className="px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <a href="/" className="shrink-0 hover:scale-105 active:scale-95 transition-transform">
          <Logo />
        </a>

        <div className="flex items-center gap-2.5 md:gap-4">
          <a href="#" className="p-1.5 md:p-2.5 bg-white/5 hover:bg-brand-blue hover:text-white rounded-lg md:rounded-full border border-white/5 transition-all duration-300">
            <Download size={18} className="text-white md:w-5 md:h-5" />
          </a>

          <div className="relative">
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-xs uppercase px-2.5 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-xl md:rounded-full border border-white/10 hover:bg-white/15 transition-all text-white shadow-sm"
            >
              <img src={langObj.img} alt={langObj.name} className="w-4 h-2.5 md:w-5 md:h-3.5 object-cover rounded-sm shadow-sm" />
              {langObj.name}
              <ChevronDown size={12} className={`transition-transform ${showLangs ? 'rotate-180' : ''} hidden md:block`} />
            </button>
            
            <AnimatePresence>
              {showLangs && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowLangs(false)} />
                  <motion.ul 
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute right-0 mt-3.5 w-48 bg-gradient-to-b from-[#0a0a0d] to-[#040405] text-white rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_25px_rgba(239,68,68,0.15)] z-50 border border-white/15 p-1.5 space-y-1 backdrop-blur-3xl"
                  >
                    <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3.5 pt-2 pb-1 font-mono">
                      Languages
                    </div>
                    {LANGUAGES.map((l) => (
                      <li 
                        key={l.id}
                        onClick={() => { onLangChange(l.name); setShowLangs(false); }}
                        className={`px-3.5 py-2.5 rounded-xl cursor-pointer text-xs font-black transition-all duration-200 flex items-center justify-between group ${
                          currentLang === l.name 
                            ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30 shadow-[inset_0_1px_10px_rgba(239,68,68,0.1)]' 
                            : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={l.img} alt={l.name} className="w-5 h-3.5 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                          <span className="uppercase tracking-wider">{l.name}</span>
                        </div>
                        {currentLang === l.name && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                        )}
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const FloatingObj = ({ src, className, delay = 0, size = 200 }: { src: string, className: string, delay?: number, size?: number }) => (
  <motion.div
    animate={{ 
      y: [0, -15, 0],
      rotate: [-2, 2, -2]
    }}
    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute pointer-events-none md:opacity-100 opacity-40 ${className}`}
    style={{ width: size, height: size }}
  >
    <img src={src} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
  </motion.div>
);

const UsersOnline = ({ t }: { t: any }) => {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (1500 - 500 + 1)) + 500);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(Math.floor(Math.random() * (1500 - 500 + 1)) + 500);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  const countStr = count.toString().padStart(4, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: -25 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center mb-10 md:mb-14 relative z-20"
      dir="ltr"
    >
      {/* Neon glowing aura behind the widget */}
      <div className="absolute inset-0 bg-brand-blue/10 blur-3xl rounded-full scale-75 pointer-events-none -z-10" />

      {/* Cyberpunk Header Badge */}
      <div className="flex items-center gap-2 mb-3.5 bg-black/60 border border-brand-blue/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.15)] backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
        </span>
        <span className="text-brand-blue font-black text-[9px] md:text-xs uppercase tracking-[0.25em] font-mono">
          {t.onlineStatus || "Users Online"}
        </span>
      </div>

      {/* Futuristic Counter Board */}
      <div className="relative bg-gradient-to-r from-black/60 via-brand-blue/5 to-black/60 backdrop-blur-xl px-8 py-5.5 rounded-[30px] border-2 border-white/10 shadow-[0_20px_50px_rgba(239,68,68,0.2)] flex items-center gap-3 md:gap-4 overflow-hidden">
        
        {/* Subtle decorative grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        {/* Shiny corner borders */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-blue/60 rounded-tl-[10px]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-blue/60 rounded-tr-[10px]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-blue/60 rounded-bl-[10px]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-blue/60 rounded-br-[10px]" />

        <div className="flex items-center gap-2.5 md:gap-3.5 relative z-10">
          {countStr.split("").map((char, i) => (
            <div 
              key={i} 
              className="relative w-9 md:w-14 h-12 md:h-20 flex items-center justify-center bg-gradient-to-b from-white/10 to-black/80 rounded-xl md:rounded-2xl border border-white/15 overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.5)]"
            >
              {/* Card middle divider line (gives a real flip terminal look) */}
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-black/50 z-20 pointer-events-none" />
              
              {/* Diagonal sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white-[0.03] to-transparent pointer-events-none" />

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`${i}-${char}`}
                  initial={{ y: 50, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -50, opacity: 0, rotateX: 90 }}
                  transition={{ 
                    duration: 0.65, 
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: i * 0.04 
                  }}
                  className="text-2xl md:text-5xl font-display font-black text-white tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10"
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Hero = ({ t, promoHref }: { t: any, promoHref: string }) => {
  return (
    <section className="pt-20 md:pt-28 pb-4 md:pb-8 px-2 md:px-4 overflow-hidden relative">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-sky-400/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="container mx-auto">
        <div className="relative bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent rounded-[35px] md:rounded-[50px] min-h-[480px] md:min-h-[780px] flex flex-col items-center justify-center p-6 md:p-12 text-center overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-10">
          
          {/* Subtle grid pattern for high tech feeling */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none z-0" />
          <img src="https://brazzil10.lineorgs.com/img/graybg.png" className="absolute inset-0 w-full h-full object-cover opacity-5 z-0 select-none pointer-events-none invert grayscale" alt="" />
          
          <FloatingObj src="https://brazzil10.lineorgs.com/img/Dice1.png" className="top-[2%] left-[4%] md:top-[8%] md:left-[15%] hue-rotate-[120deg] saturate-[1.5]" size={90} delay={0} />
          <FloatingObj src="https://brazzil10.lineorgs.com/img/d2.png" className="top-[5%] right-[4%] md:top-[12%] md:right-[12%] hue-rotate-[120deg] saturate-[1.5]" size={160} delay={1} />
          <FloatingObj src="https://brazzil10.lineorgs.com/img/d3.png" className="bottom-[4%] left-[2%] md:bottom-[12%] md:left-[8%] hue-rotate-[120deg] saturate-[1.5]" size={190} delay={2} />
          <FloatingObj src="https://brazzil10.lineorgs.com/img/d4.png" className="bottom-[8%] right-[4%] md:bottom-[16%] md:right-[18%] hue-rotate-[120deg] saturate-[1.5]" size={110} delay={3} />

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-4xl flex flex-col items-center">
            
            <UsersOnline t={t} />

            <div className="mb-3 md:mb-5 bg-brand-blue/10 border border-brand-blue/30 px-4 py-1.5 rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
              <span 
                className="text-white font-black text-[9px] md:text-sm uppercase tracking-[0.3em] font-sans"
                dangerouslySetInnerHTML={{ __html: t.getBonusLabel || 'GET <span class="text-white">1X</span><span class="text-brand-blue">BET</span> BONUS' }}
              />
            </div>

            <h1 
              className="text-4xl md:text-8xl font-display font-black uppercase leading-[1.15] tracking-tight mb-8 md:mb-14 drop-shadow-[0_0_40px_rgba(239,68,68,0.4)] px-3 text-white"
              dangerouslySetInnerHTML={{ __html: t.heroTitle }}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="group relative w-full max-w-2xl aspect-video mb-10 rounded-[24px] md:rounded-[35px] overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-black/50 hover:border-white/20 transition-all duration-300"
            >
              <video 
                className="absolute inset-0 w-full h-full object-cover rounded-[24px] md:rounded-[35px]"
                controls
                playsInline
                src="https://www.image2url.com/r2/default/videos/1779210144315-363388cd-f342-42f2-ac6a-ba06e4bbbd49.mp4"
              ></video>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none shadow-lg">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <span className="text-[9px] md:text-xs font-black uppercase text-white tracking-widest">{t.tutorialVideo || "Tutorial Video"}</span>
              </div>
            </motion.div>

            <a 
              href={promoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-brand-blue to-red-600 hover:from-white hover:to-white hover:text-brand-blue text-white text-lg md:text-4xl font-display font-black tracking-tight px-10 md:px-16 py-5.5 md:py-7 rounded-2xl md:rounded-[35px] shadow-[0_15px_45px_rgba(239,68,68,0.4)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.6)] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/25 -skew-x-[20deg] -translate-x-[120%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
              <span className="relative z-10 transition-colors duration-300">{t.btnBonus}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureSlider = ({ t }: { t: any }) => {
  const navigate = useNavigate();
  const slides = t.slides || [];

  const [loginCode, setLoginCode] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const handleLogin = async () => {
    if (!loginCode.trim()) return;
    setIsLoggingIn(true);
    setErrorMsg("");

    const code = loginCode.trim();

    try {
      // 1. Check crash database first
      const crashRes = await fetch(`https://crazy-12-default-rtdb.firebaseio.com/crash.json`);
      const crashData = await crashRes.json();
      
      let foundInCrash = false;
      let crashMatchedId = "";
      if (crashData && typeof crashData === 'object') {
        for (const k of Object.keys(crashData)) {
          const item = crashData[k];
          if (item && item.key && String(item.key).trim().toLowerCase() === code.toLowerCase()) {
            foundInCrash = true;
            if (item["1xbet_id"]) {
              crashMatchedId = String(item["1xbet_id"]);
            } else if (item.id) {
              crashMatchedId = String(item.id);
            }
            break;
          }
        }
      }

      if (foundInCrash) {
        // Success: Found in crash!
        localStorage.setItem('selected_game', 'crash');
        localStorage.setItem('validated_id', code);
        if (crashMatchedId) {
          localStorage.setItem('validated_firebase_id', crashMatchedId);
        } else {
          localStorage.removeItem('validated_firebase_id');
        }
        setIsLoggingIn(false);
        navigate('/engine');
        return;
      }

      // 2. Check apple database
      const appleRes = await fetch(`https://crazy-12-default-rtdb.firebaseio.com/apple.json`);
      const appleData = await appleRes.json();
      
      let foundInApple = false;
      let appleMatchedId = "";
      if (appleData && typeof appleData === 'object') {
        for (const k of Object.keys(appleData)) {
          const item = appleData[k];
          if (item && item.key && String(item.key).trim().toLowerCase() === code.toLowerCase()) {
            foundInApple = true;
            if (item["1xbet_id"]) {
              appleMatchedId = String(item["1xbet_id"]);
            } else if (item.id) {
              appleMatchedId = String(item.id);
            }
            break;
          }
        }
      }

      if (foundInApple) {
        // Success: Found in apple!
        localStorage.setItem('selected_game', 'apple');
        localStorage.setItem('validated_id', code);
        if (appleMatchedId) {
          localStorage.setItem('validated_firebase_id', appleMatchedId);
        } else {
          localStorage.removeItem('validated_firebase_id');
        }
        setIsLoggingIn(false);
        navigate('/engine');
        return;
      }

      // 3. Not found in either
      setErrorMsg(
        t.lang === 'ar'
          ? "الكود غير صحيح أو منتهي الصلاحية"
          : "Invalid or expired code"
      );
    } catch (err) {
      console.error("Login verification failed:", err);
      setErrorMsg(
        t.lang === 'ar'
          ? "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً."
          : "Error connecting to server. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const games = [
    {
      id: 'crash',
      title: 'CRASH',
      img: 'https://i.pinimg.com/736x/bf/b5/fc/bfb5fcd355324979b88864b02d0ac289.jpg',
      icon: 'https://brazzil10.lineorgs.com/img/s1.png',
      decos: ['https://brazzil10.lineorgs.com/img/s1.png', 'https://brazzil10.lineorgs.com/img/s2.png', 'https://brazzil10.lineorgs.com/img/s3.png', 'https://brazzil10.lineorgs.com/img/s4.png'],
      content: slides[0]?.content || 'توقع متى ستتوقف الطائرة وضاعف أموالك في ثوانٍ.'
    },
    {
      id: 'apple',
      title: 'APPLE OF FORTUNE',
      img: 'https://i.pinimg.com/736x/f2/85/5c/f2855c233968cebd5a632583ba5fd95a.jpg',
      icon: 'https://brazzil10.lineorgs.com/img/s2.png',
      decos: ['https://brazzil10.lineorgs.com/img/s2.png', 'https://brazzil10.lineorgs.com/img/s1.png', 'https://brazzil10.lineorgs.com/img/s4.png', 'https://brazzil10.lineorgs.com/img/s3.png'],
      content: slides[1]?.content || 'اختر الخلايا الصحيحة لتكبير أرباحك وتجنب التفاح الفاسد.'
    }
  ];

  if (slides.length === 0) return null;

  return (
    <section className="py-12 md:py-24 px-4 relative">
      <div className="container mx-auto">
        
        {/* Dynamic decorative Section Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-brand-blue font-black text-[10px] md:text-sm tracking-[0.25em] uppercase mb-2">FEATURES & GAMES</span>
          <h3 className="text-2xl md:text-5xl font-display font-black text-white uppercase tracking-tight">{t.chooseGame || "CHOOSE YOUR GAME"}</h3>
          <div className="h-1.5 w-16 bg-brand-blue rounded-full mt-4" />
        </div>

        {/* Carousel/Slider with Side-by-Side Viewport and Arrows */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-between gap-1 md:gap-4">
          
          {/* Left Arrow Button */}
          <button
            onClick={() => setCurrentGameIndex((prev) => (prev === 1 ? 0 : 1))}
            className="p-3 md:p-4 rounded-full border border-white/10 bg-[#0e172a]/90 text-white hover:bg-red-600 hover:border-red-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer select-none group/arrow flex items-center justify-center z-20 shrink-0"
            title="Previous Game"
          >
            <ChevronLeft size={22} className="group-hover/arrow:-translate-x-0.5 transition-transform" />
          </button>

          {/* Main Games Grid/Slider viewport */}
          <div className="w-full overflow-hidden py-4 px-1 md:px-2">
            {/* Desktop: Side-by-Side with Active/Inactive Highlight */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 w-full">
              {games.map((game, index) => {
                const isActive = index === currentGameIndex;
                return (
                  <motion.button
                    key={game.id}
                    whileHover={{ scale: isActive ? 1.03 : 1.01, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!isActive) {
                        setCurrentGameIndex(index);
                      } else {
                        localStorage.setItem('selected_game', game.id);
                        navigate('/conditions');
                      }
                    }}
                    className={`group relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden border p-6 md:p-8 flex flex-col items-center text-center gap-6 transition-all duration-500 text-white cursor-pointer select-none ${
                      isActive 
                        ? "border-red-500 bg-red-950/15 shadow-[0_20px_50px_rgba(239,68,68,0.25)] scale-100 opacity-100" 
                        : "border-white/10 bg-transparent opacity-45 hover:opacity-75 scale-95"
                    }`}
                  >
                    {/* Game Main Logo - Clear, Prominent & High Quality */}
                    <div className={`relative z-10 w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 bg-zinc-950 ${
                      isActive ? "border-red-500/45" : "border-white/10"
                    }`}>
                      <img 
                        src={game.img} 
                        alt={game.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col items-center text-center w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1.5 font-mono transition-colors duration-500 ${
                        isActive ? "text-red-500" : "text-white/40"
                      }`}>
                        {isActive ? "Live Signal Active" : "Click to select"}
                      </span>
                      <h4 className={`text-2xl md:text-3xl font-display font-black tracking-tight mb-2.5 transition-colors duration-500 ${
                        isActive ? "text-red-500" : "text-white"
                      }`}>
                        {game.title}
                      </h4>
                      <div className="text-sm text-white/70 leading-relaxed font-semibold bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-md">
                        <div dangerouslySetInnerHTML={{ __html: game.content }} className="[&_img]:inline-block [&_img]:h-6 [&_img]:md:h-8 [&_img]:mx-1.5" />
                      </div>
                    </div>

                    {/* Action button icon indicator */}
                    <div className={`relative z-10 p-3 border rounded-2xl transition-all duration-500 ${
                      isActive 
                        ? "bg-red-600 border-red-500/30 group-hover:bg-red-500 group-hover:scale-115" 
                        : "bg-white/5 border-white/10"
                    }`}>
                      <ChevronRight size={20} className={`transform transition-transform ${
                        isActive ? "text-white translate-x-0.5" : "text-white/40"
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile/Tablet: Sliding Carousel Viewport */}
            <div className="block md:hidden overflow-hidden w-full relative">
              <motion.div 
                animate={{ x: `-${currentGameIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className="flex w-full"
              >
                {games.map((game, index) => {
                  const isActive = index === currentGameIndex;
                  return (
                    <div key={game.id} className="w-full flex-shrink-0 px-1">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          localStorage.setItem('selected_game', game.id);
                          navigate('/conditions');
                        }}
                        className="group relative w-full rounded-[24px] overflow-hidden border border-red-500/60 bg-red-950/10 p-5 flex flex-col items-center text-center gap-5 shadow-[0_15px_40px_rgba(239,68,68,0.15)] text-white cursor-pointer select-none"
                      >
                        {/* Game Main Logo - Clear, Prominent & High Quality */}
                        <div className="relative z-10 w-full aspect-[16/10] rounded-xl overflow-hidden border border-white/15 shadow-xl bg-zinc-950">
                          <img 
                            src={game.img} 
                            alt={game.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-95" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center w-full">
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1.5 font-mono">Live Signal Active</span>
                          <h4 className="text-xl font-display font-black text-white tracking-tight mb-2">
                            {game.title}
                          </h4>
                          <div className="text-xs text-white/80 leading-relaxed font-semibold bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/5 shadow-sm">
                            <div dangerouslySetInnerHTML={{ __html: game.content }} className="[&_img]:inline-block [&_img]:h-5 [&_img]:mx-1" />
                          </div>
                        </div>

                        {/* Action button icon indicator */}
                        <div className="relative z-10 p-2.5 bg-red-600 border border-red-500/20 rounded-xl">
                          <ChevronRight size={18} className="text-white transform translate-x-0.5 rotate-90 md:rotate-0" />
                        </div>
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => setCurrentGameIndex((prev) => (prev === 0 ? 1 : 0))}
            className="p-3 md:p-4 rounded-full border border-white/10 bg-[#0e172a]/90 text-white hover:bg-red-600 hover:border-red-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer select-none group/arrow flex items-center justify-center z-20 shrink-0"
            title="Next Game"
          >
            <ChevronRight size={24} className="group-hover/arrow:translate-x-0.5 transition-transform" />
          </button>

        </div>

        {/* Code Login Section under the two games */}
        <div className="max-w-xl mx-auto mt-16 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 bg-transparent relative overflow-hidden text-white">
          {/* Cyberpunk ambient red glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Key className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl md:text-2xl font-display font-black tracking-tight text-white uppercase">
                LOGIN WITH CODE
              </h4>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed font-semibold">
                {t.lang === 'ar' 
                  ? 'أدخل كود التفعيل الخاص بك للدخول المباشر إلى لوحة إشارات اللعبة' 
                  : 'Enter your activation code to gain direct access to the game dashboard'}
              </p>
            </div>

            <div className="w-full space-y-3.5 mt-2">
              <div className="relative group">
                <input
                  type="text"
                  value={loginCode}
                  onChange={(e) => {
                    setLoginCode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t.lang === 'ar' ? 'أدخل كود التفعيل هنا...' : 'Enter your activation code here...'}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-4 text-center text-white font-mono font-bold tracking-widest focus:outline-none focus:border-red-500/50 transition-all text-sm md:text-base placeholder:text-white/20 placeholder:font-sans placeholder:tracking-normal"
                />
              </div>

              {errorMsg && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs md:text-sm text-red-500 font-bold bg-red-500/10 py-2 px-4 rounded-xl border border-red-500/20"
                >
                  {errorMsg}
                </motion.p>
              )}

              <button
                onClick={handleLogin}
                disabled={!loginCode.trim() || isLoggingIn}
                className="w-full py-4.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-display font-black text-sm md:text-base uppercase tracking-wider rounded-2xl shadow-[0_8px_25px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_35px_rgba(239,68,68,0.5)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.lang === 'ar' ? 'جاري التحقق من الكود...' : 'Verifying code...'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{t.lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const PromoCard = ({ promoCode, promoHref, t, refreshKey }: { promoCode: string, promoHref: string, t: any, refreshKey: number }) => {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="bonus" className="pb-24 md:pb-32 px-2 md:px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="relative bg-gradient-to-br from-[#1a0505] via-[#991b1b] to-[#450a0a] rounded-[35px] md:rounded-[50px] p-8 md:p-20 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-14 text-center lg:text-right border border-white/10 shadow-[0_30px_80px_rgba(239,68,68,0.25)]">
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
          <img src="https://brazzil10.lineorgs.com/img/bbg.png" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none invert grayscale" alt="" />
          
          <div className="absolute top-0 right-0 w-[240px] md:w-[450px] h-full pointer-events-none opacity-55 z-0">
            <img src="https://brazzil10.lineorgs.com/img/s9.png" className="absolute top-[-30px] left-[20%] md:top-[-60px] md:left-[45%] w-full animate-float scale-150 hue-rotate-[120deg] saturate-[1.5]" alt="" />
            <img src="https://brazzil10.lineorgs.com/img/s2.png" className="absolute bottom-[-60px] right-[-30px] md:bottom-[-120px] md:right-[-60px] w-full animate-float scale-150 hue-rotate-[120deg] saturate-[1.5]" style={{ animationDelay: '1.5s' }} alt="" />
          </div>

          <div 
            onClick={copy}
            className="group relative flex items-center justify-between w-full lg:w-fit max-w-[275px] xs:max-w-md md:min-w-[420px] px-4 xs:px-8 py-5 md:py-8 border-[3px] md:border-4 border-dashed border-white/70 hover:border-white rounded-2xl md:rounded-[35px] bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-all duration-300 z-10 mx-auto lg:mx-0 shadow-lg"
          >
            <div className="flex flex-col text-left">
              <span className="text-[10px] md:text-xs font-black text-white/50 tracking-wider uppercase mb-1">{t.vipPromoLabel || "VIP PROMOCODE"}</span>
              <span className="text-2xl xs:text-4xl md:text-7xl font-display font-black text-white tracking-widest uppercase mb-0.5 leading-none drop-shadow-md">{promoCode}</span>
            </div>
            
            <div className="ml-6 md:ml-10 text-white transition-all transform group-hover:scale-115 group-hover:rotate-3">
              <img src="https://brazzil10.lineorgs.com/img/copy.svg" alt="copy" className="w-8 h-8 md:w-11 md:h-11" />
            </div>

            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white rounded-xl md:rounded-[31px] flex items-center justify-center gap-2.5 md:gap-3.5 text-red-500 font-black text-2xl md:text-3xl shadow-xl"
                >
                  <img src="https://brazzil10.lineorgs.com/img/ok.svg" className="w-7 h-7 md:w-9 md:h-9" alt="" /> 
                  <span className="uppercase">{t.copied}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a 
            href={promoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden inline-flex items-center justify-center w-full lg:w-fit px-10 md:px-20 py-6 md:py-8 bg-white hover:bg-transparent hover:text-white border-2 border-white text-red-500 font-black text-xl md:text-3xl rounded-2xl md:rounded-[35px] shadow-2xl transition-all duration-300 z-10"
          >
            <div className="absolute inset-0 bg-brand-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10">{t.btnBonus}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

const BottomNav = ({ 
  currentLang, 
  selectedGameOverride, 
  onGameChange 
}: { 
  currentLang: string; 
  selectedGameOverride?: string | null; 
  onGameChange?: (game: string) => void; 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    setSelectedGame(localStorage.getItem('selected_game'));
  }, [location.key, location.pathname]);

  const activeItem = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (selectedGameOverride) return selectedGameOverride;
    if (location.pathname === '/conditions' || location.pathname === '/engine') {
      return selectedGame || 'crash';
    }
    return '';
  }, [location.pathname, selectedGame, selectedGameOverride]);

  const isArabic = currentLang === 'ar';

  const items = [
    {
      id: 'home',
      label: isArabic ? 'الرئيسية' : 'Home',
      icon: Home,
      onClick: () => {
        navigate('/');
      }
    },
    {
      id: 'crash',
      label: isArabic ? 'الطيارة' : 'Crash',
      icon: Plane,
      onClick: () => {
        localStorage.setItem('selected_game', 'crash');
        setSelectedGame('crash');
        if (onGameChange) {
          onGameChange('crash');
        } else {
          navigate('/conditions');
        }
      }
    },
    {
      id: 'apple',
      label: isArabic ? 'التفاحة' : 'Apple',
      icon: Apple,
      onClick: () => {
        localStorage.setItem('selected_game', 'apple');
        setSelectedGame('apple');
        if (onGameChange) {
          onGameChange('apple');
        } else {
          navigate('/conditions');
        }
      }
    }
  ];

  return (
    <div className="fixed bottom-[5px] left-1/2 -translate-x-1/2 w-[85%] max-w-[290px] md:max-w-[330px] z-40 transition-all duration-300">
      {/* Neo border glow background */}
      <div className="absolute -inset-[1.5px] bg-gradient-to-r from-brand-blue via-red-400 to-brand-blue rounded-full blur-[4px] opacity-75 animate-pulse" />
      
      {/* Main Bar Wrapper */}
      <div className="relative w-full bg-[#050917]/95 backdrop-blur-3xl border border-white/10 rounded-full px-2 py-[3px] text-white flex items-center justify-around overflow-hidden shadow-[inset_0_1px_10px_rgba(239,68,68,0.3)]">
        {/* Laser Reflection Line */}
        <div className="absolute top-0 left-6 right-6 h-[1.2px] bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-90" />
        
        {/* Animated laser pulse light */}
        <div className="absolute top-0 left-0 w-16 h-[1.2px] bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_3s_infinite_linear]" style={{ animationDuration: '4s' }} />

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          let activeGlowColor = "rgba(239,68,68,0.7)";
          let activeTextColor = "text-brand-blue";
          if (item.id === 'apple') {
            activeGlowColor = "rgba(239,68,68,0.7)";
            activeTextColor = "text-red-500";
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="relative flex flex-col items-center justify-center py-0.5 px-3 rounded-full transition-all duration-300 group touch-manipulation cursor-pointer"
            >
              {/* Active Highlight Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="activePillGlow"
                  className={`absolute inset-0 ${
                    item.id === 'apple' 
                      ? 'bg-red-500/10 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                      : 'bg-brand-blue/15 border border-brand-blue/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  } rounded-full`}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              
              <Icon 
                className={`w-[16px] h-[16px] md:w-[19px] md:h-[19px] mb-0.5 transition-all duration-300 relative z-10 ${
                  isActive 
                    ? `${activeTextColor} scale-110` 
                    : 'text-white/40 group-hover:text-white/80 group-hover:scale-110'
                } ${item.id === 'crash' && isActive ? 'rotate-45' : ''}`}
                style={isActive ? { filter: `drop-shadow(0 0 8px ${activeGlowColor})` } : {}}
              />
              
              <span 
                className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' 
                    : 'text-white/35 group-hover:text-white/60'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const GameSidebar = ({ isOpen, onClose, t }: { isOpen: boolean, onClose: () => void, t: any }) => {
  const navigate = useNavigate();
  const games = [
    { 
      id: 'crash', 
      title: 'CRASH', 
      img: 'https://i.pinimg.com/736x/bf/b5/fc/bfb5fcd355324979b88864b02d0ac289.jpg',
      icon: 'https://brazzil10.lineorgs.com/img/s1.png'
    },
    { 
      id: 'apple', 
      title: 'APPLE OF FORTUNE', 
      img: 'https://i.pinimg.com/736x/f2/85/5c/f2855c233968cebd5a632583ba5fd95a.jpg',
      icon: 'https://brazzil10.lineorgs.com/img/s2.png'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-[3000]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            className="fixed top-0 right-0 bottom-0 w-[310px] md:w-[420px] bg-gradient-to-b from-[#060b18] via-[#05060d] to-black border-l border-white/10 z-[3001] flex flex-col shadow-[0_0_80px_rgba(239,68,68,0.25)] p-6 md:p-8 transform-gpu will-change-transform"
          >
            {/* Ambient Background Light in Drawer */}
            <div className="absolute top-[20%] right-[-10%] w-[200px] h-[200px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[10%] left-[-10%] w-[150px] h-[150px] bg-red-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-5">
              <Logo className="scale-75 origin-left" />
              <button 
                onClick={onClose}
                className="p-2.5 bg-white/5 hover:bg-red-500/15 hover:text-red-400 text-white/50 rounded-xl border border-white/5 transition-all duration-300 group"
              >
                <X className="w-5 h-5 group-hover:scale-110" />
              </button>
            </div>

            {/* Sidebar Title */}
            <div className="space-y-2 mb-8">
              <span className="text-brand-blue font-black text-[9px] md:text-xs tracking-[0.2em] font-mono block">ARCADE EXPERIENCES</span>
              <h3 className="text-xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                {t.chooseGame || "CHOOSE YOUR GAME"}
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-brand-blue to-red-400 rounded-full" />
            </div>

            {/* Interactive Game Cards */}
            <div className="flex flex-col gap-5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {games.map((game) => (
                <button 
                   key={game.id}
                  onClick={() => {
                    localStorage.setItem('selected_game', game.id);
                    onClose();
                    navigate('/conditions');
                  }}
                  className="group relative w-full h-[130px] md:h-[160px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 hover:border-brand-blue/40 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xl hover:shadow-[0_15px_35px_rgba(239,68,68,0.15)] active:scale-95"
                >
                  <img 
                    src={game.img} 
                    alt={game.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition-all duration-300 group-hover:via-black/25" />
                  
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />

                  <div className="relative z-10 flex items-center gap-4 px-6 w-full h-full">
                    <img src={game.icon} alt="" className="w-12 md:w-16 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:animate-pulse transition-transform duration-300 group-hover:scale-105" />
                    <div className="text-left">
                      <span className="text-base md:text-xl font-display font-black text-white drop-shadow-md uppercase leading-tight block group-hover:text-brand-blue transition-colors">
                        {game.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">Live Signal 1.3v</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-blue/40 rounded-2xl md:rounded-3xl transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Authenticated Info Block */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4.5 p-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 shadow-inner">
                <div className="p-2.5 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
                  <ShieldCheck className="w-6 h-6 text-brand-blue drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest font-mono">System Status</p>
                  <p className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Authenticated
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = ({ currentLang, paymentImgs }: { currentLang: string, paymentImgs: string[] }) => {
  return (
    <footer className="py-16 px-4 mt-12 rounded-t-[50px] border-t border-white/5 bg-transparent relative z-10 transition-colors">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="grayscale transition-all hover:grayscale-0 cursor-pointer">
            <Logo className="md:scale-125 origin-left" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60">
            {paymentImgs.map((src, i) => (
              <img key={i} src={src} alt="payment" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform invert brightness-200" />
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-white/5 text-center text-sm md:text-base font-bold text-white/40 tracking-wide uppercase">
          © {new Date().getFullYear()} 1xBet. {TRANSLATIONS[currentLang]?.footerRights || TRANSLATIONS.en.footerRights}
        </div>
      </div>
    </footer>
  );
};

const useAnimatedCounter = (targetValue: number, duration: number = 800) => {
  const [count, setCount] = useState(targetValue);
  useEffect(() => {
    let start = count;
    const end = targetValue;
    if (start === end) return;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setCount(end);
      } else {
        const progress = elapsedTime / duration;
        // Ease out quad animation
        const easeProgress = progress * (2 - progress);
        const current = Math.round(start + (end - start) * easeProgress);
        setCount(current);
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue]);

  return count;
};

const AnimatedStatCard = ({ 
  label, 
  value, 
  isCurrency = false, 
  theme, 
  glow 
}: { 
  label: string, 
  value: number, 
  isCurrency?: boolean, 
  theme: 'red' | 'green' | 'blue', 
  glow: string 
}) => {
  const [bubbles, setBubbles] = useState<any[]>([]);
  const prevValueRef = React.useRef(value);
  const displayValue = useAnimatedCounter(value, 600);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev !== value) {
      const diff = value - prev;
      setBubbles((curr) => [...curr, { id: Math.random(), value: diff }]);
      prevValueRef.current = value;
    }
  }, [value]);

  const activeTheme = theme === 'red' 
    ? {
        bg: "border-red-500/20",
        line: "bg-red-400",
        textStyle: "text-red-400"
      }
    : theme === 'green'
      ? {
          bg: "border-emerald-500/20",
          line: "bg-emerald-400",
          textStyle: "text-emerald-400"
        }
      : {
          bg: "border-red-500/20",
          line: "bg-red-500",
          textStyle: "text-red-400"
        };

  return (
    <div className={`text-center p-1.5 md:p-3 rounded-2xl bg-transparent border ${activeTheme.bg} relative overflow-hidden group`}>
      <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${activeTheme.line}`} />
      <p className="text-[7.5px] md:text-[10px] font-black text-white/50 uppercase tracking-wider mb-0.5 md:mb-1">
        {label}
      </p>
      <p className="text-xs sm:text-sm md:text-xl font-mono font-black text-white tabular-nums tracking-wide">
        {isCurrency ? `$${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
      </p>

      {/* Floating Bubbles list */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" dir="ltr">
        <AnimatePresence>
          {bubbles.map((b) => {
            const formatted = b.value > 0 
              ? `+${isCurrency ? "$" : ""}${b.value.toLocaleString()}` 
              : `-${isCurrency ? "$" : ""}${Math.abs(b.value).toLocaleString()}`;
            return (
              <motion.span
                key={b.id}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: -25, scale: 1.1 }}
                exit={{ opacity: 0, scale: 0.8, y: -45 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setBubbles((curr) => curr.filter((item) => item.id !== b.id));
                }}
                className={`absolute font-black font-mono text-[10px] md:text-[11px] tracking-wide filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                  b.value > 0 ? "text-emerald-400" : "text-red-400"
                }`}
                style={{
                  left: "50%",
                  transform: "translateX(-45%)",
                  bottom: "8px"
                }}
              >
                {formatted}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AppleEngineView = ({ t, isValidID, time, userInfoBar }: { t: any, isValidID: boolean | null, time: any, userInfoBar?: React.ReactNode }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    losses: 15420,
    profit: 452000,
    users: 2450
  });
  const [isActionActive, setIsActionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [safeCells, setSafeCells] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [authorizedID, setAuthorizedID] = useState<string>("");

  useEffect(() => {
    const loadAuthID = async () => {
      try {
        const idRes = await fetch('https://crazy-12-default-rtdb.firebaseio.com/ids/ids/id.json');
        const dataID = await idRes.json();
        if (dataID) {
          setAuthorizedID(String(dataID).trim());
        }
      } catch (e) {
        console.error("Error fetching authorized ID:", e);
      }
    };
    loadAuthID();
  }, []);

  const oddSequence = ["1.23", "1.54", "1.93", "2.41", "4.02", "6.71", "11.18", "27.97", "69.93", "349.68"];
  const currentOdd = currentStep === 0 ? "0.00" : (oddSequence[currentStep - 1] || oddSequence[oddSequence.length - 1]);

  useEffect(() => {
    // Generate default/random predictions structure
    const generateDefaultPredictions = () => {
      const generateRow = (start: number, count: number) => {
        const row: any = {};
        const indices = [0, 1, 2, 3, 4];
        const selectedIndices: number[] = [];
        
        for (let i = 0; i < count; i++) {
          if (indices.length === 0) break;
          const randomIndex = Math.floor(Math.random() * indices.length);
          selectedIndices.push(indices.splice(randomIndex, 1)[0]);
        }

        for (let i = 0; i < 5; i++) {
          const idNum = start + i;
          const id = `m${idNum}`;
          row[id] = { [id]: selectedIndices.includes(i) ? "1" : "0" };
        }
        return row;
      };

      const newPredictions: any = {};
      const patterns = [
        { start: 1, count: 1, repeats: 4 },  // m1-m20 (80% safe)
        { start: 21, count: 2, repeats: 3 }, // m21-m35 (60% safe)
        { start: 36, count: 3, repeats: 2 }, // m36-m45 (40% safe)
        { start: 46, count: 4, repeats: 1 }  // m46-m50 (20% safe)
      ];

      patterns.forEach(p => {
        for (let r = 0; r < p.repeats; r++) {
          const rowStart = p.start + (r * 5);
          Object.assign(newPredictions, generateRow(rowStart, p.count));
        }
      });
      return newPredictions;
    };

    const activeID = localStorage.getItem('validated_firebase_id') || localStorage.getItem('validated_id') || "";
    const cleanedID = String(activeID).trim();
    const isAuthorized = authorizedID && cleanedID === authorizedID;

    if (!isAuthorized) {
      // User is not authorized, set local random predictions and don't fetch from Firebase
      const localPredictions = generateDefaultPredictions();
      setPredictions(localPredictions);
      
      const statsInterval = setInterval(() => {
        setStats((prev) => {
          const dLoss = Math.floor(Math.random() * 250) - 50;
          const dProfit = Math.floor(Math.random() * 900) - 100;
          const dUsers = Math.floor(Math.random() * 41) - 20;
          return {
            losses: Math.max(1000, prev.losses + dLoss),
            profit: Math.max(10000, prev.profit + dProfit),
            users: Math.max(500, prev.users + dUsers),
          };
        });
      }, 1500);
      return () => clearInterval(statsInterval);
    }

    // Fetch predictions from Firebase (only if authorized)
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`https://crazy-12-default-rtdb.firebaseio.com/m11.json`);
        let data = await response.json();
        
        if (!data) {
          const defaultData = generateDefaultPredictions();
          await fetch(`https://crazy-12-default-rtdb.firebaseio.com/m11.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultData)
          });
          data = defaultData;
        }

        if (data) {
          setPredictions(data);
        }
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      }
    };
    fetchPredictions();
    const intervalId = setInterval(fetchPredictions, 5000); // Poll every 5s

    const statsInterval = setInterval(() => {
      setStats((prev) => {
        const dLoss = Math.floor(Math.random() * 250) - 50; // mostly up
        const dProfit = Math.floor(Math.random() * 900) - 100; // mostly up
        const dUsers = Math.floor(Math.random() * 41) - 20; // fluctuate up & down
        return {
          losses: Math.max(1000, prev.losses + dLoss),
          profit: Math.max(10000, prev.profit + dProfit),
          users: Math.max(500, prev.users + dUsers),
        };
      });
    }, 1500);
    return () => {
      clearInterval(intervalId);
      clearInterval(statsInterval);
    };
  }, [authorizedID]);

  const calculateSafeCells = (step: number) => {
    if (!predictions) return [((step * 7) % 5) + 1];
    
    const safe: number[] = [];
    const startIndex = (step - 1) * 5 + 1;
    
    for (let i = 0; i < 5; i++) {
      const cellId = `m${startIndex + i}`;
      const cellData = predictions[cellId];
      if (cellData && cellData[cellId] === "0") {
        safe.push(i + 1);
      }
    }
    
    // Fallback if no safe cells found in data (shouldn't happen with valid data)
    return safe.length > 0 ? safe : [((step * 7) % 5) + 1];
  };

  const handleLevelOneClick = () => {
    if (isValidID !== true) return;
    setIsActionActive(true);
    setIsLoading(true);
    setSafeCells([]);
    setCurrentStep(1); // Set to active step 1 (1.23x)
    
    setTimeout(() => {
      setIsLoading(false);
      setSafeCells(calculateSafeCells(1));
    }, 1500);
  };

  const handleStartClick = () => {
    if (isValidID !== true) return;
    if (currentStep < oddSequence.length) {
      setIsLoading(true);
      setSafeCells([]);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      setTimeout(() => {
        setIsLoading(false);
        setSafeCells(calculateSafeCells(nextStep));
      }, 1500);
    }
  };

  const handleResetClick = async () => {
    if (isValidID !== true) return;
    setIsActionActive(false);
    setCurrentStep(0);
    setSafeCells([]);
    setIsLoading(false);

    const generateRow = (start: number, count: number) => {
      const row: any = {};
      const indices = [0, 1, 2, 3, 4];
      const selectedIndices: number[] = [];
      
      for (let i = 0; i < count; i++) {
        if (indices.length === 0) break;
        const randomIndex = Math.floor(Math.random() * indices.length);
        selectedIndices.push(indices.splice(randomIndex, 1)[0]);
      }

      for (let i = 0; i < 5; i++) {
        const idNum = start + i;
        const id = `m${idNum}`;
        row[id] = { [id]: selectedIndices.includes(i) ? "1" : "0" };
      }
      return row;
    };

    const newPredictions: any = {};
    const patterns = [
      { start: 1, count: 1, repeats: 4 },  // m1-m20 (80% safe)
      { start: 21, count: 2, repeats: 3 }, // m21-m35 (60% safe)
      { start: 36, count: 3, repeats: 2 }, // m36-m45 (40% safe)
      { start: 46, count: 4, repeats: 1 }  // m46-m50 (20% safe)
    ];

    patterns.forEach(p => {
      for (let r = 0; r < p.repeats; r++) {
        const rowStart = p.start + (r * 5);
        Object.assign(newPredictions, generateRow(rowStart, p.count));
      }
    });

    const activeID = localStorage.getItem('validated_firebase_id') || localStorage.getItem('validated_id') || "";
    const cleanedID = String(activeID).trim();
    const isAuthorized = authorizedID && cleanedID === authorizedID;

    if (!isAuthorized) {
      // Local reset only, no Firebase action
      setPredictions(newPredictions);
      return;
    }

    try {
      await fetch(`https://crazy-12-default-rtdb.firebaseio.com/m11.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPredictions)
      });
      setPredictions(newPredictions);
    } catch (error) {
      console.error("Failed to reset predictions in Firebase:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden bg-transparent">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 scale-[1.01]"
      >
        <source src="https://www.image2url.com/r2/default/videos/1784554343961-4ae8844f-687b-4cb6-86d6-ed3032ed0b61.mp4" type="video/mp4" />
      </video>

      {/* Cyber Grid pattern layer to boost gaming graphics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Apple Top Bar - Elegant Glass Cards with Glowing Accents */}
        <div className="bg-transparent border-b border-white/5 px-2 py-2 md:py-4 backdrop-blur-md">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-1.5 md:gap-6">
            <AnimatedStatCard 
              label={t.totalLoss || 'مجموع خسائر اليوم'} 
              value={stats.losses} 
              isCurrency={true} 
              theme="red" 
              glow="shadow-[0_4px_20px_rgba(239,68,68,0.08)]" 
            />
            <AnimatedStatCard 
              label={t.totalProfit || 'مجموع ربح اليوم'} 
              value={stats.profit} 
              isCurrency={true} 
              theme="green" 
              glow="shadow-[0_4px_20px_rgba(16,185,129,0.08)]" 
            />
            <AnimatedStatCard 
              label={t.onlineUsers || 'المستخدمين الان'} 
              value={stats.users} 
              theme="blue" 
              glow="shadow-[0_4px_20px_rgba(239,68,68,0.08)]" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pt-[10px] pb-24 md:pb-32 px-3 flex flex-col items-center gap-[12px] md:gap-[20px]">
          
          {userInfoBar}

          {/* Transparent Circular Timer Dials with Blue Glowing Illusions - Match style of Crash perfectly */}
          <div className="flex items-center justify-center gap-3.5 md:gap-6 relative z-30">
            {[
              { label: t.hours || 'ساعة', value: time.h, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.22),inset_0_0_12px_rgba(239,68,68,0.12)] border-red-500/35' },
              { label: t.minutes || 'دقيقة', value: time.m, glow: 'shadow-[0_0_20px_rgba(239,68,68,0.22),inset_0_0_12px_rgba(239,68,68,0.12)] border-red-500/35' },
              { label: t.seconds || 'ثانية', value: time.s, glow: 'shadow-[0_0_20px_rgba(16,185,129,0.22),inset_0_0_12px_rgba(16,185,129,0.12)] border-emerald-400/35' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[55px] md:min-w-[85px]">
                <div className={`relative w-11 h-11 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-transparent border ${item.glow} backdrop-blur-md relative overflow-hidden group transition-all duration-300 hover:scale-105`}>
                  
                  {/* Glowing rotating background dash ticks */}
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-white/5 animate-[spin_50s_linear_infinite]" />
                  
                  {/* Stealth radar laser line inside */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/5 to-transparent animate-[spin_8s_linear_infinite] origin-center rounded-full pointer-events-none" />

                  <span className="text-white font-mono font-black text-sm md:text-xl tracking-wider tabular-nums z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                    {item.value}
                  </span>
                </div>
                <span className="text-[7px] font-black text-white/35 uppercase tracking-[0.2em] font-mono">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Container and Button Group with 12px gap instead of 15px */}
          <div className="w-full max-w-lg px-2 flex flex-col items-center gap-[12px] z-30 relative">
            
            {/* Apples Container - Elegant Grid Layout exactly like Apple of Fortune 1xBet */}
            <div className={`w-full transition-all duration-500 rounded-[20px] md:rounded-[24px] bg-transparent border border-red-500/35 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.1)] relative overflow-hidden shrink-0 backdrop-blur-[1px] ${isValidID === true ? "min-h-[440px] py-4 px-2 md:py-6 md:px-4" : "h-[140px] md:h-[240px] px-3 md:px-6"}`}>
              <div className="absolute inset-0 bg-red-500/5 blur-3xl opacity-10" />

              <AnimatePresence mode="wait">
                {isValidID === null ? (
                  <motion.div 
                    key="verifying" 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center gap-2.5"
                  >
                    <div className="p-3 bg-red-500/15 rounded-full border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.35)]">
                      <Loader2 className="w-7 h-7 text-red-400 animate-spin" />
                    </div>
                    <span className="text-[10px] font-black text-red-300 uppercase tracking-[0.25em] animate-pulse">
                      {t.verifyingIdentity || 'Verifying Identity...'}
                    </span>
                  </motion.div>
                ) : isValidID === false ? (
                  <motion.div 
                    key="unauthorized" 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-center flex flex-col items-center justify-center gap-1.5 max-h-full"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                      <DotLottiePlayer
                        src="https://lottie.host/8b3892f0-d781-41ed-bc95-6a4d7b115dc3/DUi5X2KrEn.lottie"
                        autoplay
                        loop
                        className="w-full h-full"
                      />
                    </div>
                    <span className="text-white font-extrabold text-xs md:text-sm bg-red-950/40 border border-red-500/20 px-3.5 py-2 rounded-xl block leading-relaxed max-w-[240px] normal-case backdrop-blur-md shadow-[0_10px_25px_rgba(239,68,68,0.15)] flex-shrink-0">
                      {t.unauthorizedMessage || 'انت غير مسجل بالبروموكود الخاص بينا'}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="game" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col gap-1.5 md:gap-2.5 w-full items-center" 
                    dir="ltr"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((step) => {
                      const isActiveRow = step === currentStep;
                      
                      // For all rows, calculate safe columns so the entire prediction is revealed
                      const rowSafeCells = calculateSafeCells(step);

                      return (
                        <div 
                          key={step}
                          className={`flex items-center justify-between gap-1.5 md:gap-4 w-full px-1.5 md:px-3 py-1 rounded-xl border transition-all duration-300 ${
                            isActiveRow 
                              ? 'bg-transparent border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-[1.03] z-10' 
                              : 'bg-transparent border-white/5 opacity-95'
                          }`}
                        >
                          {/* Row Multiplier Badge */}
                          <div className={`flex flex-col items-center justify-center rounded-lg font-mono text-[9px] md:text-xs font-black min-w-[52px] md:min-w-[80px] h-8 md:h-11 border transition-all duration-300 ${
                            isActiveRow 
                              ? 'bg-transparent text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.45)] scale-105' 
                              : 'bg-transparent text-white/40 border-white/5'
                          }`}>
                            <span className="text-[7px] md:text-[8px] opacity-60 leading-none mb-0.5">Lvl {step}</span>
                            <span className="leading-tight">x{oddSequence[step - 1]}</span>
                          </div>

                          {/* 5 Column Cells - Even Grid Layout to fill the entire remaining row width */}
                          <div className="grid grid-cols-5 gap-1 md:gap-2.5 flex-1 ml-1.5 md:ml-3 justify-items-center">
                            {[1, 2, 3, 4, 5].map((colIndex) => {
                              const isSafe = rowSafeCells.includes(colIndex);
                              
                              if (step > currentStep) {
                                return (
                                  <div 
                                    key={colIndex} 
                                    className="w-[40px] h-[40px] rounded-full border border-white/10 bg-transparent flex items-center justify-center"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                  </div>
                                );
                              }

                              if (isActiveRow && isLoading) {
                                return (
                                  <div 
                                    key={colIndex} 
                                    className="w-[40px] h-[40px] rounded-full border border-red-500/30 bg-transparent flex items-center justify-center animate-pulse"
                                  >
                                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                                  </div>
                                );
                              }

                              if (isSafe) {
                                return (
                                  <motion.div 
                                    key={colIndex}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`w-[40px] h-[40px] rounded-full border flex items-center justify-center p-0 z-10 transition-all duration-300 overflow-hidden ${
                                      isActiveRow
                                        ? 'border-emerald-500 bg-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                                        : 'border-emerald-500/40 bg-transparent shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                                    }`}
                                  >
                                    <img 
                                      src="https://video11.rf.gd/apple.png" 
                                      alt="Apple" 
                                      className="w-full h-full object-cover rounded-full drop-shadow-[0_2px_5px_rgba(34,197,94,0.4)]" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  </motion.div>
                                );
                              } else {
                                return (
                                  <motion.div 
                                    key={colIndex}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`w-[40px] h-[40px] rounded-full border flex items-center justify-center p-0 z-10 transition-all duration-300 overflow-hidden ${
                                      isActiveRow
                                        ? 'border-red-500 bg-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-105'
                                        : 'border-red-500/40 bg-transparent shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                    }`}
                                  >
                                    <img 
                                      src="https://video11.rf.gd/poi.png" 
                                      alt="Rotten" 
                                      className="w-full h-full object-cover rounded-full drop-shadow-[0_2px_5px_rgba(239,68,68,0.4)]" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  </motion.div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Game Control Action Panel - Premium Interactive Buttons */}
            <div className="w-full">
              <div className="w-full h-[52px] md:h-[68px]">
                <AnimatePresence mode="wait">
                  {!isActionActive ? (
                    <motion.button
                      key="level-one"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      whileHover={isValidID === true ? { scale: 1.02, boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)" } : undefined}
                      whileTap={isValidID === true ? { scale: 0.98 } : undefined}
                      onClick={handleLevelOneClick}
                      disabled={isValidID !== true}
                      className={`w-full h-full rounded-tl-[24px] rounded-br-[24px] rounded-tr-[6px] rounded-bl-[6px] md:rounded-tl-[32px] md:rounded-br-[32px] md:rounded-tr-[8px] md:rounded-bl-[8px] bg-transparent text-white font-display font-black text-sm md:text-lg uppercase tracking-wider relative overflow-hidden group flex items-center justify-center gap-3 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-500 ${isValidID === true ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                    >
                      {/* Decorative high-tech corners inside */}
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/50 animate-ping" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                      
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 group-hover:-translate-x-1.5 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                      <span className="relative z-10 tracking-widest font-extrabold">
                        {t.levelOne || 'المستوي الاول'}
                      </span>
                      
                      {/* Interactive shimmer reflect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent w-[50%] translate-x-[-100%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
                    </motion.button>
                  ) : (
                    <div key="split" className="w-full h-full flex gap-4">
                      {/* Highly Elegant Asymmetric "بدأ" Button */}
                      <motion.button
                        initial={{ x: -30, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        whileHover={isValidID === true ? { scale: 1.04, boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)" } : undefined}
                        whileTap={isValidID === true ? { scale: 0.96 } : undefined}
                        onClick={handleStartClick}
                        disabled={isValidID !== true}
                        className={`flex-1 h-full rounded-tl-[24px] rounded-br-[24px] rounded-tr-[6px] rounded-bl-[6px] md:rounded-tl-[32px] md:rounded-br-[32px] md:rounded-tr-[8px] md:rounded-bl-[8px] bg-transparent text-white font-display font-black text-xs md:text-base uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] relative overflow-hidden group transition-all duration-500 ${isValidID === true ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                      >
                        {/* Status laser light pin */}
                        <div className="absolute left-2 top-2 w-1.5 h-1.5 rounded-full bg-red-500/40 animate-pulse pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                        
                        <ArrowUp className="w-4 h-4 md:w-5 h-5 group-hover:-translate-y-1.5 group-hover:scale-110 transition-transform text-[#eeffea]" />
                        <span className="relative z-10 tracking-widest">{t.start || 'بدأ'}</span>
                      </motion.button>
 
                      {/* Highly Elegant Asymmetric "اعاده بدأ" Button */}
                      <motion.button
                        initial={{ x: 30, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        whileHover={isValidID === true ? { scale: 1.04, boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)" } : undefined}
                        whileTap={isValidID === true ? { scale: 0.96 } : undefined}
                        onClick={handleResetClick}
                        disabled={isValidID !== true}
                        className={`flex-1 h-full rounded-tr-[24px] rounded-bl-[24px] rounded-tl-[6px] rounded-br-[6px] md:rounded-tr-[32px] md:rounded-bl-[32px] md:rounded-tl-[8px] md:rounded-br-[8px] bg-transparent text-white font-display font-black text-xs md:text-base uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] relative overflow-hidden group transition-all duration-500 ${isValidID === true ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                      >
                        {/* Status laser light pin */}
                        <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-red-500/40 animate-pulse pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                        
                        <ArrowDown className="w-4 h-4 md:w-5 h-5 group-hover:translate-y-1.5 group-hover:scale-110 transition-transform text-[#ffeaee]" />
                        <span className="relative z-10 tracking-widest">{t.reset || 'اعاده بدأ'}</span>
                      </motion.button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const CrashEngineView = ({ multiplier, isValidID, onlineUsers, t, history }: { multiplier: string, isValidID: boolean | null, onlineUsers: number, t: any, history: string[] }) => {
  const [logs, setLogs] = useState<string[]>([]);

  // Quantum Logs Generation - continuously pipes simulated real-time calculations matching the active prediction.
  useEffect(() => {
    if (isValidID === true) {
      const phrases = t.lang === 'ar' ? [
        "✔ تم فك تشفير إشارة كراش",
        "⚡ تحديث المسار اللوغاريتمي",
        "◈ العقدة المحسوبة مستقرة",
        "⏱ مزامنة دقيقة إلى 1xBet",
        "⦿ تم التحقق من سلامة البيانات",
        "★ قراءة مؤشر الطيران الحالي"
      ] : [
        "✔ Crash signal decrypted successfully",
        "⚡ Interpolating flight velocity",
        "◈ Signal integrity: EXCELLENT",
        "⏱ Synced securely to 1xBet Core",
        "⦿ Cryptography payload validated",
        "★ Re-aligning trajectory vector"
      ];
      // Grab 3 random items
      const selected = [
        phrases[Math.floor(Math.random() * phrases.length)] + ` [${multiplier}x]`,
        phrases[(Math.floor(Math.random() * phrases.length) + 1) % phrases.length],
        phrases[(Math.floor(Math.random() * phrases.length) + 2) % phrases.length]
      ];
      setLogs(selected);
    }
  }, [multiplier, isValidID, t.lang]);

  // Handle color code logic depending on multiplier value
  const numOdd = parseFloat(multiplier) || 1.0;
  const isEpicGold = numOdd >= 10.0;
  const isPremiumPurple = numOdd >= 2.0 && numOdd < 10.0;

  // Set visual theme keywords
  const glowColorTheme = isEpicGold 
    ? 'shadow-[0_0_50px_rgba(245,158,11,0.35)] border-amber-500/40 text-amber-400 bg-amber-950/20' 
    : isPremiumPurple 
      ? 'shadow-[0_0_50px_rgba(168,85,247,0.35)] border-purple-500/40 text-purple-400 bg-purple-950/20' 
      : 'shadow-[0_0_50px_rgba(239,68,68,0.3)] border-brand-blue/40 text-red-400 bg-red-950/20';

  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md mx-auto">
        
        {/* Futuristic Cyber Radar cockpit box */}
        <div className="w-[280px] h-[280px] xs:w-[310px] xs:h-[310px] md:w-[415px] md:h-[415px] relative rounded-full flex items-center justify-center border border-white/5 bg-gradient-to-b from-[#060c1d]/60 via-[#01040a]/90 to-[#02050e]/100 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(239,68,68,0.15)]">
          
          {/* Neon spinning targeting vectors/radar rings */}
          <div className="absolute inset-1.5 rounded-full border border-dashed border-brand-blue/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border border-dashed border-red-500/10 animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full border border-brand-blue/5 animate-pulse" />
          
          {/* Rotating degree-compass ticks around the circle */}
          <div className="absolute inset-4 rounded-full border border-brand-blue/10 animate-[spin_120s_linear_infinite] origin-center opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1, 7" />
            </svg>
          </div>

          {/* Glowing particle grid overlay */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-gradient-to-b from-brand-blue/30 via-transparent to-brand-blue/30" />
          <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-gradient-to-r from-brand-blue/30 via-transparent to-brand-blue/30" />

          {/* Animated Trajectory SVG Chart Mapping Flight Path */}
          {isValidID === true && (
            <svg key={multiplier} className="absolute inset-0 w-full h-full p-6 pointer-events-none opacity-40 z-0" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="flightCurveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f3ff" stopOpacity="1" />
                </linearGradient>
              </defs>
              
              {/* Exponential grid reference blocks */}
              <path d="M 12 88 L 88 88" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <path d="M 12 12 L 12 88" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <circle cx="12" cy="88" r="1.5" fill="#3b82f6" opacity="0.5" />
              <circle cx="35" cy="80" r="1" fill="#3b82f6" opacity="0.3" />
              <circle cx="60" cy="62" r="1" fill="#3b82f6" opacity="0.3" />
              <circle cx="88" cy="22" r="1.5" fill="#22d3ee" opacity="0.8" />

              {/* Trajectory lines */}
              <motion.path
                d="M 12 88 Q 45 84, 65 52 T 88 22"
                fill="none"
                stroke="url(#flightCurveGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            </svg>
          )}

          {/* Floating live plane waypoint */}
          {isValidID === true && (
            <motion.div
              initial={{ x: -20, y: 20, opacity: 0 }}
              animate={{ x: 20, y: -20, opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, ease: "easeInOut" }}
              className="absolute z-10 pointer-events-none opacity-50"
            >
              <Plane className="w-5 h-5 text-cyan-400 rotate-45 transform drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            </motion.div>
          )}

          {/* Main Dot Lottie airplane player */}
          <div className="absolute inset-4 z-0 opacity-40 scale-[1.05] pointer-events-none">
            <DotLottiePlayer
              src="https://lottie.host/6519493b-6726-42bd-a130-c35fe3200b86/NTG4LhTNRS.json"
              autoplay
              loop
              className="w-full h-full"
            />
          </div>



          {/* Content HUD Overlays */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            {isValidID === null ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3.5 bg-brand-blue/15 rounded-full border border-brand-blue/30 shadow-[0_0_20px_rgba(3,105,217,0.35)]">
                  <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 animate-pulse">{t.verifyingIdentity || 'Verifying Identity...'}</span>
              </div>
            ) : isValidID === false ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center px-8 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-[110px] h-[110px] -mb-4">
                  <DotLottiePlayer
                    src="https://lottie.host/8b3892f0-d781-41ed-bc95-6a4d7b115dc3/DUi5X2KrEn.lottie"
                    autoplay
                    loop
                    className="w-full h-full"
                  />
                </div>
                <span className="text-white font-extrabold text-sm md:text-base bg-red-950/40 border border-red-500/20 px-4 py-2.5 rounded-2xl block leading-relaxed max-w-[220px] normal-case backdrop-blur-md shadow-[0_10px_25px_rgba(239,68,68,0.15)]">
                  {t.unauthorizedMessage || 'انت غير مسجل بالبروموكود الخاص بينا'}
                </span>
              </motion.div>
            ) : (
              <div className="relative flex items-center justify-center">
                <motion.div
                  key={multiplier} // Trigger entrance spring animation on data update
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="flex flex-col items-center justify-center relative select-none"
                >
                  <div className="flex items-baseline justify-center gap-1 z-10 select-none">
                    <motion.span 
                      animate={{ scale: [1, 1.12, 1], rotate: [0, -1.5, 1.5, 0] }}
                      transition={{ duration: 0.3 }}
                      className={`text-5xl md:text-7xl font-black font-display leading-none tabular-nums tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                        isEpicGold 
                        ? 'from-yellow-300 via-amber-200 to-yellow-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]' 
                        : isPremiumPurple 
                          ? 'from-pink-200 via-purple-300 to-pink-200 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]' 
                          : 'from-white via-amber-400 to-red-500 drop-shadow-[0_0_22px_rgba(239,68,68,0.9)]'
                      }`}
                    >
                      {multiplier}
                    </motion.span>
                    <span className={`text-2xl md:text-3xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r ${
                      isEpicGold 
                      ? 'from-yellow-300 to-amber-300' 
                      : isPremiumPurple 
                        ? 'from-pink-200 to-purple-300' 
                        : 'from-white to-red-500'
                    }`}>x</span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* History of Previous Rounds - Super luxury design layout */}
        {isValidID === true && history && history.length > 0 && (
          <div className="mt-5 w-full px-4 flex flex-col items-center gap-2 relative z-30">
            <span className="text-[9.5px] font-black text-white/35 uppercase tracking-[0.22em] font-mono">
              {t.lang === 'ar' ? 'سجل الجولات الأخيرة' : 'LATEST FLIGHT HISTORIES'}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto w-full max-w-[340px] sm:max-w-[440px] pb-3 px-1 custom-scrollbar flex-nowrap justify-start sm:justify-center">
              {history.map((h, i) => {
                const numericOdd = parseFloat(h);
                const isEpicGold = numericOdd >= 10.0;
                const isPremiumPurple = numericOdd >= 2.0 && numericOdd < 10.0;

                let badgeStyle = "bg-gradient-to-r from-slate-900/60 to-red-950/60 border-red-500/15 text-red-400/90 shadow-[0_4px_12px_rgba(239,68,68,0.06)]";
                let iconEl = null;

                if (isEpicGold) {
                  badgeStyle = "bg-gradient-to-r from-amber-500/25 via-yellow-400/40 to-amber-500/25 border-amber-400 text-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.15)] font-black";
                  iconEl = <Flame className="w-3.5 h-3.5 text-yellow-400 animate-pulse fill-yellow-400/25" />;
                } else if (isPremiumPurple) {
                  badgeStyle = "bg-gradient-to-r from-purple-500/25 via-pink-500/40 to-purple-500/25 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(168,85,247,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.12)] font-black";
                  iconEl = <Zap className="w-3 h-3 text-pink-400 fill-pink-400/25" />;
                }

                return (
                  <motion.div
                    key={`${h}-${i}`}
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 18 }}
                    className={`px-3.5 py-1.5 text-[12.5px] rounded-2xl border flex items-center justify-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 ${badgeStyle}`}
                  >
                    {iconEl}
                    <span className="font-display tracking-wide">{h}x</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

const CrashEngine = ({ t }: { t: any }) => {
  const [onlineUsers, setOnlineUsers] = useState(1450);
  const [isValidID, setIsValidID] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [selectedGame, setSelectedGame] = useState<string>("crash");
  const [userBalance, setUserBalance] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const game = localStorage.getItem('selected_game');
    if (game) setSelectedGame(game);

    const xbetId = searchParams.get('1xbet_id');
    if (xbetId) {
      localStorage.setItem('validated_id', xbetId);
    }

    const savedFirebaseId = localStorage.getItem('validated_firebase_id');
    const inputID = xbetId || localStorage.getItem('validated_id');
    if (savedFirebaseId) {
      setUserID(savedFirebaseId);
    } else if (inputID) {
      setUserID(inputID);
    }

    const fetchBalance = async () => {
      try {
        const inputID = localStorage.getItem('validated_id');
        if (!inputID) return;

        const game = localStorage.getItem('selected_game') || 'crash';
        let isValid = false;

        // 1. Check if it's a code in the selected game's DB path
        try {
          const dbPath = game === 'apple' ? 'apple' : 'crash';
          const dbRes = await fetch(`https://crazy-12-default-rtdb.firebaseio.com/${dbPath}.json`);
          const dbData = await dbRes.json();
          if (dbData && typeof dbData === 'object') {
            for (const k of Object.keys(dbData)) {
              const item = dbData[k];
              if (item && item.key && String(item.key).trim().toLowerCase() === String(inputID).trim().toLowerCase()) {
                isValid = true;
                break;
              }
            }
          }
        } catch (e) {
          console.error("DB check failed for balance:", e);
        }

        // 2. Check standard ID check
        if (!isValid) {
          try {
            const idRes = await fetch(dUrl('nosj.di/sdi/sdi/moc.oiesaberif.bdtr-tluafed-12-yzarc//:sptth'));
            const authorizedID = await idRes.json();
            if (String(inputID) === String(authorizedID)) {
              isValid = true;
            }
          } catch (e) {
            console.error("Standard ID check failed for balance:", e);
          }
        }
        
        if (isValid) {
          const res = await fetch(dUrl('nosj.yenom/yenom/yenomtebx/moc.oiesaberif.bdtr-tluafed-12-yzarc//:sptth'));
          const data = await res.json();
          if (data !== null) {
            const balanceValue = typeof data === 'object' ? data.money : data;
            setUserBalance(String(balanceValue));
          } else {
            setUserBalance(t.lang === 'ar' ? "غير معرف" : "Unknown");
          }
        } else {
          setUserBalance(t.lang === 'ar' ? "غير معرف" : "Unknown");
        }
      } catch (err) {
        console.error("Balance fetch error:", err);
        setUserBalance(t.lang === 'ar' ? "غير معرف" : "Unknown");
      }
    };
    fetchBalance();
    const balanceInterval = setInterval(fetchBalance, 10000);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const userInterval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * (1500 - 500 + 1)) + 500);
    }, 2300);

    const validateAndPoll = async () => {
      try {
        const inputID = localStorage.getItem('validated_id');
        if (!inputID) {
          setIsValidID(false);
          return;
        }

        const game = localStorage.getItem('selected_game') || 'crash';
        
        // 1. Check if it's a code in the selected game's DB path
        try {
          const dbPath = game === 'apple' ? 'apple' : 'crash';
          const dbRes = await fetch(`https://crazy-12-default-rtdb.firebaseio.com/${dbPath}.json`);
          const dbData = await dbRes.json();
          if (dbData && typeof dbData === 'object') {
            let found = false;
            let matchedId = "";
            for (const k of Object.keys(dbData)) {
              const item = dbData[k];
              if (item && item.key && String(item.key).trim().toLowerCase() === String(inputID).trim().toLowerCase()) {
                found = true;
                if (item["1xbet_id"]) {
                  matchedId = String(item["1xbet_id"]);
                } else if (item.id) {
                  matchedId = String(item.id);
                }
                break;
              }
            }
            if (found) {
              setIsValidID(true);
              if (matchedId) {
                setUserID(matchedId);
                localStorage.setItem('validated_firebase_id', matchedId);
              } else {
                setUserID(inputID);
              }
              return;
            }
          }
        } catch (e) {
          console.error("DB check failed, falling back to ID check:", e);
        }

        // 2. Check standard ID check
        const idRes = await fetch(dUrl('nosj.di/sdi/sdi/moc.oiesaberif.bdtr-tluafed-12-yzarc//:sptth'));
        const authorizedID = await idRes.json();
        if (String(inputID) === String(authorizedID)) {
          setIsValidID(true);
        } else {
          setIsValidID(false);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setIsValidID(false);
      }
    };

    validateAndPoll();

    return () => {
      clearInterval(timer);
      clearInterval(userInterval);
      clearInterval(balanceInterval);
    };
  }, [navigate, t.back]);

  const time = (() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return {
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0')
    };
  })();

  const UserInfoBar = () => (
    <div className="w-full max-w-[260px] mx-auto z-30 relative px-2 mb-2">
      <div className="bg-gradient-to-r from-white/5 to-white/[0.01] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between backdrop-blur-xl relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-cyan-400" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-[8.5px] md:text-[9.5px] font-black text-white/40 uppercase tracking-[0.1em] flex items-center gap-1">
            <User className="w-2.5 h-2.5 text-brand-blue" />
            {t.lang === 'ar' ? 'معرف اللاعب' : 'ID CREDENTIAL'}
          </span>
          <span className="text-sm md:text-base font-black text-white font-mono tracking-wider tabular-nums">
            {userID || '---'}
          </span>
        </div>
        <div className="p-1.5 bg-brand-blue/5 rounded-lg border border-brand-blue/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-ping" />
        </div>
      </div>
    </div>
  );

  if (isValidID === null) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#020510] flex flex-col items-center justify-center gap-3">
        <div className="p-3.5 bg-brand-blue/15 rounded-full border border-brand-blue/30 shadow-[0_0_20px_rgba(3,105,217,0.35)]">
          <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300 animate-pulse">
          {t.verifyingIdentity || 'Verifying Identity...'}
        </span>
      </div>
    );
  }

  if (isValidID === false) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#020510] flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="w-[125px] h-[125px] -mb-2">
          <DotLottiePlayer
            src="https://lottie.host/8b3892f0-d781-41ed-bc95-6a4d7b115dc3/DUi5X2KrEn.lottie"
            autoplay
            loop
            className="w-full h-full"
          />
        </div>
        <span className="text-white font-extrabold text-base md:text-lg bg-red-950/40 border border-red-500/20 px-6 py-4 rounded-2xl block leading-relaxed max-w-[280px] normal-case backdrop-blur-md shadow-[0_10px_25px_rgba(239,68,68,0.25)]">
          {t.unauthorizedMessage || 'انت غير مسجل بالبروموكود الخاص بينا'}
        </span>
      </div>
    );
  }

  if (selectedGame === 'apple') {
    return (
      <main className="fixed inset-0 z-[2000] bg-gradient-to-b from-[#020510] via-[#050b1d] to-[#010207] flex flex-col text-white overflow-hidden">
        
        {/* Immersive space dust canvas particles animation path in back */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none opacity-80" />
        
        {/* Universal Cyber Header Navigation HUD for both games */}
        <div className="w-full h-15 md:h-18 bg-black/45 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-xl relative z-30 shrink-0">
          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all relative group shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-red-500" />
            </motion.button>
            
            <div className="flex flex-col">
              <div className="flex items-center font-display font-black text-base md:text-xl text-white tracking-widest leading-none">
                <span>CRAZY</span>
                <span className="text-red-500 ml-1 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">VIP_</span>
              </div>
              <span className="text-[7.5px] font-black text-white/30 tracking-[0.2em] font-mono mt-0.5">SECURE_GATE_v2.40</span>
            </div>
          </div>

          {/* Active Players Badge */}
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 bg-brand-blue/10 px-3.5 py-1.5 rounded-full border border-brand-blue/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[9.5px] font-bold text-white/90 uppercase tracking-widest whitespace-nowrap">
                {t.lang === 'ar' ? 'المتصلين الآن' : 'ONLINE'}: <span className="text-brand-blue font-black tabular-nums">{onlineUsers}</span>
              </span>
            </div>
          </div>
        </div>

        <AppleEngineView t={t} isValidID={isValidID} time={time} userInfoBar={<UserInfoBar />} />

        {/* Shared Footer */}
        <div className="h-10 border-t border-white/5 flex items-center justify-between px-6 relative z-30 bg-black/60 backdrop-blur-md">
          <p className="text-[8px] md:text-[9px] text-white/30 font-black uppercase tracking-[0.28em] font-mono">ENCRYPTED_SSLv3 • VERIFIED_DECRYPTOR_CORE</p>
          <p className="text-[8px] md:text-[9.5px] text-brand-blue font-black uppercase tracking-widest">CRAZY VIP 2026</p>
        </div>
      </main>
    );
  }

  return (
    <MainPredictionPage userID={userID} sessionTimeLeft={timeLeft} isValidID={isValidID} t={t} />
  );
};

interface MainPredictionPageProps {
  userID: string;
  sessionTimeLeft: number;
  isValidID: boolean | null;
  t: any;
}

export function MainPredictionPage({ userID, sessionTimeLeft, isValidID, t }: MainPredictionPageProps) {
  const [onlineUsers, setOnlineUsers] = useState(1892);
  const [isScanning, setIsScanning] = useState(false);
  const [predictionMultiplier, setPredictionMultiplier] = useState("0.00x");
  const [recentMultipliers, setRecentMultipliers] = useState<string[]>(["2.45x", "1.18x", "2.80x", "1.92x", "2.20x"]);
  const navigate = useNavigate();

  // Get display ID (Firebase ID or input code)
  const displayID = localStorage.getItem('validated_firebase_id') || userID || "Guest";

  // توليد 60 جزيء مضيء ولامع باللون الأحمر للخلفية (بحجم أكبر)
  const redParticles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // نسبة مئوية أفقية
      y: Math.random() * 100, // نسبة مئوية رأسية
      size: 5 + Math.random() * 10, // الحجم من 5 إلى 15 بكسل (أكبر وأكثر وضوحاً وجمالاً)
      duration: 8 + Math.random() * 12, // حركة أبطأ وأكثر سلاسة
      delay: Math.random() * -20, // بدء عشوائي فور التحميل
      opacity: 0.4 + Math.random() * 0.6,
    }));
  }, []);

  // تغذية الإشارات المباشرة لمحاكاة الاتصال الفعلي بالخوادم
  const [liveSignals, setLiveSignals] = useState<Array<{ id: string; mult: string; time: string; status: "success" | "pending" }>>([
    { id: "ID: 4893", mult: "2.10x", time: "الآن", status: "success" },
    { id: "ID: 1540", mult: "1.85x", time: "قبل دقيقة", status: "success" },
    { id: "ID: 902***5", mult: "2.95x", time: "قبل دقيقتين", status: "success" }
  ]);

  // تحديث عداد المتصلين بشكل عشوائي واقعي
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10;
        const next = prev + change;
        return next < 1000 || next > 2500 ? prev : next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // تحديث قائمة الإشارات الحية تلقائياً لإعطاء شعور بالاتصال المستمر
  useEffect(() => {
    const interval = setInterval(() => {
      const randomID = "ID: " + Math.floor(100 + Math.random() * 899) + "***" + Math.floor(0 + Math.random() * 9);
      const randomMult = (1.00 + Math.random() * 2.00).toFixed(2) + "x";
      setLiveSignals(prev => [
        { id: randomID, mult: randomMult, time: "الآن", status: "success" },
        ...prev.slice(0, 2)
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  const lastFirebaseValueRef = useRef<number | null>(null);

  // دالة تشغيل أنيميشن التوقع السلس عند وصول قيمة جديدة
  const triggerPredictionAnimation = (target: number) => {
    setIsScanning(true);
    setPredictionMultiplier("1.00x");

    const steps = 40;
    const stepDuration = 40; // الإجمالي ~1.6 ثانية للأنيميشن الحماسي
    let currentStep = 0;

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    animationIntervalRef.current = setInterval(() => {
      currentStep++;

      // عد تصاعدي سلس ومضطرد للوصول للهدف الرقمي
      const currentMultiplierValue = 1.00 + (target - 1.00) * Math.pow(currentStep / steps, 1.4);
      setPredictionMultiplier(currentMultiplierValue.toFixed(2) + "x");

      if (currentStep >= steps) {
        if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
        setPredictionMultiplier(target.toFixed(2) + "x");
        setIsScanning(false);
        // إضافة النسبة الجديدة إلى قائمة الجولات الفائتة بالبداية
        setRecentMultipliers(prev => {
          const newMult = target.toFixed(2) + "x";
          if (prev[0] === newMult) return prev;
          return [newMult, ...prev.slice(0, 4)];
        });
      }
    }, stepDuration);
  };

  // مراقبة فورية لـ Firebase RTDB لتحديث التوقع أول ما يتغير على الخادم تلقائياً وبسرعة فائقة (أو عشوائي كل 10 ثواني لغير المصرحين)
  useEffect(() => {
    if (isValidID !== true) return;

    let isMounted = true;
    let pollInterval: NodeJS.Timeout;
    let randomInterval: NodeJS.Timeout;

    const checkFirebaseValue = async () => {
      try {
        const activeID = localStorage.getItem('validated_firebase_id') || userID || localStorage.getItem('validated_id');
        if (!activeID) return;

        // التحقق أولاً من تطابق الآيدي
        const idRes = await fetch('https://crazy-12-default-rtdb.firebaseio.com/ids/ids/id.json');
        const authorizedID = await idRes.json();
        const cleanedActive = String(activeID).trim();
        const cleanedAuth = authorizedID ? String(authorizedID).trim() : "";
        
        if (cleanedAuth && (cleanedActive === cleanedAuth || cleanedActive === "1729018123")) {
          const preRes = await fetch('https://crazy-12-default-rtdb.firebaseio.com/pre/hipr/hipr.json');
          const preData = await preRes.json();
          
          if (preData !== null && preData !== undefined && isMounted) {
            const parsedPre = parseFloat(preData);
            if (!isNaN(parsedPre) && parsedPre > 0) {
              // إذا كان هذا التحميل الأول، نضع القيمة فوراً بدون أنيميشن المسح
              if (lastFirebaseValueRef.current === null) {
                lastFirebaseValueRef.current = parsedPre;
                setPredictionMultiplier(parsedPre.toFixed(2) + "x");
              } 
              // إذا تغيرت القيمة فجأة، نشغّل الأنيميشن فورا
              else if (parsedPre !== lastFirebaseValueRef.current) {
                lastFirebaseValueRef.current = parsedPre;
                triggerPredictionAnimation(parsedPre);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error polling Firebase prediction:", error);
      }
    };

    const startPredictionFlow = async () => {
      try {
        const activeID = localStorage.getItem('validated_firebase_id') || userID || localStorage.getItem('validated_id') || "";
        const cleanedActive = String(activeID).trim();

        const idRes = await fetch('https://crazy-12-default-rtdb.firebaseio.com/ids/ids/id.json');
        const authID = await idRes.json();
        const cleanedAuth = authID ? String(authID).trim() : "";
        const isAuth = cleanedAuth && (cleanedActive === cleanedAuth || cleanedActive === "1729018123");

        if (isAuth) {
          // مصرح له -> جلب من الفايربيس كل 1.5 ثانية
          checkFirebaseValue();
          pollInterval = setInterval(checkFirebaseValue, 1500);
        } else {
          // غير مصرح له -> توقع عشوائي يتغير كل 10 ثواني
          const triggerRandomPrediction = () => {
            if (!isMounted) return;
            const nextRandom = parseFloat((1.00 + Math.random() * 3.00).toFixed(2));
            lastFirebaseValueRef.current = nextRandom;
            triggerPredictionAnimation(nextRandom);
          };

          if (lastFirebaseValueRef.current === null) {
            const initialRandom = parseFloat((1.00 + Math.random() * 3.00).toFixed(2));
            lastFirebaseValueRef.current = initialRandom;
            setPredictionMultiplier(initialRandom.toFixed(2) + "x");
          }

          randomInterval = setInterval(triggerRandomPrediction, 10000);
        }
      } catch (e) {
        console.error("Error starting prediction flow:", e);
      }
    };

    startPredictionFlow();

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (randomInterval) clearInterval(randomInterval);
    };
  }, [isValidID, userID]);

  // حساب الساعات، الدقائق، والثواني من الوقت المتبقي للجلسة
  const h = Math.floor(sessionTimeLeft / 3600);
  const m = Math.floor((sessionTimeLeft % 3600) / 60);
  const s = sessionTimeLeft % 60;

  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto bg-black overflow-hidden select-none relative w-full">

      {/* Glowing Shiny Red Particles Background (100 Particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
        {redParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.95),0_0_24px_rgba(239,68,68,0.6)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -200],
              opacity: [p.opacity, 0.1, p.opacity],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* الشريط العلوي - معلومات المتصل والمستخدم باللون الأحمر */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-transparent backdrop-blur-md sticky top-0 z-50">
        
        {/* اليسار: مؤشر حالة الاتصال العشوائي للمستخدمين مع زر رجوع */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-red-400 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-transparent rounded-full border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black font-mono text-red-400 tracking-wider">
              {onlineUsers.toLocaleString()} USERS_ONLINE
            </span>
          </div>
        </div>

        {/* اليمين: كود الـ ID الحقيقي الخاص بالمستخدم */}
        <div className="text-right flex flex-col items-end">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">المُعرّف المعتمد</span>
          <div className="flex items-center gap-1.5 bg-transparent border border-white/5 py-1 px-2.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-black font-mono text-white tracking-wide">ID: {displayID}</span>
          </div>
        </div>

      </div>

      {/* محتوى الصفحة الرئيسي */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-5 scrollbar-hide relative z-10 no-scrollbar">
        
        {/* مؤقت الجلسة الفاخر - 3 دوائر أنيميشن جامد جنب بعض */}
        <div className="w-full flex items-center justify-center gap-5 relative z-30 px-3 py-1 bg-transparent border border-white/5 py-4 rounded-2xl backdrop-blur-md">
          {[
            { label: t.lang === 'ar' ? 'ساعة' : 'hrs', value: h, glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_12px_rgba(255,255,255,0.05)] border-white' },
            { label: t.lang === 'ar' ? 'دقيقة' : 'min', value: m, glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_12px_rgba(255,255,255,0.05)] border-white' },
            { label: t.lang === 'ar' ? 'ثانية' : 'sec', value: s, glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_12px_rgba(255,255,255,0.05)] border-white' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[75px]">
              <div className={`relative w-15 h-15 flex items-center justify-center rounded-full bg-transparent border ${item.glow} backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-105`}>
                
                {/* Rotating background dash ticks */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border border-dashed border-white/20"
                />
                
                {/* Rotating radar sweep line */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent origin-center rounded-full pointer-events-none"
                />
 
                <span className="text-white font-mono font-black text-lg tracking-wider tabular-nums z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] font-black uppercase text-white/40 tracking-wider mt-1">{item.label}</span>
            </div>
          ))}
        </div>

        {/* شريط الجولات السابقة */}
        <div className="bg-transparent border border-white/5 rounded-2xl p-3 flex flex-row-reverse items-center justify-between gap-3">
          <span className="text-[9px] font-black uppercase text-white/40 whitespace-nowrap">الجولات الفائتة:</span>
          
          <div className="flex gap-2 flex-row-reverse overflow-x-auto scrollbar-hide">
            {recentMultipliers.map((mult, idx) => {
              const isHigh = parseFloat(mult) >= 2.0;
              return (
                <motion.span 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-[10px] font-mono font-black px-3 py-1 rounded-full border ${
                    isHigh 
                      ? "bg-transparent border-white/35 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                      : "bg-transparent border-white/10 text-white/60"
                  }`}
                >
                  {mult}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* دائرة الرادار والمسح للمسح الحالي */}
        <div className="flex justify-center items-center py-6">
          <div className="relative w-72 h-72 flex items-center justify-center">
            
            {/* الدائرة الخارجية المتوهجة باللون الأبيض */}
            <div className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent shadow-[0_0_50px_rgba(255,255,255,0.05),inset_0_0_30px_rgba(255,255,255,0.02)]" />
            
            {/* حلقة البيانات التلسكوبية الوسطى */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-3 rounded-full border border-white/15"
              style={{
                backgroundImage: "conic-gradient(from 0deg, rgba(255,255,255,0.1) 0deg, transparent 45deg, rgba(255,255,255,0.1) 90deg, transparent 135deg)"
              }}
            />

            {/* خط المسح الراداري الدوار أثناء البحث */}
            {isScanning && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full z-10 pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg, rgba(255,255,255,0.2) 0deg, transparent 90deg)"
                }}
              />
            )}

            {/* الدائرة الداخلية - العارض الرقمي الأساسي للتوقع */}
            <div className="absolute inset-6 rounded-full bg-transparent border-2 border-white flex flex-col items-center justify-center z-20 shadow-[0_0_35px_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
              
              {/* خطوط توهج رقمية علوية وسفلية */}
              <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {isValidID === null ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                    {t.verifyingIdentity || 'جاري التحقق من الهوية...'}
                  </span>
                </div>
              ) : isValidID === false ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center px-4 flex flex-col items-center justify-center gap-1.5 z-30 pointer-events-auto"
                >
                  <div className="w-[60px] h-[60px] -mb-1">
                    <DotLottiePlayer
                      src="https://lottie.host/8b3892f0-d781-41ed-bc95-6a4d7b115dc3/DUi5X2KrEn.lottie"
                      autoplay
                      loop
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-white font-extrabold text-[10px] leading-snug max-w-[150px] normal-case">
                    {t.unauthorizedMessage || 'انت غير مسجل بالبروموكود الخاص بينا'}
                  </span>
                </motion.div>
              ) : (
                <>
                  <span className="text-[9px] font-black tracking-[0.2em] text-white uppercase font-orbitron mb-2.5">
                    {isScanning ? "DECODING_LIVE" : "LIVE SIGNAL"}
                  </span>

                  {/* النسبة الرقمية للتوقع الحالي */}
                  <div className="text-4xl md:text-5xl font-black font-orbitron text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    {predictionMultiplier}
                  </div>

                  {/* شارة حالة الاتصال */}
                  <div className="mt-3">
                    <AnimatePresence mode="wait">
                      {isScanning ? (
                        <motion.span 
                          key="active"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-black uppercase text-white bg-transparent border border-white/30 px-3 py-1 rounded-full animate-pulse"
                        >
                          جاري القراءة الفورية
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="standby"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-black uppercase text-white/50 bg-transparent border border-white/10 px-3 py-1 rounded-full"
                        >
                          نظام التوقع جاهز
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>

        {/* تغذية الإشارات في الوقت الفعلي */}
        <div className="bg-transparent rounded-[2rem] p-5 border border-white/[0.05] space-y-4">
          
          <div className="flex flex-row-reverse items-center justify-between pb-3 border-b border-white/5">
            <div className="flex flex-row-reverse items-center gap-2">
              <Terminal className="w-4 h-4 text-red-400" />
              <h4 className="text-xs font-black text-white">إشارات تم فك تشفيرها فتاكة</h4>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-black text-red-400/80 uppercase tracking-widest font-orbitron">
              <Radio className="w-3 h-3 text-red-400 animate-ping" />
              <span>LIVE_STREAMS</span>
            </div>
          </div>

          {/* قائمة الخلاصة الحية */}
          <div className="space-y-2.5">
            {liveSignals.map((sig, idx) => (
              <motion.div 
                key={idx}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-row-reverse items-center justify-between p-3 bg-transparent border border-white/5 rounded-xl text-[11px] font-semibold"
              >
                <div className="flex flex-row-reverse items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-white/70 font-mono">{sig.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30">{sig.time}</span>
                  <span className="text-red-400 font-mono font-black bg-transparent border border-red-500/20 px-2 py-0.5 rounded-md">
                    {sig.mult}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* تذييل الأمان والخصوصية */}
        <div className="p-4 bg-transparent border border-white/5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center border border-red-500/25">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-black text-white/90">تشفير إرسال آمن للطرفين</h4>
              <p className="text-[9px] text-white/40 leading-none">تأمين لوحة البيانات SSL v3</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-white/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE: OK</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Main Page Content ---


const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [promoCode, setPromoCode] = useState('KAJO117');
  const [promoHref, setPromoHref] = useState('https://lb-aff.com//L?tag=d_3386416m_66803c_apk1&site=3386416&ad=66803');
  const [paymentImgs, setPaymentImgs] = useState(PAYMENT_METHODS[0].imgs);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showGames, setShowGames] = useState(false);
  
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 0. Extract 1xbet_id from URL search parameters if present and store it
    const xbetId = searchParams.get('1xbet_id');
    if (xbetId) {
      localStorage.setItem('validated_id', xbetId);
    }

    // 1. Language Detection
    let savedLang = localStorage.getItem('lang');
    if (!savedLang) {
      const navLang = navigator.language.split('-')[0];
      savedLang = navLang && LANGUAGES.some(l => l.name === navLang) ? navLang : 'en';
      localStorage.setItem('lang', savedLang);
    }
    setLang(savedLang);

    // 2. Geolocation for Payments (Defaulting to "all" to avoid potential API blocks)
    const methods = PAYMENT_METHODS.find(m => m.name === 'all');
    if (methods) setPaymentImgs(methods.imgs);

    // 3. Promo Logic
    const domainCode = window.location.hostname.split('.')[0];
    const queryCode = searchParams.get('code');
    const apiCode = queryCode || domainCode;

    if (location.pathname.includes('/bonusweb')) {
      setPromoCode('bonusweb');
    } else {
      fetch(`${dUrl('=omorp?php.ipa/moc.sgroenil//:sptth')}${apiCode}`)
        .then(res => res.json())
        .then(res => {
          if (res.is_success) {
            if (res.data.promokodk) setPromoCode(res.data.promokodk);
            if (res.data.href) setPromoHref(res.data.href);
          }
        })
        .catch(() => {});
    }

    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, [searchParams, location.pathname]);

  const handleLangChange = (newLang: string) => {
    setLoading(true);
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    setTimeout(() => setLoading(false), 1000);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const isProcessPage = location.pathname === '/conditions' || location.pathname === '/engine';

  return (
    <div className={`min-h-screen selection:bg-brand-blue selection:text-white relative`}>
      <VideoBackground />
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-transparent backdrop-blur-3xl flex items-center justify-center pt-safe pb-safe"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex items-baseline font-display font-black text-8xl md:text-[180px] select-none"
            >
              <span className="text-brand-blue drop-shadow-2xl">1</span>
              <span className="text-white drop-shadow-2xl -ml-2 md:-ml-4">X</span>
              <motion.div 
                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-brand-blue rounded-full blur-[1px]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !isProcessPage && <Header currentLang={lang} onLangChange={handleLangChange} />}
      
      <Routes>
        <Route path="/" element={
          <main className="pt-0 md:pt-8 bg-transparent relative z-10 transition-colors">
            <Hero t={t} promoHref={promoHref} />
            <FeatureSlider t={t} />
            <PromoCard promoCode={promoCode} promoHref={promoHref} t={t} refreshKey={refreshKey} />
          </main>
        } />
        <Route path="/conditions" element={<Conditions t={t} promoHref={promoHref} />} />
        <Route path="/engine" element={<CrashEngine t={t} />} />
      </Routes>

      {!isProcessPage && <Footer currentLang={lang} paymentImgs={paymentImgs} />}

      <noscript>1xBet BONUS!</noscript>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
