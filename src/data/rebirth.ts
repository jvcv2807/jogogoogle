/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RebirthBonus } from '../types/game';

export const INITIAL_REBIRTH_TREE: RebirthBonus[] = [
  {
    id: 'rb_dmg',
    name: 'Poder Ancestral',
    description: '+10% de dano permanente para toda a equipe.',
    cost: 10,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 50,
    valuePerLevel: 10,
    type: 'damage'
  },
  {
    id: 'rb_gold',
    name: 'Ganância dos Reis',
    description: '+10% de ouro obtido em todas as batalhas.',
    cost: 8,
    costMultiplier: 1.4,
    level: 0,
    maxLevel: 50,
    valuePerLevel: 10,
    type: 'gold'
  },
  {
    id: 'rb_exp',
    name: 'Sabedoria Antiga',
    description: '+5% de experiência permanente para os heróis.',
    cost: 12,
    costMultiplier: 1.45,
    level: 0,
    maxLevel: 40,
    valuePerLevel: 5,
    type: 'exp'
  },
  {
    id: 'rb_crit',
    name: 'Instinto Primordial',
    description: '+3% de chance de acerto crítico global.',
    cost: 15,
    costMultiplier: 1.6,
    level: 0,
    maxLevel: 25,
    valuePerLevel: 3,
    type: 'crit'
  },
  {
    id: 'rb_speed',
    name: 'Agilidade Etérea',
    description: '+5% de velocidade de ataque para todos os heróis.',
    cost: 15,
    costMultiplier: 1.5,
    level: 0,
    maxLevel: 30,
    valuePerLevel: 5,
    type: 'speed'
  },
  {
    id: 'rb_break',
    name: 'Impacto Esmagador',
    description: '+15% de poder de quebra da barra de defesa dos chefões.',
    cost: 12,
    costMultiplier: 1.45,
    level: 0,
    maxLevel: 40,
    valuePerLevel: 15,
    type: 'break_power'
  }
];

export function calculateSoulsOnRebirth(highestFloor: number, totalBosses: number): number {
  if (highestFloor < 20) return 0;
  // Exponential base on floor reached past 20 + bonus for bosses killed
  const floorFactor = Math.floor(Math.pow(highestFloor - 19, 1.35) * 5);
  const bossFactor = Math.floor(totalBosses * 0.5);
  return Math.max(10, floorFactor + bossFactor);
}
