/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Equipment, EquipmentSlot, ItemRarity, ElementType } from '../types/game';

export const RARITY_CONFIG: Record<ItemRarity, { color: string; border: string; bg: string; multiplier: number }> = {
  Comum: { color: '#94a3b8', border: 'border-slate-500', bg: 'bg-slate-900/50', multiplier: 1.0 },
  Incomum: { color: '#22c55e', border: 'border-emerald-500', bg: 'bg-emerald-950/40', multiplier: 1.4 },
  Raro: { color: '#3b82f6', border: 'border-blue-500', bg: 'bg-blue-950/40', multiplier: 2.0 },
  Épico: { color: '#a855f7', border: 'border-purple-500', bg: 'bg-purple-950/40', multiplier: 3.2 },
  Lendário: { color: '#f59e0b', border: 'border-amber-500', bg: 'bg-amber-950/40', multiplier: 5.0 },
  Mítico: { color: '#ef4444', border: 'border-rose-500', bg: 'bg-rose-950/40', multiplier: 8.5 },
  Divino: { color: '#ec4899', border: 'border-fuchsia-400', bg: 'bg-gradient-to-r from-pink-950/40 to-indigo-950/40', multiplier: 15.0 }
};

export const SLOT_ICONS: Record<EquipmentSlot, string> = {
  Arma: '⚔️',
  Capacete: '🪖',
  Armadura: '🛡️',
  Luvas: '🧤',
  Botas: '🥾',
  Anel: '💍',
  Amuleto: '📿'
};

const ITEM_NAMES: Record<EquipmentSlot, string[]> = {
  Arma: ['Espada Forjada', 'Lâmina do Caos', 'Machado Arcano', 'Arco do Vento', 'Cajado Solar', 'Foice da Ruína', 'Martelo Sísmico', 'Espada do Dragão Ancião'],
  Capacete: ['Elmo de Bronze', 'Capuz das Sombras', 'Coroa Arcana', 'Elmo do Titã', 'Diadema Estelar', 'Máscara Abissal'],
  Armadura: ['Cota de Malha', 'Peitoral de Ferro', 'Traje Espectral', 'Armadura de Dracocouro', 'Manto dos Deuses', 'Armadura Abissal'],
  Luvas: ['Luvas de Couro', 'Manoplas de Aço', 'Garras do Predador', 'Manoplas do Trovão', 'Luvas do Arquimago'],
  Botas: ['Botas de Couro', 'Grevas Pesadas', 'Passos da Tempestade', 'Botas Aladas', 'Grevas do Vazio'],
  Anel: ['Anel de Rubi', 'Aliança do Vento', 'Anel do Eclipse', 'Selo do Imperador', 'Anel da Eternidade'],
  Amuleto: ['Pingente de Jade', 'Talismã da Luz', 'Coração da Fênix', 'Relíquia da Torre', 'Olho de Aetherion']
};

export function generateEquipment(floor: number, forcedRarity?: ItemRarity): Equipment {
  const slots: EquipmentSlot[] = ['Arma', 'Capacete', 'Armadura', 'Luvas', 'Botas', 'Anel', 'Amuleto'];
  const slot = slots[Math.floor(Math.random() * slots.length)];

  // Rarity roll
  let rarity: ItemRarity = 'Comum';
  if (forcedRarity) {
    rarity = forcedRarity;
  } else {
    const roll = Math.random() * 100;
    if (roll > 99.2) rarity = 'Divino';
    else if (roll > 97) rarity = 'Mítico';
    else if (roll > 92) rarity = 'Lendário';
    else if (roll > 80) rarity = 'Épico';
    else if (roll > 60) rarity = 'Raro';
    else if (roll > 35) rarity = 'Incomum';
    else rarity = 'Comum';
  }

  const mult = RARITY_CONFIG[rarity].multiplier;
  const floorScale = 1 + (floor - 1) * 0.15;
  const power = Math.floor(20 * floorScale * mult);

  const baseStat: Equipment['baseStat'] = {};
  if (slot === 'Arma') {
    baseStat.atk = power;
    baseStat.crit = Math.min(30, Math.floor(mult * 2 + 2));
  } else if (slot === 'Capacete' || slot === 'Armadura') {
    baseStat.hp = power * 6;
    baseStat.def = Math.floor(power * 0.4);
  } else if (slot === 'Luvas') {
    baseStat.atk = Math.floor(power * 0.6);
    baseStat.spd = Number((mult * 0.05).toFixed(2));
  } else if (slot === 'Botas') {
    baseStat.def = Math.floor(power * 0.3);
    baseStat.spd = Number((mult * 0.08).toFixed(2));
  } else if (slot === 'Anel') {
    baseStat.atk = Math.floor(power * 0.5);
    baseStat.crit = Math.min(25, Math.floor(mult * 3));
  } else {
    // Amuleto
    baseStat.hp = power * 4;
    baseStat.atk = Math.floor(power * 0.4);
  }

  const namePool = ITEM_NAMES[slot];
  const baseName = namePool[Math.floor(Math.random() * namePool.length)];

  // Bonus effects for higher rarities
  let bonusStat: Equipment['bonusStat'] | undefined;
  let specialEffect: string | undefined;

  if (rarity === 'Lendário' || rarity === 'Mítico' || rarity === 'Divino') {
    const elements: ElementType[] = ['Fogo', 'Natureza', 'Terra', 'Raio', 'Agua', 'Luz', 'Trevas', 'Arcano'];
    const chosenElem = elements[Math.floor(Math.random() * elements.length)];
    bonusStat = {
      elementalDamage: chosenElem,
      elementalBonus: Math.floor(10 * mult),
      lifeSteal: Math.floor(3 * mult),
      breakDamage: Math.floor(15 * mult)
    };
    specialEffect = `Chance de causar dano elemental de ${chosenElem} e +${Math.floor(15 * mult)}% quebra de defesa.`;
  }

  return {
    id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: baseName,
    slot,
    rarity,
    level: 0,
    baseStat,
    bonusStat,
    specialEffect,
    equippedToHeroId: null
  };
}

export function calculateUpgradeCost(eq: Equipment) {
  if (eq.level >= 30) return null;
  const rMult = RARITY_CONFIG[eq.rarity].multiplier;
  const gold = Math.floor(100 * Math.pow(1.18, eq.level) * rMult);
  const stones = Math.max(1, Math.floor((eq.level + 1) * 0.8 * (rMult * 0.5)));
  const successRate = Math.max(25, 100 - eq.level * 2.5);
  return { gold, stones, successRate };
}
