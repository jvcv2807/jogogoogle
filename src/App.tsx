/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Hero, 
  Enemy, 
  Equipment, 
  PlayerStats, 
  RebirthBonus, 
  BestiaryEntry, 
  FloatingText, 
  HitParticle 
} from './types/game';
import { INITIAL_HEROES, calculateHeroStats, getHeroCostForLevelUp } from './data/heroes';
import { getFloorTheme, generateEnemy } from './data/chapters';
import { INITIAL_REBIRTH_TREE, calculateSoulsOnRebirth } from './data/rebirth';
import { generateEquipment, calculateUpgradeCost } from './data/equipment';
import { formatNumber, getElementalMultiplier } from './utils/numberFormat';
import { sound } from './utils/audio';

// Components
import { TitleScreen } from './components/TitleScreen';
import { BattleArena } from './components/BattleArena';
import { TopStatusBar } from './components/TopStatusBar';
import { CombatControls } from './components/CombatControls';
import { HeroesModal } from './components/HeroesModal';
import { InventoryModal } from './components/InventoryModal';
import { SummonModal, SummonResult } from './components/SummonModal';
import { RebirthModal } from './components/RebirthModal';
import { BestiaryModal } from './components/BestiaryModal';
import { GameModesModal } from './components/GameModesModal';
import { StoryModal } from './components/StoryModal';
import { VictoryModal } from './components/VictoryModal';

// Icons
import { Users, Shield, Sparkles, RefreshCw, BookOpen, Trophy } from 'lucide-react';

const SAVE_KEY = 'dungeon_breakers_save_v1';

export default function App() {
  // Game Shell state: 'title' | 'playing'
  const [gameState, setGameState] = useState<'title' | 'playing'>('title');

  // Active Floor & Stage
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [highestFloor, setHighestFloor] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<number>(1); // 1 to 10
  const [stage, setStage] = useState<'horde' | 'elite' | 'boss'>('horde');

  // Player Stats & Economy
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    gold: 500,
    crystals: 250,
    ancestralSouls: 0,
    enhancementStones: 20,
    dungeonKeys: 5,
    totalDamageDealt: 0,
    totalClicks: 0,
    totalBossesDefeated: 0,
    rebirthCount: 0
  });

  // Heroes & Team
  const [heroes, setHeroes] = useState<Hero[]>(INITIAL_HEROES);
  const [activeTeamIds, setActiveTeamIds] = useState<string[]>([
    'hero_arthur',
    'hero_lyra',
    'hero_kael',
    'hero_serena'
  ]);

  // Inventory & Equipment
  const [inventory, setInventory] = useState<Equipment[]>(() => {
    return [
      generateEquipment(1, 'Comum'),
      generateEquipment(1, 'Incomum')
    ];
  });

  // Rebirth Perk Tree
  const [rebirthTree, setRebirthTree] = useState<RebirthBonus[]>(INITIAL_REBIRTH_TREE);

  // Bestiary entries
  const [bestiary, setBestiary] = useState<BestiaryEntry[]>([]);

  // Current Enemy
  const [enemy, setEnemy] = useState<Enemy | null>(() => generateEnemy(1, 1, 'horde'));

  // Combat ephemeral state
  const [combo, setCombo] = useState<number>(0);
  const [comboTimer, setComboTimer] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [hitParticles, setHitParticles] = useState<HitParticle[]>([]);

  // Automation & Audio settings
  const [autoProgress, setAutoProgress] = useState<boolean>(true);
  const [autoSkills, setAutoSkills] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'heroes' | 'inventory' | 'summon' | 'rebirth' | 'bestiary' | 'modes' | 'story' | null
  >(null);

  // Victory screen state
  const [victoryData, setVictoryData] = useState<{
    enemy: Enemy;
    gold: number;
    crystals: number;
    stones: number;
    equipment?: Equipment | null;
  } | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentFloor) setCurrentFloor(parsed.currentFloor);
        if (parsed.highestFloor) setHighestFloor(parsed.highestFloor);
        if (parsed.currentLevel) setCurrentLevel(parsed.currentLevel);
        if (parsed.playerStats) setPlayerStats(parsed.playerStats);
        if (parsed.activeTeamIds) setActiveTeamIds(parsed.activeTeamIds);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.rebirthTree) setRebirthTree(parsed.rebirthTree);
        if (parsed.bestiary) setBestiary(parsed.bestiary);

        // Merge saved heroes with full definitions to maintain skill methods/passives
        if (parsed.heroes) {
          setHeroes(INITIAL_HEROES.map(initH => {
            const found = parsed.heroes.find((h: Hero) => h.id === initH.id);
            if (found) {
              return {
                ...initH,
                level: found.level,
                stars: found.stars,
                awakening: found.awakening,
                unlocked: found.unlocked,
                shards: found.shards
              };
            }
            return initH;
          }));
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to LocalStorage periodically
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const dataToSave = {
          currentFloor,
          highestFloor,
          currentLevel,
          playerStats,
          activeTeamIds,
          inventory,
          rebirthTree,
          bestiary,
          heroes: heroes.map(h => ({
            id: h.id,
            level: h.level,
            stars: h.stars,
            awakening: h.awakening,
            unlocked: h.unlocked,
            shards: h.shards
          }))
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
      } catch {
        // Ignore
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [currentFloor, highestFloor, currentLevel, playerStats, activeTeamIds, inventory, rebirthTree, bestiary, heroes]);

  // Calculate Party Stats with Rebirth & Equipment
  const activeHeroes = heroes.filter(h => activeTeamIds.includes(h.id));
  const floorTheme = getFloorTheme(currentFloor);

  // Rebirth bonus multipliers
  const dmgBonus = 1 + (rebirthTree.find(r => r.type === 'damage')?.level || 0) * 0.10;
  const goldBonus = 1 + (rebirthTree.find(r => r.type === 'gold')?.level || 0) * 0.10;
  const expBonus = 1 + (rebirthTree.find(r => r.type === 'exp')?.level || 0) * 0.05;
  const critBonus = (rebirthTree.find(r => r.type === 'crit')?.level || 0) * 3;
  const spdBonus = 1 + (rebirthTree.find(r => r.type === 'speed')?.level || 0) * 0.05;
  const breakBonus = 1 + (rebirthTree.find(r => r.type === 'break_power')?.level || 0) * 0.15;

  // Add floating text
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string, scale: number = 1.0) => {
    const id = `${Date.now()}_${Math.random()}`;
    const vx = (Math.random() - 0.5) * 1.5;
    const vy = -2.5 - Math.random() * 1.5;
    setFloatingTexts(prev => [...prev.slice(-15), { id, x, y, text, color, scale, life: 1, vx, vy }]);
  }, []);

  // Add hit particles
  const addHitParticles = useCallback((x: number, y: number, color: string, count: number = 6) => {
    const newParticles: HitParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        alpha: 1,
        life: 1
      });
    }
    setHitParticles(prev => [...prev.slice(-40), ...newParticles]);
  }, []);

  // Handle Boss / Enemy Defeat
  const handleDefeatEnemy = useCallback((defeated: Enemy) => {
    sound.playLevelUp();
    setScreenShake(6);

    // Calculate rewards
    const baseRewardGold = Math.floor(defeated.level * 45 * goldBonus * (defeated.isBoss ? 4 : 1.5));
    const baseRewardCrystals = defeated.isSupremeBoss ? 50 : (defeated.isBoss ? 15 : 2);
    const baseRewardStones = defeated.isBoss ? (defeated.isSupremeBoss ? 10 : 3) : 1;

    // Equipment drop chance: 100% on Supreme, 40% on Boss, 10% on Elite, 2% on Horde
    let droppedEq: Equipment | null = null;
    const dropRoll = Math.random() * 100;
    if (defeated.isSupremeBoss || (defeated.isBoss && dropRoll < 40) || dropRoll < 6) {
      droppedEq = generateEquipment(currentFloor, defeated.isSupremeBoss ? 'Lendário' : undefined);
      setInventory(prev => [droppedEq!, ...prev]);
    }

    // Award player
    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold + baseRewardGold,
      crystals: prev.crystals + baseRewardCrystals,
      enhancementStones: prev.enhancementStones + baseRewardStones,
      totalBossesDefeated: prev.totalBossesDefeated + (defeated.isBoss ? 1 : 0)
    }));

    // Record into bestiary if boss
    if (defeated.isBoss) {
      setBestiary(prev => {
        const existing = prev.find(b => b.floor === currentFloor && b.level === currentLevel);
        if (existing) {
          return prev.map(b => b === existing ? { ...b, killCount: b.killCount + 1 } : b);
        }
        return [
          ...prev,
          {
            floor: currentFloor,
            level: currentLevel,
            bossName: defeated.name,
            archetype: defeated.archetype || 'Brutamontes',
            element: defeated.element,
            killCount: 1,
            discoveredAt: new Date().toLocaleDateString('pt-BR')
          }
        ];
      });
    }

    // Stage progression logic: Horde -> Elite -> Boss
    if (stage === 'horde') {
      setStage('elite');
      setEnemy(generateEnemy(currentFloor, currentLevel, 'elite'));
    } else if (stage === 'elite') {
      setStage('boss');
      setEnemy(generateEnemy(currentFloor, currentLevel, 'boss'));
    } else {
      // Completed boss!
      if (currentLevel < 10) {
        if (autoProgress) {
          // Immediately advance to next level in floor
          setCurrentLevel(lvl => lvl + 1);
          setStage('horde');
          setEnemy(generateEnemy(currentFloor, currentLevel + 1, 'horde'));
        } else {
          // Show victory modal
          setVictoryData({
            enemy: defeated,
            gold: baseRewardGold,
            crystals: baseRewardCrystals,
            stones: baseRewardStones,
            equipment: droppedEq
          });
        }
      } else {
        // Floor completed! Defeated the Sovereign of floor!
        const nextFloor = currentFloor + 1;
        if (nextFloor > highestFloor && nextFloor <= 100) {
          setHighestFloor(nextFloor);
        }
        setVictoryData({
          enemy: defeated,
          gold: baseRewardGold * 2,
          crystals: baseRewardCrystals * 2,
          stones: baseRewardStones * 2,
          equipment: droppedEq
        });
      }
    }
  }, [currentFloor, currentLevel, stage, goldBonus, highestFloor, autoProgress]);

  // Deal damage to current enemy
  const applyDamageToEnemy = useCallback((damage: number, isTap: boolean = false, clickX?: number, clickY?: number) => {
    if (!enemy || enemy.currentHp <= 0) return;

    let finalDmg = damage * dmgBonus;
    if (enemy.isStunned) {
      finalDmg *= 2.0; // Defense break stun doubles all damage!
    }

    const isCrit = (Math.random() * 100) < (15 + critBonus);
    if (isCrit) {
      finalDmg *= 1.8;
    }

    finalDmg = Math.max(1, Math.floor(finalDmg));

    // Break damage calculation
    const breakDmg = Math.floor(finalDmg * 0.45 * breakBonus * (isTap ? 2.5 : 1.0));

    // Update enemy HP & break gauge
    setEnemy(prev => {
      if (!prev) return null;
      const nextHp = Math.max(0, prev.currentHp - finalDmg);
      let nextBreak = prev.currentBreakGauge;
      let stunned = prev.isStunned;
      let stunTime = prev.stunTimer;

      if (!prev.isStunned) {
        nextBreak = Math.max(0, prev.currentBreakGauge - breakDmg);
        if (nextBreak <= 0) {
          // DEFENSE BREAK TRIGGERED!
          stunned = true;
          stunTime = 5.0; // 5 seconds stun
          sound.playBreakShatter();
          setScreenShake(8);
          addFloatingText('⚡ QUEBRA DE DEFESA!', clickX || 400, (clickY || 180) - 20, '#38bdf8', 1.5);
        }
      }

      if (nextHp <= 0) {
        // Trigger defeat
        setTimeout(() => handleDefeatEnemy(prev), 50);
      }

      return {
        ...prev,
        currentHp: nextHp,
        currentBreakGauge: nextBreak,
        isStunned: stunned,
        stunTimer: stunTime
      };
    });

    // Visuals & Sound
    if (isTap) {
      if (isCrit) {
        sound.playCrit();
        setScreenShake(4);
      } else {
        sound.playSlash();
      }
    }

    const posX = clickX || 450 + (Math.random() - 0.5) * 50;
    const posY = clickY || 180 + (Math.random() - 0.5) * 40;
    const color = isCrit ? '#facc15' : (isTap ? '#f87171' : '#ffffff');
    addFloatingText(formatNumber(finalDmg), posX, posY, color, isCrit ? 1.3 : 1.0);
    addHitParticles(posX, posY, color, isCrit ? 10 : 5);

    // Update player stats
    setPlayerStats(prev => ({
      ...prev,
      totalDamageDealt: prev.totalDamageDealt + finalDmg,
      totalClicks: isTap ? prev.totalClicks + 1 : prev.totalClicks
    }));
  }, [enemy, dmgBonus, critBonus, breakBonus, addFloatingText, addHitParticles, handleDefeatEnemy]);

  // Tap / Click attack on arena
  const handleTapAttack = useCallback((clickX: number, clickY: number) => {
    // Total combined team power for active taps
    const combinedTeamAtk = activeHeroes.reduce((acc, h) => {
      const stats = calculateHeroStats(h);
      return acc + stats.atk;
    }, 0);

    const baseTapPower = Math.max(12, Math.floor(combinedTeamAtk * 0.45));
    const comboMult = 1 + Math.min(2.0, combo * 0.05);
    const damage = Math.floor(baseTapPower * comboMult);

    // Increment combo
    setCombo(c => c + 1);
    setComboTimer(2.5);

    applyDamageToEnemy(damage, true, clickX, clickY);
  }, [activeHeroes, combo, applyDamageToEnemy]);

  // Trigger individual Hero active skill
  const handleTriggerSkill = useCallback((heroId: string, skillId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    const skill = hero.skills.find(s => s.id === skillId);
    if (!skill || skill.currentCooldown > 0) return;

    sound.playSlash();
    setScreenShake(3);

    // Put on cooldown
    setHeroes(prev => prev.map(h => {
      if (h.id !== heroId) return h;
      return {
        ...h,
        skills: h.skills.map(s => s.id === skillId ? { ...s, currentCooldown: s.cooldown } : s)
      };
    }));

    // Deal skill damage / heal
    const stats = calculateHeroStats(hero);
    const elemAdv = enemy ? getElementalMultiplier(hero.element, enemy.element).multiplier : 1.0;
    const skillDmg = Math.floor(stats.atk * skill.multiplier * elemAdv);

    applyDamageToEnemy(skillDmg, false);
    addFloatingText(`✨ ${skill.name}!`, 380, 150, '#a855f7', 1.25);
  }, [heroes, enemy, applyDamageToEnemy, addFloatingText]);

  // Trigger Ultimate Ability
  const handleTriggerUltimate = useCallback((heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    if (hero.ultimate.currentCharge < hero.ultimate.chargeTime) return;

    sound.playUltimate();
    setScreenShake(12);

    // Reset charge
    setHeroes(prev => prev.map(h => {
      if (h.id !== heroId) return h;
      return {
        ...h,
        ultimate: { ...h.ultimate, currentCharge: 0 }
      };
    }));

    // Devastating damage
    const stats = calculateHeroStats(hero);
    const elemAdv = enemy ? getElementalMultiplier(hero.element, enemy.element).multiplier : 1.0;
    const ultDmg = Math.floor(stats.atk * hero.ultimate.multiplier * elemAdv * 1.5);

    applyDamageToEnemy(ultDmg, false);
    addFloatingText(`💥 ${hero.ultimate.name}!!`, 420, 130, '#ef4444', 1.7);
    addHitParticles(420, 160, '#f59e0b', 25);
  }, [heroes, enemy, applyDamageToEnemy, addFloatingText, addHitParticles]);

  // Main 60fps/Tick Game Loop for auto-attacks, cooldowns, combo decay, particles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const dt = 0.1; // 100ms tick

      // 1. Combo Timer Decay
      setComboTimer(prev => {
        if (prev <= dt) {
          setCombo(0);
          return 0;
        }
        return prev - dt;
      });

      // 2. Shake decay
      setScreenShake(prev => Math.max(0, prev - 0.5));

      // 3. Floating texts & hit particles physics
      setFloatingTexts(prev => 
        prev
          .map(ft => ({ ...ft, x: ft.x + ft.vx, y: ft.y + ft.vy, life: ft.life - 0.04 }))
          .filter(ft => ft.life > 0)
      );

      setHitParticles(prev =>
        prev
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, alpha: p.alpha - 0.05, life: p.life - 0.05 }))
          .filter(p => p.life > 0)
      );

      // 4. Hero Auto-Attacks & Skill Cooldowns & Ultimate charge
      setHeroes(prevHeroes => {
        return prevHeroes.map(hero => {
          if (!activeTeamIds.includes(hero.id)) return hero;

          // Charge ultimate
          const nextUltCharge = Math.min(hero.ultimate.chargeTime, hero.ultimate.currentCharge + dt);

          // Reduce skill cooldowns
          const nextSkills = hero.skills.map(s => ({
            ...s,
            currentCooldown: Math.max(0, s.currentCooldown - dt)
          }));

          return {
            ...hero,
            skills: nextSkills,
            ultimate: {
              ...hero.ultimate,
              currentCharge: nextUltCharge
            }
          };
        });
      });

      // 5. Enemy Stun Timer countdown
      setEnemy(prev => {
        if (!prev) return null;
        if (prev.isStunned) {
          const nextStun = prev.stunTimer - dt;
          if (nextStun <= 0) {
            return {
              ...prev,
              isStunned: false,
              stunTimer: 0,
              currentBreakGauge: prev.maxBreakGauge // Reset break gauge
            };
          }
          return { ...prev, stunTimer: nextStun };
        }
        return prev;
      });

      // 6. Passive Auto-Attacks from Active Heroes
      activeHeroes.forEach(hero => {
        const stats = calculateHeroStats(hero);
        // Hero attacks roughly every (1 / spd) seconds
        const attackChance = stats.spd * spdBonus * dt;
        if (Math.random() < attackChance) {
          const elemAdv = enemy ? getElementalMultiplier(hero.element, enemy.element).multiplier : 1.0;
          const autoDmg = Math.floor(stats.atk * 0.85 * elemAdv);
          applyDamageToEnemy(autoDmg, false);
        }
      });

      // 7. Auto-cast skills if enabled
      if (autoSkills) {
        activeHeroes.forEach(hero => {
          hero.skills.forEach(skill => {
            if (skill.currentCooldown <= 0) {
              handleTriggerSkill(hero.id, skill.id);
            }
          });
          if (hero.ultimate.currentCharge >= hero.ultimate.chargeTime) {
            handleTriggerUltimate(hero.id);
          }
        });
      }

    }, 100);

    return () => clearInterval(interval);
  }, [
    gameState, 
    activeTeamIds, 
    activeHeroes, 
    enemy, 
    spdBonus, 
    autoSkills, 
    applyDamageToEnemy, 
    handleTriggerSkill, 
    handleTriggerUltimate
  ]);

  // Start Game handler
  const handleStartGame = () => {
    setGameState('playing');
    sound.startMusic();
    sound.playBossRoar();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMute(nextMuted);
  };

  // Floor changing (can revisit conquered floors)
  const handleFloorChange = (targetFloor: number) => {
    if (targetFloor < 1 || targetFloor > highestFloor) return;
    setCurrentFloor(targetFloor);
    setCurrentLevel(1);
    setStage('horde');
    setEnemy(generateEnemy(targetFloor, 1, 'horde'));
  };

  // Level Up Hero (1 to 200)
  const handleLevelUpHero = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    const cost = getHeroCostForLevelUp(hero.level);
    if (playerStats.gold < cost.gold || hero.level >= 200) return;

    sound.playCoin();
    setPlayerStats(prev => ({ ...prev, gold: prev.gold - cost.gold }));
    setHeroes(prev => prev.map(h => {
      if (h.id !== heroId) return h;
      return { ...h, level: h.level + 1 };
    }));
  };

  // Ascend Hero Star (1 to 6)
  const handleAscendStar = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    const shardsNeeded = hero.stars * 20;
    if (hero.shards < shardsNeeded || hero.stars >= 6) return;

    sound.playLevelUp();
    setHeroes(prev => prev.map(h => {
      if (h.id !== heroId) return h;
      return { ...h, stars: h.stars + 1, shards: h.shards - shardsNeeded };
    }));
  };

  // Awaken Hero (0 to 5)
  const handleAwakenHero = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero || hero.level < 200 || hero.awakening >= 5) return;

    sound.playLevelUp();
    setHeroes(prev => prev.map(h => {
      if (h.id !== heroId) return h;
      return { ...h, level: 1, awakening: h.awakening + 1 };
    }));
  };

  // Toggle Active Team slot (max 4)
  const handleToggleActiveTeam = (heroId: string) => {
    if (activeTeamIds.includes(heroId)) {
      if (activeTeamIds.length <= 1) return; // Must have at least 1 hero
      setActiveTeamIds(prev => prev.filter(id => id !== heroId));
    } else {
      if (activeTeamIds.length >= 4) {
        // Replace last slot
        setActiveTeamIds(prev => [...prev.slice(0, 3), heroId]);
      } else {
        setActiveTeamIds(prev => [...prev, heroId]);
      }
    }
  };

  // Equip item
  const handleEquipItem = (itemId: string, heroId: string) => {
    sound.playSlash();
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, equippedToHeroId: heroId };
      return item;
    }));
  };

  // Unequip item
  const handleUnequipItem = (itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, equippedToHeroId: null };
      return item;
    }));
  };

  // Upgrade equipment (+30)
  const handleUpgradeItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    const cost = calculateUpgradeCost(item);
    if (!cost || playerStats.gold < cost.gold || playerStats.enhancementStones < cost.stones) return;

    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold - cost.gold,
      enhancementStones: prev.enhancementStones - cost.stones
    }));

    const roll = Math.random() * 100;
    if (roll <= cost.successRate) {
      sound.playLevelUp();
      setInventory(prev => prev.map(i => {
        if (i.id !== itemId) return i;
        return { ...i, level: i.level + 1 };
      }));
    } else {
      sound.playSlash();
      alert('A forja falhou nesta tentativa! O item manteve seu nível.');
    }
  };

  // Dismantle equipment
  const handleDismantleItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    sound.playCoin();
    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold + 500,
      enhancementStones: prev.enhancementStones + 3
    }));
    setInventory(prev => prev.filter(i => i.id !== itemId));
  };

  // Summon success handler
  const handleSummonSuccess = (results: SummonResult[], cost: number) => {
    setPlayerStats(prev => ({ ...prev, crystals: prev.crystals - cost }));
    results.forEach(res => {
      if (res.type === 'hero' && res.heroId) {
        setHeroes(prev => prev.map(h => h.id === res.heroId ? { ...h, unlocked: true } : h));
      } else if (res.type === 'shards' && res.heroId && res.shardsCount) {
        setHeroes(prev => prev.map(h => h.id === res.heroId ? { ...h, shards: h.shards + res.shardsCount! } : h));
      } else if (res.type === 'equipment' && res.equipment) {
        setInventory(prev => [res.equipment!, ...prev]);
      }
    });
  };

  // Perform Rebirth
  const handlePerformRebirth = () => {
    const soulsEarned = calculateSoulsOnRebirth(highestFloor, playerStats.totalBossesDefeated);
    sound.playUltimate();
    setPlayerStats(prev => ({
      ...prev,
      ancestralSouls: prev.ancestralSouls + soulsEarned,
      rebirthCount: prev.rebirthCount + 1
    }));
    // Reset tower progression to floor 1
    setCurrentFloor(1);
    setCurrentLevel(1);
    setStage('horde');
    setEnemy(generateEnemy(1, 1, 'horde'));
    setActiveModal(null);
  };

  // Upgrade Rebirth Tree skill
  const handleUpgradeRebirthBonus = (bonusId: string) => {
    const bonus = rebirthTree.find(b => b.id === bonusId);
    if (!bonus) return;
    const currentCost = Math.floor(bonus.cost * Math.pow(bonus.costMultiplier, bonus.level));
    if (playerStats.ancestralSouls < currentCost || bonus.level >= bonus.maxLevel) return;

    sound.playLevelUp();
    setPlayerStats(prev => ({ ...prev, ancestralSouls: prev.ancestralSouls - currentCost }));
    setRebirthTree(prev => prev.map(b => b.id === bonusId ? { ...b, level: b.level + 1 } : b));
  };

  // Advance to next level after victory modal
  const handleContinueNextLevel = () => {
    setVictoryData(null);
    if (currentLevel < 10) {
      setCurrentLevel(lvl => lvl + 1);
      setStage('horde');
      setEnemy(generateEnemy(currentFloor, currentLevel + 1, 'horde'));
    } else {
      // Advance to next floor
      const nextFloor = Math.min(100, currentFloor + 1);
      setCurrentFloor(nextFloor);
      setCurrentLevel(1);
      setStage('horde');
      setEnemy(generateEnemy(nextFloor, 1, 'horde'));
    }
  };

  // Claim AFK expedition
  const handleClaimExpedition = (rewardGold: number, rewardCrystals: number, rewardStones: number) => {
    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold + rewardGold,
      crystals: prev.crystals + rewardCrystals,
      enhancementStones: prev.enhancementStones + rewardStones
    }));
    alert(`Expedição coletada com sucesso! +${rewardGold} Ouro, +${rewardCrystals} Cristais, +${rewardStones} Pedras.`);
  };

  // Titan hunt victory
  const handleTitanHunt = (bonusGold: number, bonusCrystals: number) => {
    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold + bonusGold,
      crystals: prev.crystals + bonusCrystals
    }));
  };

  // Render Title Screen if in title state
  if (gameState === 'title') {
    return <TitleScreen onStartGame={handleStartGame} highestFloor={highestFloor} />;
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none text-slate-100 font-sans">
      
      {/* 1. TOP STATUS & NAVIGATION BAR */}
      <TopStatusBar
        floorTheme={floorTheme}
        currentFloor={currentFloor}
        highestFloor={highestFloor}
        currentLevel={currentLevel}
        stage={stage}
        playerStats={playerStats}
        autoProgress={autoProgress}
        onToggleAutoProgress={() => setAutoProgress(p => !p)}
        autoSkills={autoSkills}
        onToggleAutoSkills={() => setAutoSkills(s => !s)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onFloorChange={handleFloorChange}
        onOpenStory={() => setActiveModal('story')}
      />

      {/* 2. LATERAL 2D BATTLE ARENA (Canvas + TapTap Breaking) */}
      <div className="flex-1 flex flex-col justify-center relative min-h-0">
        <BattleArena
          heroes={activeHeroes}
          enemy={enemy}
          floorTheme={floorTheme}
          stage={stage}
          combo={combo}
          comboTimer={comboTimer}
          onTapAttack={handleTapAttack}
          floatingTexts={floatingTexts}
          hitParticles={hitParticles}
          screenShake={screenShake}
        />
      </div>

      {/* 3. COMBAT CONTROLS & HERO CARDS */}
      <CombatControls
        heroes={activeHeroes}
        onTriggerSkill={handleTriggerSkill}
        onTriggerUltimate={handleTriggerUltimate}
      />

      {/* 4. BOTTOM MENU DOCK */}
      <nav className="w-full bg-slate-950/95 border-t border-slate-800 p-2 z-20">
        <div className="max-w-4xl mx-auto grid grid-cols-6 gap-1 sm:gap-2">
          {/* Heróis */}
          <button
            onClick={() => setActiveModal('heroes')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'heroes'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Heróis</span>
          </button>

          {/* Arsenal / Equipamentos */}
          <button
            onClick={() => setActiveModal('inventory')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'inventory'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Arsenal</span>
          </button>

          {/* Invocação */}
          <button
            onClick={() => setActiveModal('summon')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'summon'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-purple-400" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Invocação</span>
          </button>

          {/* Renascimento */}
          <button
            onClick={() => setActiveModal('rebirth')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'rebirth'
                ? 'bg-purple-600 text-white font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4 mb-0.5 text-indigo-400" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Renascer</span>
          </button>

          {/* Bestiário */}
          <button
            onClick={() => setActiveModal('bestiary')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'bestiary'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5 text-sky-400" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Bestiário</span>
          </button>

          {/* Modos Secundários */}
          <button
            onClick={() => setActiveModal('modes')}
            className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeModal === 'modes'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold truncate">Modos</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      {activeModal === 'heroes' && (
        <HeroesModal
          heroes={heroes}
          activeTeamIds={activeTeamIds}
          gold={playerStats.gold}
          onClose={() => setActiveModal(null)}
          onToggleActiveTeam={handleToggleActiveTeam}
          onLevelUp={handleLevelUpHero}
          onAscendStar={handleAscendStar}
          onAwaken={handleAwakenHero}
        />
      )}

      {activeModal === 'inventory' && (
        <InventoryModal
          inventory={inventory}
          heroes={heroes}
          gold={playerStats.gold}
          enhancementStones={playerStats.enhancementStones}
          onClose={() => setActiveModal(null)}
          onEquipItem={handleEquipItem}
          onUnequipItem={handleUnequipItem}
          onUpgradeItem={handleUpgradeItem}
          onDismantleItem={handleDismantleItem}
        />
      )}

      {activeModal === 'summon' && (
        <SummonModal
          crystals={playerStats.crystals}
          heroes={heroes}
          currentFloor={currentFloor}
          onClose={() => setActiveModal(null)}
          onSummonSuccess={handleSummonSuccess}
        />
      )}

      {activeModal === 'rebirth' && (
        <RebirthModal
          rebirthTree={rebirthTree}
          ancestralSouls={playerStats.ancestralSouls}
          highestFloor={highestFloor}
          totalBossesDefeated={playerStats.totalBossesDefeated}
          rebirthCount={playerStats.rebirthCount}
          onClose={() => setActiveModal(null)}
          onUpgradeBonus={handleUpgradeRebirthBonus}
          onPerformRebirth={handlePerformRebirth}
        />
      )}

      {activeModal === 'bestiary' && (
        <BestiaryModal
          bestiary={bestiary}
          highestFloor={highestFloor}
          totalBossesDefeated={playerStats.totalBossesDefeated}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'modes' && (
        <GameModesModal
          heroes={heroes}
          gold={playerStats.gold}
          crystals={playerStats.crystals}
          onClose={() => setActiveModal(null)}
          onClaimExpedition={handleClaimExpedition}
          onTitanHunt={handleTitanHunt}
        />
      )}

      {activeModal === 'story' && (
        <StoryModal onClose={() => setActiveModal(null)} />
      )}

      {/* VICTORY MODAL */}
      {victoryData && (
        <VictoryModal
          defeatedEnemy={victoryData.enemy}
          rewardGold={victoryData.gold}
          rewardCrystals={victoryData.crystals}
          rewardStones={victoryData.stones}
          droppedEquipment={victoryData.equipment}
          onNextLevel={handleContinueNextLevel}
        />
      )}
    </div>
  );
}
