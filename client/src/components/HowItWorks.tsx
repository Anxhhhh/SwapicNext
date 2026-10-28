'use client';
import React from 'react';
import { ShoppingCart, Calendar, RefreshCw, Shield, ArrowRight } from 'lucide-react';

/* ── Shared sparkle decorator ── */
const Spark = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
    <line x1="9" y1="1" x2="9" y2="6" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="12" x2="9" y2="17" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="9" x2="6" y2="9" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="17" y2="9" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── Step 1 illustration: Phone listing ── */
const PhoneIllustration = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <Spark className="absolute top-2 right-5 opacity-70" />
    <Spark className="absolute bottom-3 left-4 opacity-40 scale-75" />
    <svg width="90" height="115" viewBox="0 0 90 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phone body */}
      <rect x="8" y="4" width="74" height="107" rx="10" fill="white" stroke="#E8DDD4" strokeWidth="1.5"/>
      {/* Screen area */}
      <rect x="14" y="16" width="62" height="82" rx="5" fill="#FFF8F4"/>
      {/* Photo placeholder */}
      <rect x="18" y="20" width="54" height="36" rx="4" fill="#F4E8DC"/>
      <circle cx="30" cy="32" r="5" fill="#E8C9B0"/>
      <path d="M18 48 L30 38 L40 45 L52 35 L72 48" fill="#E8C9B0" opacity="0.6"/>
      {/* Listing fields */}
      <rect x="18" y="62" width="38" height="4" rx="2" fill="#D4B8A8"/>
      <rect x="18" y="70" width="28" height="3" rx="1.5" fill="#E8DDD4"/>
      {/* Transaction type pills */}
      <rect x="18" y="78" width="16" height="8" rx="4" fill="#E96B16"/>
      <text x="22" y="84.5" fontSize="4.5" fill="white" fontWeight="bold">Sell</text>
      <rect x="37" y="78" width="16" height="8" rx="4" fill="#EEE5DC"/>
      <text x="40" y="84.5" fontSize="4.5" fill="#654332" fontWeight="600">Rent</text>
      {/* Add button */}
      <circle cx="68" cy="88" r="10" fill="#E96B16"/>
      <line x1="68" y1="84" x2="68" y2="92" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="64" y1="88" x2="72" y2="88" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

/* ── Step 2 illustration: Magnifying glass ── */
const MagnifyIllustration = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <Spark className="absolute top-2 left-4 opacity-70" />
    <Spark className="absolute bottom-2 right-4 opacity-40 scale-75" />
    <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass circle */}
      <circle cx="44" cy="44" r="34" fill="white" stroke="#D4E8DC" strokeWidth="2"/>
      <circle cx="44" cy="44" r="28" fill="#F0FAF4"/>
      {/* Chair inside glass */}
      {/* Chair seat */}
      <rect x="30" y="42" width="28" height="5" rx="2" fill="#5FAD74"/>
      {/* Chair back */}
      <rect x="31" y="28" width="26" height="16" rx="3" fill="#4A9660"/>
      {/* Chair legs */}
      <rect x="32" y="47" width="3" height="12" rx="1.5" fill="#3A7A4E"/>
      <rect x="53" y="47" width="3" height="12" rx="1.5" fill="#3A7A4E"/>
      {/* Cushion highlight */}
      <rect x="33" y="31" width="22" height="10" rx="2" fill="#6CC984" opacity="0.5"/>
      {/* Handle */}
      <line x1="69" y1="69" x2="86" y2="88" stroke="#2E7A46" strokeWidth="7" strokeLinecap="round"/>
      <line x1="70" y1="68" x2="87" y2="87" stroke="#3A9055" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  </div>
);

/* ── Step 3 illustration: Buy/Rent/Barter cards ── */
const TransactionIllustration = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Buy card */}
      <rect x="10" y="10" width="88" height="24" rx="8" fill="white" stroke="#DDEAF8" strokeWidth="1.5"/>
      <circle cx="26" cy="22" r="9" fill="#4A90D9"/>
      <path d="M21 20h10M23 20l1 5h6l1-5M24 18h6" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <text x="40" y="26" fontSize="9" fill="#35190F" fontWeight="700">Buy</text>
      {/* Rent card */}
      <rect x="10" y="42" width="88" height="24" rx="8" fill="#4A90D9"/>
      <circle cx="26" cy="54" r="9" fill="white" opacity="0.25"/>
      <rect x="20" y="49" width="12" height="10" rx="2" fill="white" opacity="0.9"/>
      <line x1="23" y1="47" x2="23" y2="51" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="29" y1="47" x2="29" y2="51" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="40" y="58" fontSize="9" fill="white" fontWeight="700">Rent</text>
      {/* Barter card */}
      <rect x="10" y="74" width="88" height="24" rx="8" fill="white" stroke="#DDEAF8" strokeWidth="1.5"/>
      <circle cx="26" cy="86" r="9" fill="#E96B16"/>
      <path d="M21 83l5-2 5 4M21 89l5 2 5-4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
      <text x="40" y="90" fontSize="9" fill="#35190F" fontWeight="700">Barter</text>
    </svg>
  </div>
);

/* ── Step 4 illustration: Chat bubbles ── */
const ChatIllustration = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <Spark className="absolute top-2 right-4 opacity-60" />
    <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left bubble (orange/beige) */}
      <rect x="8" y="15" width="60" height="36" rx="12" fill="#F5E6D8"/>
      <circle cx="24" cy="33" r="4" fill="#C8906A"/>
      <circle cx="36" cy="33" r="4" fill="#C8906A"/>
      <circle cx="48" cy="33" r="4" fill="#C8906A"/>
      <path d="M15 51 L8 60 L22 51" fill="#F5E6D8"/>
      {/* Right bubble (purple) */}
      <rect x="30" y="58" width="62" height="36" rx="12" fill="#E8E0F5"/>
      <circle cx="50" cy="76" r="4" fill="#9B7EC8"/>
      <circle cx="62" cy="76" r="4" fill="#9B7EC8"/>
      <circle cx="74" cy="76" r="4" fill="#9B7EC8"/>
      <path d="M85 94 L92 103 L78 94" fill="#E8E0F5"/>
    </svg>
  </div>
);

/* ── Step 5 illustration: Box with checkmark ── */
const BoxIllustration = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <Spark className="absolute top-3 left-4 opacity-70" />
    <Spark className="absolute bottom-2 right-3 opacity-40 scale-75" />
    <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box body */}
      <path d="M16 52 L16 84 Q16 90 22 90 L78 90 Q84 90 84 84 L84 52 L50 68 Z" fill="#E8A57A"/>
      <path d="M16 52 L50 68 L50 90 L22 90 Q16 90 16 84 Z" fill="#CC8858"/>
      <path d="M84 52 L50 68 L50 90 L78 90 Q84 90 84 84 Z" fill="#D4906A"/>
      {/* Lid */}
      <path d="M16 52 L50 36 L84 52 L50 68 Z" fill="#F0B98E"/>
      <path d="M16 52 L50 36 L36 20 L2 34 Z" fill="#F0B98E" opacity="0.7"/>
      <path d="M84 52 L50 36 L64 20 L98 34 Z" fill="#E8A57A" opacity="0.7"/>
      {/* Green leaf */}
      <ellipse cx="30" cy="64" rx="5" ry="10" fill="#5FAD74" transform="rotate(-20 30 64)" opacity="0.9"/>
      <ellipse cx="70" cy="64" rx="5" ry="10" fill="#5FAD74" transform="rotate(20 70 64)" opacity="0.9"/>
      {/* Green checkmark circle */}
      <circle cx="72" cy="38" r="14" fill="#5FAD74"/>
      <path d="M65 38 L70 44 L80 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

/* ── Dashed connector arrow ── */
const DashedArrow = () => (
  <div className="flex items-center justify-center w-12 shrink-0 mt-[-24px]">
    <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
      <path d="M2 8 Q12 2 24 8 Q36 14 46 8" stroke="#E96B16" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round"/>
      <path d="M40 5 L46 8 L40 11" stroke="#E96B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

/* ── Step card ── */
type StepProps = {
  number: number;
  color: string;
  bg: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  cardBg: string;
};

const StepCard = ({ number, color, bg, title, description, illustration, cardBg }: StepProps) => (
  <div className="flex flex-col items-start flex-1 min-w-0">
    {/* Illustration card */}
    <div
      className="w-full rounded-2xl mb-4 overflow-hidden relative"
      style={{ background: cardBg, height: '148px' }}
    >
      {/* Number badge */}
      <div
        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-[14px] font-extrabold shadow-sm"
        style={{ background: color }}
      >
        {number}
      </div>
      {illustration}
    </div>

    {/* Text */}
    <h3 className="text-[15px] font-extrabold text-[#35190F] mb-1.5 leading-snug">{title}</h3>
    <p className="text-[13px] text-[#7A5C4A] leading-relaxed">{description}</p>
  </div>
);

const STEPS = [
  {
    number: 1,
    color: '#E96B16',
    cardBg: 'linear-gradient(135deg, #FFF4EC 0%, #FDEEDE 100%)',
    title: 'Create your listing',
    description: 'Add photos, condition and location — then choose Sell, Rent, Barter, or all three at once.',
    illustration: <PhoneIllustration />,
  },
  {
    number: 2,
    color: '#3D9E62',
    cardBg: 'linear-gradient(135deg, #F0FAF4 0%, #DFF2E8 100%)',
    title: 'Get discovered',
    description: 'Your item appears in Explore, category pages and nearby results with distance-aware ranking.',
    illustration: <MagnifyIllustration />,
  },
  {
    number: 3,
    color: '#4A90D9',
    cardBg: 'linear-gradient(135deg, #EEF5FD 0%, #DAEAF8 100%)',
    title: 'Buy, rent or swap',
    description: 'Buyers checkout instantly, renters pick dates with availability checks, and swappers propose exchanges with an optional cash difference.',
    illustration: <TransactionIllustration />,
  },
  {
    number: 4,
    color: '#8B6BC8',
    cardBg: 'linear-gradient(135deg, #F5F0FD 0%, #EBE0F8 100%)',
    title: 'Negotiate and counter',
    description: 'Every barter proposal keeps a full history — accept, reject or counter with cash on top.',
    illustration: <ChatIllustration />,
  },
  {
    number: 5,
    color: '#E96B16',
    cardBg: 'linear-gradient(135deg, #FFF4EC 0%, #FDEEDE 100%)',
    title: 'Complete and review',
    description: 'Deposits are held separately and released after return. Both sides rate each other afterwards.',
    illustration: <BoxIllustration />,
  },
];

/* ── Main Component ── */
const HowItWorks = () => (
  <section id="how-it-works" className="w-full bg-[#FAF7F2] py-16 px-4">
    <div className="max-w-[1200px] mx-auto">

      {/* ── Header ── */}
      <div className="relative flex flex-col items-center text-center mb-12">

        {/* Top-left decorative text */}
        <div
          className="absolute left-0 top-0 hidden lg:flex flex-col items-start leading-tight select-none pointer-events-none"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.15rem',
            color: '#C8B8AC',
            transform: 'rotate(-8deg) translateY(-4px)',
            lineHeight: 1.3,
          }}
        >
          <span>People</span>
          <span>Items</span>
          <span>Possibilities</span>
        </div>

        {/* Top-right decorative text */}
        <div
          className="absolute right-0 top-[-4px] hidden lg:flex flex-col items-center select-none pointer-events-none"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.15rem',
            color: '#35190F',
            transform: 'rotate(4deg)',
            lineHeight: 1.25,
          }}
        >
          <span>Same</span>
          <span>Things</span>
          <span>New Stories</span>
          <svg width="80" height="14" viewBox="0 0 80 14" fill="none" style={{ marginTop: '2px' }}>
            <path d="M4 6 C 25 1, 55 1, 76 6" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 11 C 28 7, 52 7, 72 11" stroke="#E96B16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <span className="text-[#E96B16] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
          Simple Steps
        </span>
        <h2 className="text-[2.6rem] font-extrabold text-[#35190F] leading-tight mb-3">
          How <span className="text-[#E96B16]">SWAPIC</span> works
        </h2>
        <p className="text-[#7A5C4A] text-[1rem]">
          One marketplace. Four ways to get what you need.
        </p>
      </div>

      {/* ── Steps row ── */}
      <div className="flex items-start gap-0">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.number}>
            <StepCard {...step} bg={step.cardBg} />
            {i < STEPS.length - 1 && <DashedArrow />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Safety banner ── */}
      <div
        className="mt-10 rounded-2xl flex items-center gap-5 px-8 py-5"
        style={{
          background: 'linear-gradient(135deg, #FFF4EC 0%, #FDEEDE 100%)',
          border: '1px solid rgba(233,107,22,0.15)',
        }}
      >
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(233,107,22,0.12)' }}
        >
          <Shield size={22} className="text-[#E96B16]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[15px] font-extrabold text-[#35190F] mb-0.5">Safety first.</p>
          <p className="text-[13.5px] text-[#7A5C4A] leading-relaxed">
            Never share your exact address publicly, meet in public places for handovers,
            and report any listing that looks fraudulent, stolen or prohibited.
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default HowItWorks;

