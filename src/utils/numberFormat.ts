/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementType } from '../types/game';

const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 
  'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg'
];

/**
 * Formats large RPG numbers cleanly into readable strings (e.g. 1.25K, 45.8M)
 */
export function formatNumber(val: number): string {
  if (!isFinite(val) || isNaN(val)) return '0';
  if (Math.abs(val) < 1000) {
    return Math.floor(val).toLocaleString('pt-BR');
  }

  const tier = Math.floor(Math.log10(Math.abs(val)) / 3);
  if (tier >= SUFFIXES.length) {
    return val.toExponential(2);
  }

  const suffix = SUFFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = val / scale;

  return `${scaled.toFixed(1)}${suffix}`;
}

/**
 * Calculates boss HP based on the formula: HP(n) = 250 * (1.085)^(n-1)
 * n is global level (1 to 1000)
 */
export function calculateBossHp(globalLevel: number, isSupreme: boolean = false): number {
  const base = 250 * Math.pow(1.085, globalLevel - 1);
  return Math.floor(isSupreme ? base * 3.5 : base);
}

/**
 * Calculates boss ATK based on the formula: ATK(n) = 18 * (1.065)^(n-1)
 */
export function calculateBossAtk(globalLevel: number, isSupreme: boolean = false): number {
  const base = 18 * Math.pow(1.065, globalLevel - 1);
  return Math.floor(isSupreme ? base * 1.8 : base);
}

/**
 * Elemental advantage table:
 * Fogo > Natureza > Terra > Raio > Água > Fogo
 * Luz <> Trevas (deal 1.5x to each other)
 * Arcano = Neutral (1.0x to all, 1.0x taken)
 */
export function getElementalMultiplier(attacker: ElementType, defender: ElementType): { multiplier: number; label: string } {
  if (attacker === 'Arcano' || defender === 'Arcano') {
    return { multiplier: 1.0, label: 'Neutro' };
  }

  if (attacker === 'Luz' && defender === 'Trevas') return { multiplier: 1.5, label: 'Super Efetivo!' };
  if (attacker === 'Trevas' && defender === 'Luz') return { multiplier: 1.5, label: 'Super Efetivo!' };

  const cycle: Record<ElementType, ElementType> = {
    'Fogo': 'Natureza',
    'Natureza': 'Terra',
    'Terra': 'Raio',
    'Raio': 'Agua',
    'Agua': 'Fogo',
    'Luz': 'Trevas',
    'Trevas': 'Luz',
    'Arcano': 'Arcano'
  };

  if (cycle[attacker] === defender) {
    return { multiplier: 1.5, label: 'Fraqueza Elemental (+50%)' };
  }

  // Reverse disadvantage
  if (cycle[defender] === attacker) {
    return { multiplier: 0.8, label: 'Resistência (-20%)' };
  }

  return { multiplier: 1.0, label: 'Neutro' };
}

export function getElementColor(element: ElementType): string {
  switch (element) {
    case 'Fogo': return '#ef4444'; // Red
    case 'Natureza': return '#22c55e'; // Green
    case 'Terra': return '#d97706'; // Amber / brown
    case 'Raio': return '#eab308'; // Yellow
    case 'Agua': return '#06b6d4'; // Cyan
    case 'Luz': return '#fef08a'; // Bright Gold
    case 'Trevas': return '#a855f7'; // Purple
    case 'Arcano': return '#ec4899'; // Magenta / pink
    default: return '#94a3b8';
  }
}
