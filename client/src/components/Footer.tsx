'use client';
import { useState } from "react";
import { Repeat, Mail, ArrowRight, Leaf } from "lucide-react";

/* ── Social icons (inline SVG) ── */
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.264 5.636 5.9-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FOOTER_NAV = [
  {
    heading: "Marketplace",
    links: ["Explore", "Barter", "Rent", "Buy", "Categories"],
  },
  {
    heading: "Company",
    links: ["About", "How It Works", "Safety", "Community", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Help / FAQ", "Prohibited Items"],
  },
];

const Footer = ({ onExploreClick }: { onExploreClick?: () => void }) => {
  const [email, setEmail] = useState("");

  return (
    <footer className="w-full">

      {/* ── NEWSLETTER BANNER ──────────────────────────────────── */}
      <div className="w-full bg-[#FAF7F2] px-4 pt-10 pb-0">
        <div
          className="relative w-full max-w-[1400px] mx-auto rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-7"
          style={{
            background: "linear-gradient(135deg, #FFF4EC 0%, #FDE8D4 100%)",
            border: "1px solid rgba(233,107,22,0.12)",
          }}
        >
          {/* Left: icon + text */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
              <Leaf size={22} className="text-[#2E8B57]" strokeWidth={2} />
            </div>
            <div>
              <p className="font-extrabold text-[1.15rem] text-[#35190F] leading-tight">
                Be part of a kinder marketplace
              </p>
              <p className="text-[#654332] text-[0.88rem] mt-0.5">
                Get updates on new items, features and community stories.
              </p>
            </div>
          </div>

          {/* Right: email form */}
          <div className="flex flex-col items-start gap-1.5 w-full md:w-auto md:max-w-[420px]">
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-full px-4 h-[46px] shadow-sm gap-2 focus-within:ring-2 focus-within:ring-[#E96B16]/25 transition-all">
                <Mail size={16} className="text-gray-400 shrink-0" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-none outline-none text-[0.9rem] text-[#35190F] placeholder:text-gray-400"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#E96B16] hover:bg-[#d45d0f] active:scale-95 text-white font-bold text-[0.88rem] px-5 h-[46px] rounded-full transition-all whitespace-nowrap shadow-[0_4px_14px_rgba(233,107,22,0.3)]">
                Stay Updated
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-[#8B6A55] text-[0.78rem] pl-4">No spam. Just the good stuff.</p>
          </div>

          {/* Decorative leaf right */}
          <div
            className="absolute right-4 bottom-0 pointer-events-none opacity-30 hidden xl:block"
            style={{ transform: "rotate(-20deg)" }}
          >
            <Leaf size={100} className="text-[#E96B16]" strokeWidth={0.8} />
          </div>
        </div>
      </div>

      {/* ── DARK FOOTER ───────────────────────────────────────── */}
      <div className="w-full bg-[#FAF7F2] px-4 pt-6 pb-0">
        <div
          className="w-full max-w-[1400px] mx-auto rounded-t-[32px] overflow-hidden"
          style={{ background: "linear-gradient(160deg, #2E1408 0%, #1C0C03 100%)" }}
        >
          {/* Main grid */}
          <div className="px-8 md:px-12 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.6fr] gap-10">

            {/* Col 1: Brand */}
            <div className="flex flex-col gap-5">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Repeat size={20} className="text-white stroke-[2.5]" />
                </div>
                <span className="font-extrabold text-[1.2rem] text-white tracking-wide">SWAPIC</span>
              </div>

              <p className="text-[#C4A08A] text-[0.88rem] leading-relaxed max-w-[200px]">
                Trade What You Have,<br />
                Get What You Need &mdash;<br />
                No Money, Just Community.
              </p>

              {/* Socials */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <InstagramIcon />, label: "Instagram" },
                  { icon: <XIcon />, label: "X" },
                  { icon: <FacebookIcon />, label: "Facebook" },
                  { icon: <YoutubeIcon />, label: "YouTube" },
                  { icon: <LinkedinIcon />, label: "LinkedIn" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#C4A08A] hover:text-white transition-all"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {FOOTER_NAV.map(({ heading, links }) => (
              <div key={heading} className="flex flex-col gap-4">
                <p className="text-[#E96B16] text-[0.7rem] font-bold tracking-[0.2em] uppercase">
                  {heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[#C4A08A] hover:text-white text-[0.9rem] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Col 5: App download */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2E8B57]/20 flex items-center justify-center">
                  <Leaf size={16} className="text-[#5FAD74]" strokeWidth={2} />
                </div>
                <p className="font-extrabold text-white text-[0.95rem] leading-tight">
                  A more sustainable<br />tomorrow
                </p>
              </div>
              <p className="text-[#C4A08A] text-[0.82rem] leading-relaxed">
                Give items a new life. Reduce waste.<br />Strengthen community.
              </p>


            </div>

          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="border-t border-white/[0.07] mx-8 md:mx-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[#7A5A48] text-[0.8rem]">
              &copy; 2024 SWAPIC. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[#7A5A48] text-[0.8rem]">
              <Leaf size={13} className="text-[#5FAD74]" strokeWidth={2} />
              <span>People</span>
              <span className="text-[#E96B16]">&bull;</span>
              <span>Community</span>
              <span className="text-[#E96B16]">&bull;</span>
              <span>A Greener Planet</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;

