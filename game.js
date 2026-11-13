/**
 * Google Chrome Dino Runner — Recriação Fiel em Canvas & JavaScript
 * Desenvolvido por João Vitor (jvcv2807) para NexoWeb
 */

// Canvas & Context Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 250;
const GROUND_Y = 210;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Audio Synthesizer (Web Audio API)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playMilestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [800, 1100].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.07);
      });
    } catch (e) {}
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}

const sound = new SoundFX();

// Cores & Tema
function getColors() {
  const isNight = document.body.classList.contains('night-mode');
  return {
    dino: isNight ? '#e8eaed' : '#535353',
    ground: isNight ? '#5f6368' : '#757575',
    cloud: isNight ? '#3c4043' : '#d0d0d0',
    star: isNight ? '#9aa0a6' : '#c0c0c0',
    text: isNight ? '#e8eaed' : '#535353',
    bg: isNight ? '#202124' : '#f7f7f7'
  };
}

// Pixel Drawing Helper
function drawPixels(ctx, x, y, matrix, pixelSize, color) {
  ctx.fillStyle = color;
  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 1) {
        ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

// Sprites Definidos em Matrizes de Pixels (Fieis ao Chrome)
const SPRITES = {
  // Dino em pé (correndo 1)
  dinoRun1: [
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
  // Dino em pé (correndo 2)
  dinoRun2: [
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0]
  ],
  // Dino abaixado (agachado 1)
  dinoDuck1: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
  // Dino abaixado (agachado 2)
  dinoDuck2: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ],
  // Cacto Pequeno
  cactusSmall: [
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,0,1,1,0,0,0],
    [0,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0]
  ],
  // Cacto Grande
  cactusBig: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,1,1,0,1,1,0,0,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0]
  ],
  // Pterodáctilo Asa Cima
  ptero1: [
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0,0,0]
  ],
  // Pterodáctilo Asa Baixo
  ptero2: [
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0]
  ],
  // Nuvem
  cloud: [
    [0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0]
  ]
};

// Estado do Jogo
const STATE = {
  START: 0,
  PLAYING: 1,
  GAMEOVER: 2
};

let gameState = STATE.START;
let score = 0;
let highScore = parseInt(localStorage.getItem('dino_highscore')) || 0;
let speed = 6;
let frameCount = 0;
let scoreFlash = 0;

// Dino
const dino = {
  x: 50,
  y: GROUND_Y - 47,
  width: 44,
  height: 47,
  baseY: GROUND_Y - 47,
  vy: 0,
  gravity: 0.65,
  jumpStrength: -11.5,
  isGrounded: true,
  isDucking: false,
  animTick: 0,

  reset() {
    this.y = this.baseY;
    this.vy = 0;
    this.isGrounded = true;
    this.isDucking = false;
    this.width = 44;
    this.height = 47;
  },

  jump() {
    if (this.isGrounded && gameState === STATE.PLAYING) {
      this.vy = this.jumpStrength;
      this.isGrounded = false;
      sound.playJump();
    }
  },

  duck(state) {
    if (gameState !== STATE.PLAYING) return;
    this.isDucking = state;
    if (state) {
      this.width = 55;
      this.height = 30;
      this.y = GROUND_Y - 30;
      if (!this.isGrounded) {
        this.vy += 4; // Queda rápida
      }
    } else {
      this.width = 44;
      this.height = 47;
      if (this.isGrounded) {
        this.y = this.baseY;
      }
    }
  },

  update() {
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;

      const groundTarget = this.isDucking ? GROUND_Y - 30 : this.baseY;
      if (this.y >= groundTarget) {
        this.y = groundTarget;
        this.vy = 0;
        this.isGrounded = true;
      }
    }
    this.animTick++;
  },

  draw(ctx, colors) {
    const pSize = 2.4;
    let sprite = SPRITES.dinoRun1;

    if (gameState === STATE.GAMEOVER) {
      sprite = SPRITES.dinoRun1; // Olhos arregalados no game over
    } else if (this.isDucking) {
      sprite = (Math.floor(this.animTick / 6) % 2 === 0) ? SPRITES.dinoDuck1 : SPRITES.dinoDuck2;
    } else if (!this.isGrounded) {
      sprite = SPRITES.dinoRun1;
    } else {
      sprite = (Math.floor(this.animTick / 6) % 2 === 0) ? SPRITES.dinoRun1 : SPRITES.dinoRun2;
    }

    drawPixels(ctx, this.x, this.y, sprite, pSize, colors.dino);
  },

  getHitbox() {
    // Hitbox ligeiramente menor que a borda visual para colisão justa
    if (this.isDucking) {
      return { x: this.x + 4, y: this.y + 6, width: this.width - 8, height: this.height - 8 };
    }
    return { x: this.x + 8, y: this.y + 4, width: this.width - 16, height: this.height - 8 };
  }
};

// Obstáculos (Cactos e Pterodáctilos)
let obstacles = [];
let nextObstacleDistance = 0;

function spawnObstacle() {
  const rand = Math.random();
  let obs = {};

  if (score > 350 && Math.random() < 0.35) {
    // Pterodáctilo
    const heights = [GROUND_Y - 35, GROUND_Y - 60, GROUND_Y - 85];
    const yPos = heights[Math.floor(Math.random() * heights.length)];
    obs = {
      type: 'ptero',
      x: CANVAS_WIDTH + 20,
      y: yPos,
      width: 42,
      height: 30,
      animTick: 0
    };
  } else if (rand < 0.5) {
    // Cacto Pequeno
    const count = Math.random() < 0.4 ? 2 : 1;
    obs = {
      type: 'cactusSmall',
      x: CANVAS_WIDTH + 20,
      y: GROUND_Y - 30,
      width: count * 18,
      height: 30,
      count: count
    };
  } else {
    // Cacto Grande
    const count = Math.random() < 0.3 ? 2 : 1;
    obs = {
      type: 'cactusBig',
      x: CANVAS_WIDTH + 20,
      y: GROUND_Y - 44,
      width: count * 24,
      height: 44,
      count: count
    };
  }

  obstacles.push(obs);
  nextObstacleDistance = Math.floor(Math.random() * 200) + 160 + (speed * 12);
}

// Chão & Linha do Horizonte
let groundOffset = 0;
const groundBumps = [];
for (let i = 0; i < 40; i++) {
  groundBumps.push({
    x: i * 25 + Math.random() * 10,
    len: Math.floor(Math.random() * 8) + 2,
    yOffset: Math.random() < 0.5 ? 2 : 5
  });
}

// Nuvens
let clouds = [
  { x: 200, y: 50, speed: 0.6 },
  { x: 500, y: 80, speed: 0.5 },
  { x: 750, y: 40, speed: 0.7 }
];

// Estrelas
let stars = [
  { x: 120, y: 40 }, { x: 300, y: 60 }, { x: 480, y: 30 },
  { x: 650, y: 70 }, { x: 780, y: 45 }
];

// Loop Principal
function update() {
  if (gameState !== STATE.PLAYING) return;

  frameCount++;
  score = Math.floor(frameCount / 4);

  // Aceleração progressiva
  speed = Math.min(13.5, 6 + (score / 400));

  // Notificação sonora a cada 100 pontos
  if (score > 0 && score % 100 === 0 && scoreFlash === 0) {
    sound.playMilestone();
    scoreFlash = 60; // Pisca pontuação
  }
  if (scoreFlash > 0) scoreFlash--;

  // Transição Dia / Noite a cada 700 pontos
  const cycle = Math.floor(score / 700);
  if (cycle % 2 === 1 && !document.body.classList.contains('night-mode')) {
    document.body.classList.add('night-mode');
  } else if (cycle % 2 === 0 && document.body.classList.contains('night-mode')) {
    document.body.classList.remove('night-mode');
  }

  // Dino update
  dino.update();

  // Chão update
  groundOffset = (groundOffset + speed) % 1000;

  // Nuvens update
  clouds.forEach(c => {
    c.x -= c.speed;
    if (c.x < -60) {
      c.x = CANVAS_WIDTH + Math.random() * 80;
      c.y = 30 + Math.random() * 60;
    }
  });

  // Obstáculos update
  nextObstacleDistance -= speed;
  if (nextObstacleDistance <= 0) {
    spawnObstacle();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= speed;
    if (obs.type === 'ptero') obs.animTick++;

    // Detecção de Colisão
    const dBox = dino.getHitbox();
    const oBox = { x: obs.x + 3, y: obs.y + 3, width: obs.width - 6, height: obs.height - 6 };

    if (
      dBox.x < oBox.x + oBox.width &&
      dBox.x + dBox.width > oBox.x &&
      dBox.y < oBox.y + oBox.height &&
      dBox.y + dBox.height > oBox.y
    ) {
      gameOver();
      return;
    }

    if (obs.x + obs.width < -30) {
      obstacles.splice(i, 1);
    }
  }
}

function gameOver() {
  gameState = STATE.GAMEOVER;
  sound.playHit();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('dino_highscore', highScore);
  }
}

function restartGame() {
  gameState = STATE.PLAYING;
  score = 0;
  frameCount = 0;
  speed = 6;
  scoreFlash = 0;
  obstacles = [];
  nextObstacleDistance = 140;
  dino.reset();
}

// Renderização
function draw() {
  const colors = getColors();

  // Limpa tela
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Estrelas e Lua (se for noite)
  if (document.body.classList.contains('night-mode')) {
    ctx.fillStyle = colors.star;
    stars.forEach(s => {
      ctx.fillRect(s.x, s.y, 2, 2);
    });

    // Lua Crescente
    ctx.fillStyle = colors.text;
    ctx.beginPath();
    ctx.arc(720, 45, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.bg;
    ctx.beginPath();
    ctx.arc(714, 42, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nuvens
  clouds.forEach(c => {
    drawPixels(ctx, c.x, c.y, SPRITES.cloud, 2.2, colors.cloud);
  });

  // Linha do Chão
  ctx.strokeStyle = colors.ground;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
  ctx.stroke();

  // Detalhes do chão (pedrinhas em movimento)
  ctx.fillStyle = colors.ground;
  groundBumps.forEach(b => {
    const x = (b.x - groundOffset) % CANVAS_WIDTH;
    const finalX = x < 0 ? x + CANVAS_WIDTH : x;
    ctx.fillRect(finalX, GROUND_Y + b.yOffset, b.len, 1.5);
  });

  // Obstáculos
  obstacles.forEach(obs => {
    if (obs.type === 'cactusSmall') {
      for (let k = 0; k < obs.count; k++) {
        drawPixels(ctx, obs.x + k * 18, obs.y, SPRITES.cactusSmall, 2.4, colors.dino);
      }
    } else if (obs.type === 'cactusBig') {
      for (let k = 0; k < obs.count; k++) {
        drawPixels(ctx, obs.x + k * 24, obs.y, SPRITES.cactusBig, 2.8, colors.dino);
      }
    } else if (obs.type === 'ptero') {
      const sprite = (Math.floor(obs.animTick / 7) % 2 === 0) ? SPRITES.ptero1 : SPRITES.ptero2;
      drawPixels(ctx, obs.x, obs.y, sprite, 2.8, colors.dino);
    }
  });

  // Dino
  dino.draw(ctx, colors);

  // Placar (Score & High Score)
  ctx.fillStyle = colors.text;
  ctx.font = '12px "Press Start 2P", monospace';
  ctx.textAlign = 'right';

  const hiStr = 'HI ' + String(highScore).padStart(5, '0');
  const scoreStr = String(score).padStart(5, '0');

  ctx.fillText(`${hiStr}  ${scoreFlash > 0 && Math.floor(scoreFlash / 10) % 2 === 0 ? '     ' : scoreStr}`, CANVAS_WIDTH - 20, 32);

  // Telas de Início e Game Over
  if (gameState === STATE.START) {
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.text;
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText('PRESSIONE ESPAÇO PARA JOGAR', CANVAS_WIDTH / 2, GROUND_Y - 90);
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('(OU TOQUE NA TELA)', CANVAS_WIDTH / 2, GROUND_Y - 65);
  } else if (gameState === STATE.GAMEOVER) {
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.text;
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText('G A M E  O V E R', CANVAS_WIDTH / 2, GROUND_Y - 95);

    // Botão de Reinício (Ícone circular de replay)
    const rx = CANVAS_WIDTH / 2;
    const ry = GROUND_Y - 55;
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(rx, ry, 15, 0.4, Math.PI * 1.8);
    ctx.stroke();
    // Triângulo da seta
    ctx.fillStyle = colors.text;
    ctx.beginPath();
    ctx.moveTo(rx + 14, ry - 7);
    ctx.lineTo(rx + 22, ry);
    ctx.lineTo(rx + 14, ry + 7);
    ctx.fill();

    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('Pressione ESPAÇO para reiniciar', CANVAS_WIDTH / 2, GROUND_Y - 15);
  }
}

// Loop Principal de Animação
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Tratamento de Teclado
window.addEventListener('keydown', (e) => {
  const isJumpKey = e.code === 'Space' || e.key === ' ' || e.keyCode === 32 ||
                    e.code === 'ArrowUp' || e.key === 'ArrowUp' || e.keyCode === 38 ||
                    e.code === 'KeyW' || e.key === 'w' || e.key === 'W' ||
                    e.code === 'Enter' || e.key === 'Enter';

  const isDuckKey = e.code === 'ArrowDown' || e.key === 'ArrowDown' || e.keyCode === 40 ||
                    e.code === 'KeyS' || e.key === 's' || e.key === 'S';

  if (isJumpKey) {
    e.preventDefault();
    if (gameState === STATE.START || gameState === STATE.GAMEOVER) {
      restartGame();
    } else {
      dino.jump();
    }
  } else if (isDuckKey) {
    e.preventDefault();
    dino.duck(true);
  }
});

window.addEventListener('keyup', (e) => {
  const isDuckKey = e.code === 'ArrowDown' || e.key === 'ArrowDown' || e.keyCode === 40 ||
                    e.code === 'KeyS' || e.key === 's' || e.key === 'S';
  if (isDuckKey) {
    dino.duck(false);
  }
});

// Toque na Tela / Mouse em qualquer lugar da área de jogo
function handleUserAction(e) {
  if (e && e.target && e.target.closest('#soundBtn, #themeBtn, .back-link, #mobileDuckBtn')) {
    return; // Não inicia se clicou nos botões de controle ou no link
  }
  if (gameState === STATE.START || gameState === STATE.GAMEOVER) {
    restartGame();
  } else {
    dino.jump();
  }
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleUserAction(e);
});

document.querySelector('.canvas-wrapper')?.addEventListener('pointerdown', (e) => {
  if (e.target !== canvas) {
    e.preventDefault();
    handleUserAction(e);
  }
});

// Botões Mobile
const jumpBtn = document.getElementById('mobileJumpBtn');
const duckBtn = document.getElementById('mobileDuckBtn');

if (jumpBtn) {
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (gameState === STATE.START || gameState === STATE.GAMEOVER) {
      restartGame();
    } else {
      dino.jump();
    }
  });
}

if (duckBtn) {
  duckBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dino.duck(true);
  });
  duckBtn.addEventListener('pointerup', (e) => {
    e.preventDefault();
    dino.duck(false);
  });
  duckBtn.addEventListener('pointerleave', (e) => {
    e.preventDefault();
    dino.duck(false);
  });
}

// Botão de Som Mudo
const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    sound.muted = !sound.muted;
    soundBtn.textContent = sound.muted ? '🔇' : '🔊';
  });
}

// Botão de Tema Manual
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    themeBtn.textContent = document.body.classList.contains('night-mode') ? '☀️' : '🌙';
  });
}
