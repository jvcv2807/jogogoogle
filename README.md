# 🦖 Google Dino Runner — Jogo do Dinossauro Recriado

> **Recriação fiel e responsiva do famoso jogo do T-Rex do Google Chrome ("No Internet"), desenvolvido com HTML5 Canvas e JavaScript puro (ES6+).**

---

## 🎮 JOGAR ONLINE AGORA

Clique no link abaixo para jogar diretamente no navegador:  
👉 **[https://jvcv2807.github.io/jogogoogle/](https://jvcv2807.github.io/jogogoogle/)**

*(Dica: Se a página abrir em branco ou com versão antiga no seu navegador, pressione `Ctrl + Shift + R` ou `Ctrl + F5` para limpar o cache).*

---

## 🕹️ Como Jogar

- **No Computador:**
  - `Espaço`, `Seta para Cima` ou `W`: Pula / Inicia a partida.
  - `Seta para Baixo` ou `S`: Agacha (para esquivar dos pterodáctilos alados) / Descida rápida no ar.
  - `Clique com o Mouse na tela`: Pula / Inicia a partida.
- **No Celular / Tablet:**
  - Toque em qualquer lugar da tela ou nos botões táteis **"Pular"** e **"Abaixar"**.

---

## ✨ Recursos & Destaques

- **Pixel Art Autêntica:** Sprites fiéis do dinossauro (correndo, agachado e colisão), cactos pequenos, cactos grandes agrupados e pterodáctilos alados em 3 alturas.
- **Física Fluida:** Pulo com gravidade realista, aceleração progressiva de velocidade e mecânica de agachar / descida rápida com tecla para baixo.
- **Ciclo Dia / Noite:** Transição suave para o modo escuro a cada 700 pontos com aparição de estrelas e lua crescente.
- **Efeitos Sonoros Retrô:** Áudio sintetizado via **Web Audio API** (sons de pulo, milestone de 100 pontos e colisão/game over) sem arquivos pesados.
- **Recorde Persistente (HI Score):** Maior pontuação salva automaticamente no `localStorage`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** `<canvas>` e estrutura semântica.
- **CSS3:** Design responsivo, variáveis dinâmicas de tema e Google Fonts (*Press Start 2P*).
- **JavaScript (Vanilla):** Game loop a 60 FPS com `requestAnimationFrame`, colisão de caixas AABB e sintetizador sonoro.

---

## 🚀 Como Executar Localmente

Basta abrir o arquivo `index.html` em qualquer navegador:

```bash
cd jogogoogle
xdg-open index.html # ou no Windows: start index.html
```

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por [João Vitor (jvcv2807)](https://github.com/jvcv2807).
