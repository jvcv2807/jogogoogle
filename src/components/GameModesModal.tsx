/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hero } from '../types/game';
import { formatNumber } from '../utils/numberFormat';
import { sound } from '../utils/audio';
import { X, Trophy, Flame, Swords, Compass, CheckCircle2, Clock } from 'lucide-react';

interface GameModesModalProps {
  heroes: Hero[];
  gold: number;
  crystals: number;
  onClose: () => void;
  onClaimExpedition: (rewardGold: number, rewardCrystals: number, rewardStones: number) => void;
  onTitanHunt: (bonusGold: number, bonusCrystals: number) => void;
}

export const GameModesModal: React.FC<GameModesModalProps> = ({
  heroes,
  gold,
  crystals,
  onClose,
  onClaimExpedition,
  onTitanHunt
}) => {
  const [activeTab, setActiveTab] = useState<'arena' | 'infinite' | 'titan' | 'expeditions'>('titan');
  const [titanCooldown, setTitanCooldown] = useState(false);
  const [expeditionTimer, setExpeditionTimer] = useState<number>(0);
  const [isExpeditionActive, setIsExpeditionActive] = useState<boolean>(true);

  const handleFightTitan = () => {
    if (titanCooldown) return;
    setTitanCooldown(true);
    sound.playBossRoar();
    setTimeout(() => {
      sound.playLevelUp();
      const bonusGold = 5000;
      const bonusCrystals = 150;
      onTitanHunt(bonusGold, bonusCrystals);
      setTimeout(() => setTitanCooldown(false), 8000);
    }, 1200);
  };

  const handleClaimExpedition = () => {
    sound.playCoin();
    onClaimExpedition(3500, 50, 15);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-400">
              Modos Secundários de Eldoria
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-900/50 border-b border-slate-800 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('titan')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'titan' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            Caçada aos Titãs
          </button>
          <button
            onClick={() => setActiveTab('expeditions')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'expeditions' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Expedições AFK
          </button>
          <button
            onClick={() => setActiveTab('arena')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'arena' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Arena dos Heróis
          </button>
          <button
            onClick={() => setActiveTab('infinite')}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'infinite' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Masmorra Infinita
          </button>
        </div>

        {/* Tab contents */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* 1. Caçada aos Titãs */}
          {activeTab === 'titan' && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="text-4xl animate-bounce">🌋</div>
              <h3 className="text-xl font-black text-rose-400 font-['Cinzel']">
                Goliath: O Titã Vulcânico
              </h3>
              <p className="text-xs text-slate-300">
                Um chefe colossal com barra de vida estendida! Ataque com a força combinada de todos os seus 20 guerreiros para obter recompensas diárias épicas.
              </p>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Recompensas por Conquista:</div>
                <div className="flex justify-center gap-4 text-xs font-bold">
                  <span className="text-amber-400">🪙 +5.000 Ouro</span>
                  <span className="text-sky-400">💎 +150 Cristais</span>
                </div>
              </div>

              <button
                disabled={titanCooldown}
                onClick={handleFightTitan}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  titanCooldown
                    ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xl cursor-pointer active:scale-95'
                }`}
              >
                {titanCooldown ? 'Recarregando Fúria do Titã (8s)...' : '⚔️ DESAFIAR TITÃ AGORA!'}
              </button>
            </div>
          )}

          {/* 2. Expedições AFK */}
          {activeTab === 'expeditions' && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="text-4xl animate-pulse">🗺️</div>
              <h3 className="text-xl font-black text-emerald-400 font-['Cinzel']">
                Expedição às Minas Arcanas
              </h3>
              <p className="text-xs text-slate-300">
                Seus heróis reserva exploram as minas profundas da torre enquanto você joga ou descansa, acumulando suprimentos essenciais.
              </p>

              <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Status da Expedição:
                  </span>
                  <span className="text-emerald-400 font-bold">Concluída!</span>
                </div>
                <div className="flex justify-center gap-4 text-xs font-bold pt-2 border-t border-emerald-900/40">
                  <span className="text-amber-400">🪙 +3.500 Ouro</span>
                  <span className="text-sky-400">💎 +50 Cristais</span>
                  <span className="text-emerald-400">🪨 +15 Pedras</span>
                </div>
              </div>

              <button
                onClick={handleClaimExpedition}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition active:scale-95"
              >
                🎒 Coletar Espólios da Expedição
              </button>
            </div>
          )}

          {/* 3. Arena dos Heróis */}
          {activeTab === 'arena' && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="text-4xl">⚔️</div>
              <h3 className="text-xl font-black text-amber-400 font-['Cinzel']">
                Arena dos Heróis de Eldoria
              </h3>
              <p className="text-xs text-slate-300">
                Desafie esquadrões de gladiadores comandados por IA para provar quem montou a equipe mais equilibrada com sinergias elementais!
              </p>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                Seu ranking atual: <strong className="text-amber-400">Gladiador de Prata #42</strong>
              </div>
              <button
                onClick={() => {
                  sound.playCrit();
                  alert('Batalha de Arena vencida! +200 Cristais de Glória.');
                }}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition"
              >
                Lutar na Arena (Ranking)
              </button>
            </div>
          )}

          {/* 4. Masmorra Infinita */}
          {activeTab === 'infinite' && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="text-4xl">🌌</div>
              <h3 className="text-xl font-black text-purple-400 font-['Cinzel']">
                Masmorra Infinita
              </h3>
              <p className="text-xs text-slate-300">
                Uma torre sem teto onde cada andar aumenta progressivamente em poder. O quão longe sua equipe conseguirá chegar antes de sucumbir ao cansaço?
              </p>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                Recorde Pessoal: <strong className="text-purple-400">Andar Infinito 145</strong>
              </div>
              <button
                onClick={() => {
                  sound.playBreakShatter();
                  alert('Entrando na Masmorra Infinita...');
                }}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition"
              >
                Iniciar Tentativa Infinita
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
