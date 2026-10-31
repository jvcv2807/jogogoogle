/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CHAPTERS, ARCHETYPES } from '../data/chapters';
import { BestiaryEntry } from '../types/game';
import { getElementColor } from '../utils/numberFormat';
import { X, Book, Skull, Award } from 'lucide-react';

interface BestiaryModalProps {
  bestiary: BestiaryEntry[];
  highestFloor: number;
  totalBossesDefeated: number;
  onClose: () => void;
}

export const BestiaryModal: React.FC<BestiaryModalProps> = ({
  bestiary,
  highestFloor,
  totalBossesDefeated,
  onClose
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];

  const chapterEntries = bestiary.filter(b => {
    return b.floor >= chapter.floorsRange[0] && b.floor <= chapter.floorsRange[1];
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-400">
              Bestiário da Torre dos 100 Abismos
            </h2>
            <span className="text-xs text-slate-400">
              · {totalBossesDefeated} Chefões Derrotados
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800 flex overflow-x-auto gap-1.5 scrollbar-thin">
          {CHAPTERS.map((chap) => {
            const isUnlocked = highestFloor >= chap.floorsRange[0];
            const isSelected = chap.id === selectedChapterId;

            return (
              <button
                key={chap.id}
                onClick={() => setSelectedChapterId(chap.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : isUnlocked
                    ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    : 'bg-slate-950 text-slate-600 border border-slate-900 opacity-60'
                }`}
              >
                <span>Capítulo {chap.roman}</span>
                {!isUnlocked && <span>🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Chapter Details Banner */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase text-amber-400 tracking-wider">
              Capítulo {chapter.roman}: {chapter.title} (Andares {chapter.floorsRange[0]} a {chapter.floorsRange[1]})
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {chapter.description}
            </p>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-xl">👑</span>
            <div className="text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Guardião Soberano</div>
              <div className="font-bold text-amber-300">{chapter.guardianName} · {chapter.guardianTitle}</div>
            </div>
          </div>
        </div>

        {/* Bosses Entries Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {chapterEntries.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              Nenhum chefão deste capítulo registrado no bestiário ainda. Conquiste os andares de {chapter.floorsRange[0]} a {chapter.floorsRange[1]}!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {chapterEntries.map((entry, idx) => {
                const elemColor = getElementColor(entry.element);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3 hover:border-slate-700 transition"
                  >
                    <div className="text-2xl p-2 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                      👹
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-white truncate">
                          {entry.bossName}
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase px-1 py-0.5 rounded shrink-0"
                          style={{
                            backgroundColor: elemColor + '25',
                            color: elemColor
                          }}
                        >
                          {entry.element}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-400 mt-0.5">
                        Andar {entry.floor} · Nível {entry.level} ({entry.archetype})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>Derrotado: <strong>{entry.killCount}x</strong></span>
                        <span className="text-[9px] opacity-75">{entry.discoveredAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
