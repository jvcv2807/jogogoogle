/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Equipment, EquipmentSlot, Hero } from '../types/game';
import { RARITY_CONFIG, SLOT_ICONS, calculateUpgradeCost } from '../data/equipment';
import { formatNumber } from '../utils/numberFormat';
import { X, ArrowUpCircle, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface InventoryModalProps {
  inventory: Equipment[];
  heroes: Hero[];
  gold: number;
  enhancementStones: number;
  onClose: () => void;
  onEquipItem: (itemId: string, heroId: string) => void;
  onUnequipItem: (itemId: string) => void;
  onUpgradeItem: (itemId: string) => void;
  onDismantleItem: (itemId: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  heroes,
  gold,
  enhancementStones,
  onClose,
  onEquipItem,
  onUnequipItem,
  onUpgradeItem,
  onDismantleItem
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<EquipmentSlot | 'All'>('All');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(inventory[0]?.id || null);
  const [targetHeroId, setTargetHeroId] = useState<string>(heroes[0]?.id || '');

  const filteredItems = inventory.filter(item => {
    if (selectedSlotFilter === 'All') return true;
    return item.slot === selectedSlotFilter;
  });

  const selectedItem = inventory.find(i => i.id === selectedItemId);
  const upgradeCost = selectedItem ? calculateUpgradeCost(selectedItem) : null;
  const canUpgrade = upgradeCost && gold >= upgradeCost.gold && enhancementStones >= upgradeCost.stones;

  const equippedHero = selectedItem?.equippedToHeroId 
    ? heroes.find(h => h.id === selectedItem.equippedToHeroId) 
    : null;

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
            <span className="text-xl">🛡️</span>
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-400">
              Arsenal & Equipamentos (+30)
            </h2>
            <span className="text-xs text-slate-400">
              · {inventory.length} Itens no Inventário
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Category Filter Tabs */}
        <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800 flex flex-wrap gap-1">
          {(['All', 'Arma', 'Capacete', 'Armadura', 'Luvas', 'Botas', 'Anel', 'Amuleto'] as (EquipmentSlot | 'All')[]).map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlotFilter(slot)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition flex items-center gap-1 ${
                selectedSlotFilter === slot
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{slot === 'All' ? '🎒 Todos' : `${SLOT_ICONS[slot]} ${slot}`}</span>
            </button>
          ))}
        </div>

        {/* Body columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Inventory Items Grid */}
          <div className="w-full md:w-7/12 p-3 border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto max-h-64 md:max-h-none">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Nenhum equipamento encontrado nesta categoria. Derrote monstros ou use o Altar de Invocação!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredItems.map((item) => {
                  const cfg = RARITY_CONFIG[item.rarity];
                  const isSelected = item.id === selectedItemId;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : `${cfg.border} hover:bg-slate-900`
                      } ${cfg.bg}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{SLOT_ICONS[item.slot]}</span>
                        <span className="text-[10px] font-black font-mono text-amber-400">
                          +{item.level}
                        </span>
                      </div>

                      <div className="font-bold text-xs truncate" style={{ color: cfg.color }}>
                        {item.name}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{item.rarity}</span>
                        {item.equippedToHeroId && (
                          <span className="text-emerald-400 font-bold">Equipado</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Item Detail & Upgrade Panel */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {selectedItem ? (
              <>
                {/* Item Card Banner */}
                <div className={`p-3.5 rounded-xl border ${RARITY_CONFIG[selectedItem.rarity].border} ${RARITY_CONFIG[selectedItem.rarity].bg}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{SLOT_ICONS[selectedItem.slot]}</span>
                    <span className="text-sm font-black font-mono text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      Nível de Reforço: +{selectedItem.level}/30
                    </span>
                  </div>

                  <h3 className="text-lg font-black" style={{ color: RARITY_CONFIG[selectedItem.rarity].color }}>
                    {selectedItem.name}
                  </h3>

                  <div className="text-xs text-slate-300 font-semibold mt-0.5">
                    {selectedItem.slot} · Raridade {selectedItem.rarity}
                  </div>

                  {/* Attributes list */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {selectedItem.baseStat.atk && (
                      <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-400">Ataque:</span>{' '}
                        <span className="font-bold text-amber-400">+{formatNumber(selectedItem.baseStat.atk * (1 + selectedItem.level * 0.15))}</span>
                      </div>
                    )}
                    {selectedItem.baseStat.hp && (
                      <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-400">Vida:</span>{' '}
                        <span className="font-bold text-rose-400">+{formatNumber(selectedItem.baseStat.hp * (1 + selectedItem.level * 0.15))}</span>
                      </div>
                    )}
                    {selectedItem.baseStat.def && (
                      <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-400">Defesa:</span>{' '}
                        <span className="font-bold text-blue-400">+{formatNumber(selectedItem.baseStat.def * (1 + selectedItem.level * 0.15))}</span>
                      </div>
                    )}
                    {selectedItem.baseStat.crit && (
                      <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-400">Crítico:</span>{' '}
                        <span className="font-bold text-purple-400">+{selectedItem.baseStat.crit}%</span>
                      </div>
                    )}
                  </div>

                  {selectedItem.specialEffect && (
                    <div className="mt-2 text-xs text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                      ⚡ {selectedItem.specialEffect}
                    </div>
                  )}

                  {equippedHero && (
                    <div className="mt-2 text-xs text-emerald-400 font-bold">
                      Equipado em: {equippedHero.name} ({equippedHero.heroClass})
                    </div>
                  )}
                </div>

                {/* Equip / Unequip actions */}
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Equipar no Campeão:
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={targetHeroId}
                      onChange={(e) => setTargetHeroId(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 text-xs text-white rounded px-2.5 py-1.5"
                    >
                      {heroes.filter(h => h.unlocked).map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} (Nv. {h.level} {h.heroClass})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => onEquipItem(selectedItem.id, targetHeroId)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition"
                    >
                      Equipar
                    </button>

                    {selectedItem.equippedToHeroId && (
                      <button
                        onClick={() => onUnequipItem(selectedItem.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition border border-slate-700"
                      >
                        Desequipar
                      </button>
                    )}
                  </div>
                </div>

                {/* Upgrade System (+30) */}
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Forja de Reforço (+30)
                    </span>
                    {upgradeCost && (
                      <span className="text-xs text-slate-400 font-mono">
                        Taxa de Sucesso: <span className="text-emerald-400 font-bold">{upgradeCost.successRate}%</span>
                      </span>
                    )}
                  </div>

                  {upgradeCost ? (
                    <button
                      disabled={!canUpgrade}
                      onClick={() => onUpgradeItem(selectedItem.id)}
                      className={`w-full py-2.5 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                        canUpgrade
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>Reforçar para +{selectedItem.level + 1}</span>
                      <span className="font-normal opacity-90">
                        (🪙 {formatNumber(upgradeCost.gold)} · 🪨 {upgradeCost.stones} Pedras)
                      </span>
                    </button>
                  ) : (
                    <div className="text-center py-2 text-xs font-bold text-amber-400">
                      ⭐ NÍVEL MÁXIMO (+30) ALCANÇADO!
                    </div>
                  )}

                  {/* Dismantle button */}
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => onDismantleItem(selectedItem.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Desmontar (Recupera Ouro e Pedras)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm">
                Selecione um equipamento para ver detalhes e melhorias.
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};
