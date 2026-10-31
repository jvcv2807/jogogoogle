/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, FloorTheme, ElementType, BossArchetype, Enemy } from '../types/game';
import { calculateBossHp, calculateBossAtk } from '../utils/numberFormat';

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    roman: 'I',
    title: 'O Despertar da Torre',
    floorsRange: [1, 10],
    guardianName: 'Grimgor',
    guardianTitle: 'O Rei Goblin',
    element: 'Natureza',
    description: 'Florestas densas, cavernas sombrias e ruínas esquecidas onde hordas goblins e mortos-vivos despertam.'
  },
  {
    id: 2,
    roman: 'II',
    title: 'Terras Elementais',
    floorsRange: [11, 20],
    guardianName: 'Atlas',
    guardianTitle: 'O Titã Elemental',
    element: 'Terra',
    description: 'Desertos escaldantes, vulcões ativos e santuários onde o poder dos quatro elementos ruge.'
  },
  {
    id: 3,
    roman: 'III',
    title: 'Reino dos Mortos',
    floorsRange: [21, 30],
    guardianName: 'Morghul',
    guardianTitle: 'O Necromante Eterno',
    element: 'Trevas',
    description: 'Cemitérios profanados, catedrais sombrias e o lago das almas perdidas governado pela magia negra.'
  },
  {
    id: 4,
    roman: 'IV',
    title: 'Domínio das Feras',
    floorsRange: [31, 40],
    guardianName: 'Ignaroth',
    guardianTitle: 'O Dragão Primordial',
    element: 'Fogo',
    description: 'Selvas inexploradas, ninhos de harpias e montanhas vulcânicas onde dragões anciãos imperam.'
  },
  {
    id: 5,
    roman: 'V',
    title: 'Império Mecânico',
    floorsRange: [41, 50],
    guardianName: 'Mechanor',
    guardianTitle: 'O Deus Máquina',
    element: 'Raio',
    description: 'Engrenagens colossais, reatores arcanos instáveis e autômatos bélicos que nunca dormem.'
  },
  {
    id: 6,
    roman: 'VI',
    title: 'Reinos Esquecidos',
    floorsRange: [51, 60],
    guardianName: 'Nereus',
    guardianTitle: 'O Imperador do Abismo',
    element: 'Agua',
    description: 'Cidades submersas nos abismos oceânicos, navios fantasmas e templos de distorções temporais.'
  },
  {
    id: 7,
    roman: 'VII',
    title: 'Invasão Demoníaca',
    floorsRange: [61, 70],
    guardianName: 'Azrak',
    guardianTitle: 'O Rei Demônio',
    element: 'Fogo',
    description: 'Rios de sangue fervente, catedrais de puro pecado e torturadores infernais de pesadelo.'
  },
  {
    id: 8,
    roman: 'VIII',
    title: 'Guerra Celestial',
    floorsRange: [71, 80],
    guardianName: 'Seraphion',
    guardianTitle: 'O Deus Caído',
    element: 'Luz',
    description: 'Jardins celestiais corrompidos, constelações vivas e juízes divinos em guerra eterna.'
  },
  {
    id: 9,
    roman: 'IX',
    title: 'Além da Realidade',
    floorsRange: [81, 90],
    guardianName: "Xal'thor",
    guardianTitle: 'O Devorador de Mundos',
    element: 'Arcano',
    description: 'Dimensões invertidas, desertos astrais e tempestades de gravidade rasgando a sanidade.'
  },
  {
    id: 10,
    roman: 'X',
    title: 'O Fim dos Abismos',
    floorsRange: [91, 100],
    guardianName: 'AETHERION',
    guardianTitle: 'O Criador dos Abismos',
    element: 'Arcano',
    description: 'O topo da torre onde fragmentos de universos colidem diante da entidade primordial de Eldoria.'
  }
];

// Exact floor names from the design brief
const FLOOR_NAMES_MAP: Record<number, { name: string; theme: string; element: ElementType }> = {
  1: { name: 'Floresta dos Goblins', theme: 'Floresta tomada por monstros', element: 'Natureza' },
  2: { name: 'Caverna dos Morcegos', theme: 'Cavernas escuras e asas na noite', element: 'Trevas' },
  3: { name: 'Pântano Venenoso', theme: 'Pântano tóxico e lodo ácido', element: 'Natureza' },
  4: { name: 'Minas Abandonadas', theme: 'Túneis de pedra e veios de cristais', element: 'Terra' },
  5: { name: 'Ruínas dos Esqueletos', theme: 'Fortaleza de ossos e mortos-vivos', element: 'Trevas' },
  6: { name: 'Covil das Aranhas', theme: 'Teias gigantescas e presas sedentas', element: 'Natureza' },
  7: { name: 'Bosque Amaldiçoado', theme: 'Árvores corrompidas e sussurros', element: 'Trevas' },
  8: { name: 'Fortaleza dos Orcs', theme: 'Acampamento militar impiedoso', element: 'Terra' },
  9: { name: 'Catacumbas Perdidas', theme: 'Túmulos antigos e guardiões de pedra', element: 'Trevas' },
  10: { name: 'Castelo do Rei Goblin', theme: 'Fortaleza real de ferro e madeira', element: 'Natureza' },

  11: { name: 'Deserto Escarlate', theme: 'Dunas de areia vermelha e escorpiões', element: 'Terra' },
  12: { name: 'Templo das Serpentes', theme: 'Armadilhas milenares e veneno', element: 'Natureza' },
  13: { name: 'Vulcão Adormecido', theme: 'Rochas basálticas e fissuras de lava', element: 'Fogo' },
  14: { name: 'Cavernas Flamejantes', theme: 'Criaturas nascidas do fogo puro', element: 'Fogo' },
  15: { name: 'Planície Congelada', theme: 'Geleiras eternas e ventos cortantes', element: 'Agua' },
  16: { name: 'Palácio de Gelo', theme: 'Torres translúcidas de gelo perpétuo', element: 'Agua' },
  17: { name: 'Templo das Tempestades', theme: 'Arcos elétricos e trovões celestes', element: 'Raio' },
  18: { name: 'Ilhas Flutuantes', theme: 'Rochas suspensas e monstros alados', element: 'Raio' },
  19: { name: 'Santuário Elemental', theme: 'Convergência das quatro forças primordiais', element: 'Arcano' },
  20: { name: 'Trono do Titã', theme: 'Arena monumental de magma e rocha', element: 'Terra' },

  21: { name: 'Cemitério Esquecido', theme: 'Névoa gélida e lápides destruídas', element: 'Trevas' },
  22: { name: 'Cripta dos Vampiros', theme: 'Sarcófagos de mármore e sede de sangue', element: 'Trevas' },
  23: { name: 'Cidade Fantasma', theme: 'Espectros condenados vagando pelas ruas', element: 'Trevas' },
  24: { name: 'Laboratório Profano', theme: 'Alquimia proibida e quimeras mortas', element: 'Natureza' },
  25: { name: 'Prisão dos Condenados', theme: 'Correntes arcanas e almas em tortura', element: 'Trevas' },
  26: { name: 'Catedral Sombria', theme: 'Vitrôs negros e clérigos da perdição', element: 'Trevas' },
  27: { name: 'Lago das Almas', theme: 'Águas espirituais que afogam a luz', element: 'Agua' },
  28: { name: 'Fortaleza dos Liches', theme: 'Filactérias cintilantes e poder necrótico', element: 'Trevas' },
  29: { name: 'Portal do Submundo', theme: 'Fenda abissal liberando demônios menores', element: 'Fogo' },
  30: { name: 'Palácio do Necromante', theme: 'Trono de ossos ancestrais de Morghul', element: 'Trevas' },

  31: { name: 'Selva Selvagem', theme: 'Vegetação primordial e predadores titânicos', element: 'Natureza' },
  32: { name: 'Ninho das Harpias', theme: 'Picos escarpados e rajadas de vento', element: 'Raio' },
  33: { name: 'Labirinto do Minotauro', theme: 'Paredes colossais de pedra cinzenta', element: 'Terra' },
  34: { name: 'Montanhas dos Trolls', theme: 'Cavernas de pedra bruta e fúria', element: 'Terra' },
  35: { name: 'Covil das Quimeras', theme: 'Monstros de três cabeças e sopros letais', element: 'Fogo' },
  36: { name: 'Floresta dos Lobisomens', theme: 'Luar sangrento e uivos na escuridão', element: 'Trevas' },
  37: { name: 'Vale dos Dinossauros', theme: 'Feras do início dos tempos', element: 'Terra' },
  38: { name: 'Caverna dos Basiliscos', theme: 'Olhares petrificantes e sombras rígidas', element: 'Terra' },
  39: { name: 'Montanha dos Dragões', theme: 'Ninhos de serpes e cinzas incandescentes', element: 'Fogo' },
  40: { name: 'Trono do Dragão Ancião', theme: 'O covil supremo de Ignaroth', element: 'Fogo' },

  41: { name: 'Oficina dos Autômatos', theme: 'Esteiras de cobre e robôs despertos', element: 'Raio' },
  42: { name: 'Fábrica Abandonada', theme: 'Fornos industriais e caldeiras a vapor', element: 'Fogo' },
  43: { name: 'Minas de Energia', theme: 'Cristais elétricos pulsantes', element: 'Raio' },
  44: { name: 'Laboratório Arcano', theme: 'Sinergia de magia ancestral e metalurgia', element: 'Arcano' },
  45: { name: 'Cidade dos Golems', theme: 'Sentinelas de latão e titânio', element: 'Terra' },
  46: { name: 'Fortaleza de Ferro', theme: 'Muralhas de aço temperado e canhões', element: 'Raio' },
  47: { name: 'Torre dos Engenheiros', theme: 'Engenhocas letais e cientistas insanos', element: 'Arcano' },
  48: { name: 'Reator Instável', theme: 'Descargas eletromagnéticas descontroladas', element: 'Raio' },
  49: { name: 'Arsenal Mecânico', theme: 'Armaduras gigantes e armas autônomas', element: 'Raio' },
  50: { name: 'Núcleo do Deus Máquina', theme: 'O coração cibernético de Mechanor', element: 'Raio' },

  51: { name: 'Cidade Submersa', theme: 'Ruínas oceânicas de civilização esquecida', element: 'Agua' },
  52: { name: 'Abismo Marinho', theme: 'Profundezas escuras e bioluminescência', element: 'Agua' },
  53: { name: 'Navio Fantasma', theme: 'Conveses apodrecidos e piratas condenados', element: 'Trevas' },
  54: { name: 'Reino dos Tritões', theme: 'Tridentes forjados com pérolas e coral', element: 'Agua' },
  55: { name: 'Recife dos Leviatãs', theme: 'Monstros marinhos descomunais', element: 'Agua' },
  56: { name: 'Cidade de Cristal', theme: 'Prismas vivos que refratam a realidade', element: 'Luz' },
  57: { name: 'Biblioteca Perdida', theme: 'Grimórios encantados flutuantes', element: 'Arcano' },
  58: { name: 'Reino dos Espelhos', theme: 'Reflexos que ganham vida própria', element: 'Arcano' },
  59: { name: 'Templo do Tempo', theme: 'Fendas temporais aceleradas', element: 'Arcano' },
  60: { name: 'Palácio do Imperador', theme: 'O salão dourado de Nereus nas profundezas', element: 'Agua' },

  61: { name: 'Floresta Corrompida', theme: 'Raízes demoníacas e seiva de enxofre', element: 'Fogo' },
  62: { name: 'Fortaleza Infernal', theme: 'Fortificações talhadas em obsidiana', element: 'Fogo' },
  63: { name: 'Rio de Sangue', theme: 'Correntezas escarlates ferventes', element: 'Trevas' },
  64: { name: 'Arena dos Condenados', theme: 'Combates bárbaros entre demônios', element: 'Fogo' },
  65: { name: 'Prisão das Almas', theme: 'Gaiolas suspensas sobre o lago de fogo', element: 'Trevas' },
  66: { name: 'Catedral Demoníaca', theme: 'Altares de sacrifício e cânticos abissais', element: 'Trevas' },
  67: { name: 'Cidade das Sombras', theme: 'Ruelas de escuridão viva e assassinos', element: 'Trevas' },
  68: { name: 'Portal do Inferno', theme: 'Portões escancarados para o abismo', element: 'Fogo' },
  69: { name: 'Trono dos Pecados', theme: 'Presença dos sete generais demoníacos', element: 'Trevas' },
  70: { name: 'Palácio do Rei Demônio', theme: 'A cidadela flamejante de Azrak', element: 'Fogo' },

  71: { name: 'Jardins Celestiais', theme: 'Campos de lírios divinos e luz dourada', element: 'Luz' },
  72: { name: 'Santuário da Luz', theme: 'Colunas de mármore e guerreiros alados', element: 'Luz' },
  73: { name: 'Cidade dos Anjos', theme: 'Anjos cegos pela pureza corrompida', element: 'Luz' },
  74: { name: 'Tribunal Divino', theme: 'Juízes com balanças de justiça inflexível', element: 'Luz' },
  75: { name: 'Ponte do Firmamento', theme: 'Passarela de arco-íris cósmico', element: 'Luz' },
  76: { name: 'Biblioteca Divina', theme: 'Pergaminhos com as leis do universo', element: 'Arcano' },
  77: { name: 'Jardim das Estrelas', theme: 'Constelações vivas dançando no céu', element: 'Luz' },
  78: { name: 'Fortaleza dos Arcanjos', theme: 'Lâminas reluzentes e escudos solares', element: 'Luz' },
  79: { name: 'Portão dos Deuses', theme: 'Entrada para o plano supremo', element: 'Luz' },
  80: { name: 'Trono do Deus Caído', theme: 'O trono quebrado de Seraphion', element: 'Luz' },

  81: { name: 'Floresta do Vazio', theme: 'Árvores sem matéria e névoa etérea', element: 'Arcano' },
  82: { name: 'Deserto Astral', theme: 'Dunas de pó estelar e auroras boreais', element: 'Arcano' },
  83: { name: 'Cidade Invertida', theme: 'Torres apontando para o abismo espacial', element: 'Arcano' },
  84: { name: 'Labirinto Dimensional', theme: 'Corredores infinitos de hipercubos', element: 'Arcano' },
  85: { name: 'Oceano Cósmico', theme: 'Navegação por nebulosas radiantes', element: 'Arcano' },
  86: { name: 'Jardim do Caos', theme: 'Matéria instável mudando a cada piscar', element: 'Arcano' },
  87: { name: 'Biblioteca do Infinito', theme: 'Conhecimento que enlouquece mortais', element: 'Arcano' },
  88: { name: 'Prisão das Dimensões', theme: 'Seres incompreensíveis aprisionados', element: 'Arcano' },
  89: { name: 'Coração do Universo', theme: 'A fornalha das primeiras galáxias', element: 'Luz' },
  90: { name: 'Trono do Devorador', theme: 'O horizonte de eventos de Xal\'thor', element: 'Trevas' },

  91: { name: 'Reino Destruído', theme: 'Fragmentos de todos os 90 andares abaixo', element: 'Terra' },
  92: { name: 'Labirinto das Memórias', theme: 'Ecos e fantasmas dos heróis de Eldoria', element: 'Arcano' },
  93: { name: 'Cemitério dos Heróis', theme: 'Espadas cravadas em colinas infinitas', element: 'Luz' },
  94: { name: 'Fortaleza do Destino', theme: 'Engrenagens cósmicas que ditam o fim', element: 'Raio' },
  95: { name: 'Santuário do Primeiro Rei', theme: 'O monarca que desafiou a torre outrora', element: 'Terra' },
  96: { name: 'Jardim do Apocalipse', theme: 'Flores de cinzas e cometas cadentes', element: 'Fogo' },
  97: { name: 'Trono da Eternidade', theme: 'Entidades atemporais velando o fim', element: 'Luz' },
  98: { name: 'Reino do Nada', theme: 'Silêncio absoluto antes da criação', element: 'Arcano' },
  99: { name: 'Portão do Último Abismo', theme: 'Sombra dos 99 soberanos ressuscitados', element: 'Trevas' },
  100: { name: 'Coração da Torre', theme: 'O sanctum primordial de Aetherion', element: 'Arcano' }
};

export const ARCHETYPES: { type: BossArchetype; title: string; mechanic: string }[] = [
  { type: 'Brutamontes', title: 'Brutamontes', mechanic: 'Força bruta e golpes massivos' },
  { type: 'Caçador', title: 'Caçador', mechanic: 'Ataques velozes e perfuração' },
  { type: 'Feiticeiro', title: 'Feiticeiro', mechanic: 'Magias arcanas devastadoras' },
  { type: 'Assassino', title: 'Assassino', mechanic: 'Golpes críticos fulminantes' },
  { type: 'Berserker', title: 'Berserker', mechanic: 'Fúria crescente quando ferido' },
  { type: 'Corruptor', title: 'Corruptor', mechanic: 'Veneno e maldições debilitantes' },
  { type: 'Guardião', title: 'Guardião', mechanic: 'Defesa e escudo de resistência ampliados' },
  { type: 'Invocador', title: 'Invocador', mechanic: 'Invocações de lacaios protetores' },
  { type: 'General', title: 'General', mechanic: 'Comanda o campo e combina poderes' },
  { type: 'Soberano', title: 'Guardião Supremo', mechanic: 'Combate em 3 fases com fúria elemental' }
];

export function getFloorTheme(floorNum: number): FloorTheme {
  const boundedFloor = Math.max(1, Math.min(100, floorNum));
  const chapterId = Math.ceil(boundedFloor / 10);
  const chapter = CHAPTERS.find(c => c.id === chapterId) || CHAPTERS[0];
  const info = FLOOR_NAMES_MAP[boundedFloor] || {
    name: `Andar ${boundedFloor}`,
    theme: 'Ruínas misteriosas',
    element: chapter.element
  };

  // Visual palettes based on chapter & element
  const paletteByChapter: Record<number, { bg: string; sky: string; ground: string; accent: string; particles: FloorTheme['ambientParticles'] }> = {
    1: { bg: '#0b1d13', sky: '#123320', ground: '#1f4327', accent: '#4ade80', particles: 'spores' },
    2: { bg: '#241209', sky: '#3d1c0c', ground: '#572611', accent: '#f97316', particles: 'fire' },
    3: { bg: '#100c1e', sky: '#1b1333', ground: '#2a1f4a', accent: '#a855f7', particles: 'souls' },
    4: { bg: '#1a1005', sky: '#2e1906', ground: '#4a280a', accent: '#eab308', particles: 'fire' },
    5: { bg: '#0f172a', sky: '#1e293b', ground: '#334155', accent: '#38bdf8', particles: 'sparks' },
    6: { bg: '#061a29', sky: '#0c2d48', ground: '#14466b', accent: '#06b6d4', particles: 'bubbles' },
    7: { bg: '#1c0505', sky: '#330a0a', ground: '#4f1111', accent: '#ef4444', particles: 'fire' },
    8: { bg: '#171a2b', sky: '#2a2e4d', ground: '#3e4470', accent: '#fbbf24', particles: 'stars' },
    9: { bg: '#180728', sky: '#2d0f4d', ground: '#43196f', accent: '#f43f5e', particles: 'void' },
    10: { bg: '#090514', sky: '#170b33', ground: '#261254', accent: '#e879f9', particles: 'crystals' }
  };

  const p = paletteByChapter[chapterId] || paletteByChapter[1];

  return {
    floorNumber: boundedFloor,
    name: info.name,
    chapter: chapterId,
    chapterName: chapter.title,
    theme: info.theme,
    environmentName: info.name,
    bgColor: p.bg,
    skyColor: p.sky,
    groundColor: p.ground,
    accentColor: p.accent,
    sovereignName: boundedFloor % 10 === 0 ? chapter.guardianName : `Guardião de ${info.name}`,
    element: info.element,
    ambientParticles: p.particles
  };
}

/**
 * Generates an enemy / boss for a given floor and level (1-10) and stage (horde, elite, boss)
 */
export function generateEnemy(floor: number, levelInFloor: number, stage: 'horde' | 'elite' | 'boss'): Enemy {
  const floorTheme = getFloorTheme(floor);
  const globalLevel = (floor - 1) * 10 + levelInFloor; // 1 to 1000
  const isSupreme = levelInFloor === 10 && stage === 'boss';
  const archetypeInfo = ARCHETYPES[(levelInFloor - 1) % ARCHETYPES.length];

  const baseHp = calculateBossHp(globalLevel, isSupreme);
  const baseAtk = calculateBossAtk(globalLevel, isSupreme);

  if (stage === 'horde') {
    const hordeHp = Math.max(10, Math.floor(baseHp * 0.18));
    const hordeAtk = Math.max(2, Math.floor(baseAtk * 0.35));
    const isGoblin = floor === 1;
    return {
      id: `horde_${floor}_${levelInFloor}_${Date.now()}`,
      name: isGoblin ? 'Goblin Selvagem' : `Lacaio de ${floorTheme.name}`,
      title: isGoblin ? 'Monstro da Floresta' : 'Monstro Comum',
      isBoss: false,
      isSupremeBoss: false,
      stageType: 'horde',
      element: floorTheme.element,
      level: globalLevel,
      maxHp: hordeHp,
      currentHp: hordeHp,
      maxBreakGauge: Math.floor(hordeHp * 0.25),
      currentBreakGauge: Math.floor(hordeHp * 0.25),
      isStunned: false,
      stunTimer: 0,
      atk: hordeAtk,
      def: Math.floor(hordeAtk * 0.2),
      attackInterval: 2.5,
      attackTimer: 0,
      color: floorTheme.accentColor,
      accentColor: floorTheme.groundColor,
      sizeMultiplier: 0.95
    };
  }

  if (stage === 'elite') {
    const eliteHp = Math.max(25, Math.floor(baseHp * 0.5));
    const eliteAtk = Math.max(5, Math.floor(baseAtk * 0.65));
    return {
      id: `elite_${floor}_${levelInFloor}_${Date.now()}`,
      name: `${archetypeInfo.title} Elite de ${floorTheme.name}`,
      title: 'Monstro de Elite',
      isBoss: false,
      isSupremeBoss: false,
      archetype: archetypeInfo.type,
      stageType: 'elite',
      element: floorTheme.element,
      level: globalLevel,
      maxHp: eliteHp,
      currentHp: eliteHp,
      maxBreakGauge: Math.floor(eliteHp * 0.4),
      currentBreakGauge: Math.floor(eliteHp * 0.4),
      isStunned: false,
      stunTimer: 0,
      atk: eliteAtk,
      def: Math.floor(eliteAtk * 0.35),
      attackInterval: 2.2,
      attackTimer: 0,
      specialAbility: archetypeInfo.mechanic,
      color: '#f59e0b',
      accentColor: floorTheme.accentColor,
      sizeMultiplier: 1.25
    };
  }

  // BOSS
  let bossName = `${floorTheme.name} - ${archetypeInfo.title}`;
  let bossTitle = `Guardião do Nível ${levelInFloor}`;
  
  if (levelInFloor === 10) {
    const chapterId = Math.ceil(floor / 10);
    const chapter = CHAPTERS.find(c => c.id === chapterId) || CHAPTERS[0];
    if (floor % 10 === 0) {
      bossName = `${chapter.guardianName}`;
      bossTitle = `${chapter.guardianTitle} [Soberano do Capítulo ${chapter.roman}]`;
    } else {
      bossName = `Soberano de ${floorTheme.name}`;
      bossTitle = `Guardião Supremo do Andar ${floor}`;
    }
  }

  const hp = baseHp;
  const atk = baseAtk;

  return {
    id: `boss_${floor}_${levelInFloor}_${Date.now()}`,
    name: bossName,
    title: bossTitle,
    isBoss: true,
    isSupremeBoss: isSupreme,
    archetype: archetypeInfo.type,
    stageType: 'boss',
    element: floorTheme.element,
    level: globalLevel,
    maxHp: hp,
    currentHp: hp,
    maxBreakGauge: Math.floor(hp * 0.6),
    currentBreakGauge: Math.floor(hp * 0.6),
    isStunned: false,
    stunTimer: 0,
    atk: atk,
    def: Math.floor(atk * 0.4),
    attackInterval: isSupreme ? 1.8 : 2.0,
    attackTimer: 0,
    phase: isSupreme ? 1 : undefined,
    specialAbility: archetypeInfo.mechanic,
    color: isSupreme ? '#ef4444' : '#eab308',
    accentColor: floorTheme.accentColor,
    sizeMultiplier: isSupreme ? 1.75 : 1.45
  };
}
