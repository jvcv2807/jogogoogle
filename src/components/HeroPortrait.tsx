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


type Headwear = 'helmet' | 'hood' | 'crown' | 'horns' | 'hat' | 'antlers' | 'diadem' | 'mask';
type Weapon = 'sword' | 'staff' | 'bow' | 'daggers' | 'axe' | 'scythe' | 'orb' | 'spear' | 'hammer' | 'book' | 'shield';

interface PortraitDesign {
  body: string;
  trim: string;
  hair: string;
  skin: string;
  headwear: Headwear;
  weapon: Weapon;
}

/** Fifteen distinct hero silhouettes; the starter five retain their original bespoke drawings. */
const PORTRAIT_DESIGNS: Record<string, PortraitDesign> = {
  hero_darius: { body: '#f59e0b', trim: '#fef3c7', hair: '#713f12', skin: '#fed7aa', headwear: 'helmet', weapon: 'shield' },
  hero_freya: { body: '#0891b2', trim: '#bae6fd', hair: '#f8fafc', skin: '#ffedd5', headwear: 'horns', weapon: 'axe' },
  hero_sylas: { body: '#4c1d95', trim: '#c4b5fd', hair: '#a78bfa', skin: '#d6d3d1', headwear: 'hood', weapon: 'staff' },
  hero_iris: { body: '#4338ca', trim: '#fde047', hair: '#fbbf24', skin: '#fce7f3', headwear: 'diadem', weapon: 'orb' },
  hero_thorne: { body: '#166534', trim: '#86efac', hair: '#854d0e', skin: '#fed7aa', headwear: 'antlers', weapon: 'staff' },
  hero_valeria: { body: '#991b1b', trim: '#fb923c', hair: '#fecaca', skin: '#fed7aa', headwear: 'helmet', weapon: 'spear' },
  hero_noctis: { body: '#1e1b4b', trim: '#a78bfa', hair: '#18181b', skin: '#d6d3d1', headwear: 'hood', weapon: 'scythe' },
  hero_eldrin: { body: '#701a75', trim: '#f0abfc', hair: '#e9d5ff', skin: '#ffedd5', headwear: 'hat', weapon: 'book' },
  hero_astra: { body: '#f8fafc', trim: '#fde68a', hair: '#fef9c3', skin: '#fed7aa', headwear: 'crown', weapon: 'shield' },
  hero_ragnar: { body: '#78350f', trim: '#fb923c', hair: '#7c2d12', skin: '#fdba74', headwear: 'horns', weapon: 'hammer' },
  hero_luna: { body: '#312e81', trim: '#c4b5fd', hair: '#e0e7ff', skin: '#ffedd5', headwear: 'diadem', weapon: 'orb' },
  hero_zephyr: { body: '#0f766e', trim: '#99f6e4', hair: '#e2e8f0', skin: '#fed7aa', headwear: 'mask', weapon: 'daggers' },
  hero_morrigan: { body: '#581c87', trim: '#d8b4fe', hair: '#0f172a', skin: '#f5d0fe', headwear: 'hat', weapon: 'book' },
  hero_orion: { body: '#1d4ed8', trim: '#67e8f9', hair: '#78350f', skin: '#fed7aa', headwear: 'hood', weapon: 'bow' },
  hero_azrael: { body: '#181029', trim: '#f43f5e', hair: '#0f172a', skin: '#ddd6fe', headwear: 'crown', weapon: 'sword' }
};

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

    // Premium vector portraits: a unique weapon, outfit, headwear and palette per hero.
    const d = PORTRAIT_DESIGNS[targetId];
    if (d) {
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="31" r="29" fill={d.trim} opacity="0.09" />
          {/* Cloak and shoulders */}
          <path d="M15 36 Q6 39 5 62 H59 Q58 39 49 36 L43 43 H21 Z" fill={d.body} stroke={d.trim} strokeWidth="1.6" />
          <path d="M21 41 L32 52 L43 41 L40 62 H24 Z" fill="#0f172a" opacity="0.65" />
          <path d="M13 47 L21 41 L24 51 L17 58 Z M51 47 L43 41 L40 51 L47 58 Z" fill={d.trim} opacity="0.8" />
          <path d="M32 49 L36 54 L32 59 L28 54 Z" fill={d.trim} />
          {/* Face, hair and eyes */}
          <ellipse cx="32" cy="27" rx="11" ry="13" fill={d.skin} />
          <path d="M20 25 Q20 12 32 13 Q44 12 44 25 L39 20 Q32 16 25 21 Z" fill={d.hair} />
          <circle cx="28" cy="28" r="1.3" fill="#111827" />
          <circle cx="36" cy="28" r="1.3" fill="#111827" />
          <path d="M29 34 Q32 36 35 34" stroke="#78350f" strokeWidth="0.9" fill="none" />
          {/* Class silhouette: helm, crown, antlers, occult hat, or hood */}
          {d.headwear === 'helmet' && <g><path d="M18 22 L22 13 L42 13 L46 22 L41 26 L39 19 H25 L23 26 Z" fill={d.trim} /><path d="M19 25 L25 25 M39 25 L45 25" stroke={d.body} strokeWidth="3" /></g>}
          {d.headwear === 'hood' && <path d="M18 41 Q9 11 29 8 Q51 6 47 39 L42 37 Q46 18 32 16 Q18 17 22 36 Z" fill={d.body} stroke={d.trim} strokeWidth="1.6" />}
          {d.headwear === 'crown' && <path d="M20 20 L17 8 L27 14 L32 5 L37 14 L47 8 L44 20 Z" fill={d.trim} stroke={d.body} strokeWidth="1.5" />}
          {d.headwear === 'horns' && <g><path d="M23 22 Q9 19 13 5 Q17 16 26 17 Z M41 22 Q55 19 51 5 Q47 16 38 17 Z" fill={d.trim} /><path d="M22 20 Q32 11 42 20" fill="none" stroke={d.body} strokeWidth="4" /></g>}
          {d.headwear === 'hat' && <g><path d="M17 21 L32 2 L45 21 Z" fill={d.body} stroke={d.trim} strokeWidth="2" /><path d="M9 23 Q32 16 55 23" stroke={d.trim} strokeWidth="4" fill="none" /></g>}
          {d.headwear === 'antlers' && <g fill="none" stroke={d.trim} strokeWidth="2.5"><path d="M24 21 L18 8 L12 5 M18 8 L19 2 M40 21 L46 8 L52 5 M46 8 L45 2" /></g>}
          {d.headwear === 'diadem' && <g><path d="M20 22 Q32 12 44 22" fill="none" stroke={d.trim} strokeWidth="3" /><path d="M32 15 L36 21 L32 25 L28 21 Z" fill={d.trim} /></g>}
          {d.headwear === 'mask' && <g><path d="M22 27 L42 27 L39 35 L25 35 Z" fill="#0f172a" stroke={d.trim} /><path d="M27 30 L30 31 M34 31 L37 30" stroke={d.trim} strokeWidth="1.4" /></g>}
          {/* Equipment silhouettes distinguish damage dealers, tanks and casters. */}
          {d.weapon === 'sword' && <g><path d="M51 54 L59 11" stroke="#e2e8f0" strokeWidth="4" /><path d="M46 37 L60 40 M50 55 L54 57" stroke={d.trim} strokeWidth="3" /></g>}
          {d.weapon === 'staff' && <g><path d="M51 61 L51 15" stroke="#a16207" strokeWidth="4" /><circle cx="51" cy="13" r="6" fill={d.trim} stroke="#f8fafc" strokeWidth="1.5" /></g>}
          {d.weapon === 'bow' && <g><path d="M50 12 Q63 32 50 55" stroke={d.trim} strokeWidth="4" fill="none" /><path d="M50 12 L50 55 M45 33 L61 33" stroke="#e2e8f0" strokeWidth="1.7" /></g>}
          {d.weapon === 'daggers' && <g stroke="#e2e8f0" strokeWidth="3"><path d="M10 55 L22 36 M54 55 L42 36" /><path d="M9 45 L21 49 M55 45 L43 49" stroke={d.trim} /></g>}
          {d.weapon === 'axe' && <g><path d="M52 61 L53 14" stroke="#a16207" strokeWidth="3.5" /><path d="M52 12 L62 14 L60 29 L52 27 Z" fill={d.trim} /></g>}
          {d.weapon === 'scythe' && <g><path d="M51 61 L49 14" stroke="#a78bfa" strokeWidth="3.5" /><path d="M48 13 Q66 4 61 29 Q60 18 48 18 Z" fill={d.trim} /></g>}
          {d.weapon === 'orb' && <g><circle cx="52" cy="41" r="9" fill={d.trim} opacity="0.3" /><circle cx="52" cy="41" r="5" fill={d.trim} stroke="#f8fafc" strokeWidth="1" /><path d="M43 46 L39 50" stroke={d.trim} strokeWidth="2.5" /></g>}
          {d.weapon === 'spear' && <g><path d="M53 61 L53 15" stroke="#d6d3d1" strokeWidth="3" /><path d="M53 5 L59 19 L53 16 L47 19 Z" fill={d.trim} /></g>}
          {d.weapon === 'hammer' && <g><path d="M52 61 L52 24" stroke="#a16207" strokeWidth="4" /><rect x="43" y="13" width="19" height="14" rx="2" fill={d.trim} stroke="#f8fafc" strokeWidth="1" /></g>}
          {d.weapon === 'book' && <g><path d="M46 43 Q52 40 60 44 L60 57 Q53 54 46 57 Z" fill={d.trim} stroke="#f8fafc" strokeWidth="1.3" /><path d="M53 43 L53 56" stroke={d.body} strokeWidth="1.5" /></g>}
          {d.weapon === 'shield' && <g><path d="M48 37 L61 39 L59 54 L54 59 L48 54 Z" fill={d.body} stroke={d.trim} strokeWidth="2.8" /><path d="M54 41 L54 54 M49 47 L59 47" stroke={d.trim} strokeWidth="2" /></g>}
        </g>
      );
    }

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
