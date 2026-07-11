// Rich metadata for Dota 2 heroes, items, positions, and game modes.

export interface Hero {
  id: number;
  name: string;
  displayName: string;
  attribute: 'str' | 'agi' | 'int' | 'uni';
  roles: string[];
}

export interface DotaItem {
  id: number;
  name: string;
  displayName: string;
  cost: number;
}

export interface Match {
  id: number;
  heroId: number;
  heroName: string;
  heroDisplayName: string;
  isVictory: boolean;
  gameMode: string;
  duration: string; // e.g. "38:45"
  kills: number;
  deaths: number;
  assists: number;
  gpm: number;
  xpm: number;
  lastHits: number;
  denies: number;
  heroDamage: number;
  towerDamage: number;
  heroHealing: number;
  position: 'Carry' | 'Mid' | 'Offlane' | 'Soft Support' | 'Hard Support';
  lane: 'Safe' | 'Mid' | 'Off' | 'Roaming' | 'Jungle';
  items: string[]; // item display names
  timestamp: string; // e.g., "2 hours ago" or "2026-07-09T18:30:00Z"
  goldGraph: number[]; // gold difference over time
}

// Map of popular Dota 2 heroes
export const HEROES: Record<number, Hero> = {
  1: { id: 1, name: 'antimage', displayName: 'Anti-Mage', attribute: 'agi', roles: ['Carry', 'Escape'] },
  2: { id: 2, name: 'axe', displayName: 'Axe', attribute: 'str', roles: ['Initiator', 'Durable', 'Disabler'] },
  4: { id: 4, name: 'bloodseeker', displayName: 'Bloodseeker', attribute: 'agi', roles: ['Carry', 'Nuker', 'Initiator'] },
  5: { id: 5, name: 'crystal_maiden', displayName: 'Crystal Maiden', attribute: 'int', roles: ['Support', 'Disabler', 'Nuker'] },
  6: { id: 6, name: 'drow_ranger', displayName: 'Drow Ranger', attribute: 'agi', roles: ['Carry', 'Ranged'] },
  8: { id: 8, name: 'juggernaut', displayName: 'Juggernaut', attribute: 'agi', roles: ['Carry', 'Pusher', 'Escape'] },
  11: { id: 11, name: 'nevermore', displayName: 'Shadow Fiend', attribute: 'agi', roles: ['Carry', 'Nuker'] },
  14: { id: 14, name: 'pudge', displayName: 'Pudge', attribute: 'str', roles: ['Disabler', 'Initiator', 'Durable'] },
  25: { id: 25, name: 'lina', displayName: 'Lina', attribute: 'int', roles: ['Nuker', 'Disabler'] },
  36: { id: 36, name: 'necrolyte', displayName: 'Necrophos', attribute: 'int', roles: ['Durable', 'Nuker'] },
  44: { id: 44, name: 'phantom_assassin', displayName: 'Phantom Assassin', attribute: 'agi', roles: ['Carry', 'Escape'] },
  53: { id: 53, name: 'furion', displayName: "Nature's Prophet", attribute: 'int', roles: ['Carry', 'Pusher'] },
  63: { id: 63, name: 'weaver', displayName: 'Weaver', attribute: 'agi', roles: ['Carry', 'Escape'] },
  70: { id: 70, name: 'ursa', displayName: 'Ursa', attribute: 'agi', roles: ['Carry', 'Durable'] },
  74: { id: 74, name: 'invoker', displayName: 'Invoker', attribute: 'int', roles: ['Carry', 'Nuker', 'Disabler', 'Escape'] },
  91: { id: 91, name: 'wisp', displayName: 'Io', attribute: 'uni', roles: ['Support'] },
  93: { id: 93, name: 'slark', displayName: 'Slark', attribute: 'agi', roles: ['Carry', 'Escape'] },
  97: { id: 97, name: 'magnus', displayName: 'Magnus', attribute: 'uni', roles: ['Initiator', 'Disabler'] },
  114: { id: 114, name: 'monkey_king', displayName: 'Monkey King', attribute: 'agi', roles: ['Carry', 'Initiator', 'Escape'] },
  126: { id: 126, name: 'void_spirit', displayName: 'Void Spirit', attribute: 'uni', roles: ['Carry', 'Escape', 'Nuker'] },
};

// Item list with simple display data
export const ITEMS: Record<string, DotaItem> = {
  'phase_boots': { id: 50, name: 'phase_boots', displayName: 'Phase Boots', cost: 1500 },
  'power_treads': { id: 63, name: 'power_treads', displayName: 'Power Treads', cost: 1400 },
  'black_king_bar': { id: 116, name: 'black_king_bar', displayName: 'Black King Bar', cost: 4050 },
  'manta_style': { id: 147, name: 'manta_style', displayName: 'Manta Style', cost: 4600 },
  'blink_dagger': { id: 1    , name: 'blink_dagger', displayName: 'Blink Dagger', cost: 2250 },
  'abyssal_blade': { id: 208, name: 'abyssal_blade', displayName: 'Abyssal Blade', cost: 6250 },
  'battle_fury': { id: 145, name: 'battle_fury', displayName: 'Battle Fury', cost: 4100 },
  'scythe_of_vyse': { id: 96, name: 'scythe_of_vyse', displayName: 'Scythe of Vyse', cost: 5550 },
  'aghanims_scepter': { id: 108, name: 'aghanims_scepter', displayName: "Aghanims Scepter", cost: 4200 },
  'force_staff': { id: 102, name: 'force_staff', displayName: 'Force Staff', cost: 2200 },
  'glimmer_cape': { id: 254, name: 'glimmer_cape', displayName: 'Glimmer Cape', cost: 1950 },
  'desolator': { id: 168, name: 'desolator', displayName: 'Desolator', cost: 3500 },
};

export const MOCK_MATCH_HISTORY: Match[] = [
  {
    id: 76541001,
    heroId: 8,
    heroName: 'juggernaut',
    heroDisplayName: 'Juggernaut',
    isVictory: true,
    gameMode: 'Ranked All Pick',
    duration: '38:15',
    kills: 12,
    deaths: 2,
    assists: 8,
    gpm: 710,
    xpm: 780,
    lastHits: 340,
    denies: 15,
    heroDamage: 34500,
    towerDamage: 8900,
    heroHealing: 1200,
    position: 'Carry',
    lane: 'Safe',
    items: ['Power Treads', 'Battle Fury', 'Manta Style', 'Black King Bar', 'Abyssal Blade', 'desolator'],
    timestamp: '3 hours ago',
    goldGraph: [0, 200, 500, 1200, 1800, 2500, 3100, 4200, 6000, 8500, 11000, 14000, 17500, 22000]
  },
  {
    id: 76541002,
    heroId: 74,
    heroName: 'invoker',
    heroDisplayName: 'Invoker',
    isVictory: false,
    gameMode: 'Ranked All Pick',
    duration: '45:20',
    kills: 8,
    deaths: 7,
    assists: 14,
    gpm: 540,
    xpm: 610,
    lastHits: 220,
    denies: 8,
    heroDamage: 42000,
    towerDamage: 1200,
    heroHealing: 0,
    position: 'Mid',
    lane: 'Mid',
    items: ['Phase Boots', 'Aghanims Scepter', 'Scythe of Vyse', 'Blink Dagger', 'Black King Bar'],
    timestamp: '1 day ago',
    goldGraph: [0, -100, 200, -300, -800, -500, -1200, -200, 500, -1000, -3000, -6000, -10000, -15000]
  },
  {
    id: 76541003,
    heroId: 5,
    heroName: 'crystal_maiden',
    heroDisplayName: 'Crystal Maiden',
    isVictory: true,
    gameMode: 'Normal All Pick',
    duration: '32:10',
    kills: 3,
    deaths: 4,
    assists: 22,
    gpm: 320,
    xpm: 450,
    lastHits: 45,
    denies: 4,
    heroDamage: 15400,
    towerDamage: 150,
    heroHealing: 800,
    position: 'Hard Support',
    lane: 'Safe',
    items: ['Tranquil Boots', 'Glimmer Cape', 'Force Staff', 'Blink Dagger'],
    timestamp: '2 days ago',
    goldGraph: [0, 300, 600, 1100, 1500, 2100, 3200, 4000, 5500, 7000, 8200, 9500, 12000]
  },
  {
    id: 76541004,
    heroId: 44,
    heroName: 'phantom_assassin',
    heroDisplayName: 'Phantom Assassin',
    isVictory: true,
    gameMode: 'Ranked All Pick',
    duration: '29:40',
    kills: 16,
    deaths: 1,
    assists: 4,
    gpm: 820,
    xpm: 890,
    lastHits: 295,
    denies: 12,
    heroDamage: 38200,
    towerDamage: 7200,
    heroHealing: 0,
    position: 'Carry',
    lane: 'Safe',
    items: ['Phase Boots', 'Battle Fury', 'Desolator', 'Black King Bar', 'Abyssal Blade'],
    timestamp: '3 days ago',
    goldGraph: [0, 500, 1200, 2400, 3800, 5200, 7100, 9500, 12800, 16000, 19500]
  },
  {
    id: 76541005,
    heroId: 14,
    heroName: 'pudge',
    heroDisplayName: 'Pudge',
    isVictory: false,
    gameMode: 'Ranked All Pick',
    duration: '41:05',
    kills: 5,
    deaths: 11,
    assists: 10,
    gpm: 380,
    xpm: 490,
    lastHits: 90,
    denies: 2,
    heroDamage: 21000,
    towerDamage: 0,
    heroHealing: 150,
    position: 'Soft Support',
    lane: 'Off',
    items: ['Phase Boots', 'Blink Dagger', 'Aghanims Scepter', 'Force Staff'],
    timestamp: '4 days ago',
    goldGraph: [0, -200, -500, 100, -400, -900, -1200, -2500, -4000, -5500, -8000, -11000, -14500]
  }
];

export function getHeroColors(attribute: string) {
  switch (attribute) {
    case 'str': return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    case 'agi': return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'int': return { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' };
    case 'uni': return { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' };
    default: return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
  }
}

export interface DetailedPlayer {
  name: string;
  heroId: number;
  heroName: string;
  heroDisplayName: string;
  attribute: string;
  kills: number;
  deaths: number;
  assists: number;
  gpm: number;
  xpm: number;
  isRadiant: boolean;
  skillBuild: string;
  skillsTimeline: string[];
  itemsTimeline: { name: string; displayName: string; time: string }[];
  observers: number;
  sentries: number;
  killMatrix: Record<number, number>; // target heroId -> kills
}

export interface LaneMatchup {
  laneName: string;
  resultText: string;
  winner: 'Radiant' | 'Dire' | 'Draw';
  radiantHeroes: number[];
  direHeroes: number[];
}

export interface DetailedMatchInfo {
  id: number;
  isVictory: boolean;
  duration: string;
  radiantKills: number;
  direKills: number;
  players: DetailedPlayer[];
  laneMatchups: LaneMatchup[];
  draft: {
    autoBans: number[];
    pickPhase1: { radiant: number[]; dire: number[] };
    pickPhase2: { radiant: number[]; dire: number[] };
    pickPhase3: { radiant: number[]; dire: number[] };
  };
  xpAdvantage: number[];
  goldAdvantage: number[];
}

export function generateDetailedMatch(match: Match): DetailedMatchInfo {
  // If the selected match has the Juggernaut id or any victory, let's create the high-fidelity match corresponding to the user screenshots!
  // We can seed the data so that it's extremely close to the screenshots.
  const isDemo = match.id === 76541001 || match.heroId === 8 || match.isVictory;

  const radiantPlayers: DetailedPlayer[] = [
    {
      name: 'XVII',
      heroId: 70,
      heroName: 'ursa',
      heroDisplayName: 'Ursa',
      attribute: 'agi',
      kills: 17,
      deaths: 2,
      assists: 8,
      gpm: 710,
      xpm: 785,
      isRadiant: true,
      skillBuild: '1-1-3-1 build',
      skillsTimeline: ['Q', 'W', 'E', 'E', 'E', 'R', 'E', 'Q', 'W', 'W', 'Talent', 'R'],
      itemsTimeline: [
        { name: 'phase_boots', displayName: 'Phase Boots', time: '06:16' },
        { name: 'blink_dagger', displayName: 'Blink Dagger', time: '14:16' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '18:46' },
        { name: 'abyssal_blade', displayName: 'Abyssal Blade', time: '28:46' },
        { name: 'daedalus', displayName: 'Daedalus', time: '34:52' }
      ],
      observers: 0,
      sentries: 0,
      killMatrix: { 6: 2, 97: 6, 25: 3, 63: 2, 93: 4 }
    },
    {
      name: 'cursedwm',
      heroId: 11,
      heroName: 'nevermore',
      heroDisplayName: 'Shadow Fiend',
      attribute: 'agi',
      kills: 13,
      deaths: 7,
      assists: 14,
      gpm: 640,
      xpm: 690,
      isRadiant: true,
      skillBuild: '3-0-2-1 build',
      skillsTimeline: ['Q', 'E', 'Q', 'E', 'Q', 'R', 'E', 'Q', 'W', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'power_treads', displayName: 'Power Treads', time: '05:10' },
        { name: 'manta_style', displayName: 'Manta Style', time: '15:20' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '22:15' },
        { name: 'blink_dagger', displayName: 'Blink Dagger', time: '18:30' },
        { name: 'daedalus', displayName: 'Daedalus', time: '32:40' }
      ],
      observers: 1,
      sentries: 2,
      killMatrix: { 6: 3, 97: 2, 25: 4, 63: 2, 93: 2 }
    },
    {
      name: '333белонежк...',
      heroId: 53,
      heroName: 'furion',
      heroDisplayName: "Nature's Prophet",
      attribute: 'int',
      kills: 8,
      deaths: 5,
      assists: 22,
      gpm: 510,
      xpm: 580,
      isRadiant: true,
      skillBuild: '1-1-3-1 build',
      skillsTimeline: ['E', 'W', 'E', 'Q', 'E', 'R', 'E', 'Q', 'W', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'force_staff', displayName: 'Force Staff', time: '11:45' },
        { name: 'glimmer_cape', displayName: 'Glimmer Cape', time: '18:20' },
        { name: 'scythe_of_vyse', displayName: 'Scythe of Vyse', time: '29:10' }
      ],
      observers: 4,
      sentries: 6,
      killMatrix: { 6: 1, 97: 3, 25: 1, 63: 2, 93: 1 }
    },
    {
      name: 'Tel-Aviv smirzz...',
      heroId: 36,
      heroName: 'necrolyte',
      heroDisplayName: 'Necrophos',
      attribute: 'int',
      kills: 7,
      deaths: 11,
      assists: 19,
      gpm: 460,
      xpm: 530,
      isRadiant: true,
      skillBuild: '2-0-3-1 build',
      skillsTimeline: ['E', 'Q', 'E', 'Q', 'E', 'R', 'E', 'Q', 'Q', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'phase_boots', displayName: 'Phase Boots', time: '08:12' },
        { name: 'aghanims_scepter', displayName: 'Aghanims Scepter', time: '19:50' },
        { name: 'shivas_guard', displayName: "Shiva's Guard", time: '30:15' }
      ],
      observers: 1,
      sentries: 3,
      killMatrix: { 6: 1, 97: 2, 25: 1, 63: 1, 93: 2 }
    },
    {
      name: 'анальный шарик',
      heroId: 91,
      heroName: 'wisp',
      heroDisplayName: 'Io',
      attribute: 'uni',
      kills: 5,
      deaths: 2,
      assists: 31,
      gpm: 340,
      xpm: 480,
      isRadiant: true,
      skillBuild: '1-3-1-1 build',
      skillsTimeline: ['Q', 'W', 'W', 'E', 'W', 'R', 'W', 'Q', 'E', 'E', 'Talent'],
      itemsTimeline: [
        { name: 'tranquil_boots', displayName: 'Tranquil Boots', time: '07:30' },
        { name: 'mekansm', displayName: 'Mekansm', time: '14:20' },
        { name: 'glimmer_cape', displayName: 'Glimmer Cape', time: '22:10' }
      ],
      observers: 8,
      sentries: 14,
      killMatrix: { 6: 1, 97: 1, 25: 1, 63: 0, 93: 2 }
    }
  ];

  const direPlayers: DetailedPlayer[] = [
    {
      name: 'TYLER DURDEN',
      heroId: 6,
      heroName: 'drow_ranger',
      heroDisplayName: 'Drow Ranger',
      attribute: 'agi',
      kills: 6,
      deaths: 8,
      assists: 10,
      gpm: 550,
      xpm: 600,
      isRadiant: false,
      skillBuild: '1-3-1-1 build',
      skillsTimeline: ['W', 'Q', 'W', 'E', 'W', 'R', 'W', 'Q', 'E', 'E', 'Talent'],
      itemsTimeline: [
        { name: 'power_treads', displayName: 'Power Treads', time: '06:30' },
        { name: 'hurricane_pike', displayName: 'Hurricane Pike', time: '17:40' },
        { name: 'manta_style', displayName: 'Manta Style', time: '24:15' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '31:20' }
      ],
      observers: 0,
      sentries: 0,
      killMatrix: { 70: 0, 11: 2, 53: 1, 36: 2, 91: 1 }
    },
    {
      name: 'Vlone',
      heroId: 97,
      heroName: 'magnus',
      heroDisplayName: 'Magnus',
      attribute: 'uni',
      kills: 3,
      deaths: 14,
      assists: 18,
      gpm: 420,
      xpm: 490,
      isRadiant: false,
      skillBuild: '1-1-3-1 build',
      skillsTimeline: ['E', 'Q', 'E', 'W', 'E', 'R', 'E', 'Q', 'W', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'phase_boots', displayName: 'Phase Boots', time: '07:50' },
        { name: 'blink_dagger', displayName: 'Blink Dagger', time: '15:10' },
        { name: 'force_staff', displayName: 'Force Staff', time: '22:40' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '31:10' }
      ],
      observers: 1,
      sentries: 1,
      killMatrix: { 70: 1, 11: 1, 53: 0, 36: 1, 91: 0 }
    },
    {
      name: 'R.M.B.',
      heroId: 25,
      heroName: 'lina',
      heroDisplayName: 'Lina',
      attribute: 'int',
      kills: 12,
      deaths: 10,
      assists: 9,
      gpm: 590,
      xpm: 630,
      isRadiant: false,
      skillBuild: '3-0-2-1 build',
      skillsTimeline: ['Q', 'E', 'Q', 'E', 'Q', 'R', 'E', 'Q', 'W', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'phase_boots', displayName: 'Phase Boots', time: '05:40' },
        { name: 'euls_scepter', displayName: "Eul's Scepter", time: '13:20' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '21:40' },
        { name: 'scythe_of_vyse', displayName: 'Scythe of Vyse', time: '33:10' }
      ],
      observers: 2,
      sentries: 3,
      killMatrix: { 70: 1, 11: 3, 53: 2, 36: 5, 91: 1 }
    },
    {
      name: 'parham.gh',
      heroId: 63,
      heroName: 'weaver',
      heroDisplayName: 'Weaver',
      attribute: 'agi',
      kills: 4,
      deaths: 7,
      assists: 15,
      gpm: 520,
      xpm: 590,
      isRadiant: false,
      skillBuild: '1-3-1-1 build',
      skillsTimeline: ['W', 'E', 'W', 'Q', 'W', 'R', 'W', 'E', 'E', 'E', 'Talent'],
      itemsTimeline: [
        { name: 'power_treads', displayName: 'Power Treads', time: '06:15' },
        { name: 'desolator', displayName: 'Desolator', time: '14:50' },
        { name: 'linkens_sphere', displayName: "Linken's Sphere", time: '23:40' },
        { name: 'daedalus', displayName: 'Daedalus', time: '35:10' }
      ],
      observers: 1,
      sentries: 1,
      killMatrix: { 70: 0, 11: 1, 53: 1, 36: 2, 91: 0 }
    },
    {
      name: 'A.M.B',
      heroId: 93,
      heroName: 'slark',
      heroDisplayName: 'Slark',
      attribute: 'agi',
      kills: 2,
      deaths: 11,
      assists: 11,
      gpm: 460,
      xpm: 520,
      isRadiant: false,
      skillBuild: '1-1-3-1 build',
      skillsTimeline: ['E', 'Q', 'E', 'Q', 'E', 'R', 'E', 'Q', 'W', 'W', 'Talent'],
      itemsTimeline: [
        { name: 'power_treads', displayName: 'Power Treads', time: '05:50' },
        { name: 'shadow_blade', displayName: 'Shadow Blade', time: '14:20' },
        { name: 'echo_sabre', displayName: 'Echo Sabre', time: '20:10' },
        { name: 'black_king_bar', displayName: 'Black King Bar', time: '29:40' }
      ],
      observers: 2,
      sentries: 4,
      killMatrix: { 70: 0, 11: 0, 53: 1, 36: 1, 91: 0 }
    }
  ];

  if (!isDemo) {
    // If it's a defeat/non-demo match, let's invert or swap roles/names slightly to represent a realistic other game!
    // But still maintain extremely beautiful cohesive data!
    radiantPlayers.forEach((p, idx) => {
      p.kills = Math.max(1, Math.round(p.kills * 0.5));
      p.deaths = Math.round(p.deaths * 2.5);
      p.assists = Math.max(2, Math.round(p.assists * 0.6));
      p.gpm = Math.round(p.gpm * 0.7);
      p.xpm = Math.round(p.xpm * 0.75);
      // random kill matrix
      Object.keys(p.killMatrix).forEach(k => {
        p.killMatrix[Number(k)] = Math.max(0, p.killMatrix[Number(k)] - 2);
      });
    });
    direPlayers.forEach((p, idx) => {
      p.kills = Math.round(p.kills * 2.2);
      p.deaths = Math.max(1, Math.round(p.deaths * 0.4));
      p.assists = Math.round(p.assists * 1.5);
      p.gpm = Math.round(p.gpm * 1.3);
      p.xpm = Math.round(p.xpm * 1.25);
      Object.keys(p.killMatrix).forEach(k => {
        p.killMatrix[Number(k)] = p.killMatrix[Number(k)] + 2;
      });
    });
  }

  // Calculate sum totals
  const radiantKills = radiantPlayers.reduce((sum, p) => sum + p.kills, 0);
  const direKills = direPlayers.reduce((sum, p) => sum + p.kills, 0);

  // Generate lane matchups
  const laneMatchups: LaneMatchup[] = [
    {
      laneName: 'Top Lane',
      resultText: isDemo ? 'Radiant Won Top Lane' : 'Dire Won Top Lane',
      winner: isDemo ? 'Radiant' : 'Dire',
      radiantHeroes: [53, 91], // Nature's Prophet, Io
      direHeroes: [93, 6] // Slark, Drow Ranger
    },
    {
      laneName: 'Middle Lane',
      resultText: isDemo ? 'Radiant Won Middle Lane' : 'Dire Won Middle Lane',
      winner: isDemo ? 'Radiant' : 'Dire',
      radiantHeroes: [11], // Shadow Fiend
      direHeroes: [97] // Magnus
    },
    {
      laneName: 'Bottom Lane',
      resultText: isDemo ? 'Radiant Won Bottom Lane' : 'Dire Won Bottom Lane',
      winner: isDemo ? 'Radiant' : 'Dire',
      radiantHeroes: [70, 91], // Ursa, Io
      direHeroes: [25, 63] // Lina, Weaver
    }
  ];

  // Pick / Ban stages
  const draft = {
    autoBans: [1, 2, 4, 5, 14, 44, 74, 114, 126], // Sven, Doom, Storm, Sven, etc.
    pickPhase1: {
      radiant: [91, 5], // Io, Crystal Maiden
      dire: [25, 63] // Lina, Weaver
    },
    pickPhase2: {
      radiant: [11, 53], // Shadow Fiend, Nature's Prophet
      dire: [93, 97] // Slark, Magnus
    },
    pickPhase3: {
      radiant: [70], // Ursa
      dire: [6] // Drow Ranger
    }
  };

  // Advantage timelines
  const ticksCount = 14;
  const goldAdvantage: number[] = [];
  const xpAdvantage: number[] = [];
  let currentGold = 0;
  let currentXp = 0;

  for (let i = 0; i < ticksCount; i++) {
    if (isDemo) {
      // Radiant pulls ahead in mid-late game
      const trendG = i < 4 ? -200 : i < 8 ? 800 : 2500;
      const trendX = i < 4 ? -100 : i < 8 ? 1000 : 3000;
      currentGold += trendG + (Math.sin(i) * 500);
      currentXp += trendX + (Math.cos(i) * 400);
    } else {
      // Dire pulls ahead
      const trendG = i < 4 ? 100 : i < 8 ? -900 : -3200;
      const trendX = i < 4 ? 50 : i < 8 ? -1100 : -3500;
      currentGold += trendG + (Math.sin(i) * 600);
      currentXp += trendX + (Math.cos(i) * 500);
    }
    goldAdvantage.push(Math.round(currentGold));
    xpAdvantage.push(Math.round(currentXp));
  }

  return {
    id: match.id,
    isVictory: match.isVictory,
    duration: match.duration,
    radiantKills,
    direKills,
    players: [...radiantPlayers, ...direPlayers],
    laneMatchups,
    draft,
    goldAdvantage,
    xpAdvantage
  };
}
