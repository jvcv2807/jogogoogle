/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GameDifficulty } from '../store/gameStore';
import { X, Volume2, VolumeX, Shield, Eye, RefreshCw, Flame, Check } from 'lucide-react';

interface SettingsModalProps {
  difficulty: GameDifficulty;
  highContrast: boolean;
  isMuted: boolean;
  onClose: () => void;
  onSelectDifficulty: (diff: GameDifficulty) => void;
  onToggleHighContrast: () => void;
  onToggleMute: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  difficulty,
  highContrast,
  isMuted,
  onClose,
  onSelectDifficulty,
  onToggleHighContrast,
  onToggleMute,
  onResetData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 330 }}
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-100 space-y-4"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-400">
              Configurações de Jogo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Dificuldade dos Abismos:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Normal', desc: '1.0x Vida / Ouro' },
              { id: 'dificil', label: 'Difícil', desc: '1.4x Vida (+30% Ouro)' },
              { id: 'abissal', label: 'Abissal', desc: '2.0x Vida (+80% Recompensas)' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => onSelectDifficulty(d.id as GameDifficulty)}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                  difficulty === d.id
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                <span className="text-xs font-bold">{d.label}</span>
                <span className="text-[9px] opacity-80 mt-0.5">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-2 font-bold">
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Áudio & Efeitos Sonoros</span>
          </div>
          <button
            onClick={onToggleMute}
            className={`px-3 py-1 rounded font-bold transition ${
              isMuted ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {isMuted ? 'Desativado' : 'Ativado'}
          </button>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-2 font-bold">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Modo Alto Contraste</span>
          </div>
          <button
            onClick={onToggleHighContrast}
            className={`px-3 py-1 rounded font-bold transition ${
              highContrast ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {highContrast ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Reset Progress */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              if (confirm('Deseja realmente apagar todo o progresso e reiniciar o jogo do zero?')) {
                onResetData();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition"
          >
            ⚠️ Redefinir Dados Salvos
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};
