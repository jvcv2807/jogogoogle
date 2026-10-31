/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { getFloorTheme } from './data/chapters';

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
import { TutorialOverlay } from './components/TutorialOverlay';
import { SettingsModal } from './components/SettingsModal';

// Icons
import { Users, Shield, Sparkles, RefreshCw, BookOpen, Trophy } from 'lucide-react';

export default function App() {
  const {
    gameState,
    currentFloor,
    highestFloor,
    currentLevel,
    stage,
    difficulty,
    tutorialCompleted,
    highContrast,
    playerStats,
    heroes,
    activeTeamIds,
    inventory,
    rebirthTree,
    bestiary,
    enemy,
    combo,
    comboTimer,
    screenShake,
    floatingTexts,
    hitParticles,
    autoProgress,
    autoSkills,
    isMuted,
    activeModal,
    victoryData,

    setGameState,
    setActiveModal,
    setDifficulty,
    setTutorialCompleted,
    toggleHighContrast,
    toggleAutoProgress,
    toggleAutoSkills,
    toggleMute,
    changeFloor,
    tapAttack,
    triggerSkill,
    triggerUltimate,
    tickGame,
    continueNextLevel,
    levelUpHero,
    ascendStar,
    awakenHero,
    toggleActiveTeam,
    equipItem,
    unequipItem,
    upgradeItem,
    dismantleItem,
    performRebirth,
    upgradeRebirthBonus,
    addSummonRewards,
    claimExpedition,
    claimTitan
  } = useGameStore();

  const floorTheme = getFloorTheme(currentFloor);
  const activeHeroes = heroes.filter(h => activeTeamIds.includes(h.id));

  // Main 100ms game tick loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      tickGame(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [gameState, tickGame]);

  // Handle summon dispatch
  const handleSummonSuccess = (results: SummonResult[], cost: number) => {
    const unlockedIds: string[] = [];
    const shardsMap: Record<string, number> = {};
    const newEquips = [];

    for (const res of results) {
      if (res.type === 'hero' && res.heroId) {
        unlockedIds.push(res.heroId);
      } else if (res.type === 'shards' && res.heroId && res.shardsCount) {
        shardsMap[res.heroId] = (shardsMap[res.heroId] || 0) + res.shardsCount;
      } else if (res.type === 'equipment' && res.equipment) {
        newEquips.push(res.equipment);
      }
    }

    addSummonRewards(cost, unlockedIds, shardsMap, newEquips);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Render Title Screen if in title state
  if (gameState === 'title') {
    return <TitleScreen onStartGame={() => setGameState('playing')} highestFloor={highestFloor} />;
  }

  return (
    <div className={`relative w-full h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none font-sans ${highContrast ? 'contrast-125 brightness-110 text-white' : 'text-slate-100'}`}>
      
      {/* 1. TOP STATUS & NAVIGATION BAR */}
      <TopStatusBar
        floorTheme={floorTheme}
        currentFloor={currentFloor}
        highestFloor={highestFloor}
        currentLevel={currentLevel}
        stage={stage}
        playerStats={playerStats}
        difficulty={difficulty}
        autoProgress={autoProgress}
        onToggleAutoProgress={toggleAutoProgress}
        autoSkills={autoSkills}
        onToggleAutoSkills={toggleAutoSkills}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onFloorChange={changeFloor}
        onOpenStory={() => setActiveModal('story')}
        onOpenSettings={() => setActiveModal('settings')}
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
          onTapAttack={tapAttack}
          floatingTexts={floatingTexts}
          hitParticles={hitParticles}
          screenShake={screenShake}
        />
      </div>

      {/* 3. COMBAT CONTROLS & HERO CARDS */}
      <CombatControls
        heroes={activeHeroes}
        onTriggerSkill={triggerSkill}
        onTriggerUltimate={triggerUltimate}
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

      {/* MODALS WITH ANIMATE PRESENCE & MOTION.DIV WRAPPERS */}
      <AnimatePresence>
        {activeModal === 'heroes' && (
          <motion.div
            key="modal-heroes"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroesModal
              heroes={heroes}
              activeTeamIds={activeTeamIds}
              gold={playerStats.gold}
              onClose={() => setActiveModal(null)}
              onToggleActiveTeam={toggleActiveTeam}
              onLevelUp={levelUpHero}
              onAscendStar={ascendStar}
              onAwaken={awakenHero}
            />
          </motion.div>
        )}

        {activeModal === 'inventory' && (
          <motion.div
            key="modal-inventory"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <InventoryModal
              inventory={inventory}
              heroes={heroes}
              gold={playerStats.gold}
              enhancementStones={playerStats.enhancementStones}
              onClose={() => setActiveModal(null)}
              onEquipItem={equipItem}
              onUnequipItem={unequipItem}
              onUpgradeItem={upgradeItem}
              onDismantleItem={dismantleItem}
            />
          </motion.div>
        )}

        {activeModal === 'summon' && (
          <motion.div
            key="modal-summon"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <SummonModal
              crystals={playerStats.crystals}
              heroes={heroes}
              currentFloor={currentFloor}
              onClose={() => setActiveModal(null)}
              onSummonSuccess={handleSummonSuccess}
            />
          </motion.div>
        )}

        {activeModal === 'rebirth' && (
          <motion.div
            key="modal-rebirth"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <RebirthModal
              rebirthTree={rebirthTree}
              ancestralSouls={playerStats.ancestralSouls}
              highestFloor={highestFloor}
              totalBossesDefeated={playerStats.totalBossesDefeated}
              rebirthCount={playerStats.rebirthCount}
              onClose={() => setActiveModal(null)}
              onUpgradeBonus={upgradeRebirthBonus}
              onPerformRebirth={performRebirth}
            />
          </motion.div>
        )}

        {activeModal === 'bestiary' && (
          <motion.div
            key="modal-bestiary"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <BestiaryModal
              bestiary={bestiary}
              highestFloor={highestFloor}
              totalBossesDefeated={playerStats.totalBossesDefeated}
              onClose={() => setActiveModal(null)}
            />
          </motion.div>
        )}

        {activeModal === 'modes' && (
          <motion.div
            key="modal-modes"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <GameModesModal
              heroes={heroes}
              gold={playerStats.gold}
              crystals={playerStats.crystals}
              onClose={() => setActiveModal(null)}
              onClaimExpedition={claimExpedition}
              onTitanHunt={claimTitan}
            />
          </motion.div>
        )}

        {activeModal === 'story' && (
          <motion.div
            key="modal-story"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <StoryModal onClose={() => setActiveModal(null)} />
          </motion.div>
        )}

        {activeModal === 'settings' && (
          <motion.div
            key="modal-settings"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <SettingsModal
              difficulty={difficulty}
              highContrast={highContrast}
              isMuted={isMuted}
              onClose={() => setActiveModal(null)}
              onSelectDifficulty={setDifficulty}
              onToggleHighContrast={toggleHighContrast}
              onToggleMute={toggleMute}
              onResetData={handleResetData}
            />
          </motion.div>
        )}

        {/* VICTORY MODAL */}
        {victoryData && (
          <motion.div
            key="modal-victory"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <VictoryModal
              defeatedEnemy={victoryData.enemy}
              rewardGold={victoryData.gold}
              rewardCrystals={victoryData.crystals}
              rewardStones={victoryData.stones}
              droppedEquipment={victoryData.equipment}
              onNextLevel={continueNextLevel}
            />
          </motion.div>
        )}

        {/* FIRST LAUNCH TUTORIAL OVERLAY */}
        {!tutorialCompleted && (
          <motion.div
            key="modal-tutorial"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <TutorialOverlay onComplete={() => setTutorialCompleted(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
