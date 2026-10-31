/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Enemy, Equipment } from '../types/game';
import { formatNumber } from '../utils/numberFormat';
import { RARITY_CONFIG, SLOT_ICONS } from '../data/equipment';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface VictoryModalProps {
  defeatedEnemy: Enemy;
  rewardGold: number;
  rewardCrystals: number;
  rewardStones: number;
  droppedEquipment?: Equipment | null;
  onNextLevel: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  defeatedEnemy,
  rewardGold,
  rewardCrystals,
  rewardStones,
  droppedEquipment,
  onNextLevel
}) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
        className="w-full max-w-md bg-slate-950 border border-amber-500/50 rounded-2xl shadow-2xl p-5 text-center text-slate-100 space-y-4"
      >
        
        {/* Victory Trophy Badge */}
        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-600 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
          <Trophy className="w-8 h-8 text-slate-950" />
        </div>

        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
            {defeatedEnemy.isSupremeBoss ? '👑 SOBERANO DESTRUÍDO!' : 'CHEFÃO DERROTADO!'}
          </span>
          <h2 className="text-xl font-black text-white font-['Cinzel'] mt-0.5">
            {defeatedEnemy.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            A defesa do abismo foi quebrada! Os despojos de batalha foram conquistados.
          </p>
        </div>

        {/* Loot Rewards Box */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Recompensas Obtidas:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="text-amber-400">🪙 +{formatNumber(rewardGold)} Ouro</span>
            <span className="text-sky-400">💎 +{rewardCrystals} Cristais</span>
            <span className="text-emerald-400">🪨 +{rewardStones} Pedras</span>
          </div>

          {/* Dropped Equipment Card if any */}
          {droppedEquipment && (
            <div className={`mt-2 p-2 rounded-lg border text-left flex items-center gap-2.5 ${RARITY_CONFIG[droppedEquipment.rarity].border} ${RARITY_CONFIG[droppedEquipment.rarity].bg}`}>
              <span className="text-2xl">{SLOT_ICONS[droppedEquipment.slot]}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate" style={{ color: RARITY_CONFIG[droppedEquipment.rarity].color }}>
                  {droppedEquipment.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {droppedEquipment.slot} · {droppedEquipment.rarity}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={onNextLevel}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Avançar para o Próximo Nível</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </motion.div>
    </motion.div>
  );
};
