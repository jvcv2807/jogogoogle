/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, Enemy, FloorTheme, FloatingText, HitParticle } from '../types/game';
import { formatNumber, getElementColor, getElementalMultiplier } from '../utils/numberFormat';
import { sound } from '../utils/audio';

interface BattleArenaProps {
  heroes: Hero[];
  enemy: Enemy | null;
  floorTheme: FloorTheme;
  stage: 'horde' | 'elite' | 'boss';
  combo: number;
  comboTimer: number;
  onTapAttack: (clickX: number, clickY: number) => void;
  floatingTexts: FloatingText[];
  hitParticles: HitParticle[];
  screenShake: number;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  heroes,
  enemy,
  floorTheme,
  stage,
  combo,
  comboTimer,
  onTapAttack,
  floatingTexts,
  hitParticles,
  screenShake
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();

      // Screen shake translation
      if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake * 6;
        const shakeY = (Math.random() - 0.5) * screenShake * 6;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw atmospheric dynamic background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, floorTheme.bgColor);
      grad.addColorStop(0.65, floorTheme.skyColor);
      grad.addColorStop(1, floorTheme.groundColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant silhouette arches / dungeon pillars
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      for (let i = 0; i < 7; i++) {
        const pillarX = (i * (w / 6) + t * 5) % (w + 100) - 50;
        ctx.fillRect(pillarX, 40, 24, h - 120);
        ctx.beginPath();
        ctx.arc(pillarX + 12, 40, 30, Math.PI, 0, false);
        ctx.fill();
      }

      // Ground platform
      const groundY = h - 90;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, floorTheme.groundColor);
      groundGrad.addColorStop(1, '#050508');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, 90);

      // Arena glow line on ground
      ctx.strokeStyle = floorTheme.accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Ambient theme particles (spores, embers, stars, sparks)
      ctx.fillStyle = floorTheme.accentColor;
      for (let i = 0; i < 18; i++) {
        const px = (Math.sin(i * 99 + t * 0.4) * 0.5 + 0.5) * w;
        const py = ((i * 37 + t * 25) % (h - 90));
        const pSize = 1.5 + (i % 3);
        ctx.globalAlpha = 0.2 + (Math.sin(t + i) * 0.2 + 0.2);
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 2. Draw Left Side: Heroes in Lateral Formation
      const heroSpacing = Math.min(55, (w * 0.35) / Math.max(1, heroes.length));
      heroes.forEach((hero, index) => {
        const heroX = 40 + index * heroSpacing;
        const idleBounce = Math.sin(t * 3 + index) * 3;
        const heroY = groundY - 55 + idleBounce;

        // Shadow under hero
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(heroX + 16, groundY - 6, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hero Aura / Base
        const elemColor = getElementColor(hero.element);
        ctx.strokeStyle = elemColor;
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(heroX, heroY, 36, 52, 6);
        ctx.fill();
        ctx.stroke();

        // Hero sprite icon / symbol
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hero.avatarSprite, heroX + 18, heroY + 22);

        // Hero Star Badge
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('★'.repeat(Math.min(3, hero.stars)), heroX + 18, heroY + 44);

        // Hero HP mini bar
        const hpPercent = Math.max(0, Math.min(1, hero.currentHp / hero.baseHp));
        ctx.fillStyle = '#334155';
        ctx.fillRect(heroX - 2, heroY - 10, 40, 4);
        ctx.fillStyle = hpPercent > 0.3 ? '#22c55e' : '#ef4444';
        ctx.fillRect(heroX - 2, heroY - 10, 40 * hpPercent, 4);

        // Hero Name
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(hero.name, heroX + 18, heroY - 15);
      });

      // 3. Draw Right Side: Enemy / Boss
      if (enemy) {
        const enemyScale = enemy.sizeMultiplier || 1.3;
        const baseWidth = 75 * enemyScale;
        const baseHeight = 95 * enemyScale;
        const enemyX = w - baseWidth - 45;
        const breath = Math.sin(t * 3.5) * 4;
        const enemyY = groundY - baseHeight + breath;

        // Boss Floor Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.ellipse(enemyX + baseWidth / 2, groundY - 8, baseWidth * 0.6, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stunned / Break visual cue
        if (enemy.isStunned) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(enemyX + baseWidth / 2, enemyY - 15, 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 12px "Press Start 2P", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('STUN!', enemyX + baseWidth / 2, enemyY - 30);
        }

        // Boss Body Outer Glow
        const enemyElemColor = getElementColor(enemy.element);
        ctx.shadowColor = enemy.isSupremeBoss ? '#ef4444' : enemyElemColor;
        ctx.shadowBlur = enemy.isSupremeBoss ? 24 : 12;

        // Main monster frame
        ctx.fillStyle = enemy.isSupremeBoss ? '#1e0505' : '#111827';
        ctx.strokeStyle = enemy.isSupremeBoss ? '#ef4444' : enemyElemColor;
        ctx.lineWidth = enemy.isSupremeBoss ? 4 : 2.5;

        ctx.beginPath();
        ctx.roundRect(enemyX, enemyY, baseWidth, baseHeight, 14);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Inner monster aesthetic runes / eyes
        const eyeColor = enemy.isStunned ? '#64748b' : (enemy.isSupremeBoss ? '#ff0044' : '#fbbf24');
        ctx.fillStyle = eyeColor;
        const eyeY = enemyY + baseHeight * 0.35;
        ctx.beginPath();
        ctx.arc(enemyX + baseWidth * 0.32, eyeY, 6 * enemyScale, 0, Math.PI * 2);
        ctx.arc(enemyX + baseWidth * 0.68, eyeY, 6 * enemyScale, 0, Math.PI * 2);
        ctx.fill();

        // Monster mouth / fangs
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.moveTo(enemyX + baseWidth * 0.3, enemyY + baseHeight * 0.65);
        ctx.lineTo(enemyX + baseWidth * 0.5, enemyY + baseHeight * 0.75);
        ctx.lineTo(enemyX + baseWidth * 0.7, enemyY + baseHeight * 0.65);
        ctx.strokeStyle = '#fee2e2';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Boss Crown / Horns for Supreme Bosses
        if (enemy.isSupremeBoss) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(enemyX + baseWidth * 0.2, enemyY);
          ctx.lineTo(enemyX + baseWidth * 0.35, enemyY - 22);
          ctx.lineTo(enemyX + baseWidth * 0.5, enemyY - 8);
          ctx.lineTo(enemyX + baseWidth * 0.65, enemyY - 22);
          ctx.lineTo(enemyX + baseWidth * 0.8, enemyY);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 4. Draw Hit Particles
      hitParticles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 5. Draw Floating Damage Numbers
      floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        ctx.font = `bold ${Math.floor(18 * ft.scale)}px "Cinzel", "Press Start 2P", sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [heroes, enemy, floorTheme, stage, screenShake, hitParticles, floatingTexts]);

  // Handle canvas resize on mount/window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple effect
    const rippleId = Date.now() + Math.random();
    setClickRipples(prev => [...prev.slice(-6), { id: rippleId, x, y }]);
    setTimeout(() => {
      setClickRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 400);

    onTapAttack(x, y);
  };

  const hpPercent = enemy ? Math.max(0, Math.min(1, enemy.currentHp / enemy.maxHp)) : 0;
  const breakPercent = enemy ? Math.max(0, Math.min(1, enemy.currentBreakGauge / enemy.maxBreakGauge)) : 0;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-full h-[320px] md:h-[380px] bg-slate-950 overflow-hidden cursor-crosshair select-none touch-none border-y border-slate-800"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Click Visual Ripples */}
      {clickRipples.map(r => (
        <div
          key={r.id}
          className="pointer-events-none absolute w-12 h-12 -ml-6 -mt-6 border-2 border-amber-400 rounded-full animate-ping opacity-75"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Top Combat HUD: Boss Health & Break Bar with Framer Motion */}
      {enemy && (
        <div className="pointer-events-none absolute top-3 left-4 right-4 md:left-24 md:right-24 flex flex-col items-center">
          {/* Boss Header with Entrance Animation */}
          <motion.div
            key={enemy.id}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-1.5 px-3 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-md shadow-md"
          >
            <span
              className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: getElementColor(enemy.element) + '33',
                color: getElementColor(enemy.element)
              }}
            >
              {enemy.element}
            </span>
            <span className="text-sm md:text-base font-black text-white font-['Cinzel'] tracking-wide">
              {enemy.name}
            </span>
            {enemy.title && (
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                · {enemy.title}
              </span>
            )}
          </motion.div>

          {/* Main Boss HP Bar with Smooth Spring and Trailing Damage Ghost Bar */}
          <div className="w-full max-w-xl h-5 bg-slate-900 border border-slate-700 rounded-md overflow-hidden relative shadow-lg">
            {/* 1. Trailing Damage Ghost Bar (Classic RPG visual indicator of recently lost health) */}
            <motion.div
              initial={false}
              animate={{ width: `${hpPercent * 100}%` }}
              transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-amber-400/80"
            />

            {/* 2. Primary Fluid Health Bar */}
            <motion.div
              initial={false}
              animate={{ width: `${hpPercent * 100}%` }}
              transition={{
                type: 'spring',
                stiffness: 190,
                damping: 24,
                mass: 0.8
              }}
              className={`h-full relative z-10 ${
                enemy.isSupremeBoss
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500'
                  : 'bg-gradient-to-r from-amber-600 to-amber-400'
              }`}
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-between px-2 text-[11px] font-bold text-white drop-shadow">
              <span className="font-mono">HP</span>
              <span className="tabular-nums font-mono">
                {formatNumber(enemy.currentHp)} / {formatNumber(enemy.maxHp)} ({Math.round(hpPercent * 100)}%)
              </span>
            </div>
          </div>

          {/* Defense Break Resistance Gauge with Smooth Motion */}
          <div className="w-full max-w-xl mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2.5 bg-slate-950 border border-cyan-800 rounded overflow-hidden relative shadow-inner">
              <motion.div
                initial={false}
                animate={{ width: `${breakPercent * 100}%` }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 22
                }}
                className={`h-full ${
                  enemy.isStunned
                    ? 'bg-cyan-300 animate-pulse shadow-[0_0_10px_#38bdf8]'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-400'
                }`}
              />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all ${enemy.isStunned ? 'text-cyan-300 font-black animate-bounce' : 'text-cyan-500'}`}>
              {enemy.isStunned ? '⚡ QUEBRADO! (+100% DANO)' : '🛡️ DEFESA'}
            </span>
          </div>
        </div>
      )}

      {/* Combo Counter on top-left of battle field */}
      {combo > 1 && (
        <div className="pointer-events-none absolute top-20 left-4 bg-slate-950/85 border border-amber-500/50 rounded-lg p-2 shadow-xl flex flex-col items-center animate-pulse">
          <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-widest">
            Combo x{(1 + Math.min(2.0, combo * 0.05)).toFixed(1)}
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-300 font-['Cinzel'] tabular-nums">
            {combo} HITS
          </div>
          <div className="w-16 h-1 bg-slate-800 rounded mt-1 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-75"
              style={{ width: `${(comboTimer / 2.5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tap Instruction watermark overlay */}
      <div className="pointer-events-none absolute bottom-3 right-4 text-xs font-semibold text-slate-400/80 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
        👆 Clique / Toque rápido para atacar e quebrar defesa!
      </div>
    </div>
  );
};
