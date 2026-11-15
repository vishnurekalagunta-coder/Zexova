import React from 'react';
import { motion } from 'framer-motion';

export const FlexibleIllustrationBadges: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-[320px] sm:h-[380px] pointer-events-none select-none">
      
      {/* ─── 1. MOON & SUN BADGE (Top Right) ────────────────────────────── */}
      <motion.div
        className="absolute top-2 right-12 sm:right-16 z-20"
        animate={{
          y: [0, -7, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 filter drop-shadow-[0_12px_24px_rgba(251,191,36,0.22)]">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Sun Body & Glow */}
            <circle cx="76" cy="46" r="22" fill="#F59E0B" />
            <circle cx="76" cy="46" r="20" fill="#FBBF24" />
            {/* Sun Rays */}
            <g stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round">
              <line x1="76" y1="14" x2="76" y2="19" />
              <line x1="76" y1="73" x2="76" y2="78" />
              <line x1="44" y1="46" x2="49" y2="46" />
              <line x1="103" y1="46" x2="108" y2="46" />
              <line x1="53" y1="23" x2="57" y2="27" />
              <line x1="95" y1="65" x2="99" y2="69" />
              <line x1="53" y1="69" x2="57" y2="65" />
              <line x1="95" y1="27" x2="99" y2="23" />
            </g>
            {/* Crescent Moon Cuddling the Sun */}
            <path
              d="M52 24 C36 32 30 52 38 70 C46 88 66 94 82 86 C64 88 46 76 44 58 C42 42 48 30 52 24 Z"
              fill="#FDE68A"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Warm Moon Details */}
            <circle cx="48" cy="54" r="2.5" fill="#D97706" opacity="0.4" />
            <circle cx="56" cy="70" r="3" fill="#D97706" opacity="0.35" />
          </svg>
        </div>
      </motion.div>

      {/* ─── 2. VINTAGE TWIN-BELL ALARM CLOCK (Bottom Left / Mid) ────────── */}
      <motion.div
        className="absolute bottom-4 left-4 sm:left-8 z-30"
        animate={{
          y: [0, -5, 0],
          rotate: [0, -1.5, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.6,
        }}
      >
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 filter drop-shadow-[0_16px_32px_rgba(30,58,138,0.25)]">
          <svg viewBox="0 0 140 140" className="w-full h-full">
            {/* Clock Legs */}
            <line x1="42" y1="112" x2="28" y2="128" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <line x1="98" y1="112" x2="112" y2="128" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            
            {/* Clock Bells */}
            <ellipse cx="36" cy="38" rx="14" ry="11" transform="rotate(-32 36 38)" fill="#EA580C" stroke="#C2410C" strokeWidth="3" />
            <ellipse cx="104" cy="38" rx="14" ry="11" transform="rotate(32 104 38)" fill="#EA580C" stroke="#C2410C" strokeWidth="3" />
            {/* Hammer & Bracket */}
            <path d="M50 32 L70 24 L90 32" fill="none" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="70" cy="22" r="5" fill="#94A3B8" />

            {/* Clock Outer Rim */}
            <circle cx="70" cy="74" r="44" fill="#1E3A8A" stroke="#172554" strokeWidth="4" />
            <circle cx="70" cy="74" r="38" fill="#2563EB" />
            {/* Clock Face White Dial */}
            <circle cx="70" cy="74" r="32" fill="#FFFFFF" />

            {/* Dial Hour Ticks */}
            <line x1="70" y1="46" x2="70" y2="50" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="98" x2="70" y2="102" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="74" x2="46" y2="74" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="94" y1="74" x2="98" y2="74" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

            {/* Clock Hands pointing to ~10:10 */}
            <line x1="70" y1="74" x2="52" y2="58" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="70" y1="74" x2="88" y2="56" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="70" cy="74" r="3.5" fill="#EA580C" />
          </svg>
        </div>
      </motion.div>

      {/* ─── 3. DESK CALENDAR PAD (Bottom Right) ────────────────────────── */}
      <motion.div
        className="absolute bottom-6 right-2 sm:right-6 z-20"
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1.2, 0],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.1,
        }}
      >
        <div className="relative w-44 h-40 sm:w-48 sm:h-44 filter drop-shadow-[0_18px_36px_rgba(217,119,6,0.2)]">
          <svg viewBox="0 0 160 140" className="w-full h-full">
            {/* Calendar Stand & Base */}
            <polygon points="18,124 142,124 150,132 10,132" fill="#B45309" opacity="0.6" />
            
            {/* Calendar Paper Block */}
            <rect x="22" y="24" width="116" height="98" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <rect x="22" y="24" width="116" height="22" rx="6" fill="#F59E0B" />

            {/* Spiral Rings at Top */}
            <g stroke="#78350F" strokeWidth="3" strokeLinecap="round">
              <line x1="42" y1="16" x2="42" y2="30" />
              <line x1="64" y1="16" x2="64" y2="30" />
              <line x1="96" y1="16" x2="96" y2="30" />
              <line x1="118" y1="16" x2="118" y2="30" />
            </g>

            {/* Calendar Days Matrix with Circled Highlights */}
            {/* Row 1 */}
            <circle cx="44" cy="62" r="5" fill="#FDE68A" />
            <circle cx="68" cy="62" r="5" fill="#FDE68A" />
            <circle cx="92" cy="62" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="116" cy="62" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />

            {/* Row 2 */}
            <circle cx="44" cy="84" r="5" fill="#FDE68A" />
            <circle cx="68" cy="84" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="92" cy="84" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="116" cy="84" r="5" fill="#FDE68A" />

            {/* Row 3 */}
            <circle cx="44" cy="104" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="68" cy="104" r="5" fill="#FDE68A" />
            <circle cx="92" cy="104" r="7.5" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="116" cy="104" r="5" fill="#FDE68A" />
          </svg>
        </div>
      </motion.div>

    </div>
  );
};

