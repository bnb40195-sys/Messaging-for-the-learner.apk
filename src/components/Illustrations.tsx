import React from 'react';

/**
 * Clean Academic Blue / Sky / Emerald SVG illustrations with zero purple/pink/lavender tones.
 */

export const HomeHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ambient Glow */}
    <ellipse cx="200" cy="220" rx="160" ry="40" fill="#DBEAFE" fillOpacity="0.85" />

    {/* Floating Graduation Cap (Top Left) */}
    <g transform="translate(60, 40) rotate(-15)">
      <polygon points="40,25 75,40 40,55 5,40" fill="#2563EB" />
      <polygon points="75,40 40,55 5,40 40,48" fill="#1D4ED8" />
      <path d="M25 50 V68 C25 78, 55 78, 55 68 V50" fill="#1E40AF" />
      <path d="M40 25 V45 L48 55" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="48" cy="55" r="3" fill="#FBBF24" />
    </g>

    {/* Floating Book (Top Center) */}
    <g transform="translate(190, 30) rotate(20)">
      <rect x="0" y="0" width="48" height="64" rx="4" fill="#2563EB" />
      <rect x="6" y="8" width="36" height="48" rx="2" fill="#FFFFFF" fillOpacity="0.2" />
      <line x1="12" y1="20" x2="36" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="28" x2="30" y2="28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="36" x2="26" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Megaphone / Announcement (Top Right) */}
    <g transform="translate(260, 50) rotate(-10)">
      <polygon points="20,25 50,10 50,50 20,35" fill="#0EA5E9" />
      <ellipse cx="50" cy="30" rx="4" ry="20" fill="#38BDF8" />
      <path d="M20 25 H8 V35 H20" fill="#0284C7" />
      <path d="M12 35 L8 48 H16 L18 35" fill="#0369A1" />
    </g>

    {/* Laptop Device */}
    <g transform="translate(110, 65)">
      <rect x="15" y="10" width="150" height="100" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="4" />
      <rect x="23" y="18" width="134" height="84" rx="3" fill="#F8FAFC" />

      {/* Video Lesson Mockup */}
      <rect x="30" y="26" width="42" height="30" rx="4" fill="#DBEAFE" />
      <polygon points="48,35 58,41 48,47" fill="#2563EB" />
      <line x1="80" y1="30" x2="148" y2="30" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="38" x2="135" y2="38" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" />
      <line x1="80" y1="46" x2="142" y2="46" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" />

      {/* Playlist rows */}
      <rect x="30" y="64" width="118" height="12" rx="3" fill="#EFF6FF" />
      <polygon points="36,68 42,70 36,72" fill="#2563EB" />
      <rect x="30" y="80" width="118" height="12" rx="3" fill="#EFF6FF" />
      <polygon points="36,84 42,86 36,88" fill="#10B981" />

      {/* Laptop Base */}
      <path d="M0 110 H180 L195 118 H-15 L0 110 Z" fill="#2563EB" />
      <rect x="75" y="112" width="30" height="3" rx="1.5" fill="#1E3A8A" />
    </g>

    {/* Stack of books below laptop */}
    <g transform="translate(115, 175)">
      <rect x="10" y="24" width="80" height="14" rx="3" fill="#10B981" />
      <rect x="14" y="26" width="72" height="10" rx="2" fill="#ECFDF5" />
      <rect x="15" y="12" width="74" height="14" rx="3" fill="#FBBF24" />
      <rect x="19" y="14" width="66" height="10" rx="2" fill="#FFFBEB" />
      <rect x="22" y="0" width="70" height="14" rx="3" fill="#3B82F6" />
      <rect x="26" y="2" width="62" height="10" rx="2" fill="#EFF6FF" />
    </g>

    {/* Accent star */}
    <polygon points="240,48 243,53 248,53 244,57 246,62 240,58 234,62 236,57 232,53 237,53" fill="#F59E0B" />
  </svg>
);

export const RegistrationIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="240" rx="150" ry="30" fill="#DBEAFE" fillOpacity="0.85" />

    {/* Study Desk */}
    <rect x="100" y="160" width="200" height="8" rx="4" fill="#1E3A8A" />
    <rect x="110" y="168" width="6" height="70" fill="#1D4ED8" />
    <rect x="284" y="168" width="6" height="70" fill="#1D4ED8" />

    {/* Desktop Monitor */}
    <g transform="translate(160, 90)">
      <rect x="10" y="0" width="100" height="66" rx="5" fill="#38BDF8" stroke="#1E40AF" strokeWidth="3" />
      <rect x="16" y="6" width="88" height="54" rx="2" fill="#F0F9FF" />
      <circle cx="60" cy="24" r="8" fill="#2563EB" />
      <rect x="45" y="36" width="30" height="5" rx="2.5" fill="#F59E0B" />
      <rect x="35" y="44" width="50" height="4" rx="2" fill="#93C5FD" />
      <rect x="55" y="66" width="10" height="14" fill="#1E40AF" />
      <ellipse cx="60" cy="80" rx="20" ry="4" fill="#1E3A8A" />
    </g>

    {/* Student Character */}
    <g transform="translate(130, 95)">
      <circle cx="50" cy="30" r="14" fill="#FCD34D" />
      <path d="M38 25 C38 16, 62 16, 62 25 C62 30, 56 26, 50 26 C44 26, 38 30, 38 25 Z" fill="#0F172A" />
      <path d="M36 44 C36 40, 64 40, 64 44 L70 95 H30 Z" fill="#2563EB" />
      <path d="M60 52 L80 72 L95 72" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="97" cy="72" r="5" fill="#FCD34D" />
      <rect x="18" y="50" width="14" height="45" rx="5" fill="#1D4ED8" />
      <rect x="23" y="95" width="4" height="40" fill="#1E3A8A" />
      <rect x="42" y="95" width="8" height="35" fill="#0F172A" />
      <ellipse cx="50" cy="130" rx="9" ry="5" fill="#F59E0B" />
    </g>

    {/* Desk Plant */}
    <g transform="translate(112, 125)">
      <polygon points="10,25 24,25 20,38 14,38" fill="#F59E0B" />
      <path d="M17 25 C14 12, 6 16, 8 25" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 25 C18 10, 26 12, 23 25" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 25 V14" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    </g>

    {/* Desk Calendar */}
    <g transform="translate(260, 132)">
      <polygon points="8,0 28,0 32,28 4,28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="7" y="2" width="22" height="4" fill="#EF4444" />
      <line x1="8" y1="12" x2="28" y2="12" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="8" y1="18" x2="28" y2="18" stroke="#CBD5E1" strokeWidth="2" />
    </g>
  </svg>
);

export const DocumentsIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="240" rx="150" ry="30" fill="#DBEAFE" fillOpacity="0.85" />

    <g transform="translate(130, 80) rotate(-10)">
      <rect x="0" y="0" width="70" height="90" rx="4" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
      <line x1="10" y1="18" x2="60" y2="18" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="28" x2="50" y2="28" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="36" x2="55" y2="36" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    <g transform="translate(200, 75) rotate(12)">
      <rect x="0" y="0" width="70" height="90" rx="4" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
      <line x1="10" y1="18" x2="40" y2="18" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="28" x2="58" y2="28" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="36" x2="52" y2="36" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="44" x2="45" y2="44" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Blue Document Folder */}
    <g transform="translate(130, 110)">
      <path d="M10 20 H55 L68 35 H150 C155 35, 160 40, 160 45 V110 C160 115, 155 120, 150 120 H10 C5 120, 0 115, 0 110 V30 C0 25, 5 20, 10 20 Z" fill="#1D4ED8" />
      <path d="M0 50 C0 45, 5 40, 10 40 H150 C155 40, 160 45, 160 50 V110 C160 115, 155 120, 150 120 H10 C5 120, 0 115, 0 110 Z" fill="#3B82F6" />
      <circle cx="28" cy="85" r="14" fill="#60A5FA" />
      <path d="M22 85 C22 90, 34 90, 34 85" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Person Inspecting */}
    <g transform="translate(250, 105)">
      <circle cx="60" cy="30" r="12" fill="#FCD34D" />
      <path d="M50 25 C50 18, 70 18, 70 25 C70 28, 65 26, 60 26 Z" fill="#0F172A" />
      <path d="M48 42 C48 38, 72 38, 72 42 L76 90 H44 Z" fill="#2563EB" />
      <path d="M48 50 L10 40" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" />
      <rect x="46" y="90" width="8" height="42" fill="#1E40AF" />
      <rect x="62" y="90" width="8" height="42" fill="#1E40AF" />
      <ellipse cx="48" cy="133" rx="7" ry="4" fill="#0F172A" />
      <ellipse cx="68" cy="133" rx="7" ry="4" fill="#0F172A" />
    </g>

    {/* Magnifying Glass */}
    <g transform="translate(195, 75)">
      <circle cx="50" cy="50" r="38" stroke="#0F172A" strokeWidth="9" fill="#FFFFFF" fillOpacity="0.4" />
      <line x1="77" y1="77" x2="115" y2="115" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
    </g>
  </svg>
);

export const HomeworkIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="240" rx="150" ry="30" fill="#DBEAFE" fillOpacity="0.85" />

    <g transform="translate(265, 90)">
      <path d="M70 10 H15 L45 50 L15 90 H70" stroke="#93C5FD" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <g transform="translate(195, 70)">
      <rect x="0" y="0" width="76" height="28" rx="6" fill="#2563EB" />
      <text x="38" y="19" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
        7X8=56
      </text>
    </g>

    <g transform="translate(85, 75)">
      <rect x="10" y="10" width="180" height="115" rx="8" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="4" />
      <rect x="18" y="18" width="164" height="99" rx="4" fill="#F8FAFC" />

      <g transform="translate(28, 28)">
        <polyline points="0,8 4,12 12,2" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="8" x2="65" y2="8" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

        <polyline points="0,22 4,26 12,16" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="22" x2="60" y2="22" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

        <polyline points="0,36 4,40 12,30" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="36" x2="70" y2="36" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

        <polyline points="0,50 4,54 12,44" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="50" x2="55" y2="50" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      </g>

      <polygon points="140,40 165,75 125,75" fill="none" stroke="#0EA5E9" strokeWidth="2.5" />
      <line x1="140" y1="40" x2="140" y2="75" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="3,3" />

      <path d="M-5 125 H205 L218 135 H-18 L-5 125 Z" fill="#2563EB" />
    </g>

    <g transform="translate(170, 115)">
      <circle cx="30" cy="20" r="11" fill="#FCD34D" />
      <path d="M22 16 C22 10, 38 10, 38 16 C38 20, 34 18, 30 18 Z" fill="#92400E" />
      <path d="M18 31 C18 28, 42 28, 42 31 L46 60 H14 Z" fill="#0EA5E9" />
      <path d="M12 60 C12 60, 48 60, 48 60 C55 68, 5 68, 12 60 Z" fill="#1E3A8A" />
      <rect x="20" y="44" width="22" height="15" rx="2" fill="#0F172A" />
      <circle cx="31" cy="51" r="2" fill="#60A5FA" />
    </g>

    <g transform="translate(140, 185)">
      <path d="M10 20 C35 15, 60 18, 60 25 C60 18, 85 15, 110 20 L105 32 C85 27, 60 30, 60 35 C60 30, 35 27, 15 32 Z" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
      <rect x="5" y="32" width="110" height="12" rx="3" fill="#1D4ED8" />
    </g>
  </svg>
);

export const MiddleSchoolIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="240" rx="150" ry="30" fill="#DBEAFE" fillOpacity="0.85" />

    <g transform="translate(180, 50)">
      <circle cx="50" cy="35" r="14" fill="#FBBF24" />
      <rect x="46" y="49" width="8" height="5" rx="1" fill="#78350F" />
      <line x1="50" y1="16" x2="50" y2="10" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <line x1="33" y1="23" x2="28" y2="19" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <line x1="67" y1="23" x2="72" y2="19" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />

      {/* DNA Helix */}
      <path d="M10 15 Q20 25 10 35 Q0 45 10 55" stroke="#2563EB" strokeWidth="2.5" fill="none" />
      <path d="M15 15 Q5 25 15 35 Q25 45 15 55" stroke="#10B981" strokeWidth="2.5" fill="none" />

      <path d="M28 20 H34 L40 32 C41 34, 40 37, 36 37 H26 C22 37, 21 34, 22 32 Z" fill="#38BDF8" />

      <circle cx="80" cy="45" r="9" fill="#64748B" />
      <circle cx="80" cy="45" r="4" fill="#FFFFFF" />
      <circle cx="95" cy="55" r="7" fill="#94A3B8" />
      <circle cx="95" cy="55" r="3" fill="#FFFFFF" />

      <text x="75" y="75" fill="#334155" fontSize="11" fontWeight="bold" fontFamily="monospace">E=mc²</text>
    </g>

    <g transform="translate(155, 110)">
      <circle cx="45" cy="30" r="14" fill="#FCD34D" />
      <path d="M34 26 C34 16, 56 16, 56 26 C56 30, 50 26, 45 26 C40 26, 34 30, 34 26 Z" fill="#0F172A" />
      <circle cx="40" cy="30" r="4.5" stroke="#0F172A" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="30" r="4.5" stroke="#0F172A" strokeWidth="1.5" fill="none" />
      <line x1="44.5" y1="30" x2="45.5" y2="30" stroke="#0F172A" strokeWidth="1.5" />

      <path d="M30 45 C30 40, 60 40, 60 45 L64 88 H26 Z" fill="#0EA5E9" />

      <path d="M32 75 L45 85 L58 75 L70 82 L55 98 L45 89 L35 98 Z" fill="#1E293B" />
      <path d="M45 85 L45 92" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>

    <g transform="translate(110, 165)">
      <rect x="0" y="24" width="45" height="10" rx="2" fill="#1E293B" />
      <text x="22" y="31" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">MATH</text>

      <rect x="2" y="14" width="43" height="10" rx="2" fill="#2563EB" />
      <text x="22" y="21" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">ENGLISH</text>

      <rect x="4" y="4" width="41" height="10" rx="2" fill="#059669" />
      <text x="22" y="11" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">SCIENCE</text>
    </g>

    <g transform="translate(230, 160)">
      <rect x="5" y="5" width="55" height="35" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="32" cy="22" r="3" fill="#FFFFFF" />
      <rect x="0" y="40" width="65" height="4" rx="2" fill="#64748B" />
    </g>
  </svg>
);

export const SecondarySchoolIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-48' }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="200" cy="240" rx="150" ry="30" fill="#DBEAFE" fillOpacity="0.85" />

    <g transform="translate(100, 60)">
      <rect x="0" y="20" width="80" height="4" fill="#CBD5E1" />
      <rect x="10" y="4" width="6" height="16" fill="#2563EB" />
      <rect x="18" y="7" width="5" height="13" fill="#10B981" />
      <rect x="25" y="2" width="7" height="18" fill="#60A5FA" />

      <rect x="50" y="-10" width="30" height="25" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="65" cy="2" r="6" fill="#E2E8F0" />

      <path d="M0 80 L35 30 L45 40" stroke="#64748B" strokeWidth="3" fill="none" />
      <polygon points="35,22 55,35 45,45" fill="#2563EB" />

      <rect x="22" y="75" width="12" height="12" rx="2" fill="#3B82F6" />
      <circle cx="28" cy="72" r="7" fill="#10B981" />
    </g>

    <g transform="translate(180, 95)">
      <circle cx="50" cy="30" r="13" fill="#FCD34D" />
      <path d="M38 25 C38 15, 62 15, 62 25 C62 30, 56 26, 50 26 Z" fill="#0F172A" />
      <rect x="62" y="27" width="3" height="6" rx="1" fill="#0F172A" />

      {/* Blue Hoodie */}
      <path d="M34 44 C34 40, 66 40, 66 44 L70 95 H30 Z" fill="#2563EB" />

      <rect x="0" y="58" width="46" height="32" rx="3" fill="#0F172A" />
      <circle cx="23" cy="74" r="3" fill="#60A5FA" />
      <rect x="-8" y="90" width="60" height="4" rx="2" fill="#475569" />

      <g transform="translate(75, 55)">
        <ellipse cx="20" cy="35" rx="12" ry="16" fill="#1E293B" />
        <circle cx="20" cy="18" r="9" fill="#1E293B" />
        <polygon points="12,14 16,6 18,14" fill="#1E293B" />
        <polygon points="22,14 24,6 28,14" fill="#1E293B" />
        <path d="M28 45 C40 40, 35 25, 38 20" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </g>

    <g transform="translate(235, 75)">
      <ellipse cx="20" cy="15" rx="18" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="14" cy="15" r="2" fill="#94A3B8" />
      <circle cx="20" cy="15" r="2" fill="#94A3B8" />
      <circle cx="26" cy="15" r="2" fill="#94A3B8" />
    </g>
  </svg>
);
