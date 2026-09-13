import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CatMood } from '../types';
import { playMeowSound } from '../utils/audio';

interface CatMascotProps {
  mood?: CatMood;
  equippedHatId?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  soundEnabled?: boolean;
  interactive?: boolean;
  speechText?: string | null;
  onPet?: () => void;
}

export const CatMascot: React.FC<CatMascotProps> = ({
  mood = 'idle',
  equippedHatId = null,
  size = 'lg',
  soundEnabled = true,
  interactive = true,
  speechText = null,
  onPet,
}) => {
  const [blinking, setBlinking] = useState(false);
  const [purring, setPurring] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  // Random natural eye blink loop
  useEffect(() => {
    if (mood === 'sleeping') return;
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [mood]);

  const handleCatClick = () => {
    if (!interactive) return;
    setPurring(true);
    playMeowSound(soundEnabled);
    if (onPet) onPet();

    // Spawn floating heart
    const newHeart = { id: Date.now(), x: (Math.random() - 0.5) * 60 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);

    setTimeout(() => setPurring(false), 1500);
  };

  const dimensions = {
    sm: { width: 120, height: 110 },
    md: { width: 180, height: 165 },
    lg: { width: 240, height: 220 },
    xl: { width: 300, height: 275 },
  }[size];

  const currentMood = purring ? 'happy' : mood;

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="mb-2 max-w-[240px] px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-orange-100 text-xs font-semibold text-stone-700 text-center relative z-20"
          >
            {speechText}
            {/* Bubble arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-orange-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts on pet */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 30, x: heart.x, scale: 0.6 }}
            animate={{ opacity: 0, y: -50, scale: 1.3 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/3 text-rose-500 font-bold text-xl drop-shadow-sm"
          >
            💖
          </motion.div>
        ))}
      </div>

      {/* Cat SVG Container */}
      <motion.div
        className={`relative ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} transition-transform duration-200`}
        onClick={handleCatClick}
        animate={
          currentMood === 'celebrating'
            ? { y: [0, -14, 0, -10, 0], rotate: [0, -3, 3, -2, 0] }
            : currentMood === 'focusing'
            ? { y: [0, -3, 0] }
            : currentMood === 'sleeping'
            ? { scale: [1, 1.02, 1] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: currentMood === 'celebrating' ? 1.2 : currentMood === 'focusing' ? 3.5 : currentMood === 'sleeping' ? 4 : 3,
          ease: 'easeInOut',
        }}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 260 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id="peachPatch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="greyPatch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <filter id="catShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#78350F" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Animated Tail */}
          <motion.path
            d="M 50 170 Q 20 180 25 210 Q 30 230 65 215"
            stroke="#FDBA74"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                'M 50 170 Q 20 180 25 210 Q 30 230 65 215',
                'M 50 170 Q 10 160 15 190 Q 25 210 65 215',
                'M 50 170 Q 20 180 25 210 Q 30 230 65 215',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          />

          <g filter="url(#catShadow)">
            {/* Body */}
            <path
              d="M 65 150 Q 55 220 130 220 Q 205 220 195 150 Z"
              fill="url(#bodyGrad)"
              stroke="#EA580C"
              strokeWidth="4"
            />
            {/* Calico Belly patch */}
            <path
              d="M 105 180 Q 130 215 155 180 Q 130 170 105 180 Z"
              fill="#FDE68A"
              opacity="0.6"
            />

            {/* Cat Ears */}
            {/* Left Ear */}
            <path
              d="M 60 110 L 45 45 L 105 80 Z"
              fill="url(#peachPatch)"
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M 62 100 L 52 58 L 95 82 Z" fill="#FDA4AF" opacity="0.8" />

            {/* Right Ear */}
            <path
              d="M 200 110 L 215 45 L 155 80 Z"
              fill="url(#bodyGrad)"
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M 198 100 L 208 58 L 165 82 Z" fill="#FDA4AF" opacity="0.8" />

            {/* Head */}
            <ellipse
              cx="130"
              cy="120"
              rx="76"
              ry="66"
              fill="url(#bodyGrad)"
              stroke="#EA580C"
              strokeWidth="4"
            />

            {/* Calico Head Patch */}
            <path
              d="M 60 95 Q 85 70 105 85 Q 90 125 55 118 Z"
              fill="url(#peachPatch)"
              opacity="0.9"
            />
            <path
              d="M 185 85 Q 205 95 198 115 Q 175 110 170 90 Z"
              fill="url(#greyPatch)"
              opacity="0.85"
            />

            {/* Whiskers */}
            <g stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
              <line x1="72" y1="126" x2="35" y2="120" />
              <line x1="72" y1="134" x2="32" y2="138" />
              <line x1="188" y1="126" x2="225" y2="120" />
              <line x1="188" y1="134" x2="228" y2="138" />
            </g>

            {/* Rosy Cheeks */}
            <ellipse cx="88" cy="136" rx="11" ry="7" fill="#FDA4AF" opacity="0.85" />
            <ellipse cx="172" cy="136" rx="11" ry="7" fill="#FDA4AF" opacity="0.85" />

            {/* Eyes based on mood */}
            {currentMood === 'sleeping' ? (
              // Sleeping eyes (-_-)
              <g stroke="#451A03" strokeWidth="3.5" strokeLinecap="round">
                <path d="M 94 122 Q 104 128 114 122" fill="none" />
                <path d="M 146 122 Q 156 128 166 122" fill="none" />
              </g>
            ) : currentMood === 'celebrating' || currentMood === 'happy' ? (
              // Joyful curved eyes (^_^)
              <g stroke="#451A03" strokeWidth="4" strokeLinecap="round">
                <path d="M 92 125 Q 104 112 116 125" fill="none" />
                <path d="M 144 125 Q 156 112 168 125" fill="none" />
                {/* Cheerful sparkles */}
                <circle cx="104" cy="110" r="2.5" fill="#F59E0B" />
                <circle cx="156" cy="110" r="2.5" fill="#F59E0B" />
              </g>
            ) : currentMood === 'focusing' ? (
              // Focused determined eyes with cute round glasses
              <g>
                <ellipse cx="104" cy="122" rx="9" ry="11" fill="#1C1917" />
                <circle cx="107" cy="118" r="3.5" fill="#FFFFFF" />
                <ellipse cx="156" cy="122" rx="9" ry="11" fill="#1C1917" />
                <circle cx="159" cy="118" r="3.5" fill="#FFFFFF" />
                {/* Cute focus glasses */}
                <circle cx="104" cy="122" r="14" fill="none" stroke="#D97706" strokeWidth="2.5" />
                <circle cx="156" cy="122" r="14" fill="none" stroke="#D97706" strokeWidth="2.5" />
                <line x1="118" y1="122" x2="142" y2="122" stroke="#D97706" strokeWidth="2.5" />
              </g>
            ) : blinking ? (
              // Blink line
              <g stroke="#451A03" strokeWidth="3.5" strokeLinecap="round">
                <line x1="94" y1="122" x2="114" y2="122" />
                <line x1="146" y1="122" x2="166" y2="122" />
              </g>
            ) : (
              // Normal big sparkly cat eyes
              <g>
                <ellipse cx="104" cy="121" rx="10" ry="13" fill="#1C1917" />
                <circle cx="107" cy="116" r="4.5" fill="#FFFFFF" />
                <circle cx="101" cy="126" r="2" fill="#FFFFFF" />

                <ellipse cx="156" cy="121" rx="10" ry="13" fill="#1C1917" />
                <circle cx="159" cy="116" r="4.5" fill="#FFFFFF" />
                <circle cx="153" cy="126" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Nose & Mouth */}
            <polygon points="130,130 125,124 135,124" fill="#FB7185" />
            <path
              d="M 123 134 Q 130 141 130 132 Q 130 141 137 134"
              stroke="#451A03"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Front Paws */}
            {currentMood === 'celebrating' ? (
              // Paws raised in celebration
              <g fill="url(#bodyGrad)" stroke="#EA580C" strokeWidth="3">
                <ellipse cx="85" cy="165" rx="12" ry="10" />
                <ellipse cx="175" cy="165" rx="12" ry="10" />
              </g>
            ) : (
              // Paws resting politely
              <g fill="url(#bodyGrad)" stroke="#EA580C" strokeWidth="3">
                <ellipse cx="112" cy="195" rx="12" ry="9" />
                <ellipse cx="148" cy="195" rx="12" ry="9" />
                {/* Toe dividers */}
                <line x1="110" y1="193" x2="110" y2="198" stroke="#EA580C" strokeWidth="1.5" />
                <line x1="115" y1="193" x2="115" y2="198" stroke="#EA580C" strokeWidth="1.5" />
                <line x1="145" y1="193" x2="145" y2="198" stroke="#EA580C" strokeWidth="1.5" />
                <line x1="150" y1="193" x2="150" y2="198" stroke="#EA580C" strokeWidth="1.5" />
              </g>
            )}

            {/* Golden Collar with Coin Bell */}
            <path d="M 98 160 Q 130 172 162 160" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="130" cy="168" r="8" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <text x="130" y="171" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle">
              🪙
            </text>
          </g>

          {/* Equipped Hat Overlay */}
          {equippedHatId && <HatGraphic hatId={equippedHatId} />}
        </svg>
      </motion.div>

      {/* Sleeping Zzz animation */}
      {currentMood === 'sleeping' && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: [0, 1, 0], x: [20, 35, 45], y: [-10, -25, -40] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
          className="absolute right-4 top-2 text-indigo-400 font-bold text-sm tracking-widest pointer-events-none"
        >
          Zzz...
        </motion.div>
      )}
    </div>
  );
};

// SVG Hat Graphic Renderer (Tailored specifically for each hat ID)
export const HatGraphic: React.FC<{ hatId: string }> = ({ hatId }) => {
  switch (hatId) {
    case 'scholar':
      return (
        <g id="hat-scholar">
          {/* Mortarboard square diamond */}
          <polygon points="130,32 185,50 130,66 75,50" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          {/* Cap skull cap under */}
          <ellipse cx="130" cy="62" rx="30" ry="12" fill="#0F172A" />
          {/* Button in center */}
          <circle cx="130" cy="49" r="3.5" fill="#F59E0B" />
          {/* Golden tassel */}
          <path d="M 130 49 Q 155 52 162 74" fill="none" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="160,74 164,74 165,85 159,85" fill="#F59E0B" />
        </g>
      );

    case 'crown':
      return (
        <g id="hat-crown">
          {/* Royal Crown base */}
          <path
            d="M 98 62 L 95 38 L 112 48 L 130 30 L 148 48 L 165 38 L 162 62 Z"
            fill="#EAB308"
            stroke="#CA8A04"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Red jewels */}
          <circle cx="130" cy="30" r="3.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <circle cx="95" cy="38" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
          <circle cx="165" cy="38" r="3" fill="#10B981" stroke="#047857" strokeWidth="1" />
          {/* Crown band pearls */}
          <ellipse cx="130" cy="60" rx="32" ry="5" fill="#CA8A04" />
          <circle cx="112" cy="60" r="2.5" fill="#FFFFFF" />
          <circle cx="130" cy="60" r="2.5" fill="#FFFFFF" />
          <circle cx="148" cy="60" r="2.5" fill="#FFFFFF" />
        </g>
      );

    case 'strawberry':
      return (
        <g id="hat-strawberry">
          {/* Strawberry body */}
          <path
            d="M 100 62 C 90 35 110 25 130 25 C 150 25 170 35 160 62 Z"
            fill="#F43F5E"
            stroke="#E11D48"
            strokeWidth="2.5"
          />
          {/* Seeds */}
          <circle cx="118" cy="40" r="1.5" fill="#FEF08A" />
          <circle cx="142" cy="40" r="1.5" fill="#FEF08A" />
          <circle cx="130" cy="48" r="1.5" fill="#FEF08A" />
          <circle cx="115" cy="54" r="1.5" fill="#FEF08A" />
          <circle cx="145" cy="54" r="1.5" fill="#FEF08A" />
          {/* Green leafy calyx & stem */}
          <path
            d="M 130 25 L 122 18 L 130 22 L 138 18 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          <path d="M 130 22 Q 133 12 128 8" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'wizard':
      return (
        <g id="hat-wizard">
          {/* Wizard brim */}
          <ellipse cx="130" cy="64" rx="42" ry="9" fill="#4338CA" stroke="#312E81" strokeWidth="2" />
          {/* Pointy cone with curve */}
          <path
            d="M 100 62 Q 115 15 148 10 Q 138 28 160 62 Z"
            fill="#6366F1"
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gold Stars and Moon */}
          <path
            d="M 126 34 Q 131 32 133 36 Q 130 38 126 34 Z"
            fill="#FDE047"
          />
          <circle cx="128" cy="48" r="2.5" fill="#FDE047" />
          {/* Gold belt band */}
          <ellipse cx="130" cy="61" rx="28" ry="4" fill="#F59E0B" />
        </g>
      );

    case 'cowboy':
      return (
        <g id="hat-cowboy">
          {/* Cowboy hat crown */}
          <path
            d="M 108 58 C 104 38 114 30 124 35 C 130 32 136 32 142 35 C 152 30 162 38 158 58 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="2.5"
          />
          {/* Hat band with star */}
          <ellipse cx="133" cy="57" rx="26" ry="4" fill="#78350F" />
          <polygon points="133,54 135,58 139,58 136,60 137,63 133,61 129,63 130,60 127,58 131,58" fill="#FBBF24" />
          {/* Curled brim */}
          <path
            d="M 85 58 Q 133 72 181 58 Q 185 50 175 54 Q 133 64 91 54 Q 81 50 85 58 Z"
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="2"
          />
        </g>
      );

    case 'flower_crown':
      return (
        <g id="hat-flower-crown">
          {/* Vine */}
          <path d="M 94 62 Q 130 68 166 62" stroke="#16A34A" strokeWidth="3" fill="none" />
          {/* Blossom 1 */}
          <circle cx="102" cy="60" r="6" fill="#F472B6" />
          <circle cx="102" cy="60" r="2.5" fill="#FEF08A" />
          {/* Blossom 2 */}
          <circle cx="120" cy="63" r="7" fill="#FB7185" />
          <circle cx="120" cy="63" r="3" fill="#FFFFFF" />
          {/* Blossom 3 */}
          <circle cx="140" cy="63" r="7" fill="#F472B6" />
          <circle cx="140" cy="63" r="3" fill="#FFFFFF" />
          {/* Blossom 4 */}
          <circle cx="158" cy="60" r="6" fill="#FB7185" />
          <circle cx="158" cy="60" r="2.5" fill="#FEF08A" />
        </g>
      );

    case 'frog_beanie':
      return (
        <g id="hat-frog-beanie">
          {/* Green beanie dome */}
          <path
            d="M 95 65 C 92 40 168 40 165 65 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2.5"
          />
          {/* Frog eyes */}
          <circle cx="108" cy="40" r="10" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
          <circle cx="108" cy="40" r="7" fill="#FFFFFF" />
          <circle cx="108" cy="40" r="4" fill="#1C1917" />
          <circle cx="110" cy="38" r="1.5" fill="#FFFFFF" />

          <circle cx="152" cy="40" r="10" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
          <circle cx="152" cy="40" r="7" fill="#FFFFFF" />
          <circle cx="152" cy="40" r="4" fill="#1C1917" />
          <circle cx="154" cy="38" r="1.5" fill="#FFFFFF" />

          {/* Frog rosy cheeks & smile on beanie */}
          <ellipse cx="112" cy="57" rx="3.5" ry="2" fill="#F87171" opacity="0.8" />
          <ellipse cx="148" cy="57" rx="3.5" ry="2" fill="#F87171" opacity="0.8" />
          <path d="M 124 57 Q 130 61 136 57" stroke="#15803D" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'pink_bow':
      return (
        <g id="hat-pink-bow">
          {/* Left loop */}
          <path d="M 130 54 Q 100 38 105 58 Q 112 68 130 58 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
          {/* Right loop */}
          <path d="M 130 54 Q 160 38 155 58 Q 148 68 130 58 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
          {/* Knot */}
          <circle cx="130" cy="56" r="6" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
          {/* Ribbon tails */}
          <path d="M 126 60 L 115 76 L 123 74 L 128 62" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
          <path d="M 134 60 L 145 76 L 137 74 L 132 62" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
        </g>
      );

    case 'top_hat':
      return (
        <g id="hat-top-hat">
          {/* Brim */}
          <ellipse cx="130" cy="65" rx="36" ry="7" fill="#0F172A" stroke="#020617" strokeWidth="2" />
          {/* Tall cylinder */}
          <path d="M 106 63 L 110 24 L 150 24 L 154 63 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <ellipse cx="130" cy="24" rx="20" ry="5" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
          {/* Red silk ribbon band */}
          <path d="M 107 57 L 106 63 L 154 63 L 153 57 Z" fill="#DC2626" />
        </g>
      );

    case 'chef_hat':
      return (
        <g id="hat-chef">
          {/* Puff clouds */}
          <path
            d="M 112 55 C 95 48 95 24 116 25 C 118 10 142 10 144 25 C 165 24 165 48 148 55 Z"
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="2.5"
          />
          {/* Pleated base band */}
          <rect x="110" y="52" width="40" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        </g>
      );

    case 'mushroom':
      return (
        <g id="hat-mushroom">
          {/* Toadstool dome */}
          <path
            d="M 94 62 C 90 28 170 28 166 62 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="2.5"
          />
          {/* Mushroom stem underneath */}
          <ellipse cx="130" cy="62" rx="34" ry="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          {/* White Polka dots */}
          <circle cx="112" cy="45" r="4.5" fill="#FFFFFF" />
          <circle cx="130" cy="38" r="5" fill="#FFFFFF" />
          <circle cx="148" cy="45" r="4.5" fill="#FFFFFF" />
          <circle cx="122" cy="52" r="3.5" fill="#FFFFFF" />
          <circle cx="138" cy="52" r="3.5" fill="#FFFFFF" />
        </g>
      );

    case 'party_hat':
      return (
        <g id="hat-party">
          {/* Cone */}
          <polygon points="130,12 104,64 156,64" fill="#A855F7" stroke="#7E22CE" strokeWidth="2.5" />
          {/* Stripes */}
          <path d="M 113 46 L 147 46" stroke="#FDE047" strokeWidth="4" />
          <path d="M 121 30 L 139 30" stroke="#38BDF8" strokeWidth="3" />
          {/* Fluffy Pom-pom on tip */}
          <circle cx="130" cy="11" r="5.5" fill="#F43F5E" stroke="#E11D48" strokeWidth="1.5" />
          {/* Bottom ruffle */}
          <ellipse cx="130" cy="64" rx="26" ry="4" fill="#FDE047" />
        </g>
      );

    case 'baseball_cap':
      return (
        <g id="hat-baseball">
          {/* Cap dome */}
          <path d="M 102 62 C 100 38 160 38 158 62 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
          {/* Top button */}
          <circle cx="130" cy="42" r="3" fill="#BAE6FD" />
          {/* Curved visor turned stylishly */}
          <path d="M 98 62 Q 130 70 162 62 Q 175 66 150 71 Q 120 72 98 62 Z" fill="#0369A1" stroke="#075985" strokeWidth="1.5" />
        </g>
      );

    case 'propeller':
      return (
        <g id="hat-propeller">
          {/* Multi-colored dome */}
          <path d="M 102 62 C 100 40 130 38 130 62 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <path d="M 130 62 C 130 38 160 40 158 62 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          {/* Pin */}
          <line x1="130" y1="42" x2="130" y2="28" stroke="#71717A" strokeWidth="3" />
          {/* Spinning Propeller Blades */}
          <ellipse cx="118" cy="28" rx="14" ry="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="142" cy="28" rx="14" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <circle cx="130" cy="28" r="3" fill="#EF4444" />
        </g>
      );

    default:
      return null;
  }
};
