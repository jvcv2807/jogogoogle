/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hero, Equipment, ItemRarity } from '../types/game';
import { generateEquipment, RARITY_CONFIG } from '../data/equipment';
import { sound } from '../utils/audio';
import { X, Sparkles, Gem, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SummonResult {
  type: 'hero' | 'shards' | 'equipment';
  title: string;
  subtitle: string;
  rarity: ItemRarity;
  icon: string;
  heroId?: string;
  equipment?: Equipment;
  shardsCount?: number;
}

interface SummonModalProps {
  crystals: number;
  heroes: Hero[];
  currentFloor: number;
  onClose: () => void;
  onSummonSuccess: (results: SummonResult[], cost: number) => void;
}

export const SummonModal: React.FC<SummonModalProps> = ({
  crystals,
  heroes,
  currentFloor,
  onClose,
  onSummonSuccess
}) => {
  const [summonResults, setSummonResults] = useState<SummonResult[] | null>(null);
  const [isSummoning, setIsSummoning] = useState<boolean>(false);

  const executeSummon = (count: number, cost: number) => {
    if (crystals < cost || isSummoning) return;
    setIsSummoning(true);
    sound.playUltimate();

    setTimeout(() => {
      const results: SummonResult[] = [];

      for (let i = 0; i < count; i++) {
        const roll = Math.random() * 100;

        if (roll < 30) {
          // Hero unlock or shards
          const lockedHeroes = heroes.filter(h => !h.unlocked);
          if (lockedHeroes.length > 0 && Math.random() < 0.4) {
            // Unlock a new hero!
            const chosenHero = lockedHeroes[Math.floor(Math.random() * lockedHeroes.length)];
            results.push({
              type: 'hero',
              title: `NOVO HERÓI: ${chosenHero.name}`,
              subtitle: `${chosenHero.title} · ${chosenHero.heroClass}`,
              rarity: chosenHero.rarity,
              icon: chosenHero.avatarSprite,
              heroId: chosenHero.id
            });
          } else {
            // Shards for an existing or random hero
            const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
            results.push({
              type: 'shards',
              title: `Fragmentos de ${randomHero.name}`,
              subtitle: '+20 Fragmentos para Ascensão ⭐',
              rarity: randomHero.rarity,
              icon: '🧩',
              heroId: randomHero.id,
              shardsCount: 20
            });
          }
        } else {
          // Equipment drop
          const eq = generateEquipment(Math.max(1, currentFloor));
          results.push({
            type: 'equipment',
            title: eq.name,
            subtitle: `${eq.slot} (${eq.rarity})`,
            rarity: eq.rarity,
            icon: '⚔️',
            equipment: eq
          });
        }
      }

      setSummonResults(results);
      setIsSummoning(false);
      onSummonSuccess(results, cost);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 330 }}
        className="w-full max-w-4xl bg-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🔮</span>
            <div>
              <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-300">
                Altar de Invocação dos Abismos
              </h2>
              <p className="text-xs text-slate-400">
                Invoque os 20 lendários heróis de Eldoria, fragmentos de ascensão e relíquias divinas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col items-center justify-center">
          {summonResults ? (
            <div className="w-full space-y-4">
              <div className="text-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  Resultado da Invocação
                </span>
                <h3 className="text-xl font-black text-white font-['Cinzel']">
                  Bênçãos dos Abismos Reveladas!
                </h3>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {summonResults.map((res, idx) => {
                  const cfg = RARITY_CONFIG[res.rarity];
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center shadow-lg transform transition hover:scale-105 ${cfg.border} ${cfg.bg}`}
                    >
                      <span className="text-3xl mb-1">{res.icon}</span>
                      <div className="text-xs font-black truncate w-full" style={{ color: cfg.color }}>
                        {res.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {res.subtitle}
                      </div>
                      <span className="mt-2 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-300">
                        {res.rarity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setSummonResults(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition border border-slate-700"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md w-full text-center space-y-6 py-8">
              {/* Magic Circle graphic */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-amber-500/50 rounded-full animate-spin duration-10000" />
                <div className="absolute inset-2 border border-purple-500/40 rounded-full" />
                <div className="w-28 h-28 bg-gradient-to-tr from-amber-600/20 via-purple-600/30 to-rose-600/20 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-5xl animate-bounce">✨</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-amber-200 font-['Cinzel']">
                  Canalize a Energia dos Cristais
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Seu saldo: <span className="text-sky-400 font-bold font-mono">💎 {crystals} Cristais</span>
                </p>
              </div>

              {/* Summon Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1x Summon */}
                <button
                  disabled={crystals < 100 || isSummoning}
                  onClick={() => executeSummon(1, 100)}
                  className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition flex flex-col items-center justify-center ${
                    crystals >= 100 && !isSummoning
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-lg cursor-pointer active:scale-95'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>Invocação 1x</span>
                  <span className="text-[11px] font-mono mt-0.5">💎 100 Cristais</span>
                </button>

                {/* 10x Summon */}
                <button
                  disabled={crystals < 900 || isSummoning}
                  onClick={() => executeSummon(10, 900)}
                  className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition flex flex-col items-center justify-center ${
                    crystals >= 900 && !isSummoning
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-xl ring-2 ring-purple-500/40 cursor-pointer active:scale-95'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Invocação 10x (Desconto)
                  </span>
                  <span className="text-[11px] font-mono mt-0.5">💎 900 Cristais</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};
