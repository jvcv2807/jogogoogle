/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { sound } from '../utils/audio';
import { Shield, Sparkles, Sword } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  highestFloor: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, highestFloor }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="relative w-full h-screen bg-slate-950 flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      {/* Background radial glow & atmospheric abyss particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black pointer-events-none" />

      {/* Subtle floating runes / background pillars */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex justify-around items-center">
        <div className="text-8xl animate-pulse">⚔️</div>
        <div className="text-9xl animate-pulse delay-500">🏰</div>
        <div className="text-8xl animate-pulse delay-1000">👑</div>
      </div>

      {/* Top space filler */}
      <div className="z-10 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RPG Idle & TapTap Breaking · 100 Andares · 1.000 Chefões</span>
        </div>
      </div>

      {/* Centerpiece: Bespoke Title Lockup */}
      <div className="z-10 flex flex-col items-center text-center max-w-2xl px-4">
        {/* Inline SVG Crest */}
        <div className="w-20 h-20 mb-4 text-amber-500 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M50 5 L85 20 L85 65 C85 85 50 95 50 95 C50 95 15 85 15 65 L15 20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M50 15 L50 85 M25 45 L75 45" stroke="currentColor" strokeWidth="3" />
            <polygon points="50,22 56,38 72,38 59,48 64,64 50,54 36,64 41,48 28,38 44,38" fill="#f59e0b" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 font-['Cinzel'] drop-shadow-md">
          DUNGEON BREAKERS
        </h1>

        <div className="text-lg sm:text-2xl font-black text-rose-400 font-['Cinzel'] tracking-widest uppercase mt-1 drop-shadow">
          A Torre dos 100 Abismos
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mt-4 max-w-lg leading-relaxed font-sans">
          Destrua as barras de resistência de monstros colossais, lidere 20 heróis míticos, quebre defesas com toques rápidos e desvende o enigma do Criador Aetherion.
        </p>

        {/* Start Game CTA Button */}
        <button
          onClick={onStartGame}
          className="mt-8 group relative px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-widest rounded-xl shadow-2xl shadow-amber-500/40 transform transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-3"
        >
          <Sword className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-45" />
          <span>Entrar na Torre dos Abismos</span>
          <span className="hidden sm:inline text-[11px] font-mono opacity-80 bg-slate-950/20 px-1.5 py-0.5 rounded">
            [ENTER / ESPAÇO]
          </span>
        </button>

        {highestFloor > 1 && (
          <div className="text-xs text-amber-400 font-semibold mt-3">
            Progresso salvo detectado: Andar {highestFloor} alcançado!
          </div>
        )}
      </div>

      {/* Flat Control-Hint Line at Bottom */}
      <div className="z-10 pb-4 text-center">
        <div className="text-xs text-slate-400/90 font-mono">
          Toque na Arena para Atacar · Destrua a Defesa do Chefe · Habilidades Automáticas e Manuais · Salvo Automático
        </div>
      </div>
    </div>
  );
};
