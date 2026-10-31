/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hero } from '../types/game';
import { getElementColor } from '../utils/numberFormat';
import { Zap, Flame, Shield, Sparkles } from 'lucide-react';
import { HeroPortrait } from './HeroPortrait';

interface CombatControlsProps {
  heroes: Hero[];
  onTriggerSkill: (heroId: string, skillId: string) => void;
  onTriggerUltimate: (heroId: string) => void;
}

export const CombatControls: React.FC<CombatControlsProps> = ({
  heroes,
  onTriggerSkill,
  onTriggerUltimate
}) => {
  return (
    <div className="w-full bg-slate-950/90 border-t border-slate-800 p-2 sm:p-3 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {heroes.map((hero) => {
          const elemColor = getElementColor(hero.element);
          const ultReady = hero.ultimate.currentCharge >= hero.ultimate.chargeTime;
          const ultPercent = Math.min(1, hero.ultimate.currentCharge / hero.ultimate.chargeTime);

          return (
            <div
              key={hero.id}
              className="bg-slate-900/90 rounded-lg border border-slate-800 p-2 sm:p-2.5 flex flex-col justify-between relative overflow-hidden shadow-md"
            >
              {/* Element colored accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: elemColor }}
              />

              {/* Hero info header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <HeroPortrait heroId={hero.id} element={hero.element} size={36} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                      {hero.name}
                      <span className="text-[10px] text-amber-400 font-normal">
                        {'★'.repeat(hero.stars)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Nv. {hero.level} · {hero.heroClass}
                    </div>
                  </div>
                </div>

                <span
                  className="text-[9px] font-black uppercase px-1 py-0.5 rounded tracking-wider shrink-0"
                  style={{
                    backgroundColor: elemColor + '25',
                    color: elemColor
                  }}
                >
                  {hero.element}
                </span>
              </div>

              {/* Active Skills row */}
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {hero.skills.map((skill) => {
                  const onCd = skill.currentCooldown > 0;
                  return (
                    <button
                      key={skill.id}
                      disabled={onCd}
                      onClick={() => onTriggerSkill(hero.id, skill.id)}
                      title={`${skill.name} (${skill.description})`}
                      className={`relative flex items-center gap-1 p-1 rounded text-left border transition text-[11px] ${
                        onCd
                          ? 'bg-slate-950/80 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200 active:scale-95'
                      }`}
                    >
                      <span className="text-sm">{skill.icon}</span>
                      <span className="truncate font-semibold">{skill.name}</span>
                      {onCd && (
                        <span className="absolute right-1 text-[10px] font-mono font-bold text-amber-400">
                          {Math.ceil(skill.currentCooldown)}s
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Ultimate Power Button */}
              <button
                disabled={!ultReady}
                onClick={() => onTriggerUltimate(hero.id)}
                title={`${hero.ultimate.name}: ${hero.ultimate.description}`}
                className={`w-full py-1.5 px-2 rounded font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition relative overflow-hidden shadow ${
                  ultReady
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white animate-pulse border border-amber-300 ring-2 ring-amber-500/50 cursor-pointer active:scale-95'
                    : 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {/* Progress fill behind button when charging */}
                {!ultReady && (
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-950/70 -z-0 transition-all duration-200"
                    style={{ width: `${ultPercent * 100}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className="text-sm">{hero.ultimate.icon}</span>
                  <span className="truncate">
                    {ultReady ? `🔥 ${hero.ultimate.name}!` : `${hero.ultimate.name} (${Math.round(ultPercent * 100)}%)`}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
