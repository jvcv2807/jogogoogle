/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sword, Shield, Zap, X } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: '👆',
    title: 'Combate e Quebra de Defesa (Break Gauge)',
    description: 'Toque ou clique rapidamente na arena de combate para desferir golpes rápidos. Ataques contínuos acumulam combo de até 3.0x e esvaziam a barra azul de Defesa. Ao quebrá-la, o monstro fica atordoado e recebe o dobro de dano!',
    badge: 'Mecânica Core'
  },
  {
    icon: '🔥',
    title: 'Habilidades & Ataques Supremos',
    description: 'Seus 4 heróis usam habilidades automaticamente ou quando você aciona seus botões. Quando a barra de Poder Supremo atingir 100%, o botão começará a pulsar: clique nele para desencadear um golpe devastador na arena!',
    badge: 'Poderes Míticos'
  },
  {
    icon: '🛡️',
    title: 'Arsenal & Forja até +30',
    description: 'Monstros deixam cair equipamentos em 7 raridades diferentes (Comum até Divino). Abra o menu "Arsenal" para equipar seus guerreiros e aprimorar cada item até +30 usando Pedras de Reforço e Ouro!',
    badge: 'Progressão'
  },
  {
    icon: '🔮',
    title: 'Conquiste os 100 Andares & Renascença',
    description: 'Cada andar possui 10 níveis, todos com um chefão! No nível 10 de cada andar, enfrente o Guardião Soberano. A partir do andar 20, o Renascimento concede Almas Ancestrais para melhorias permanentes eternas!',
    badge: 'A Profecia'
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 330 }}
        className="w-full max-w-lg bg-slate-950 border border-amber-500/50 rounded-2xl shadow-2xl p-6 text-slate-100 relative space-y-4"
      >
        
        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
        >
          <span>Pular</span>
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">{step.icon}</span>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              {step.badge} · Passo {currentStepIndex + 1} de {STEPS.length}
            </div>
            <h3 className="text-lg font-black text-white font-['Cinzel'] mt-0.5">
              {step.title}
            </h3>
          </div>
        </div>

        {/* Content text */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          {step.description}
        </p>

        {/* Step dots & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-400 w-6'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
          >
            {currentStepIndex < STEPS.length - 1 ? 'Próximo Passo' : 'Iniciar Conquista!'}
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};
