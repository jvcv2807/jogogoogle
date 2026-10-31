# 🎮 Dungeon Breakers: A Torre dos 100 Abismos
## Guia de Melhorias de Arquitetura, Store Global & Design de Heróis

Este documento detalha as melhorias implementadas no projeto para escalabilidade, manutenibilidade e identidade visual limpa.

---

### 1️⃣ Arquitetura & Gerenciamento de Estado (Zustand Store)

Para eliminar o prop-drilling e isolar o ciclo de combate de 60fps da renderização pesada da UI, foi introduzido o Zustand como store central unificado:

- **Arquivo:** `src/store/gameStore.ts`
- **Responsabilidades:**
  - `gameState`: Transição entre `'title'` (Game Shell) e `'playing'`.
  - `currentFloor`, `highestFloor`, `currentLevel`, `stage`: Andares de 1 a 100 e progressão Horda $\rightarrow$ Elite $\rightarrow$ Chefão.
  - `playerStats`: Ouro, Cristais, Almas Ancestrais, Pedras de Reforço e estatísticas de combate.
  - `difficulty`: Modos de jogo (`'normal'`, `'dificil'`, `'abissal'`) com multiplicadores de vida e recompensas proporcionais.
  - `tutorialCompleted`: Flag persistida para orientar jogadores novatos na primeira execução.
  - `highContrast`: Opção de acessibilidade visual de alto contraste.
  - `tickGame(dt)`: Executa as recargas de habilidades, decaimento de combo, partículas e ataques automáticos da equipe.
  - **Persistência Automática:** Assinatura reativa no `localStorage` sob a chave `'dungeon_breakers_save_v2'`.

---

### 2️⃣ Design de Personagens & Componente `<HeroPortrait>`

Em vez de depender exclusivamente de emojis genéricos, foi criado um componente vetorial customizado:

- **Arquivo:** `src/components/HeroPortrait.tsx`
- **Estilo:** Flat-design com sombras sutis, auras radiais de elementos (`Fogo`, `Natureza`, `Terra`, `Raio`, `Agua`, `Luz`, `Trevas`, `Arcano`) e traços com stroke weight padronizado.
- **Visualização Escalável:** Suporta visualizações em 36px, 42px e 64px com fidelidade de renderização nítida.

#### Exemplo de Uso:
```tsx
import { HeroPortrait } from './HeroPortrait';

// Renderizando o retrato de Arthur (Guerreiro, elemento Terra)
<HeroPortrait heroId="hero_arthur" element="Terra" size={48} />

// Renderizando o retrato de Kael (Mago, elemento Fogo com aura ativa)
<HeroPortrait heroId="hero_kael" element="Fogo" size={64} showAura={true} />
```

---

### 3️⃣ Overlay de Tutorial Interativo

- **Arquivo:** `src/components/TutorialOverlay.tsx`
- **Etapas Guiadas:**
  1. *Combate & Quebra de Defesa (Break Gauge):* Explicação dos cliques rápidos, multiplicador de combo até 3.0x e o atordoamento temporário por quebra de escudo.
  2. *Habilidades & Poderes Supremos:* Instruções para ativação do botão dourado pulsante quando a carga atinge 100%.
  3. *Arsenal & Forja +30:* Como equipar armas, elmos, armaduras, luvas, botas, anéis e amuletos em 7 raridades.
  4. *Conquista dos 100 Andares & Renascimento:* Explicando a mecânica de chefões a cada nível e as Almas Ancestrais a partir do andar 20.

---

### 4️⃣ Configurações & Seletor de Dificuldade

- **Arquivo:** `src/components/SettingsModal.tsx`
- **Opções:**
  - **Normal:** 1.0x Vida / Ouro padrão.
  - **Difícil:** 1.4x Vida dos monstros (+30% de Ouro e Cristais).
  - **Abissal:** 2.0x Vida dos monstros (+80% de Recompensas).
  - Áudio e trilha sonora sintetizada ligada/desligada.
  - Alto contraste (`contrast-125 brightness-110`).
  - Redefinição e limpeza segura de dados locais.

---

### 5️⃣ Checklist de Manutenção

- [x] Zustand instalado e configurado em `src/store/gameStore.ts`.
- [x] Componente `HeroPortrait` implementado com silhuetas vetoriais SVG distintas.
- [x] Integração completa dos modais (`HeroesModal`, `CombatControls`, `TopStatusBar`, `SettingsModal`).
- [x] Tutorial de integração para primeiro acesso.
- [x] Validação TypeScript e compilação do Vite sem erros.
