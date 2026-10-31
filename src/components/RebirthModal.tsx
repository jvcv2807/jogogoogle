/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RebirthBonus } from '../types/game';
import { calculateSoulsOnRebirth } from '../data/rebirth';
import { formatNumber } from '../utils/numberFormat';
import { X, RefreshCw, Sparkles, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RebirthModalProps {
  rebirthTree: RebirthBonus[];
  ancestralSouls: number;
  highestFloor: number;
  totalBossesDefeated: number;
  rebirthCount: number;
  onClose: () => void;
  onUpgradeBonus: (bonusId: string) => void;
  onPerformRebirth: () => void;
}

export const RebirthModal: React.FC<RebirthModalProps> = ({
  rebirthTree,
  ancestralSouls,
  highestFloor,
  totalBossesDefeated,
  rebirthCount,
  onClose,
  onUpgradeBonus,
  onPerformRebirth
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const soulsEarnable = calculateSoulsOnRebirth(highestFloor, totalBossesDefeated);
  const isUnlocked = highestFloor >= 20;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-950 border border-purple-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-spin duration-3000">🔮</span>
            <div>
              <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-purple-300">
                Árvore das Almas Ancestrais & Renascimento
              </h2>
              <p className="text-xs text-slate-400">
                Renascimento #{rebirthCount} · Conquistas e Heróis são eternos.
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

        {/* Top Banner: Status & Rebirth Action */}
        <div className="p-4 bg-purple-950/20 border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">
              Saldo de Almas Ancestrais
            </div>
            <div className="text-2xl font-black font-mono text-purple-200 flex items-center gap-1.5">
              <span>🔮 {formatNumber(ancestralSouls)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">
                Almas ao Renascer:
              </div>
              <div className="text-base font-bold text-amber-400 font-mono">
                +{formatNumber(soulsEarnable)} Almas
              </div>
            </div>

            {isUnlocked ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                Renascer Agora
              </button>
            ) : (
              <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800 px-3 py-1.5 rounded font-bold">
                🔒 Desbloqueia após o Andar 20 (Atual: Andar {highestFloor})
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal overlay */}
        {showConfirm && (
          <div className="p-4 bg-rose-950/80 border-b border-rose-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>
                <strong>Confirmar Renascimento?</strong> O progresso da torre voltará ao Andar 1, mas você receberá{' '}
                <strong className="text-amber-300">+{formatNumber(soulsEarnable)} Almas</strong>. Seus heróis, equipamentos e bestiário continuarão salvos!
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onPerformRebirth();
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold uppercase tracking-wider text-[11px]"
              >
                Sim, Renascer!
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold uppercase tracking-wider text-[11px]"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Upgrades Tree */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Melhorias Permanentes das Almas:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rebirthTree.map((bonus) => {
              const currentCost = Math.floor(bonus.cost * Math.pow(bonus.costMultiplier, bonus.level));
              const canAfford = ancestralSouls >= currentCost && bonus.level < bonus.maxLevel;
              const isMax = bonus.level >= bonus.maxLevel;

              return (
                <div
                  key={bonus.id}
                  className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2 hover:border-purple-500/50 transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        {bonus.name}
                      </h4>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        Nv. {bonus.level}/{bonus.maxLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {bonus.description}
                    </p>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Bônus Atual: +{bonus.level * bonus.valuePerLevel}%
                    </div>
                  </div>

                  <button
                    disabled={!canAfford || isMax}
                    onClick={() => onUpgradeBonus(bonus.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                      isMax
                        ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      'Nível Máximo'
                    ) : (
                      <>
                        <span>Aprimorar (+{bonus.valuePerLevel}%)</span>
                        <span className="font-mono text-purple-200">🔮 {formatNumber(currentCost)}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
