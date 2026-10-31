/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  Hero, 
  Enemy, 
  Equipment, 
  PlayerStats, 
  RebirthBonus, 
  BestiaryEntry, 
  FloatingText, 
  HitParticle 
} from '../types/game';
import { INITIAL_HEROES, calculateHeroStats, getHeroCostForLevelUp } from '../data/heroes';
import { getFloorTheme, generateEnemy } from '../data/chapters';
import { INITIAL_REBIRTH_TREE, calculateSoulsOnRebirth } from '../data/rebirth';
import { generateEquipment, calculateUpgradeCost } from '../data/equipment';
import { formatNumber, getElementalMultiplier } from '../utils/numberFormat';
import { sound } from '../utils/audio';

export type GameDifficulty = 'normal' | 'dificil' | 'abissal';

export interface GameStoreState {
  // Game shell & flow
  gameState: 'title' | 'playing';
  currentFloor: number;
  highestFloor: number;
  currentLevel: number;
  stage: 'horde' | 'elite' | 'boss';
  difficulty: GameDifficulty;
  tutorialCompleted: boolean;
  highContrast: boolean;

  // Economy & stats
  playerStats: PlayerStats;
  heroes: Hero[];
  activeTeamIds: string[];
  inventory: Equipment[];
  rebirthTree: RebirthBonus[];
  bestiary: BestiaryEntry[];

  // Ephemeral combat state
  enemy: Enemy | null;
  combo: number;
  comboTimer: number;
  screenShake: number;
  floatingTexts: FloatingText[];
  hitParticles: HitParticle[];

  // Settings
  autoProgress: boolean;
  autoSkills: boolean;
  isMuted: boolean;

  // Active modal
  activeModal: 'heroes' | 'inventory' | 'summon' | 'rebirth' | 'bestiary' | 'modes' | 'story' | 'settings' | null;
  victoryData: {
    enemy: Enemy;
    gold: number;
    crystals: number;
    stones: number;
    equipment?: Equipment | null;
  } | null;

  // Actions
  setGameState: (state: 'title' | 'playing') => void;
  setActiveModal: (modal: GameStoreState['activeModal']) => void;
  setVictoryData: (data: GameStoreState['victoryData']) => void;
  setDifficulty: (diff: GameDifficulty) => void;
  setTutorialCompleted: (completed: boolean) => void;
  toggleHighContrast: () => void;
  toggleAutoProgress: () => void;
  toggleAutoSkills: () => void;
  toggleMute: () => void;
  changeFloor: (targetFloor: number) => void;

  // Combat actions
  tapAttack: (clickX: number, clickY: number) => void;
  triggerSkill: (heroId: string, skillId: string) => void;
  triggerUltimate: (heroId: string) => void;
  tickGame: (dt: number) => void;
  defeatEnemy: (defeated: Enemy) => void;
  continueNextLevel: () => void;

  // Hero management
  levelUpHero: (heroId: string) => void;
  ascendStar: (heroId: string) => void;
  awakenHero: (heroId: string) => void;
  toggleActiveTeam: (heroId: string) => void;

  // Equipment management
  equipItem: (itemId: string, heroId: string) => void;
  unequipItem: (itemId: string) => void;
  upgradeItem: (itemId: string) => void;
  dismantleItem: (itemId: string) => void;

  // Rebirth & Summon & Expeditions
  performRebirth: () => void;
  upgradeRebirthBonus: (bonusId: string) => void;
  addSummonRewards: (cost: number, unlockedHeroIds: string[], shardsMap: Record<string, number>, newEquips: Equipment[]) => void;
  claimExpedition: (gold: number, crystals: number, stones: number) => void;
  claimTitan: (gold: number, crystals: number) => void;
}

const SAVE_KEY = 'dungeon_breakers_save_v2';

function loadInitialState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentFloor: parsed.currentFloor || 1,
        highestFloor: parsed.highestFloor || 1,
        currentLevel: parsed.currentLevel || 1,
        difficulty: parsed.difficulty || 'normal',
        tutorialCompleted: parsed.tutorialCompleted ?? false,
        highContrast: parsed.highContrast ?? false,
        playerStats: parsed.playerStats || {
          gold: 500,
          crystals: 250,
          ancestralSouls: 0,
          enhancementStones: 20,
          dungeonKeys: 5,
          totalDamageDealt: 0,
          totalClicks: 0,
          totalBossesDefeated: 0,
          rebirthCount: 0
        },
        activeTeamIds: parsed.activeTeamIds || ['hero_arthur', 'hero_lyra', 'hero_kael', 'hero_serena'],
        inventory: parsed.inventory || [generateEquipment(1, 'Comum'), generateEquipment(1, 'Incomum')],
        rebirthTree: parsed.rebirthTree || INITIAL_REBIRTH_TREE,
        bestiary: parsed.bestiary || []
      };
    }
  } catch {
    // fallback
  }
  return {
    currentFloor: 1,
    highestFloor: 1,
    currentLevel: 1,
    difficulty: 'normal' as GameDifficulty,
    tutorialCompleted: false,
    highContrast: false,
    playerStats: {
      gold: 500,
      crystals: 250,
      ancestralSouls: 0,
      enhancementStones: 20,
      dungeonKeys: 5,
      totalDamageDealt: 0,
      totalClicks: 0,
      totalBossesDefeated: 0,
      rebirthCount: 0
    },
    activeTeamIds: ['hero_arthur', 'hero_lyra', 'hero_kael', 'hero_serena'],
    inventory: [generateEquipment(1, 'Comum'), generateEquipment(1, 'Incomum')],
    rebirthTree: INITIAL_REBIRTH_TREE,
    bestiary: []
  };
}

const init = loadInitialState();

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameState: 'title',
  currentFloor: init.currentFloor,
  highestFloor: init.highestFloor,
  currentLevel: init.currentLevel,
  stage: 'horde',
  difficulty: init.difficulty,
  tutorialCompleted: init.tutorialCompleted,
  highContrast: init.highContrast,

  playerStats: init.playerStats,
  heroes: INITIAL_HEROES,
  activeTeamIds: init.activeTeamIds,
  inventory: init.inventory,
  rebirthTree: init.rebirthTree,
  bestiary: init.bestiary,

  enemy: generateEnemy(init.currentFloor, init.currentLevel, 'horde'),
  combo: 0,
  comboTimer: 0,
  screenShake: 0,
  floatingTexts: [],
  hitParticles: [],

  autoProgress: true,
  autoSkills: true,
  isMuted: false,

  activeModal: null,
  victoryData: null,

  setGameState: (st) => {
    set({ gameState: st });
    if (st === 'playing') {
      sound.startMusic();
      sound.playBossRoar();
    }
  },

  setActiveModal: (modal) => set({ activeModal: modal }),
  setVictoryData: (data) => set({ victoryData: data }),
  setDifficulty: (diff) => {
    set({ difficulty: diff });
    // Regenerate current enemy with new difficulty scaling
    const s = get();
    set({ enemy: generateEnemy(s.currentFloor, s.currentLevel, s.stage) });
  },
  setTutorialCompleted: (completed) => set({ tutorialCompleted: completed }),
  toggleHighContrast: () => set(s => ({ highContrast: !s.highContrast })),

  toggleAutoProgress: () => set(s => ({ autoProgress: !s.autoProgress })),
  toggleAutoSkills: () => set(s => ({ autoSkills: !s.autoSkills })),
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next });
    sound.setMute(next);
  },

  changeFloor: (targetFloor) => {
    const { highestFloor } = get();
    if (targetFloor < 1 || targetFloor > highestFloor) return;
    set({
      currentFloor: targetFloor,
      currentLevel: 1,
      stage: 'horde',
      enemy: generateEnemy(targetFloor, 1, 'horde')
    });
  },

  tapAttack: (clickX, clickY) => {
    const s = get();
    if (!s.enemy || s.enemy.currentHp <= 0) return;

    const activeHeroes = s.heroes.filter(h => s.activeTeamIds.includes(h.id));
    const combinedTeamAtk = activeHeroes.reduce((acc, h) => acc + calculateHeroStats(h).atk, 0);

    const dmgBonus = 1 + (s.rebirthTree.find(r => r.type === 'damage')?.level || 0) * 0.10;
    const critBonus = (s.rebirthTree.find(r => r.type === 'crit')?.level || 0) * 3;
    const breakBonus = 1 + (s.rebirthTree.find(r => r.type === 'break_power')?.level || 0) * 0.15;

    const baseTap = Math.max(12, Math.floor(combinedTeamAtk * 0.45));
    const comboMult = 1 + Math.min(2.0, s.combo * 0.05);
    let finalDmg = Math.floor(baseTap * comboMult * dmgBonus);

    if (s.enemy.isStunned) finalDmg *= 2.0;

    const isCrit = (Math.random() * 100) < (15 + critBonus);
    if (isCrit) finalDmg *= 1.8;
    finalDmg = Math.max(1, Math.floor(finalDmg));

    const breakDmg = Math.floor(finalDmg * 0.45 * breakBonus * 2.5);

    // Audio & Shake
    if (isCrit) {
      sound.playCrit();
      set({ screenShake: 4 });
    } else {
      sound.playSlash();
    }

    // Spawn floating texts & particles
    const posX = clickX || 450 + (Math.random() - 0.5) * 50;
    const posY = clickY || 180 + (Math.random() - 0.5) * 40;
    const color = isCrit ? '#facc15' : '#f87171';

    const newFt: FloatingText = {
      id: `${Date.now()}_${Math.random()}`,
      x: posX,
      y: posY,
      text: formatNumber(finalDmg),
      color,
      scale: isCrit ? 1.3 : 1.0,
      life: 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2.5 - Math.random() * 1.5
    };

    const newParticles: HitParticle[] = [];
    for (let i = 0; i < (isCrit ? 10 : 5); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        x: posX,
        y: posY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        alpha: 1,
        life: 1
      });
    }

    // Apply HP reduction
    let nextHp = Math.max(0, s.enemy.currentHp - finalDmg);
    let nextBreak = s.enemy.currentBreakGauge;
    let stunned = s.enemy.isStunned;
    let stunTime = s.enemy.stunTimer;

    if (!stunned) {
      nextBreak = Math.max(0, s.enemy.currentBreakGauge - breakDmg);
      if (nextBreak <= 0) {
        stunned = true;
        stunTime = 5.0;
        sound.playBreakShatter();
        set({ screenShake: 8 });
      }
    }

    set(prev => ({
      combo: prev.combo + 1,
      comboTimer: 2.5,
      floatingTexts: [...prev.floatingTexts.slice(-15), newFt],
      hitParticles: [...prev.hitParticles.slice(-40), ...newParticles],
      playerStats: {
        ...prev.playerStats,
        totalDamageDealt: prev.playerStats.totalDamageDealt + finalDmg,
        totalClicks: prev.playerStats.totalClicks + 1
      },
      enemy: prev.enemy ? {
        ...prev.enemy,
        currentHp: nextHp,
        currentBreakGauge: nextBreak,
        isStunned: stunned,
        stunTimer: stunTime
      } : null
    }));

    if (nextHp <= 0 && s.enemy) {
      setTimeout(() => get().defeatEnemy(s.enemy!), 50);
    }
  },

  triggerSkill: (heroId, skillId) => {
    const s = get();
    const hero = s.heroes.find(h => h.id === heroId);
    if (!hero || !s.enemy || s.enemy.currentHp <= 0) return;
    const skill = hero.skills.find(sk => sk.id === skillId);
    if (!skill || skill.currentCooldown > 0) return;

    sound.playSlash();
    set({ screenShake: 3 });

    // Set cooldown
    set(prev => ({
      heroes: prev.heroes.map(h => h.id === heroId ? {
        ...h,
        skills: h.skills.map(sk => sk.id === skillId ? { ...sk, currentCooldown: sk.cooldown } : sk)
      } : h)
    }));

    const stats = calculateHeroStats(hero);
    const elemAdv = getElementalMultiplier(hero.element, s.enemy.element).multiplier;
    const dmgBonus = 1 + (s.rebirthTree.find(r => r.type === 'damage')?.level || 0) * 0.10;
    let finalDmg = Math.floor(stats.atk * skill.multiplier * elemAdv * dmgBonus);
    if (s.enemy.isStunned) finalDmg *= 2.0;

    const nextHp = Math.max(0, s.enemy.currentHp - finalDmg);
    set(prev => ({
      enemy: prev.enemy ? { ...prev.enemy, currentHp: nextHp } : null,
      floatingTexts: [...prev.floatingTexts.slice(-15), {
        id: `${Date.now()}_${Math.random()}`,
        x: 380,
        y: 150,
        text: `✨ ${skill.name}!`,
        color: '#a855f7',
        scale: 1.25,
        life: 1,
        vx: 0,
        vy: -2
      }]
    }));

    if (nextHp <= 0) {
      setTimeout(() => get().defeatEnemy(s.enemy!), 50);
    }
  },

  triggerUltimate: (heroId) => {
    const s = get();
    const hero = s.heroes.find(h => h.id === heroId);
    if (!hero || !s.enemy || s.enemy.currentHp <= 0) return;
    if (hero.ultimate.currentCharge < hero.ultimate.chargeTime) return;

    sound.playUltimate();
    set({ screenShake: 12 });

    // Reset charge
    set(prev => ({
      heroes: prev.heroes.map(h => h.id === heroId ? {
        ...h,
        ultimate: { ...h.ultimate, currentCharge: 0 }
      } : h)
    }));

    const stats = calculateHeroStats(hero);
    const elemAdv = getElementalMultiplier(hero.element, s.enemy.element).multiplier;
    const dmgBonus = 1 + (s.rebirthTree.find(r => r.type === 'damage')?.level || 0) * 0.10;
    let finalDmg = Math.floor(stats.atk * hero.ultimate.multiplier * elemAdv * dmgBonus * 1.5);
    if (s.enemy.isStunned) finalDmg *= 2.0;

    const nextHp = Math.max(0, s.enemy.currentHp - finalDmg);
    set(prev => ({
      enemy: prev.enemy ? { ...prev.enemy, currentHp: nextHp } : null,
      floatingTexts: [...prev.floatingTexts.slice(-15), {
        id: `${Date.now()}_${Math.random()}`,
        x: 420,
        y: 130,
        text: `💥 ${hero.ultimate.name}!!`,
        color: '#ef4444',
        scale: 1.7,
        life: 1,
        vx: 0,
        vy: -2
      }]
    }));

    if (nextHp <= 0) {
      setTimeout(() => get().defeatEnemy(s.enemy!), 50);
    }
  },

  tickGame: (dt) => {
    const s = get();
    if (s.gameState !== 'playing') return;

    // 1. Combo timer decay
    let nextCombo = s.combo;
    let nextComboTimer = s.comboTimer - dt;
    if (nextComboTimer <= 0) {
      nextCombo = 0;
      nextComboTimer = 0;
    }

    // 2. Shake decay
    const nextShake = Math.max(0, s.screenShake - 0.5);

    // 3. Floating texts & particles
    const nextFt = s.floatingTexts
      .map(ft => ({ ...ft, x: ft.x + ft.vx, y: ft.y + ft.vy, life: ft.life - 0.04 }))
      .filter(ft => ft.life > 0);

    const nextParticles = s.hitParticles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, alpha: p.alpha - 0.05, life: p.life - 0.05 }))
      .filter(p => p.life > 0);

    // 4. Hero skill cooldowns & ultimate charge
    const nextHeroes = s.heroes.map(hero => {
      if (!s.activeTeamIds.includes(hero.id)) return hero;
      const nextCharge = Math.min(hero.ultimate.chargeTime, hero.ultimate.currentCharge + dt);
      const nextSkills = hero.skills.map(sk => ({
        ...sk,
        currentCooldown: Math.max(0, sk.currentCooldown - dt)
      }));
      return {
        ...hero,
        skills: nextSkills,
        ultimate: { ...hero.ultimate, currentCharge: nextCharge }
      };
    });

    // 5. Stun timer countdown
    let nextEnemy = s.enemy;
    if (nextEnemy && nextEnemy.isStunned) {
      const nextStun = nextEnemy.stunTimer - dt;
      if (nextStun <= 0) {
        nextEnemy = {
          ...nextEnemy,
          isStunned: false,
          stunTimer: 0,
          currentBreakGauge: nextEnemy.maxBreakGauge
        };
      } else {
        nextEnemy = { ...nextEnemy, stunTimer: nextStun };
      }
    }

    // 6. Passive auto-attacks
    const spdBonus = 1 + (s.rebirthTree.find(r => r.type === 'speed')?.level || 0) * 0.05;
    const activeHeroes = nextHeroes.filter(h => s.activeTeamIds.includes(h.id));
    let autoDamageTotal = 0;

    activeHeroes.forEach(hero => {
      const stats = calculateHeroStats(hero);
      const attackChance = stats.spd * spdBonus * dt;
      if (Math.random() < attackChance && nextEnemy && nextEnemy.currentHp > 0) {
        const elemAdv = getElementalMultiplier(hero.element, nextEnemy.element).multiplier;
        const dmgBonus = 1 + (s.rebirthTree.find(r => r.type === 'damage')?.level || 0) * 0.10;
        let dmg = Math.floor(stats.atk * 0.85 * elemAdv * dmgBonus);
        if (nextEnemy.isStunned) dmg *= 2.0;
        autoDamageTotal += dmg;
      }
    });

    if (autoDamageTotal > 0 && nextEnemy) {
      const remainingHp = Math.max(0, nextEnemy.currentHp - autoDamageTotal);
      nextEnemy = { ...nextEnemy, currentHp: remainingHp };
      if (remainingHp <= 0) {
        setTimeout(() => get().defeatEnemy(nextEnemy!), 50);
      }
    }

    // 7. Auto cast skills if enabled
    if (s.autoSkills) {
      activeHeroes.forEach(hero => {
        hero.skills.forEach(skill => {
          if (skill.currentCooldown <= 0) {
            get().triggerSkill(hero.id, skill.id);
          }
        });
        if (hero.ultimate.currentCharge >= hero.ultimate.chargeTime) {
          get().triggerUltimate(hero.id);
        }
      });
    }

    set({
      combo: nextCombo,
      comboTimer: nextComboTimer,
      screenShake: nextShake,
      floatingTexts: nextFt,
      hitParticles: nextParticles,
      heroes: nextHeroes,
      enemy: nextEnemy
    });
  },

  defeatEnemy: (defeated) => {
    const s = get();
    sound.playLevelUp();
    set({ screenShake: 6 });

    // Difficulty multipliers
    const diffMult = s.difficulty === 'abissal' ? 1.8 : (s.difficulty === 'dificil' ? 1.3 : 1.0);
    const goldBonus = 1 + (s.rebirthTree.find(r => r.type === 'gold')?.level || 0) * 0.10;

    const baseRewardGold = Math.floor(defeated.level * 45 * goldBonus * diffMult * (defeated.isBoss ? 4 : 1.5));
    const baseRewardCrystals = Math.floor((defeated.isSupremeBoss ? 50 : (defeated.isBoss ? 15 : 2)) * diffMult);
    const baseRewardStones = defeated.isBoss ? (defeated.isSupremeBoss ? 10 : 3) : 1;

    let droppedEq: Equipment | null = null;
    const dropRoll = Math.random() * 100;
    if (defeated.isSupremeBoss || (defeated.isBoss && dropRoll < 45) || dropRoll < 8) {
      droppedEq = generateEquipment(s.currentFloor, defeated.isSupremeBoss ? 'Lendário' : undefined);
      set(prev => ({ inventory: [droppedEq!, ...prev.inventory] }));
    }

    // Update stats
    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        gold: prev.playerStats.gold + baseRewardGold,
        crystals: prev.playerStats.crystals + baseRewardCrystals,
        enhancementStones: prev.playerStats.enhancementStones + baseRewardStones,
        totalBossesDefeated: prev.playerStats.totalBossesDefeated + (defeated.isBoss ? 1 : 0)
      }
    }));

    // Record bestiary
    if (defeated.isBoss) {
      set(prev => {
        const existing = prev.bestiary.find(b => b.floor === s.currentFloor && b.level === s.currentLevel);
        if (existing) {
          return {
            bestiary: prev.bestiary.map(b => b === existing ? { ...b, killCount: b.killCount + 1 } : b)
          };
        }
        return {
          bestiary: [
            ...prev.bestiary,
            {
              floor: s.currentFloor,
              level: s.currentLevel,
              bossName: defeated.name,
              archetype: defeated.archetype || 'Brutamontes',
              element: defeated.element,
              killCount: 1,
              discoveredAt: new Date().toLocaleDateString('pt-BR')
            }
          ]
        };
      });
    }

    // Progression logic
    if (s.stage === 'horde') {
      set({ stage: 'elite', enemy: generateEnemy(s.currentFloor, s.currentLevel, 'elite') });
    } else if (s.stage === 'elite') {
      set({ stage: 'boss', enemy: generateEnemy(s.currentFloor, s.currentLevel, 'boss') });
    } else {
      // Completed level
      if (s.currentLevel < 10) {
        if (s.autoProgress) {
          set(prev => ({
            currentLevel: prev.currentLevel + 1,
            stage: 'horde',
            enemy: generateEnemy(prev.currentFloor, prev.currentLevel + 1, 'horde')
          }));
        } else {
          set({
            victoryData: {
              enemy: defeated,
              gold: baseRewardGold,
              crystals: baseRewardCrystals,
              stones: baseRewardStones,
              equipment: droppedEq
            }
          });
        }
      } else {
        // Floor completed!
        const nextFloor = s.currentFloor + 1;
        set(prev => ({
          highestFloor: Math.max(prev.highestFloor, Math.min(100, nextFloor)),
          victoryData: {
            enemy: defeated,
            gold: baseRewardGold * 2,
            crystals: baseRewardCrystals * 2,
            stones: baseRewardStones * 2,
            equipment: droppedEq
          }
        }));
      }
    }
  },

  continueNextLevel: () => {
    const s = get();
    set({ victoryData: null });
    if (s.currentLevel < 10) {
      set(prev => ({
        currentLevel: prev.currentLevel + 1,
        stage: 'horde',
        enemy: generateEnemy(prev.currentFloor, prev.currentLevel + 1, 'horde')
      }));
    } else {
      const nextFloor = Math.min(100, s.currentFloor + 1);
      set({
        currentFloor: nextFloor,
        currentLevel: 1,
        stage: 'horde',
        enemy: generateEnemy(nextFloor, 1, 'horde')
      });
    }
  },

  levelUpHero: (heroId) => {
    const s = get();
    const hero = s.heroes.find(h => h.id === heroId);
    if (!hero) return;
    const cost = getHeroCostForLevelUp(hero.level);
    if (s.playerStats.gold < cost.gold || hero.level >= 200) return;

    sound.playCoin();
    set(prev => ({
      playerStats: { ...prev.playerStats, gold: prev.playerStats.gold - cost.gold },
      heroes: prev.heroes.map(h => h.id === heroId ? { ...h, level: h.level + 1 } : h)
    }));
  },

  ascendStar: (heroId) => {
    const s = get();
    const hero = s.heroes.find(h => h.id === heroId);
    if (!hero) return;
    const needed = hero.stars * 20;
    if (hero.shards < needed || hero.stars >= 6) return;

    sound.playLevelUp();
    set(prev => ({
      heroes: prev.heroes.map(h => h.id === heroId ? {
        ...h,
        stars: h.stars + 1,
        shards: h.shards - needed
      } : h)
    }));
  },

  awakenHero: (heroId) => {
    const s = get();
    const hero = s.heroes.find(h => h.id === heroId);
    if (!hero || hero.level < 200 || hero.awakening >= 5) return;

    sound.playLevelUp();
    set(prev => ({
      heroes: prev.heroes.map(h => h.id === heroId ? {
        ...h,
        level: 1,
        awakening: h.awakening + 1
      } : h)
    }));
  },

  toggleActiveTeam: (heroId) => {
    const s = get();
    if (s.activeTeamIds.includes(heroId)) {
      if (s.activeTeamIds.length <= 1) return;
      set(prev => ({ activeTeamIds: prev.activeTeamIds.filter(id => id !== heroId) }));
    } else {
      if (s.activeTeamIds.length >= 4) {
        set(prev => ({ activeTeamIds: [...prev.activeTeamIds.slice(0, 3), heroId] }));
      } else {
        set(prev => ({ activeTeamIds: [...prev.activeTeamIds, heroId] }));
      }
    }
  },

  equipItem: (itemId, heroId) => {
    sound.playSlash();
    set(prev => ({
      inventory: prev.inventory.map(i => i.id === itemId ? { ...i, equippedToHeroId: heroId } : i)
    }));
  },

  unequipItem: (itemId) => {
    set(prev => ({
      inventory: prev.inventory.map(i => i.id === itemId ? { ...i, equippedToHeroId: null } : i)
    }));
  },

  upgradeItem: (itemId) => {
    const s = get();
    const item = s.inventory.find(i => i.id === itemId);
    if (!item) return;
    const cost = calculateUpgradeCost(item);
    if (!cost || s.playerStats.gold < cost.gold || s.playerStats.enhancementStones < cost.stones) return;

    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        gold: prev.playerStats.gold - cost.gold,
        enhancementStones: prev.playerStats.enhancementStones - cost.stones
      }
    }));

    if (Math.random() * 100 <= cost.successRate) {
      sound.playLevelUp();
      set(prev => ({
        inventory: prev.inventory.map(i => i.id === itemId ? { ...i, level: i.level + 1 } : i)
      }));
    } else {
      sound.playSlash();
    }
  },

  dismantleItem: (itemId) => {
    sound.playCoin();
    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        gold: prev.playerStats.gold + 500,
        enhancementStones: prev.playerStats.enhancementStones + 3
      },
      inventory: prev.inventory.filter(i => i.id !== itemId)
    }));
  },

  performRebirth: () => {
    const s = get();
    const souls = calculateSoulsOnRebirth(s.highestFloor, s.playerStats.totalBossesDefeated);
    sound.playUltimate();
    set(prev => ({
      currentFloor: 1,
      currentLevel: 1,
      stage: 'horde',
      enemy: generateEnemy(1, 1, 'horde'),
      activeModal: null,
      playerStats: {
        ...prev.playerStats,
        ancestralSouls: prev.playerStats.ancestralSouls + souls,
        rebirthCount: prev.playerStats.rebirthCount + 1
      }
    }));
  },

  upgradeRebirthBonus: (bonusId) => {
    const s = get();
    const b = s.rebirthTree.find(item => item.id === bonusId);
    if (!b) return;
    const cost = Math.floor(b.cost * Math.pow(b.costMultiplier, b.level));
    if (s.playerStats.ancestralSouls < cost || b.level >= b.maxLevel) return;

    sound.playLevelUp();
    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        ancestralSouls: prev.playerStats.ancestralSouls - cost
      },
      rebirthTree: prev.rebirthTree.map(item => item.id === bonusId ? { ...item, level: item.level + 1 } : item)
    }));
  },

  addSummonRewards: (cost, unlockedHeroIds, shardsMap, newEquips) => {
    set(prev => ({
      playerStats: { ...prev.playerStats, crystals: prev.playerStats.crystals - cost },
      inventory: [...newEquips, ...prev.inventory],
      heroes: prev.heroes.map(h => {
        let isUnlocked = h.unlocked || unlockedHeroIds.includes(h.id);
        let addedShards = shardsMap[h.id] || 0;
        return {
          ...h,
          unlocked: isUnlocked,
          shards: h.shards + addedShards
        };
      })
    }));
  },

  claimExpedition: (gold, crystals, stones) => {
    sound.playCoin();
    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        gold: prev.playerStats.gold + gold,
        crystals: prev.playerStats.crystals + crystals,
        enhancementStones: prev.playerStats.enhancementStones + stones
      }
    }));
  },

  claimTitan: (gold, crystals) => {
    set(prev => ({
      playerStats: {
        ...prev.playerStats,
        gold: prev.playerStats.gold + gold,
        crystals: prev.playerStats.crystals + crystals
      }
    }));
  }
}));

// Automatic persistence subscription
useGameStore.subscribe((state) => {
  try {
    const toSave = {
      currentFloor: state.currentFloor,
      highestFloor: state.highestFloor,
      currentLevel: state.currentLevel,
      difficulty: state.difficulty,
      tutorialCompleted: state.tutorialCompleted,
      highContrast: state.highContrast,
      playerStats: state.playerStats,
      activeTeamIds: state.activeTeamIds,
      inventory: state.inventory,
      rebirthTree: state.rebirthTree,
      bestiary: state.bestiary
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // Ignore storage quota
  }
});
