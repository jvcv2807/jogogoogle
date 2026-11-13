# 🦖 Google Dino Runner — Jogo do Dinossauro Recriado

> **Recriação fiel e responsiva do famoso jogo do T-Rex do Google Chrome ("No Internet"), desenvolvido com HTML5 Canvas e JavaScript puro (ES6+).**

---

## 🎮 Jogar Online

Acesse diretamente no seu navegador:  
👉 **[https://jvcv2807.github.io/jogogoogle/](https://jvcv2807.github.io/jogogoogle/)**

---

## ✨ Recursos & Destaques

- **Pixel Art Autêntica:** Sprites fiéis do dinossauro (correndo, agachado e colisão), cactos pequenos, cactos grandes agrupados e pterodáctilos alados em 3 alturas.
- **Física Fluida:** Pulo com gravidade realista, aceleração progressiva de velocidade e mecânica de agachar / descida rápida com tecla para baixo.
- **Ciclo Dia / Noite:** Transição suave para o modo escuro a cada 700 pontos com aparição de estrelas e lua crescente.
- **Efeitos Sonoros Retrô:** Áudio sintetizado via **Web Audio API** (sons de pulo, milestone de 100 pontos e colisão/game over) sem arquivos pesados.
- **Controle Total:**
  - **Teclado:** `Espaço` ou `Seta para Cima` para pular; `Seta para Baixo` para agachar.
  - **Mobile / Touch:** Toque na tela ou botões táteis dedicados.
- **Recorde Persistente (HI Score):** Maior pontuação salva automaticamente no `localStorage`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** `<canvas>` e estrutura semântica.
- **CSS3:** Design responsivo, variáveis dinâmicas de tema e Google Fonts (*Press Start 2P*).
- **JavaScript (Vanilla):** Game loop a 60 FPS com `requestAnimationFrame`, colisão de caixas AABB e sintetizador sonoro.

---

## 🚀 Como Executar Localmente

```bash
git clone https://github.com/jvcv2807/jogogoogle.git
cd jogogoogle
xdg-open index.html # ou no Windows: start index.html
```

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por [João Vitor (jvcv2807)](https://github.com/jvcv2807).
