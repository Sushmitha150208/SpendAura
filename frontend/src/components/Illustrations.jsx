import React from 'react';

/**
 * SpendAura Floral & Aesthetic Vector Illustrations
 * Crafted to precisely match the warm, pastel, cozy look of the UI design.
 */

export const SpendAuraLogoIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="20" cy="20" r="18" fill="#FCE7EE" />
    <path
      d="M14 26C14 26 15 18 22 15C29 12 28 24 21 26C16 27.5 14 26 14 26Z"
      fill="url(#aura_grad1)"
    />
    <path
      d="M26 14C26 14 22 19 16 19C12 19 13 13 18 12C22 11 26 14 26 14Z"
      fill="url(#aura_grad2)"
      opacity="0.85"
    />
    <defs>
      <linearGradient id="aura_grad1" x1="14" y1="15" x2="28" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8325E" />
        <stop offset="1" stopColor="#581C38" />
      </linearGradient>
      <linearGradient id="aura_grad2" x1="13" y1="12" x2="26" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#A8325E" />
      </linearGradient>
    </defs>
  </svg>
);

export const LeafDonutCenterIcon = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M16 28C16 28 16 18 10 14C4 10 5 21 11 25C13.5 26.5 16 28 16 28Z"
      fill="#4E9F76"
    />
    <path
      d="M16 28C16 28 17 17 23 12C29 7 28 19 22 24C19 26.5 16 28 16 28Z"
      fill="#6BBF94"
    />
  </svg>
);

export const HeaderDeskIllustration = () => (
  <div className="relative w-full max-w-[420px] h-32 md:h-36 select-none pointer-events-none flex items-end justify-end">
    {/* Hanging trailing vines from top */}
    <div className="absolute -top-4 right-20 w-44 h-32 z-10">
      <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Main stem 1 */}
        <path d="M90 0 C 85 40, 110 70, 75 125" stroke="#487856" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Main stem 2 */}
        <path d="M125 0 C 130 35, 95 65, 110 110" stroke="#5B8E6A" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Leaves */}
        <ellipse cx="78" cy="30" rx="9" ry="14" transform="rotate(-30 78 30)" fill="#68A578" />
        <ellipse cx="100" cy="45" rx="10" ry="15" transform="rotate(25 100 45)" fill="#4E8C60" />
        <ellipse cx="75" cy="65" rx="11" ry="16" transform="rotate(-40 75 65)" fill="#78B688" />
        <ellipse cx="105" cy="80" rx="9" ry="14" transform="rotate(35 105 80)" fill="#5A966C" />
        <ellipse cx="70" cy="98" rx="8" ry="13" transform="rotate(-20 70 98)" fill="#447A53" />
        <ellipse cx="112" cy="105" rx="7" ry="12" transform="rotate(40 112 105)" fill="#68A578" />
        <ellipse cx="76" cy="122" rx="6" ry="10" transform="rotate(10 76 122)" fill="#8AC89B" />
        
        {/* Right branch leaves */}
        <ellipse cx="132" cy="25" rx="8" ry="13" transform="rotate(45 132 25)" fill="#5A966C" />
        <ellipse cx="118" cy="50" rx="9" ry="14" transform="rotate(-15 118 50)" fill="#72B083" />
        <ellipse cx="102" cy="70" rx="8" ry="12" transform="rotate(30 102 70)" fill="#4E8C60" />
      </svg>
    </div>

    {/* Desk surface */}
    <div className="relative w-full flex items-end justify-end space-x-3 pb-1">
      {/* Books stack */}
      <div className="flex flex-col items-center -space-y-1 mb-1">
        {/* Top book */}
        <div className="w-24 h-4 bg-[#581C38] rounded-sm shadow-sm flex items-center justify-center transform -rotate-1">
          <div className="w-16 h-0.5 bg-[#8C3F65] rounded"></div>
        </div>
        {/* Middle book */}
        <div className="w-26 h-4 bg-[#E07A5F] rounded-sm shadow-sm"></div>
        {/* Bottom book */}
        <div className="w-28 h-5 bg-[#E9ECEF] border border-gray-200 rounded-sm shadow-sm flex items-center px-1">
          <div className="w-full h-1 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Pencil Holder Cup */}
      <div className="relative flex flex-col items-center mb-1">
        {/* Pencils */}
        <div className="flex items-end justify-center space-x-1.5 -mb-2 z-0">
          <div className="w-1.5 h-9 bg-[#3B82F6] rounded-t-sm transform -rotate-12"></div>
          <div className="w-1.5 h-11 bg-[#F59E0B] rounded-t-sm transform -rotate-3"></div>
          <div className="w-1.5 h-10 bg-[#EC4899] rounded-t-sm transform rotate-8"></div>
        </div>
        {/* Cup */}
        <div className="w-10 h-12 bg-white rounded-b-md border border-gray-100 shadow-sm z-10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-pink-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-pink-300"></div>
          </div>
        </div>
      </div>

      {/* Desk Standing Calendar */}
      <div className="relative w-28 h-24 bg-white rounded-xl shadow-md border border-pink-100 flex flex-col p-2 mb-1 z-10">
        {/* Spiral top rings */}
        <div className="absolute -top-2 inset-x-0 flex justify-around px-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-2 h-3.5 rounded-full border-2 border-gray-700 bg-white"></div>
          ))}
        </div>
        
        {/* Calendar Grid & Red Checked Date */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 flex-1 items-center justify-items-center">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="w-3.5 h-2.5 bg-pink-50 rounded-sm"></div>
          ))}
          {/* Active checked circle */}
          <div className="w-5 h-5 bg-[#E76F51] rounded-full flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white">
              <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Wooden Desk Base Trim */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#D4A373] rounded-full opacity-80"></div>
    </div>
  </div>
);

export const PlantVaseSidebarIllustration = () => (
  <div className="relative w-full h-44 flex items-end justify-center overflow-hidden select-none pointer-events-none">
    {/* Soft wavy background layers */}
    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FADCE4]/60 to-transparent rounded-t-full"></div>
    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FEEBF0] rounded-full blur-sm"></div>
    <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#FEE2E8] rounded-full blur-sm"></div>

    <div className="relative z-10 flex flex-col items-center">
      {/* Leaves branching upwards */}
      <div className="w-28 h-28 -mb-4">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Main Central Stem */}
          <path d="M50 100 C 50 60, 48 40, 50 10" stroke="#375540" strokeWidth="2" strokeLinecap="round"/>
          <path d="M50 70 C 35 55, 25 45, 18 35" stroke="#375540" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M50 60 C 65 48, 75 40, 82 28" stroke="#375540" strokeWidth="1.8" strokeLinecap="round"/>
          
          {/* Oval leaves with eucalyptus shades */}
          <ellipse cx="50" cy="15" rx="7" ry="12" fill="#4C785B" />
          <ellipse cx="38" cy="35" rx="7" ry="11" transform="rotate(-30 38 35)" fill="#689E7B" />
          <ellipse cx="62" cy="32" rx="7" ry="11" transform="rotate(30 62 32)" fill="#548663" />
          
          <ellipse cx="22" cy="40" rx="6" ry="10" transform="rotate(-45 22 40)" fill="#7EAE8E" />
          <ellipse cx="78" cy="34" rx="6" ry="10" transform="rotate(45 78 34)" fill="#639874" />

          {/* Accent small peach berries */}
          <circle cx="44" cy="48" r="3" fill="#E79A88"/>
          <circle cx="58" cy="44" r="2.5" fill="#E79A88"/>
          <circle cx="30" cy="32" r="2.5" fill="#F4B5A5"/>
          <circle cx="70" cy="24" r="2.5" fill="#F4B5A5"/>
        </svg>
      </div>

      {/* Ceramic Blush Vase */}
      <div className="relative w-14 h-16 bg-gradient-to-b from-[#F2BBC9] to-[#E396A9] rounded-2xl shadow-md border border-white/60 flex items-center justify-center">
        {/* Neck */}
        <div className="absolute -top-2 w-7 h-3 bg-[#EAA5B6] rounded-t-lg border-t border-white/50"></div>
        {/* Subtle shine on vase */}
        <div className="absolute left-2 top-3 w-1.5 h-8 bg-white/40 rounded-full blur-[0.5px]"></div>
      </div>
    </div>
  </div>
);

export const LaptopGoalIllustration = () => (
  <div className="relative w-32 h-24 select-none pointer-events-none flex items-center justify-center">
    {/* Sparkling rays */}
    <div className="absolute -top-1 -right-1 text-amber-400 animate-pulse text-xs">✨</div>
    <div className="absolute top-4 -left-1 text-rose-400 text-xs">✦</div>

    <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      {/* Laptop Screen Bezel */}
      <rect x="25" y="15" width="90" height="58" rx="6" fill="#2E1825" stroke="#581C38" strokeWidth="2" />
      {/* Screen Display (Warm sunset/gradient) */}
      <rect x="29" y="19" width="82" height="50" rx="3" fill="url(#screen_grad)" />
      {/* Web browser mockup lines on screen */}
      <circle cx="36" cy="25" r="2" fill="#F87171" />
      <circle cx="43" cy="25" r="2" fill="#FBBF24" />
      <circle cx="50" cy="25" r="2" fill="#34D399" />
      <path d="M35 34 C 45 32, 60 48, 80 40 C 95 34, 102 46, 108 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      
      {/* Laptop Base & Keyboard Deck */}
      <path d="M10 76 L130 76 L120 86 C 119 88, 116 89, 114 89 L26 89 C 24 89, 21 88, 20 86 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
      {/* Trackpad */}
      <rect x="58" y="79" width="24" height="6" rx="1.5" fill="#CBD5E1"/>
      {/* Keyboard groove */}
      <rect x="30" y="75" width="80" height="2" fill="#94A3B8" opacity="0.6"/>

      <defs>
        <linearGradient id="screen_grad" x1="29" y1="19" x2="111" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="0.5" stopColor="#FB7185" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
