/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hero } from '../types/game';

export const INITIAL_HEROES: Hero[] = [
  // 1. Arthur - Guerreiro
  {
    id: 'hero_arthur',
    name: 'Arthur',
    title: 'O Campeão de Eldoria',
    heroClass: 'Guerreiro',
    rarity: 'Comum',
    element: 'Terra',
    specialty: 'Defesa e Dano Físico',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 950,
    baseAtk: 110,
    baseDef: 45,
    baseSpd: 1.2,
    baseCrit: 8,
    currentHp: 950,
    unlocked: true,
    shards: 10,
    color: '#3b82f6',
    accentColor: '#93c5fd',
    avatarSprite: '🛡️',
    passive: {
      name: 'Vontade Indomável',
      description: 'Reduz todo o dano recebido em 15% e aumenta defesa.',
      bonusType: 'defense',
      bonusValue: 15
    },
    skills: [
      {
        id: 'arthur_s1',
        name: 'Golpe Pesado',
        description: 'Desfere um golpe devastador causando 160% de dano e quebrando defesa.',
        multiplier: 1.6,
        cooldown: 4,
        currentCooldown: 0,
        icon: '⚔️',
        type: 'damage'
      },
      {
        id: 'arthur_s2',
        name: 'Postura do Guardião',
        description: 'Aumenta a defesa de toda a equipe em 30% por 6s.',
        multiplier: 1.0,
        cooldown: 12,
        currentCooldown: 0,
        icon: '🛡️',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Lâmina do Destino',
      description: 'Corta o ar com uma espada colossal, causando 550% de dano e quebrando 30% da barra de defesa do chefe.',
      multiplier: 5.5,
      chargeTime: 18,
      currentCharge: 0,
      icon: '⚡'
    }
  },

  // 2. Lyra - Arqueira
  {
    id: 'hero_lyra',
    name: 'Lyra',
    title: 'Vento Silencioso',
    heroClass: 'Arqueira',
    rarity: 'Comum',
    element: 'Natureza',
    specialty: 'Ataques Rápidos e Precisão',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 720,
    baseAtk: 135,
    baseDef: 25,
    baseSpd: 1.8,
    baseCrit: 18,
    currentHp: 720,
    unlocked: true,
    shards: 10,
    color: '#22c55e',
    accentColor: '#86efac',
    avatarSprite: '🏹',
    passive: {
      name: 'Passos da Brisa',
      description: 'Aumenta a velocidade de ataque da equipe em 12%.',
      bonusType: 'speed',
      bonusValue: 12
    },
    skills: [
      {
        id: 'lyra_s1',
        name: 'Tiro Perfurante',
        description: 'Dispara uma flecha veloz que causa 175% de dano perfurante.',
        multiplier: 1.75,
        cooldown: 3.5,
        currentCooldown: 0,
        icon: '🎯',
        type: 'damage'
      },
      {
        id: 'lyra_s2',
        name: 'Rajada de Flechas',
        description: 'Dispara 5 flechas em sucessão rápida totalizando 250% de dano.',
        multiplier: 2.5,
        cooldown: 8,
        currentCooldown: 0,
        icon: '🏹',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Tempestade de Vento Verde',
      description: 'Convoca um turbilhão esmeralda que atinge os inimigos causando 600% de dano e acelera os aliados.',
      multiplier: 6.0,
      chargeTime: 16,
      currentCharge: 0,
      icon: '🌪️'
    }
  },

  // 3. Kael - Mago das Chamas (Featured character from design doc!)
  {
    id: 'hero_kael',
    name: 'Kael',
    title: 'O Mago das Chamas',
    heroClass: 'Mago',
    rarity: 'Épico',
    element: 'Fogo',
    specialty: 'Dano Mágico em Área',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 800,
    baseAtk: 160,
    baseDef: 35,
    baseSpd: 1.1,
    baseCrit: 15,
    currentHp: 800,
    unlocked: true,
    shards: 15,
    color: '#ef4444',
    accentColor: '#fca5a5',
    avatarSprite: '🔥',
    passive: {
      name: 'Alma Flamejante',
      description: 'Inimigos queimados recebem 20% de dano adicional de toda a equipe.',
      bonusType: 'damage',
      bonusValue: 20
    },
    skills: [
      {
        id: 'kael_s1',
        name: 'Bola de Fogo',
        description: 'Lança uma explosão ígnea causando 180% de dano mágico.',
        multiplier: 1.8,
        cooldown: 4,
        currentCooldown: 0,
        icon: '☄️',
        type: 'damage'
      },
      {
        id: 'kael_s2',
        name: 'Chuva de Meteoros',
        description: 'Bombardeia o campo de batalha causando 300% de dano em área.',
        multiplier: 3.0,
        cooldown: 9,
        currentCooldown: 0,
        icon: '🌠',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Sol Carmesim',
      description: 'Invoca um pequeno sol flamejante que explode sobre a arena, provocando 800% de dano mágico devastador!',
      multiplier: 8.0,
      chargeTime: 20,
      currentCharge: 0,
      icon: '☀️'
    }
  },

  // 4. Serena - Sacerdotisa
  {
    id: 'hero_serena',
    name: 'Serena',
    title: 'Luz da Esperança',
    heroClass: 'Sacerdotisa',
    rarity: 'Comum',
    element: 'Luz',
    specialty: 'Cura e Purificação',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 750,
    baseAtk: 95,
    baseDef: 30,
    baseSpd: 1.0,
    baseCrit: 10,
    currentHp: 750,
    unlocked: true,
    shards: 10,
    color: '#eab308',
    accentColor: '#fef08a',
    avatarSprite: '✨',
    passive: {
      name: 'Graça Divina',
      description: 'Aumenta a eficácia de cura em 25% e regenera vida da equipe gradualmente.',
      bonusType: 'heal_boost',
      bonusValue: 25
    },
    skills: [
      {
        id: 'serena_s1',
        name: 'Luz Sagrada',
        description: 'Restaura 20% da vida máxima do aliado mais ferido e causa 120% de dano.',
        multiplier: 1.2,
        cooldown: 5,
        currentCooldown: 0,
        icon: '💖',
        type: 'heal'
      },
      {
        id: 'serena_s2',
        name: 'Oração Celestial',
        description: 'Cura toda a equipe em 30% da vida máxima e concede imunidade a atordoamento.',
        multiplier: 1.5,
        cooldown: 12,
        currentCooldown: 0,
        icon: '🕊️',
        type: 'heal'
      }
    ],
    ultimate: {
      name: 'Julgamento Sagrado',
      description: 'Emite um feixe de luz que cega os inimigos, cura 50% de todo o time e causa 500% de dano de Luz.',
      multiplier: 5.0,
      chargeTime: 18,
      currentCharge: 0,
      icon: '🔆'
    }
  },

  // 5. Raven - Assassino
  {
    id: 'hero_raven',
    name: 'Raven',
    title: 'Lâmina Noturna',
    heroClass: 'Assassino',
    rarity: 'Raro',
    element: 'Trevas',
    specialty: 'Dano Crítico e Evasão',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 680,
    baseAtk: 155,
    baseDef: 20,
    baseSpd: 1.7,
    baseCrit: 28,
    currentHp: 680,
    unlocked: false,
    shards: 0,
    color: '#8b5cf6',
    accentColor: '#c4b5fd',
    avatarSprite: '🗡️',
    passive: {
      name: 'Instinto Assassino',
      description: 'Aumenta a chance crítica de toda a equipe em 10%.',
      bonusType: 'crit',
      bonusValue: 10
    },
    skills: [
      {
        id: 'raven_s1',
        name: 'Corte Sombrio',
        description: 'Ataca pontos vitais causando 220% de dano crítico garantido.',
        multiplier: 2.2,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🗡️',
        type: 'damage'
      },
      {
        id: 'raven_s2',
        name: 'Dança das Sombras',
        description: 'Aumenta o multiplicador de crítico em 50% por 8s.',
        multiplier: 1.0,
        cooldown: 10,
        currentCooldown: 0,
        icon: '👤',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Execução Noturna',
      description: 'Surge das sombras desferindo um golpe letal que causa 750% de dano com 100% de crítico.',
      multiplier: 7.5,
      chargeTime: 17,
      currentCharge: 0,
      icon: '💀'
    }
  },

  // 6. Darius - Paladino
  {
    id: 'hero_darius',
    name: 'Darius',
    title: 'O Baluarte Dourado',
    heroClass: 'Paladino',
    rarity: 'Raro',
    element: 'Luz',
    specialty: 'Proteção e Provocação',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 1100,
    baseAtk: 95,
    baseDef: 55,
    baseSpd: 0.9,
    baseCrit: 5,
    currentHp: 1100,
    unlocked: false,
    shards: 0,
    color: '#fbbf24',
    accentColor: '#fde68a',
    avatarSprite: '🛡️',
    passive: {
      name: 'Aura da Pureza',
      description: 'Reduz o dano sofrido por aliados em 12%.',
      bonusType: 'defense',
      bonusValue: 12
    },
    skills: [
      {
        id: 'darius_s1',
        name: 'Martelo da Justiça',
        description: 'Esmaga o chão com poder radiante, causando 150% de dano e quebra de defesa.',
        multiplier: 1.5,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🔨',
        type: 'damage'
      },
      {
        id: 'darius_s2',
        name: 'Muralha Inquebrável',
        description: 'Gera um escudo protetor igual a 25% da vida máxima para toda a equipe.',
        multiplier: 1.25,
        cooldown: 14,
        currentCooldown: 0,
        icon: '🏰',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Fortaleza Radiante',
      description: 'Invoca pilares de luz sagrada que causam 480% de dano e tornam a equipe invulnerável por 4s.',
      multiplier: 4.8,
      chargeTime: 22,
      currentCharge: 0,
      icon: '🏛️'
    }
  },

  // 7. Freya - Berserker
  {
    id: 'hero_freya',
    name: 'Freya',
    title: 'Fúria Gélida',
    heroClass: 'Berserker',
    rarity: 'Raro',
    element: 'Agua',
    specialty: 'Dano Crescente com Vida Baixa',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 880,
    baseAtk: 140,
    baseDef: 30,
    baseSpd: 1.3,
    baseCrit: 16,
    currentHp: 880,
    unlocked: false,
    shards: 0,
    color: '#06b6d4',
    accentColor: '#a5f3fc',
    avatarSprite: '🪓',
    passive: {
      name: 'Sangue Glacial',
      description: 'Ganha até +40% de ataque conforme a equipe ataca continuamente.',
      bonusType: 'damage',
      bonusValue: 20
    },
    skills: [
      {
        id: 'freya_s1',
        name: 'Machado Congelante',
        description: 'Golpe violento que causa 200% de dano gélido e reduz o ataque inimigo.',
        multiplier: 2.0,
        cooldown: 3.8,
        currentCooldown: 0,
        icon: '❄️',
        type: 'damage'
      },
      {
        id: 'freya_s2',
        name: 'Frenesi Ártico',
        description: 'Aumenta a velocidade de ataque em 35% e chance de acerto crítico por 7s.',
        multiplier: 1.0,
        cooldown: 11,
        currentCooldown: 0,
        icon: '⚡',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Avalanche Impiedosa',
      description: 'Desencadeia uma fúria brutal desferindo múltiplos cortes glaciais com 680% de dano total.',
      multiplier: 6.8,
      chargeTime: 17,
      currentCharge: 0,
      icon: '🏔️'
    }
  },

  // 8. Sylas - Necromante
  {
    id: 'hero_sylas',
    name: 'Sylas',
    title: 'Voz dos Mortos',
    heroClass: 'Necromante',
    rarity: 'Raro',
    element: 'Trevas',
    specialty: 'Dano Contínuo e Debuffs',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 710,
    baseAtk: 130,
    baseDef: 28,
    baseSpd: 1.1,
    baseCrit: 12,
    currentHp: 710,
    unlocked: false,
    shards: 0,
    color: '#7c3aed',
    accentColor: '#ddd6fe',
    avatarSprite: '💀',
    passive: {
      name: 'Colheita de Almas',
      description: 'Aumenta o ganho de Ouro e Almas Ancestrais em 15%.',
      bonusType: 'damage',
      bonusValue: 15
    },
    skills: [
      {
        id: 'sylas_s1',
        name: 'Drenar Vitalidade',
        description: 'Rouba essência vital do inimigo, causando 170% de dano e restaurando a própria vida.',
        multiplier: 1.7,
        cooldown: 4.2,
        currentCooldown: 0,
        icon: '🩸',
        type: 'damage'
      },
      {
        id: 'sylas_s2',
        name: 'Espíritos Vingativos',
        description: 'Enxame espectral que atinge todos os inimigos com 240% de dano de trevas.',
        multiplier: 2.4,
        cooldown: 9,
        currentCooldown: 0,
        icon: '👻',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Cataclismo Necrótico',
      description: 'Rasga o solo despertando almas aprisionadas que explodem em 620% de dano necrótico.',
      multiplier: 6.2,
      chargeTime: 18,
      currentCharge: 0,
      icon: '⚰️'
    }
  },

  // 9. Iris - Feiticeira
  {
    id: 'hero_iris',
    name: 'Iris',
    title: 'A Centelha Celeste',
    heroClass: 'Feiticeira',
    rarity: 'Raro',
    element: 'Raio',
    specialty: 'Controle e Dano de Choque',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 730,
    baseAtk: 145,
    baseDef: 26,
    baseSpd: 1.3,
    baseCrit: 18,
    currentHp: 730,
    unlocked: false,
    shards: 0,
    color: '#eab308',
    accentColor: '#fef9c3',
    avatarSprite: '⚡',
    passive: {
      name: 'Sobrecarga Elétrica',
      description: 'Ataques têm 15% de chance de causar quebra de defesa instantânea de 10%.',
      bonusType: 'damage',
      bonusValue: 15
    },
    skills: [
      {
        id: 'iris_s1',
        name: 'Relâmpago em Cadeia',
        description: 'Arco voltaico que atinge o inimigo com 190% de dano elétrico veloz.',
        multiplier: 1.9,
        cooldown: 3.5,
        currentCooldown: 0,
        icon: '⚡',
        type: 'damage'
      },
      {
        id: 'iris_s2',
        name: 'Campo Eletrostático',
        description: 'Eletrifica a arena, paralisando o inimigo por 1.5s e causando 220% de dano.',
        multiplier: 2.2,
        cooldown: 8.5,
        currentCooldown: 0,
        icon: '🌐',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Trovão do Juízo',
      description: 'Dispara um raio colossal dos céus, causando 700% de dano e quebrando drasticamente o escudo do chefe.',
      multiplier: 7.0,
      chargeTime: 17,
      currentCharge: 0,
      icon: '⛈️'
    }
  },

  // 10. Thorne - Druida
  {
    id: 'hero_thorne',
    name: 'Thorne',
    title: 'Guardião do Bosque',
    heroClass: 'Druida',
    rarity: 'Raro',
    element: 'Natureza',
    specialty: 'Cura e Veneno',
    level: 1,
    stars: 1,
    awakening: 0,
    baseHp: 850,
    baseAtk: 115,
    baseDef: 38,
    baseSpd: 1.1,
    baseCrit: 10,
    currentHp: 850,
    unlocked: false,
    shards: 0,
    color: '#16a34a',
    accentColor: '#bbf7d0',
    avatarSprite: '🌿',
    passive: {
      name: 'Harmonia Natural',
      description: 'Regenera 3% da vida máxima dos aliados a cada 5 segundos.',
      bonusType: 'heal_boost',
      bonusValue: 20
    },
    skills: [
      {
        id: 'thorne_s1',
        name: 'Espinhos Envenenados',
        description: 'Atira vinhas espinhosas que causam 160% de dano e envenenam por 5s.',
        multiplier: 1.6,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🌵',
        type: 'damage'
      },
      {
        id: 'thorne_s2',
        name: 'Florescer Curativo',
        description: 'Bênção florestal que cura todos os aliados em 25% da vida máxima.',
        multiplier: 1.25,
        cooldown: 11,
        currentCooldown: 0,
        icon: '🌸',
        type: 'heal'
      }
    ],
    ultimate: {
      name: 'Ira de Gaia',
      description: 'Raízes gigantescas emergem do chão esmagando os inimigos com 580% de dano de Natureza.',
      multiplier: 5.8,
      chargeTime: 18,
      currentCharge: 0,
      icon: '🌲'
    }
  },

  // 11. Valeria - Cavaleira
  {
    id: 'hero_valeria',
    name: 'Valeria',
    title: 'A Rosa de Fogo',
    heroClass: 'Cavaleira',
    rarity: 'Lendário',
    element: 'Fogo',
    specialty: 'Ataque e Defesa Flamejante',
    level: 1,
    stars: 3,
    awakening: 0,
    baseHp: 1020,
    baseAtk: 150,
    baseDef: 48,
    baseSpd: 1.25,
    baseCrit: 16,
    currentHp: 1020,
    unlocked: false,
    shards: 0,
    color: '#dc2626',
    accentColor: '#fca5a5',
    avatarSprite: '⚔️',
    passive: {
      name: 'Armadura Ígnea',
      description: 'Devolve 20% do dano recebido em chamas e aumenta defesa em 18%.',
      bonusType: 'defense',
      bonusValue: 18
    },
    skills: [
      {
        id: 'valeria_s1',
        name: 'Investida Escarlate',
        description: 'Avança com sua lança em chamas causando 210% de dano físico e fogo.',
        multiplier: 2.1,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🔥',
        type: 'damage'
      },
      {
        id: 'valeria_s2',
        name: 'Estandarte da Glória',
        description: 'Aumenta ataque e defesa da equipe em 25% por 8s.',
        multiplier: 1.0,
        cooldown: 12,
        currentCooldown: 0,
        icon: '🚩',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Julgamento da Fênix',
      description: 'Uma fênix de magma sobrevoa o campo, causando 780% de dano e concedendo escudo a todo o time.',
      multiplier: 7.8,
      chargeTime: 19,
      currentCharge: 0,
      icon: '🦅'
    }
  },

  // 12. Noctis - Ceifador
  {
    id: 'hero_noctis',
    name: 'Noctis',
    title: 'Ceifador Abissal',
    heroClass: 'Ceifador',
    rarity: 'Lendário',
    element: 'Trevas',
    specialty: 'Roubo de Vida e Execução',
    level: 1,
    stars: 3,
    awakening: 0,
    baseHp: 890,
    baseAtk: 175,
    baseDef: 32,
    baseSpd: 1.4,
    baseCrit: 24,
    currentHp: 890,
    unlocked: false,
    shards: 0,
    color: '#6d28d9',
    accentColor: '#c4b5fd',
    avatarSprite: '🪦',
    passive: {
      name: 'Sede Eterna',
      description: '15% de todo o dano causado por Noctis é convertido em cura para ele.',
      bonusType: 'damage',
      bonusValue: 20
    },
    skills: [
      {
        id: 'noctis_s1',
        name: 'Foice das Almas',
        description: 'Corte curvo espectral que causa 230% de dano e quebra resistência.',
        multiplier: 2.3,
        cooldown: 3.8,
        currentCooldown: 0,
        icon: '🌙',
        type: 'damage'
      },
      {
        id: 'noctis_s2',
        name: 'Manto do Vazio',
        description: 'Fica imune a dano por 2s e aumenta ataque em 30%.',
        multiplier: 1.0,
        cooldown: 10,
        currentCooldown: 0,
        icon: '🌫️',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Valsa da Morte',
      description: 'Gira a foice em vórtice voraz, causando 850% de dano sombrio e curando 30% da vida da equipe.',
      multiplier: 8.5,
      chargeTime: 20,
      currentCharge: 0,
      icon: '🖤'
    }
  },

  // 13. Eldrin - Arquimago
  {
    id: 'hero_eldrin',
    name: 'Eldrin',
    title: 'Mestre do Arcano',
    heroClass: 'Arquimago',
    rarity: 'Lendário',
    element: 'Arcano',
    specialty: 'Magias Devastadoras e Multielementais',
    level: 1,
    stars: 3,
    awakening: 0,
    baseHp: 780,
    baseAtk: 190,
    baseDef: 30,
    baseSpd: 1.2,
    baseCrit: 22,
    currentHp: 780,
    unlocked: false,
    shards: 0,
    color: '#ec4899',
    accentColor: '#fbcfe8',
    avatarSprite: '🔮',
    passive: {
      name: 'Ressonância Arcana',
      description: 'Ignora 25% da defesa de qualquer inimigo ou chefe.',
      bonusType: 'damage',
      bonusValue: 25
    },
    skills: [
      {
        id: 'eldrin_s1',
        name: 'Orbe Prisma',
        description: 'Dispara uma esfera de energia pura que causa 240% de dano Arcano.',
        multiplier: 2.4,
        cooldown: 4,
        currentCooldown: 0,
        icon: '💠',
        type: 'damage'
      },
      {
        id: 'eldrin_s2',
        name: 'Distorção Espacial',
        description: 'Cria uma fissura que atordoa o inimigo por 2s e causa 280% de dano.',
        multiplier: 2.8,
        cooldown: 9,
        currentCooldown: 0,
        icon: '🌀',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Singularidade Dimensional',
      description: 'Abre um buraco negro no centro da arena que colapsa causando 920% de dano Arcano descomunal!',
      multiplier: 9.2,
      chargeTime: 21,
      currentCharge: 0,
      icon: '🌌'
    }
  },

  // 14. Astra - Guardiã
  {
    id: 'hero_astra',
    name: 'Astra',
    title: 'Sentinela da Luz',
    heroClass: 'Guardiã',
    rarity: 'Épico',
    element: 'Luz',
    specialty: 'Escudos Cósmicos e Refração',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 1050,
    baseAtk: 105,
    baseDef: 52,
    baseSpd: 1.0,
    baseCrit: 8,
    currentHp: 1050,
    unlocked: false,
    shards: 0,
    color: '#e0e7ff',
    accentColor: '#818cf8',
    avatarSprite: '🛡️',
    passive: {
      name: 'Prisma Protetor',
      description: 'Concede escudo automático a aliados com menos de 30% de vida.',
      bonusType: 'defense',
      bonusValue: 20
    },
    skills: [
      {
        id: 'astra_s1',
        name: 'Golpe Estelar',
        description: 'Esmaga com o escudo de luz estelar causando 170% de dano e atordoando.',
        multiplier: 1.7,
        cooldown: 4.5,
        currentCooldown: 0,
        icon: '⭐',
        type: 'damage'
      },
      {
        id: 'astra_s2',
        name: 'Barreira Celestial',
        description: 'Absorve até 35% do dano de toda a equipe durante 8s.',
        multiplier: 1.0,
        cooldown: 13,
        currentCooldown: 0,
        icon: '🌟',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Bastilha das Estrelas',
      description: 'Ergue uma fortaleza estelar que cura 30% da equipe e causa 520% de dano radiante aos inimigos.',
      multiplier: 5.2,
      chargeTime: 19,
      currentCharge: 0,
      icon: '🌠'
    }
  },

  // 15. Ragnar - Bárbaro
  {
    id: 'hero_ragnar',
    name: 'Ragnar',
    title: 'O Esmagador de Titãs',
    heroClass: 'Bárbaro',
    rarity: 'Épico',
    element: 'Terra',
    specialty: 'Dano Físico Bruto e Quebra de Defesa',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 980,
    baseAtk: 165,
    baseDef: 36,
    baseSpd: 1.15,
    baseCrit: 18,
    currentHp: 980,
    unlocked: false,
    shards: 0,
    color: '#b45309',
    accentColor: '#fde68a',
    avatarSprite: '🪨',
    passive: {
      name: 'Força Titânica',
      description: 'Aumenta todo o dano físico e de quebra de defesa em 25%.',
      bonusType: 'damage',
      bonusValue: 25
    },
    skills: [
      {
        id: 'ragnar_s1',
        name: 'Esmagar Crânios',
        description: 'Golpe descendente com martelo duplo causando 220% de dano e quebrando defesa.',
        multiplier: 2.2,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🔨',
        type: 'damage'
      },
      {
        id: 'ragnar_s2',
        name: 'Grito de Guerra',
        description: 'Aumenta ataque da equipe em 30% e velocidade em 15% por 6s.',
        multiplier: 1.0,
        cooldown: 11,
        currentCooldown: 0,
        icon: '🗣️',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Fúria Sísmica',
      description: 'Racha a crosta da terra sob o inimigo com 720% de dano e destrói 50% do escudo de defesa restante.',
      multiplier: 7.2,
      chargeTime: 18,
      currentCharge: 0,
      icon: '💥'
    }
  },

  // 16. Luna - Invocadora
  {
    id: 'hero_luna',
    name: 'Luna',
    title: 'Canalizadora da Lua',
    heroClass: 'Invocadora',
    rarity: 'Épico',
    element: 'Arcano',
    specialty: 'Criaturas Auxiliares e Cura Mágica',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 760,
    baseAtk: 135,
    baseDef: 28,
    baseSpd: 1.25,
    baseCrit: 14,
    currentHp: 760,
    unlocked: false,
    shards: 0,
    color: '#60a5fa',
    accentColor: '#bfdbfe',
    avatarSprite: '🌙',
    passive: {
      name: 'Bênção Lunar',
      description: 'Aumenta a recarga das habilidades da equipe em 15%.',
      bonusType: 'speed',
      bonusValue: 15
    },
    skills: [
      {
        id: 'luna_s1',
        name: 'Espírito Lupino',
        description: 'Invoca lobos lunares que mordem o inimigo causando 180% de dano rápido.',
        multiplier: 1.8,
        cooldown: 3.5,
        currentCooldown: 0,
        icon: '🐺',
        type: 'damage'
      },
      {
        id: 'luna_s2',
        name: 'Luar Restaurador',
        description: 'Cura 22% da equipe e aumenta dano mágico em 20%.',
        multiplier: 1.22,
        cooldown: 10,
        currentCooldown: 0,
        icon: '🌕',
        type: 'heal'
      }
    ],
    ultimate: {
      name: 'Eclipse Prateado',
      description: 'A lua cheia projeta sua fúria cobrindo a arena, causando 650% de dano Arcano e curando aliados.',
      multiplier: 6.5,
      chargeTime: 18,
      currentCharge: 0,
      icon: '🌘'
    }
  },

  // 17. Zephyr - Duelista
  {
    id: 'hero_zephyr',
    name: 'Zephyr',
    title: 'O Vento Cortante',
    heroClass: 'Duelista',
    rarity: 'Épico',
    element: 'Natureza',
    specialty: 'Combos Frequentes e Esquiva',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 810,
    baseAtk: 150,
    baseDef: 30,
    baseSpd: 1.9,
    baseCrit: 20,
    currentHp: 810,
    unlocked: false,
    shards: 0,
    color: '#10b981',
    accentColor: '#a7f3d0',
    avatarSprite: '🗡️',
    passive: {
      name: 'Mestre do Florete',
      description: 'Acelera o multiplicador de combo de cliques em 30%.',
      bonusType: 'speed',
      bonusValue: 20
    },
    skills: [
      {
        id: 'zephyr_s1',
        name: 'Estocada Quádrupla',
        description: '4 perfurações velozes causando 200% de dano total.',
        multiplier: 2.0,
        cooldown: 3.2,
        currentCooldown: 0,
        icon: '🗡️',
        type: 'damage'
      },
      {
        id: 'zephyr_s2',
        name: 'Riposte Preciso',
        description: 'Contra-ataca com 240% de dano e aumenta crítico em 25% por 6s.',
        multiplier: 2.4,
        cooldown: 9,
        currentCooldown: 0,
        icon: '⚡',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'Tufão de Mil Lâminas',
      description: 'Corta através do espaço em alta velocidade, atingindo o inimigo com 720% de dano tempestuoso.',
      multiplier: 7.2,
      chargeTime: 17,
      currentCharge: 0,
      icon: '🌀'
    }
  },

  // 18. Morrigan - Bruxa
  {
    id: 'hero_morrigan',
    name: 'Morrigan',
    title: 'A Rainha dos Corvos',
    heroClass: 'Bruxa',
    rarity: 'Épico',
    element: 'Natureza',
    specialty: 'Maldições e Veneno Acumulado',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 740,
    baseAtk: 140,
    baseDef: 27,
    baseSpd: 1.2,
    baseCrit: 16,
    currentHp: 740,
    unlocked: false,
    shards: 0,
    color: '#059669',
    accentColor: '#6ee7b7',
    avatarSprite: '🦅',
    passive: {
      name: 'Maldição Sombria',
      description: 'Inimigos perdem 20% de ataque e defesa continuamente.',
      bonusType: 'damage',
      bonusValue: 20
    },
    skills: [
      {
        id: 'morrigan_s1',
        name: 'Revoada de Corvos',
        description: 'Pássaros espectrais bicam o inimigo causando 180% de dano e cegueira.',
        multiplier: 1.8,
        cooldown: 3.8,
        currentCooldown: 0,
        icon: '🐦',
        type: 'damage'
      },
      {
        id: 'morrigan_s2',
        name: 'Poção Tóxica',
        description: 'Lança frasco alquímico causando 260% de dano tóxico ao longo de 6s.',
        multiplier: 2.6,
        cooldown: 9.5,
        currentCooldown: 0,
        icon: '🧪',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Praga do Corvo Negro',
      description: 'Maldiz a arena com névoa virulenta que causa 690% de dano e quebra escudos de resistência.',
      multiplier: 6.9,
      chargeTime: 18,
      currentCharge: 0,
      icon: '☠️'
    }
  },

  // 19. Orion - Caçador
  {
    id: 'hero_orion',
    name: 'Orion',
    title: 'O Olho do Trovão',
    heroClass: 'Caçador',
    rarity: 'Épico',
    element: 'Raio',
    specialty: 'Precisão Absoluta e Dano Elétrico',
    level: 1,
    stars: 2,
    awakening: 0,
    baseHp: 770,
    baseAtk: 160,
    baseDef: 28,
    baseSpd: 1.5,
    baseCrit: 22,
    currentHp: 770,
    unlocked: false,
    shards: 0,
    color: '#f59e0b',
    accentColor: '#fde68a',
    avatarSprite: '⚡',
    passive: {
      name: 'Mira Cirúrgica',
      description: 'Ataques de Orion nunca erram e possuem +15% de chance de crítico.',
      bonusType: 'crit',
      bonusValue: 15
    },
    skills: [
      {
        id: 'orion_s1',
        name: 'Tiro de Sniper',
        description: 'Disparo elétrico supercarregado que atinge o ponto fraco causando 230% de dano.',
        multiplier: 2.3,
        cooldown: 4,
        currentCooldown: 0,
        icon: '🎯',
        type: 'damage'
      },
      {
        id: 'orion_s2',
        name: 'Armadilha Estática',
        description: 'Eletrocuta o solo causando 210% de dano e reduzindo velocidade do chefe.',
        multiplier: 2.1,
        cooldown: 8.5,
        currentCooldown: 0,
        icon: '⚡',
        type: 'aoe'
      }
    ],
    ultimate: {
      name: 'Bombardeio Orbital Elétrico',
      description: 'Dispara um sinalizador que convoca múltiplos raios celestes causando 760% de dano explosivo!',
      multiplier: 7.6,
      chargeTime: 18,
      currentCharge: 0,
      icon: '💥'
    }
  },

  // 20. Azrael - Cavaleiro Abissal
  {
    id: 'hero_azrael',
    name: 'Azrael',
    title: 'O Arauto do Fim',
    heroClass: 'Cavaleiro Abissal',
    rarity: 'Divino',
    element: 'Trevas',
    specialty: 'Transformação Demoníaca e Poder Destrutivo',
    level: 1,
    stars: 4,
    awakening: 0,
    baseHp: 1150,
    baseAtk: 210,
    baseDef: 50,
    baseSpd: 1.35,
    baseCrit: 25,
    currentHp: 1150,
    unlocked: false,
    shards: 0,
    color: '#4c1d95',
    accentColor: '#ddd6fe',
    avatarSprite: '👑',
    passive: {
      name: 'Aura da Ruína',
      description: 'Aumenta todo o dano causado pela equipe em 30% contra chefões e guardiões.',
      bonusType: 'damage',
      bonusValue: 30
    },
    skills: [
      {
        id: 'azrael_s1',
        name: 'Corte do Abismo',
        description: 'Lâmina carregada com o poder dos 100 abismos, causando 260% de dano letal.',
        multiplier: 2.6,
        cooldown: 3.5,
        currentCooldown: 0,
        icon: '⚔️',
        type: 'damage'
      },
      {
        id: 'azrael_s2',
        name: 'Domínio das Trevas',
        description: 'Envolve a equipe com chamas negras aumentando ataque em 35% por 8s.',
        multiplier: 1.0,
        cooldown: 11,
        currentCooldown: 0,
        icon: '🔥',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'DESPERTAR DO ABISMO',
      description: 'Transforma-se no colosso sombrio supremo, desferindo um golpe que rasga a arena com 1.200% de dano destrutivo!',
      multiplier: 12.0,
      chargeTime: 24,
      currentCharge: 0,
      icon: '👑'
    }
  },

  // 21. Aurora - A Maga da Luz
  {
    id: 'hero_aurora',
    name: 'Aurora',
    title: 'A Maga da Luz Celeste',
    heroClass: 'Mago',
    rarity: 'Lendário',
    element: 'Luz',
    specialty: 'Dano Radiante e Iluminação',
    level: 1,
    stars: 3,
    awakening: 0,
    baseHp: 820,
    baseAtk: 180,
    baseDef: 34,
    baseSpd: 1.35,
    baseCrit: 20,
    currentHp: 820,
    unlocked: true,
    shards: 20,
    color: '#38bdf8',
    accentColor: '#fde047',
    avatarSprite: '🪄',
    passive: {
      name: 'Resplendor Celeste',
      description: 'Aumenta todo o dano sagrado e crítico da equipe em 25%.',
      bonusType: 'damage',
      bonusValue: 25
    },
    skills: [
      {
        id: 'aurora_s1',
        name: 'Feixe Prismático',
        description: 'Dispara um raio de pura luz celestial causando 220% de dano e quebrando defesa.',
        multiplier: 2.2,
        cooldown: 3.8,
        currentCooldown: 0,
        icon: '✨',
        type: 'damage'
      },
      {
        id: 'aurora_s2',
        name: 'Prisma Protetor',
        description: 'Envolve a equipe com um manto de fótons que reduz dano recebido em 25% por 6s.',
        multiplier: 1.0,
        cooldown: 10,
        currentCooldown: 0,
        icon: '🛡️',
        type: 'buff'
      }
    ],
    ultimate: {
      name: 'AURORA BOREAL DEVASTADORA',
      description: 'Rasga o céu da masmorra com cortinas estelares radiantes, causando 850% de dano em área e atordoando inimigos!',
      multiplier: 8.5,
      chargeTime: 18,
      currentCharge: 0,
      icon: '🌌'
    }
  }
];

export function calculateHeroStats(hero: Hero) {
  // Level scaling: 1 to 200
  const lvlMult = 1 + (hero.level - 1) * 0.12;
  // Star scaling: 1 to 6 (each star gives +20% stats)
  const starMult = 1 + (hero.stars - 1) * 0.25;
  // Awakening scaling: 0 to 5 (each gives +50% permanent stats)
  const awkMult = 1 + hero.awakening * 0.50;

  const totalMultiplier = lvlMult * starMult * awkMult;

  const maxHp = Math.floor(hero.baseHp * totalMultiplier);
  const atk = Math.floor(hero.baseAtk * totalMultiplier);
  const def = Math.floor(hero.baseDef * totalMultiplier);
  const spd = Number((hero.baseSpd * (1 + (hero.stars - 1) * 0.05)).toFixed(2));
  const crit = Math.min(80, Math.floor(hero.baseCrit + (hero.stars - 1) * 2 + hero.awakening * 3));

  return { maxHp, atk, def, spd, crit };
}

export function getHeroCostForLevelUp(currentLevel: number): { gold: number; expRequired: number } {
  const gold = Math.floor(50 * Math.pow(1.09, currentLevel - 1));
  const expRequired = Math.floor(80 * Math.pow(1.10, currentLevel - 1));
  return { gold, expRequired };
}
