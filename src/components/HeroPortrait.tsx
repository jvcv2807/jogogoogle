/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { ElementType } from '../types/game';
import { getElementColor } from '../utils/numberFormat';

interface HeroPortraitProps {
  heroId?: string;
  hero?: string;
  element?: ElementType;
  size?: number;
  className?: string;
  showAura?: boolean;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = memo(({
  heroId,
  hero,
  element = 'Terra',
  size = 64,
  className = '',
  showAura = true
}) => {
  const targetId = (hero || heroId || 'hero_arthur').toLowerCase();
  const elemColor = getElementColor(element);

  // If directly referencing asset image
  if (targetId === 'aurora' || targetId === 'hero_aurora') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/assets/heroes/aurora_portrait.svg"
          alt="Aurora portrait"
          width={size}
          height={size}
          className="w-full h-full object-cover filter drop-shadow"
        />
      </div>
    );
  }

  if (targetId === 'goblin' || targetId === 'goblin_portrait') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/assets/heroes/goblin_portrait.svg"
          alt="Goblin portrait"
          width={size}
          height={size}
          className="w-full h-full object-cover filter drop-shadow"
        />
      </div>
    );
  }

  // Render bespoke custom vector SVG for each hero archetype
  const renderHeroSVG = () => {
    switch (targetId) {
      // 1. Arthur - The Knight / Champion of Eldoria
      case 'hero_arthur':
        return (
          <g>
            {/* Helm & visor */}
            <path d="M16 26 C16 14 48 14 48 26 L46 44 C46 50 18 50 18 44 Z" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <path d="M22 28 L42 28 L40 33 L24 33 Z" fill="#0f172a" />
            <path d="M30 14 L34 14 L35 22 L29 22 Z" fill="#f59e0b" />
            {/* Golden lion crest on forehead */}
            <circle cx="32" cy="22" r="3" fill="#f59e0b" />
            {/* Shoulder Pauldrons */}
            <path d="M6 46 C10 40 20 42 22 48 L14 60 C8 58 6 52 6 46 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M58 46 C54 40 44 42 42 48 L50 60 C56 58 58 52 58 46 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Breastplate */}
            <path d="M20 46 L44 46 L40 62 L24 62 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            <path d="M32 46 L32 60" stroke="#f59e0b" strokeWidth="2" />
          </g>
        );

      // 2. Lyra - The Wind Ranger
      case 'hero_lyra':
        return (
          <g>
            {/* Hood & flowing wind cloak */}
            <path d="M18 24 C18 12 46 12 46 24 L50 56 C50 62 14 62 14 56 Z" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
            {/* Face */}
            <ellipse cx="32" cy="30" rx="10" ry="12" fill="#fde047" opacity="0.3" />
            <path d="M22 24 C22 18 42 18 42 24 C42 38 22 38 22 24 Z" fill="#fed7aa" />
            {/* Hair strands */}
            <path d="M20 22 C24 16 38 16 42 20 L44 34 C38 34 38 24 32 24 C26 24 24 34 20 34 Z" fill="#ca8a04" />
            {/* Archer eye focus */}
            <circle cx="28" cy="28" r="1.5" fill="#166534" />
            <circle cx="36" cy="28" r="1.5" fill="#166534" />
            {/* Quiver & arrow tip */}
            <path d="M48 20 L56 12 L58 14 L50 22 Z" fill="#eab308" />
            <polygon points="56,10 60,14 58,16 54,12" fill="#22c55e" />
          </g>
        );

      // 3. Kael - The Flame Mage
      case 'hero_kael':
        return (
          <g>
            {/* Fiery Robe & High Collar */}
            <path d="M14 26 C14 12 50 12 50 26 L54 62 L10 62 Z" fill="#991b1b" stroke="#ef4444" strokeWidth="2" />
            {/* Fiery hair / flames */}
            <path d="M20 24 C20 10 32 6 32 6 C32 6 44 10 44 24 C40 18 36 20 32 14 C28 20 24 18 20 24 Z" fill="#f97316" />
            <path d="M24 20 C24 12 32 8 32 8 C32 8 40 12 40 20 Z" fill="#fde047" />
            {/* Face */}
            <path d="M24 24 C24 18 40 18 40 24 C40 36 24 36 24 24 Z" fill="#ffedd5" />
            {/* Glowing red eyes */}
            <circle cx="28" cy="26" r="2" fill="#ef4444" />
            <circle cx="36" cy="26" r="2" fill="#ef4444" />
            {/* Flame orb symbol on chest */}
            <circle cx="32" cy="48" r="6" fill="#f97316" />
            <circle cx="32" cy="48" r="3" fill="#fde047" />
          </g>
        );

      // 4. Serena - High Priestess of Light
      case 'hero_serena':
        return (
          <g>
            {/* Halo of Light */}
            <circle cx="32" cy="18" r="14" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="3,2" />
            {/* White veil */}
            <path d="M16 26 C16 16 48 16 48 26 L52 62 L12 62 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Face & golden circlet */}
            <path d="M24 26 C24 20 40 20 40 26 C40 38 24 38 24 26 Z" fill="#ffedd5" />
            <path d="M23 23 L41 23" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="32" cy="22" r="2" fill="#38bdf8" />
            {/* Calm eyes */}
            <path d="M26 28 Q29 27 30 28" stroke="#0f172a" strokeWidth="1.5" fill="none" />
            <path d="M34 28 Q35 27 38 28" stroke="#0f172a" strokeWidth="1.5" fill="none" />
            {/* Holy cross symbol */}
            <path d="M32 44 L32 56 M27 49 L37 49" stroke="#f59e0b" strokeWidth="2.5" />
          </g>
        );

      // 5. Raven - The Shadow Assassin
      case 'hero_raven':
        return (
          <g>
            {/* Dark cowl & mask */}
            <path d="M18 20 C18 10 46 10 46 20 L50 62 L14 62 Z" fill="#09090b" stroke="#6d28d9" strokeWidth="2" />
            {/* Face mask */}
            <path d="M22 26 L42 26 L38 38 L26 38 Z" fill="#18181b" stroke="#71717a" strokeWidth="1" />
            {/* Purple piercing eyes */}
            <path d="M26 24 L30 24" stroke="#c084fc" strokeWidth="2" />
            <path d="M34 24 L38 24" stroke="#c084fc" strokeWidth="2" />
            {/* Crossed daggers on tunic */}
            <line x1="24" y1="46" x2="40" y2="58" stroke="#a1a1aa" strokeWidth="2" />
            <line x1="40" y1="46" x2="24" y2="58" stroke="#a1a1aa" strokeWidth="2" />
          </g>
        );

      // Default / Generics: Dynamic Arcane Warrior
      default:
        return (
          <g>
            {/* Arcane helm/cowl */}
            <path d="M18 22 C18 12 46 12 46 22 L48 60 L16 60 Z" fill="#1e1b4b" stroke={elemColor} strokeWidth="2" />
            <circle cx="32" cy="28" r="9" fill="#312e81" />
            <circle cx="29" cy="28" r="2" fill={elemColor} />
            <circle cx="35" cy="28" r="2" fill={elemColor} />
            <polygon points="32,40 37,50 27,50" fill={elemColor} />
            <path d="M22 52 L42 52 L38 62 L26 62 Z" fill="#4338ca" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background radial glow */}
      {showAura && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at center, ${elemColor} 0%, transparent 70%)`
          }}
        />
      )}

      {/* SVG canvas */}
      <svg
        viewBox="0 0 64 64"
        width="100%"
        height="100%"
        className="w-full h-full filter drop-shadow"
      >
        {renderHeroSVG()}
      </svg>
    </div>
  );
});
