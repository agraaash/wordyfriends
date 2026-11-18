import React from 'react';
import { SituationCard } from '../../types';

interface CartoonSceneCardProps {
  situation: SituationCard;
}

export const CartoonSceneCard: React.FC<CartoonSceneCardProps> = ({ situation }) => {
  const { cartoonType, title, emoji } = situation;

  // Custom rich colorful crayon/cartoon illustrated scenes
  const renderIllustration = () => {
    switch (cartoonType) {
      case 'rabbit_garden':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F3" />
                <stop offset="100%" stopColor="#FFE4E9" />
              </linearGradient>
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D8F3DC" />
                <stop offset="100%" stopColor="#B7E4C7" />
              </linearGradient>
            </defs>
            {/* Sky */}
            <rect width="400" height="170" fill="url(#skyGrad)" />
            {/* Sun */}
            <circle cx="340" cy="50" r="28" fill="#FDE68A" />
            <circle cx="340" cy="50" r="38" fill="#FEF3C7" opacity="0.5" />
            {/* Clouds */}
            <path d="M50 45 Q65 30 85 45 Q105 30 120 45 Q130 55 115 65 Q95 70 70 65 Z" fill="#FFFFFF" opacity="0.9" />
            <path d="M220 35 Q235 20 255 35 Q275 25 290 40 Q295 50 280 55 Q260 60 230 55 Z" fill="#FFFFFF" opacity="0.85" />
            {/* Hills/Grass */}
            <ellipse cx="200" cy="230" rx="260" ry="80" fill="url(#grassGrad)" />
            <ellipse cx="60" cy="220" rx="140" ry="60" fill="#95D5B2" opacity="0.6" />

            {/* Tulips & Flowers */}
            {/* Tulip 1 */}
            <path d="M40 210 Q45 180 50 170" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />
            <path d="M40 170 C35 150, 65 150, 60 170 C60 185, 40 185, 40 170 Z" fill="#FF8DA1" />
            {/* Tulip 2 */}
            <path d="M90 220 Q95 190 90 175" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 175 C75 155, 105 155, 100 175 C100 190, 80 190, 80 175 Z" fill="#F472B6" />
            {/* Sunflower */}
            <path d="M330 220 Q335 180 340 160" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />
            <circle cx="340" cy="155" r="16" fill="#FBBF24" />
            <circle cx="340" cy="155" r="9" fill="#92400E" />
            {/* Strawberries */}
            <path d="M290 205 C285 190, 310 190, 305 205 C300 215, 290 215, 290 205 Z" fill="#EF4444" />
            <polygon points="295,190 300,185 305,190" fill="#22C55E" />

            {/* Butterfly */}
            <g transform="translate(130, 80)">
              <ellipse cx="0" cy="0" rx="2" ry="7" fill="#7D5A61" />
              <path d="M-2 -3 C-12 -12, -15 0, -2 0 Z" fill="#F472B6" opacity="0.9" />
              <path d="M2 -3 C12 -12, 15 0, 2 0 Z" fill="#60A5FA" opacity="0.9" />
              <path d="M-2 1 C-10 6, -10 12, -2 3 Z" fill="#FBBF24" opacity="0.9" />
              <path d="M2 1 C10 6, 10 12, 2 3 Z" fill="#34D399" opacity="0.9" />
            </g>

            {/* The Fluffy Joyful Jumping Rabbit! */}
            <g transform="translate(195, 110)">
              {/* Jumping motion lines */}
              <path d="M-30 45 Q-15 55 0 50" stroke="#FF8DA1" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="3 3" />
              <path d="M-40 35 Q-20 45 -5 40" stroke="#FF8DA1" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="2 2" />

              {/* Rabbit Body (White & fluffy) */}
              <ellipse cx="0" cy="10" rx="26" ry="20" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="3" />
              {/* Fluffy tail */}
              <circle cx="-25" cy="12" r="9" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="2" />
              {/* Rabbit Head */}
              <circle cx="20" cy="-6" r="17" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="3" />
              {/* Ears */}
              <g transform="rotate(-15, 15, -20)">
                <ellipse cx="15" cy="-28" rx="6" ry="17" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="2.5" />
                <ellipse cx="15" cy="-28" rx="3.5" ry="12" fill="#FFB6C1" />
              </g>
              <g transform="rotate(10, 25, -20)">
                <ellipse cx="25" cy="-28" rx="6" ry="17" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="2.5" />
                <ellipse cx="25" cy="-28" rx="3.5" ry="12" fill="#FFB6C1" />
              </g>
              {/* Eyes */}
              <circle cx="25" cy="-7" r="2.5" fill="#7D5A61" />
              <circle cx="26" cy="-8" r="0.8" fill="#FFFFFF" />
              {/* Cheerful Nose & Smile */}
              <polygon points="32,-3 35,-3 33.5,-1" fill="#FF8DA1" />
              <path d="M31 1 Q33.5 4 36 1" stroke="#7D5A61" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Rosy Cheek */}
              <circle cx="22" cy="-1" r="3.5" fill="#FFB6C1" opacity="0.6" />
              {/* Paws */}
              <ellipse cx="12" cy="26" rx="6" ry="11" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="2" transform="rotate(25, 12, 26)" />
              <ellipse cx="-10" cy="26" rx="7" ry="12" fill="#FFFFFF" stroke="#FFD1DC" strokeWidth="2" transform="rotate(-20, -10, 26)" />
            </g>
          </svg>
        );

      case 'treasure_can':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <rect width="400" height="240" fill="#2B2129" />
            {/* Wooden Workbench */}
            <rect x="0" y="160" width="400" height="80" fill="#5C3D2E" />
            <line x1="0" y1="160" x2="400" y2="160" stroke="#8B5E3C" strokeWidth="4" />
            <line x1="0" y1="190" x2="400" y2="190" stroke="#3D281E" strokeWidth="2" />

            {/* Glowing magic stardust swirl */}
            <path
              d="M170 140 Q130 90 180 50 Q240 20 260 70 Q280 120 220 130"
              stroke="#FDE68A"
              strokeWidth="4"
              fill="none"
              strokeDasharray="4 4"
              className="animate-pulse"
            />

            {/* Mystery Silver Tin Can */}
            <g transform="translate(160, 105)">
              <ellipse cx="40" cy="65" rx="35" ry="12" fill="#9CA3AF" />
              <rect x="5" y="15" width="70" height="50" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
              <ellipse cx="40" cy="15" rx="35" ry="12" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
              {/* Colorful retro label */}
              <rect x="8" y="25" width="64" height="25" fill="#FF8DA1" rx="4" />
              <text x="40" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                MYSTERY ★
              </text>

              {/* Popped open lid hovering */}
              <g transform="translate(30, -35) rotate(-25)">
                <ellipse cx="20" cy="10" rx="32" ry="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
                <circle cx="20" cy="10" r="5" fill="#D1D5DB" />
              </g>
            </g>

            {/* Bursting Golden Gears & Gadgets */}
            <g transform="translate(190, 60)">
              {/* Gear 1 */}
              <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="5" fill="#FEF3C7" />
              {/* Gear 2 */}
              <circle cx="35" cy="-20" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="35" cy="-20" r="3.5" fill="#D1FAE5" />
              {/* Compass / crystal */}
              <polygon points="-30,-15 -25,-30 -20,-15 -25,0" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
              {/* Sparkling stars */}
              <text x="-40" y="25" fill="#FDE68A" fontSize="16">✨</text>
              <text x="45" y="10" fill="#FDE68A" fontSize="18">🌟</text>
              <text x="10" y="-35" fill="#F472B6" fontSize="16">💫</text>
            </g>
          </svg>
        );

      case 'puppy_bakery':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <rect width="400" height="150" fill="#FFF5F5" />
            <rect width="400" height="90" y="150" fill="#FED7AA" />
            {/* Kitchen Shelves */}
            <line x1="20" y1="50" x2="380" y2="50" stroke="#D97706" strokeWidth="4" />
            {/* Jam Jars */}
            <rect x="50" y="25" width="22" height="25" fill="#EF4444" rx="3" />
            <rect x="80" y="28" width="20" height="22" fill="#8B5CF6" rx="3" />
            {/* Rolling pin */}
            <rect x="280" y="38" width="60" height="8" fill="#F59E0B" rx="3" />

            {/* Chef Puppy */}
            <g transform="translate(130, 70)">
              {/* Body */}
              <ellipse cx="40" cy="70" rx="25" ry="30" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Paws on counter */}
              <ellipse cx="65" cy="80" rx="8" ry="12" fill="#F59E0B" />
              <ellipse cx="15" cy="80" rx="8" ry="12" fill="#F59E0B" />
              {/* Head */}
              <circle cx="40" cy="35" r="22" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Floppy Ears */}
              <ellipse cx="18" cy="40" rx="8" ry="16" fill="#D97706" transform="rotate(-15, 18, 40)" />
              <ellipse cx="62" cy="40" rx="8" ry="16" fill="#D97706" transform="rotate(15, 62, 40)" />
              {/* Eyes */}
              <circle cx="33" cy="32" r="3" fill="#451A03" />
              <circle cx="47" cy="32" r="3" fill="#451A03" />
              {/* Nose & Smile */}
              <circle cx="40" cy="40" r="4" fill="#451A03" />
              <path d="M37 44 Q40 48 43 44" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Rosy Cheeks */}
              <circle cx="28" cy="40" r="4" fill="#FF8DA1" opacity="0.6" />
              <circle cx="52" cy="40" r="4" fill="#FF8DA1" opacity="0.6" />

              {/* Chef Hat */}
              <path d="M22 18 C15 -5, 65 -5, 58 18 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
              <rect x="25" y="14" width="30" height="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
            </g>

            {/* Cupcakes on Counter */}
            <g transform="translate(230, 140)">
              {/* Cupcake 1 */}
              <polygon points="10,35 15,50 35,50 40,35" fill="#92400E" />
              <circle cx="25" cy="30" r="14" fill="#FF8DA1" />
              <circle cx="25" cy="18" r="4" fill="#EF4444" />
              {/* Cupcake 2 */}
              <polygon points="55,35 60,50 80,50 85,35" fill="#92400E" />
              <circle cx="70" cy="30" r="14" fill="#60A5FA" />
              <circle cx="70" cy="18" r="4" fill="#FBBF24" />
              {/* Confetti */}
              <circle cx="22" cy="28" r="1.5" fill="#FBBF24" />
              <circle cx="28" cy="32" r="1.5" fill="#34D399" />
              <circle cx="67" cy="28" r="1.5" fill="#F472B6" />
              <circle cx="74" cy="32" r="1.5" fill="#FBBF24" />
            </g>

            {/* Cute Flour Paw Prints */}
            <g fill="#FFFFFF" opacity="0.8">
              <ellipse cx="60" cy="170" rx="5" ry="4" />
              <circle cx="55" cy="164" r="1.5" />
              <circle cx="59" cy="163" r="1.5" />
              <circle cx="64" cy="165" r="1.5" />

              <ellipse cx="90" cy="190" rx="5" ry="4" />
              <circle cx="85" cy="184" r="1.5" />
              <circle cx="89" cy="183" r="1.5" />
              <circle cx="94" cy="185" r="1.5" />
            </g>
          </svg>
        );

      case 'dragon_kite':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <defs>
              <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="50%" stopColor="#FDBA74" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#sunsetSky)" />
            {/* Setting Sun */}
            <circle cx="200" cy="150" r="45" fill="#FFFFFF" opacity="0.8" />
            {/* Rolling Green Hill */}
            <path d="M-20 240 Q150 160 420 240 Z" fill="#15803D" />
            <path d="M0 240 Q250 180 420 240 Z" fill="#22C55E" opacity="0.7" />

            {/* Friends flying kite */}
            <g transform="translate(100, 160)">
              {/* Friend 1 */}
              <circle cx="15" cy="15" r="8" fill="#FDE047" />
              <line x1="15" y1="23" x2="15" y2="45" stroke="#1E3A8A" strokeWidth="4" />
              <line x1="15" y1="45" x2="10" y2="65" stroke="#1E3A8A" strokeWidth="3" />
              <line x1="15" y1="45" x2="20" y2="65" stroke="#1E3A8A" strokeWidth="3" />
              {/* Friend 2 */}
              <circle cx="45" cy="18" r="8" fill="#F472B6" />
              <line x1="45" y1="26" x2="45" y2="45" stroke="#B91C1C" strokeWidth="4" />
              <line x1="45" y1="45" x2="40" y2="65" stroke="#B91C1C" strokeWidth="3" />
              <line x1="45" y1="45" x2="50" y2="65" stroke="#B91C1C" strokeWidth="3" />
              {/* Kite String */}
              <path d="M15 25 Q130 90 240 40" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </g>

            {/* Giant Dragon Kite */}
            <g transform="translate(240, 30)">
              {/* Diamond head */}
              <polygon points="30,0 60,25 30,50 0,25" fill="#DC2626" stroke="#FEF08A" strokeWidth="2.5" />
              {/* Dragon Eyes */}
              <circle cx="38" cy="20" r="4" fill="#FEF08A" />
              <circle cx="38" cy="20" r="2" fill="#000000" />
              <circle cx="38" cy="30" r="4" fill="#FEF08A" />
              <circle cx="38" cy="30" r="2" fill="#000000" />
              {/* Gold horns */}
              <polygon points="50,15 65,8 55,22" fill="#FBBF24" />
              <polygon points="50,35 65,42 55,28" fill="#FBBF24" />

              {/* Dancing Ribbon Tail with Bows */}
              <path d="M0 25 Q-30 45 -20 70 Q-10 95 -40 115 Q-70 135 -50 160" stroke="#DC2626" strokeWidth="3" fill="none" />
              {/* Ribbon Bows */}
              <polygon points="-25,40 -20,45 -30,50" fill="#FBBF24" />
              <polygon points="-15,70 -10,75 -20,80" fill="#3B82F6" />
              <polygon points="-35,115 -30,120 -40,125" fill="#10B981" />
              <polygon points="-55,155 -50,160 -60,165" fill="#F472B6" />
            </g>
          </svg>
        );

      case 'bear_tea_party':
      default:
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full">
            <rect width="400" height="240" fill="#ECFDF5" />
            {/* Tree trunk inside */}
            <path d="M0 0 L100 0 L120 240 L0 240 Z" fill="#78350F" />
            <rect x="100" y="160" width="300" height="80" fill="#A7F3D0" />
            {/* Window with Leafy view */}
            <circle cx="280" cy="70" r="40" fill="#93C5FD" stroke="#92400E" strokeWidth="4" />
            <line x1="280" y1="30" x2="280" y2="110" stroke="#92400E" strokeWidth="3" />
            <line x1="240" y1="70" x2="320" y2="70" stroke="#92400E" strokeWidth="3" />

            {/* Tree Table */}
            <ellipse cx="230" cy="180" rx="60" ry="25" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            {/* Kettle and Tea Cups */}
            <ellipse cx="220" cy="172" rx="10" ry="12" fill="#E5E7EB" stroke="#6B7280" strokeWidth="1.5" />
            <circle cx="250" cy="175" r="5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1" />
            <circle cx="200" cy="175" r="5" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />

            {/* Little Bluebirds */}
            <g transform="translate(290, 160)">
              <circle cx="0" cy="0" r="7" fill="#60A5FA" />
              <polygon points="5,-2 12,0 5,2" fill="#F59E0B" />
              <circle cx="-1" cy="-2" r="1" fill="#000000" />
            </g>

            {/* Gentle Bear in Yellow Bowtie */}
            <g transform="translate(130, 90)">
              {/* Ears */}
              <circle cx="25" cy="20" r="10" fill="#78350F" />
              <circle cx="25" cy="20" r="5" fill="#D97706" />
              <circle cx="65" cy="20" r="10" fill="#78350F" />
              <circle cx="65" cy="20" r="5" fill="#D97706" />
              {/* Head */}
              <circle cx="45" cy="40" r="28" fill="#92400E" />
              {/* Muzzle */}
              <ellipse cx="45" cy="48" rx="14" ry="11" fill="#FDE68A" />
              <ellipse cx="45" cy="44" rx="5" ry="3.5" fill="#451A03" />
              <path d="M42 50 Q45 54 48 50" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Eyes */}
              <circle cx="36" cy="38" r="2.5" fill="#451A03" />
              <circle cx="54" cy="38" r="2.5" fill="#451A03" />
              {/* Bowtie */}
              <polygon points="35,70 45,73 35,76" fill="#FBBF24" />
              <polygon points="55,70 45,73 55,76" fill="#FBBF24" />
              <circle cx="45" cy="73" r="3" fill="#D97706" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border-3 border-[#FFE4E9] bg-white shadow-xs">
      <div className="aspect-16/10 w-full overflow-hidden bg-[#FFF9FA]">
        {renderIllustration()}
      </div>

      <div className="p-3 bg-white/90 border-t border-[#FFE4E9] flex items-center justify-between">
        <span className="font-heading font-bold text-xs text-[#7D5A61] flex items-center gap-1.5">
          <span className="text-base">{emoji}</span>
          <span>{title}</span>
        </span>
        <span className="text-[10px] text-[#A89094] font-medium bg-[#FFF0F3] px-2 py-0.5 rounded-full">
          Cartoon Situation
        </span>
      </div>
    </div>
  );
};
