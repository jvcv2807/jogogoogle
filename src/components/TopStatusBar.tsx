/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FloorTheme, PlayerStats } from '../types/game';
import { formatNumber } from '../utils/numberFormat';
import { Volume2, VolumeX, Shield, Play, Pause, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface TopStatusBarProps {
  floorTheme: FloorTheme;
  currentFloor: number;
  highestFloor: number;
  currentLevel: number;
  stage: 'horde' | 'elite' | 'boss';
  playerStats: PlayerStats;
  autoProgress: boolean;
  onToggleAutoProgress: () => void;
  autoSkills: boolean;
  onToggleAutoSkills: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onFloorChange: (floor: number) => void;
  onOpenStory: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  floorTheme,
  currentFloor,
  highestFloor,
  currentLevel,
  stage,
  playerStats,
  autoProgress,
  onToggleAutoProgress,
  autoSkills,
  onToggleAutoSkills,
  isMuted,
  onToggleMute,
  onFloorChange,
  onOpenStory
}) => {
  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 text-slate-200 select-none z-10 px-3 py-2">
      {/* Top row: Currencies & System Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Currencies Bar */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-bold">
          {/* Gold */}
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
            <span className="text-base">🪙</span>
            <span className="font-mono tabular-nums">{formatNumber(playerStats.gold)}</span>
            <span className="text-[10px] text-amber-500 uppercase font-semibold hidden sm:inline">Ouro</span>
          </div>

          {/* Crystals */}
          <div className="flex items-center gap-1.5 text-sky-400 bg-sky-950/30 px-2 py-1 rounded border border-sky-900/50">
            <span className="text-base">💎</span>
            <span className="font-mono tabular-nums">{formatNumber(playerStats.crystals)}</span>
            <span className="text-[10px] text-sky-500 uppercase font-semibold hidden sm:inline">Cristais</span>
          </div>

          {/* Ancestral Souls */}
          <div className="flex items-center gap-1.5 text-purple-400 bg-purple-950/30 px-2 py-1 rounded border border-purple-900/50">
            <span className="text-base">🔮</span>
            <span className="font-mono tabular-nums">{formatNumber(playerStats.ancestralSouls)}</span>
            <span className="text-[10px] text-purple-500 uppercase font-semibold hidden sm:inline">Almas</span>
          </div>

          {/* Enhancement Stones */}
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50 hidden md:flex">
            <span className="text-base">🪨</span>
            <span className="font-mono tabular-nums">{formatNumber(playerStats.enhancementStones)}</span>
            <span className="text-[10px] text-emerald-500 uppercase font-semibold">Pedras</span>
          </div>
        </div>

        {/* Toggles & Options */}
        <div className="flex items-center gap-2">
          {/* Story modal trigger */}
          <button
            onClick={onOpenStory}
            title="História de Eldoria"
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Lore</span>
          </button>

          {/* Auto Skills */}
          <button
            onClick={onToggleAutoSkills}
            className={`px-2 py-1 text-xs font-bold rounded border transition ${
              autoSkills
                ? 'bg-indigo-900/60 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            AUTO SKILLS: {autoSkills ? 'ON' : 'OFF'}
          </button>

          {/* Auto Progress */}
          <button
            onClick={onToggleAutoProgress}
            className={`px-2 py-1 text-xs font-bold rounded border transition ${
              autoProgress
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            AUTO AVANÇO: {autoProgress ? 'ON' : 'OFF'}
          </button>

          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            aria-label={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Second row: Current Floor & Stage Breadcrumbs */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Floor Navigation */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentFloor <= 1}
            onClick={() => onFloorChange(currentFloor - 1)}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Capítulo {floorTheme.chapter}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-sm font-black text-white font-['Cinzel'] tracking-wide">
                Andar {currentFloor} / 100: {floorTheme.name}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              {floorTheme.theme}
            </span>
          </div>

          <button
            disabled={currentFloor >= highestFloor || currentFloor >= 100}
            onClick={() => onFloorChange(currentFloor + 1)}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Level and Stage Progression (1. Horda -> 2. Elite -> 3. Chefão) */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-extrabold text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Nível <span className="text-amber-400">{currentLevel}</span>/10
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`px-2 py-0.5 rounded transition ${
                stage === 'horde'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              1. Horda
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2 py-0.5 rounded transition ${
                stage === 'elite'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              2. Elite
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-2 py-0.5 rounded transition ${
                stage === 'boss'
                  ? 'bg-rose-500 text-white shadow-md font-black animate-pulse'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {currentLevel === 10 ? '👑 SOBERANO' : '3. Chefão'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
