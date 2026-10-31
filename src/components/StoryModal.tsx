/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Scroll, Sparkles } from 'lucide-react';

interface StoryModalProps {
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-950 border border-amber-500/40 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black tracking-wide font-['Cinzel'] text-amber-300">
              Crônicas de Eldoria & A Profecia dos 100 Abismos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-300 font-serif">
          <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg italic text-amber-200">
            « Quando o centésimo abismo despertar, a última chama dos heróis decidirá o destino de todos os mundos. »
            <div className="text-right text-xs not-italic text-amber-400 mt-1">— Antigo Códice de Eldoria</div>
          </div>

          <p>
            Há milhares de anos, uma torre colossal ergueu-se silenciosa no coração do continente de <strong>Eldoria</strong>. Sua presença não trouxe bênçãos — rasgou o véu da realidade, liberando hordas de bestas, autômatos corrompidos, liches e demônios que mergulharam os reinos humanos em sangue e desespero.
          </p>

          <p>
            Reis ancestrais marcharam com exércitos inteiros para as suas portas sombrias, mas nenhuma espada de ferro comum foi capaz de arranhar seus alicerces. A torre era dividida em <strong>100 Andares</strong>, cada qual selado por <strong>10 Guardiões</strong> — totalizando mil provações mortais.
          </p>

          <p>
            Você assume o papel do escolhido que carrega uma relíquia proibida: o <em>Núcleo do Destruidor</em>. Essa relíquia permite canalizar cada golpe, cada impacto e cada quebra de defesa para absorver a essência dos monstros derrotados, fortalecendo 20 heróis de eras esquecidas.
          </p>

          <p>
            Mas um segredo terrível o aguarda no ápice: a Torre não foi erguida para aprisionar os monstros dentro dela... <strong>Ela foi construída para impedir que algo infinitamente pior despertasse no vazio do cosmos.</strong>
          </p>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-sans text-xs uppercase tracking-wider rounded-lg transition"
            >
              Prosseguir com a Conquista
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
