/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementType = 'Fogo' | 'Natureza' | 'Terra' | 'Raio' | 'Agua' | 'Luz' | 'Trevas' | 'Arcano';

export type HeroClass = 'Guerreiro' | 'Arqueira' | 'Mago' | 'Sacerdotisa' | 'Assassino' | 'Paladino' | 'Berserker' | 'Necromante' | 'Feiticeira' | 'Druida' | 'Cavaleira' | 'Ceifador' | 'Arquimago' | 'Guardiã' | 'Bárbaro' | 'Invocadora' | 'Duelista' | 'Bruxa' | 'Caçador' | 'Cavaleiro Abissal';

export type EquipmentSlot = 'Arma' | 'Capacete' | 'Armadura' | 'Luvas' | 'Botas' | 'Anel' | 'Amuleto';

export type ItemRarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico' | 'Divino';

export type BossArchetype = 
  | 'Brutamontes'
  | 'Caçador'
  | 'Feiticeiro'
  | 'Assassino'
  | 'Berserker'
  | 'Corruptor'
  | 'Guardião'
  | 'Invocador'
  | 'General'
  | 'Soberano';

export interface HeroSkill {
  id: string;
  name: string;
  description: string;
  multiplier: number; // e.g., 1.8 for 180%
  cooldown: number; // seconds
  currentCooldown: number;
  icon: string;
  type: 'damage' | 'heal' | 'buff' | 'aoe' | 'debuff';
}

export interface HeroPassive {
  name: string;
  description: string;
  bonusType: 'damage' | 'crit' | 'speed' | 'defense' | 'heal_boost';
  bonusValue: number;
}

export interface HeroUltimate {
  name: string;
  description: string;
  multiplier: number;
  chargeTime: number; // seconds to charge
  currentCharge: number;
  icon: string;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  heroClass: HeroClass;
  rarity: ItemRarity;
  element: ElementType;
  specialty: string;
  level: number;
  stars: number; // 1 to 6
  awakening: number; // 0 to 5
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number; // attack speed (attacks per 5 sec)
  baseCrit: number; // percentage (e.g. 10)
  currentHp: number;
  skills: HeroSkill[];
  passive: HeroPassive;
  ultimate: HeroUltimate;
  unlocked: boolean;
  shards: number;
  color: string;
  accentColor: string;
  avatarSprite: string;
}

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  level: number; // +0 to +30
  baseStat: {
    atk?: number;
    hp?: number;
    def?: number;
    crit?: number;
    spd?: number;
  };
  bonusStat?: {
    elementalDamage?: ElementType;
    elementalBonus?: number;
    lifeSteal?: number;
    breakDamage?: number;
  };
  specialEffect?: string;
  equippedToHeroId?: string | null;
}

export interface Enemy {
  id: string;
  name: string;
  title?: string;
  isBoss: boolean;
  isSupremeBoss: boolean;
  archetype?: BossArchetype;
  stageType: 'horde' | 'elite' | 'boss';
  element: ElementType;
  level: number;
  maxHp: number;
  currentHp: number;
  maxBreakGauge: number;
  currentBreakGauge: number;
  isStunned: boolean;
  stunTimer: number;
  atk: number;
  def: number;
  attackInterval: number; // seconds
  attackTimer: number;
  phase?: number; // 1, 2, or 3 for Supreme Bosses
  specialAbility?: string;
  color: string;
  accentColor: string;
  sizeMultiplier: number;
}

export interface FloorTheme {
  floorNumber: number;
  name: string;
  chapter: number;
  chapterName: string;
  theme: string;
  environmentName: string;
  bgColor: string;
  skyColor: string;
  groundColor: string;
  accentColor: string;
  sovereignName: string;
  element: ElementType;
  ambientParticles: 'spores' | 'fire' | 'snow' | 'lightning' | 'souls' | 'sparks' | 'bubbles' | 'void' | 'stars' | 'crystals';
}

export interface Chapter {
  id: number;
  title: string;
  roman: string;
  floorsRange: [number, number];
  guardianName: string;
  guardianTitle: string;
  element: ElementType;
  description: string;
}

export interface RebirthBonus {
  id: string;
  name: string;
  description: string;
  cost: number;
  costMultiplier: number;
  level: number;
  maxLevel: number;
  valuePerLevel: number;
  type: 'damage' | 'gold' | 'exp' | 'crit' | 'speed' | 'break_power';
}

export interface BestiaryEntry {
  floor: number;
  level: number;
  bossName: string;
  archetype: BossArchetype;
  element: ElementType;
  killCount: number;
  discoveredAt: string;
}

export interface PlayerStats {
  gold: number;
  crystals: number;
  ancestralSouls: number;
  enhancementStones: number;
  dungeonKeys: number;
  totalDamageDealt: number;
  totalClicks: number;
  totalBossesDefeated: number;
  rebirthCount: number;
}

export interface GameSettings {
  autoProgress: boolean;
  autoSkills: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  screenShake: boolean;
  damageNumbers: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
  life: number; // 0 to 1
  vy: number;
  vx: number;
}

export interface HitParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}
