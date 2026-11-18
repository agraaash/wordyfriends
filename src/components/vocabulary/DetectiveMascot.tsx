import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface DetectiveMascotProps {
  message?: string;
  isThinking?: boolean;
  isCelebrating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DetectiveMascot: React.FC<DetectiveMascotProps> = ({
  message = "Hello, Detective! Let's find the missing clue together! 🔎",
  isThinking = false,
  isCelebrating = false,
  size = 'md',
}) => {
  const dimension = size === 'sm' ? 'w-20 h-20' : size === 'lg' ? 'w-36 h-36' : 'w-28 h-28';

  return (
    <div className="flex items-center gap-4 animate-fadeIn">
      {/* Crayon Boy Detective Vector Illustration */}
      <div className={`relative ${dimension} flex-shrink-0 select-none group`}>
        {/* Playful Crayon Sparkles & Glow */}
        <div className="absolute -top-2 -left-2 text-amber-400 animate-pulse text-lg">✨</div>
        <div className="absolute -bottom-1 -right-1 text-pink-400 animate-bounce text-sm">🖍️</div>

        {/* SVG Illustrated Crayon Character */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        >
          {/* Crayon Texture Definitions & Filters */}
          <defs>
            <filter id="crayon-roughness" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="hat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="coat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="lens-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background Soft Crayon Splash */}
          <circle cx="100" cy="105" r="75" fill="#FEF3C7" opacity="0.6" />
          <circle cx="140" cy="85" r="45" fill="#FCE7F3" opacity="0.7" />

          {/* Detective Boy Body / Coat */}
          <path
            d="M 60 150 Q 100 135 140 150 L 148 190 Q 100 198 52 190 Z"
            fill="url(#coat-grad)"
            stroke="#1E40AF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shirt Collar & Tie (Crayon Style) */}
          <path
            d="M 85 140 L 100 160 L 115 140 Z"
            fill="#FFFFFF"
            stroke="#1E3A8A"
            strokeWidth="2.5"
          />
          <path
            d="M 97 155 L 103 155 L 105 180 L 95 180 Z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="2"
          />

          {/* Detective Boy Cheerful Head */}
          <circle
            cx="100"
            cy="100"
            r="38"
            fill="#FDE68A"
            stroke="#D97706"
            strokeWidth="3.5"
          />

          {/* Cute Rosy Blush Cheeks */}
          <ellipse cx="78" cy="112" rx="7" ry="4.5" fill="#F472B6" opacity="0.6" />
          <ellipse cx="122" cy="112" rx="7" ry="4.5" fill="#F472B6" opacity="0.6" />

          {/* Hair Tufts (Playful messy brown crayon hair) */}
          <path
            d="M 66 85 Q 75 60 90 75 Q 105 58 120 75 Q 135 62 135 88"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="3"
          />

          {/* Happy Eyes */}
          {isCelebrating ? (
            /* Star-eyes celebration */
            <>
              <path d="M 80 96 L 85 105 L 75 105 Z" fill="#451A03" />
              <path d="M 120 96 L 125 105 L 115 105 Z" fill="#451A03" />
            </>
          ) : (
            /* Friendly Round Eyes */
            <>
              <circle cx="82" cy="98" r="4.5" fill="#1F2937" />
              <circle cx="84" cy="96" r="1.5" fill="#FFFFFF" />
              <circle cx="118" cy="98" r="4.5" fill="#1F2937" />
              <circle cx="120" cy="96" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cheerful Smile */}
          <path
            d={isCelebrating ? "M 88 116 Q 100 130 112 116" : "M 90 116 Q 100 125 110 116"}
            fill={isCelebrating ? "#EF4444" : "none"}
            stroke="#991B1B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Detective Sherlock Hat (Crayon Yellow/Amber with plaid band) */}
          <path
            d="M 52 82 C 55 45, 145 45, 148 82 C 160 84, 155 92, 140 88 C 100 82, 60 88, 48 88 C 40 88, 42 82, 52 82 Z"
            fill="url(#hat-grad)"
            stroke="#B45309"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Hat Ribbon */}
          <path
            d="M 58 78 Q 100 72 142 78 L 140 83 Q 100 77 60 83 Z"
            fill="#EF4444"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Hat Top Button */}
          <circle cx="100" cy="48" r="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />

          {/* Detective Magnifying Glass (Held proudly in hand) */}
          <g className={isThinking ? "animate-pulse" : "animate-wiggle"}>
            {/* Wooden Handle */}
            <path
              d="M 142 135 L 175 168"
              stroke="#92400E"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Glass Rim */}
            <circle
              cx="135"
              cy="125"
              r="26"
              fill="url(#lens-grad)"
              stroke="#F59E0B"
              strokeWidth="4.5"
            />
            {/* Inner Glass Flare Reflection */}
            <path
              d="M 122 112 A 18 18 0 0 1 148 116"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Little Mystery Question Mark in Lens */}
            <text
              x="131"
              y="133"
              fontSize="18"
              fontWeight="bold"
              fill="#D97706"
              opacity="0.8"
            >
              ?
            </text>
          </g>

          {/* Detective Hand holding Glass */}
          <circle cx="145" cy="140" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Speech Bubble with Pop of Color & Crayon feel */}
      <div className="relative flex-1 bg-white border-3 border-[#FED7AA] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xs text-left">
        {/* Speech Bubble Arrow */}
        <div className="absolute -left-2.5 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-10 border-r-white border-b-8 border-b-transparent z-10"></div>
        <div className="absolute -left-3.5 top-5.5 w-0 h-0 border-t-9 border-t-transparent border-r-12 border-r-[#FED7AA] border-b-9 border-b-transparent"></div>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
            Detective Leo's Clue
          </span>
          {isCelebrating && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-bounce">
              Super Solved! 🌟
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#78350F] leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};
