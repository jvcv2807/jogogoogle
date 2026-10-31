/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hero } from '../types/game';
import { calculateHeroStats, getHeroCostForLevelUp } from '../data/heroes';
import { formatNumber, getElementColor } from '../utils/numberFormat';
import { X, Star, Zap, Shield, Heart, Sword, Sparkles, Check } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';
import { motion } from 'framer-motion';

interface HeroesModalProps {
  heroes: Hero[];
  activeTeamIds: string[];
  gold: number;
  onClose: () => void;
  onToggleActiveTeam: (heroId: string) => void;
  onLevelUp: (heroId: string) => void;
  onAscendStar: (heroId: string) => void;
  onAwaken: (heroId: string) => void;
}

export const HeroesModal: React.FC<HeroesModalProps> = ({
  heroes,
  activeTeamIds,
  gold,
  onClose,
  onToggleActiveTeam,
  onLevelUp,
  onAscendStar,
  onAwaken
}) => {
  const [selectedHeroId, setSelectedHeroId] = useState<string>(activeTeamIds[0] || heroes[0].id);
  const selectedHero = heroes.find(h => h.id === selectedHeroId) || heroes[0];
  const stats = calculateHeroStats(selectedHero);
  const cost = getHeroCostForLevelUp(selectedHero.level);
  const canLevelUp = gold >= cost.gold && selectedHero.level < 200 && selectedHero.unlocked;
  const shardsNeededForStar = selectedHero.stars * 20;
  const canAscend = selectedHero.unlocked && selectedHero.stars < 6 && selectedHero.shards >= shardsNeededForStar;
  const canAwaken = selectedHero.unlocked && selectedHero.level >= 200 && selectedHero.awakening < 5;
  const isInActiveTeam = activeTeamIds.includes(selectedHero.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 330 }}
        className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧙‍♂️</span>
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-400">
              Salão dos Heróis (20 Campeões)
            </h2>
            <span className="text-xs text-slate-400">
              · Equipe Ativa: {activeTeamIds.length}/4
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Heroes Roster Grid */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto max-h-60 md:max-h-none space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Selecione o Herói para Gerenciar:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {heroes.map((hero) => {
                const elemColor = getElementColor(hero.element);
                const isSelected = hero.id === selectedHeroId;
                const inTeam = activeTeamIds.includes(hero.id);

                return (
                  <button
                    key={hero.id}
                    onClick={() => setSelectedHeroId(hero.id)}
                    className={`p-2 rounded-lg border text-left transition flex items-center gap-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 shadow-lg ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60'
                    } ${!hero.unlocked ? 'opacity-50 grayscale' : ''}`}
                  >
                    <HeroPortrait heroId={hero.id} element={hero.element} size={42} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                        <span>{hero.name}</span>
                        {inTeam && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 rounded font-bold">
                            ATIVO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Nv. {hero.level} · {hero.heroClass}
                      </div>
                      <div className="text-[9px] font-semibold" style={{ color: elemColor }}>
                        {hero.element} · {'★'.repeat(hero.stars)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Hero Details & Upgrades */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Hero Profile Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <HeroPortrait heroId={selectedHero.id} element={selectedHero.element} size={64} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white font-['Cinzel']">
                      {selectedHero.name}
                    </h3>
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: getElementColor(selectedHero.element) + '25',
                        color: getElementColor(selectedHero.element)
                      }}
                    >
                      {selectedHero.element}
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-semibold">
                    {selectedHero.title} · {selectedHero.heroClass}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Especialidade: {selectedHero.specialty}
                  </div>
                </div>
              </div>

              {/* Toggle in/out of 4-hero party */}
              {selectedHero.unlocked ? (
                <button
                  onClick={() => onToggleActiveTeam(selectedHero.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isInActiveTeam
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                      : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                  }`}
                >
                  {isInActiveTeam ? 'Remover da Equipe' : 'Colocar na Equipe (Máx 4)'}
                </button>
              ) : (
                <div className="text-xs text-rose-400 font-bold bg-rose-950/40 px-3 py-1 rounded border border-rose-900">
                  Bloqueado (Invoque no Altar)
                </div>
              )}
            </div>

            {/* Attributes Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-center">
                <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Vida</div>
                <div className="text-sm font-black font-mono text-white">{formatNumber(stats.maxHp)}</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-center">
                <Sword className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Ataque</div>
                <div className="text-sm font-black font-mono text-white">{formatNumber(stats.atk)}</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-center">
                <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Defesa</div>
                <div className="text-sm font-black font-mono text-white">{formatNumber(stats.def)}</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-center">
                <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Vel. Atq</div>
                <div className="text-sm font-black font-mono text-white">{stats.spd}/s</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-center">
                <Sparkles className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Crítico</div>
                <div className="text-sm font-black font-mono text-white">{stats.crit}%</div>
              </div>
            </div>

            {/* Skills & Ultimate descriptions */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Habilidades & Poderes:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedHero.skills.map((s) => (
                  <div key={s.id} className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>{s.icon}</span>
                      <span>{s.name} ({s.cooldown}s)</span>
                    </div>
                    <div className="text-slate-300 text-[11px] mt-1 leading-snug">
                      {s.description}
                    </div>
                  </div>
                ))}

                {/* Passive */}
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Passiva: {selectedHero.passive.name}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1 leading-snug">
                    {selectedHero.passive.description}
                  </div>
                </div>

                {/* Ultimate */}
                <div className="bg-slate-900/80 border border-amber-900/50 p-2 rounded-lg">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <span>{selectedHero.ultimate.icon}</span>
                    <span>Suprema: {selectedHero.ultimate.name}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1 leading-snug">
                    {selectedHero.ultimate.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Evolution & Upgrades Action Buttons */}
            {selectedHero.unlocked && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                {/* Level Up (1-200) */}
                <button
                  disabled={!canLevelUp}
                  onClick={() => onLevelUp(selectedHero.id)}
                  className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                    canLevelUp
                      ? 'bg-amber-950/60 border-amber-500 hover:bg-amber-900 text-amber-200 cursor-pointer'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs font-black uppercase">Subir Nível ({selectedHero.level}/200)</div>
                  <div className="text-[11px] font-mono mt-0.5">🪙 {formatNumber(cost.gold)} Ouro</div>
                </button>

                {/* Ascend Stars (1-6) */}
                <button
                  disabled={!canAscend}
                  onClick={() => onAscendStar(selectedHero.id)}
                  className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                    canAscend
                      ? 'bg-purple-950/60 border-purple-500 hover:bg-purple-900 text-purple-200 cursor-pointer'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs font-black uppercase">
                    Ascensão ({'★'.repeat(selectedHero.stars)})
                  </div>
                  <div className="text-[11px] font-mono mt-0.5">
                    🧩 {selectedHero.shards}/{shardsNeededForStar} Fragmentos
                  </div>
                </button>

                {/* Awaken (0-5) */}
                <button
                  disabled={!canAwaken}
                  onClick={() => onAwaken(selectedHero.id)}
                  className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                    canAwaken
                      ? 'bg-rose-950/60 border-rose-500 hover:bg-rose-900 text-rose-200 cursor-pointer'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs font-black uppercase">
                    Despertar ({selectedHero.awakening}/5)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedHero.level >= 200 ? 'Disponível (+50% Permanente)' : 'Requer Nv. 200'}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};
