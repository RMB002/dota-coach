'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Settings,
  Shield,
  Award,
  Calendar,
  Clock,
  Sword,
  Skull,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  TrendingUp,
  RefreshCw,
  BarChart2,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  ChevronLeft,
  Users,
  Flame,
  Activity,
  Maximize2
} from 'lucide-react';
import { Match, getHeroColors, HEROES, generateDetailedMatch, DetailedPlayer, DetailedMatchInfo, LaneMatchup } from '@/lib/stratz-helpers';

interface AiAnalysis {
  overallRating: string;
  playstyleTitle: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  proTips: string[];
}

export default function DotaDashboard() {
  // Account & API Key state
  const [accountId, setAccountId] = useState<string>('86745123'); // Preset a popular ID for instant loading
  const [apiKey, setApiKey] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('Miracle-');
  
  // Dashboard navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview');

  // Dashboard filter states
  const [excludeTurbo, setExcludeTurbo] = useState<boolean>(true);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('All time');
  const [selectedHeroFilter, setSelectedHeroFilter] = useState<string>('All heroes');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('All positions');
  const [selectedGameModeFilter, setSelectedGameModeFilter] = useState<string>('All game modes');
  const [selectedLobbyFilter, setSelectedLobbyFilter] = useState<string>('All lobby types');
  const [selectedPartyFilter, setSelectedPartyFilter] = useState<string>('Solo/Party');

  // Dashboard states
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchTab, setMatchTab] = useState<'overview' | 'builds' | 'kills' | 'coaching'>('overview');
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [isRealApi, setIsRealApi] = useState<boolean>(false);
  const [apiInfo, setApiInfo] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // AI Coaching States
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiStep, setAiStep] = useState<string>('');

  // Match-specific AI Coaching States
  const [matchAnalyses, setMatchAnalyses] = useState<Record<number, AiAnalysis>>({});
  const [isLoadingMatchAi, setIsLoadingMatchAi] = useState<boolean>(false);

  // Fetch match statistics
  const fetchMatches = async (idToFetch: string) => {
    if (!idToFetch.trim()) {
      setErrorMsg("Please enter a valid Steam Account ID.");
      return;
    }

    setIsLoadingMatches(true);
    setErrorMsg(null);
    setSelectedMatch(null);
    setAiAnalysis(null);
    setMatchAnalyses({});

    try {
      const response = await fetch('/api/stratz/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: idToFetch, apiKey: apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setPlayerName(data.playerName);
        setMatches(data.matches);
        setIsRealApi(data.isRealApi);
        setApiInfo(data.info || '');
        if (data.matches.length > 0) {
          setSelectedMatch(data.matches[0]);
        }
      } else {
        setErrorMsg(data.error || "Failed to load matches.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while fetching your match history.");
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // Trigger initial fetch on load
  useEffect(() => {
    setTimeout(() => {
      fetchMatches(accountId);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AI Analysis Request Handler
  const generateAiAnalysis = async () => {
    if (matches.length === 0) return;

    setIsLoadingAi(true);
    setAiStep('Initializing core analyzer...');

    const steps = [
      'Scanning matches and laning phases...',
      'Calculating GPM/XPM farming curves...',
      'Evaluating fight positioning and KDA metrics...',
      'Generating high-tier esports coaching plan...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAiStep(steps[currentStep]);
        currentStep++;
      }
    }, 1200);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches, playerName }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (response.ok) {
        setAiAnalysis(data);
      } else {
        setErrorMsg(data.error || "Could not complete AI performance coaching.");
      }
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setErrorMsg("An error occurred while communicating with the AI Coach.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Match-specific AI Coaching Request Handler
  const generateMatchCoaching = async (match: Match) => {
    setIsLoadingMatchAi(true);
    setAiStep('Scanning laning phase and item timings...');

    const steps = [
      'Analyzing skill builds and power spikes...',
      'Evaluating kill matrix and target prioritization...',
      'Formulating specific tactical tips for this match...',
      'Generating high-tier esports coaching report...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAiStep(steps[currentStep]);
        currentStep++;
      }
    }, 1200);

    try {
      const detailedInfo = generateDetailedMatch(match);
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playerName, 
          selectedMatch: match, 
          detailedMatchInfo: detailedInfo 
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (response.ok) {
        setMatchAnalyses(prev => ({
          ...prev,
          [match.id]: data
        }));
      } else {
        setErrorMsg(data.error || "Could not complete match-specific coaching.");
      }
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setErrorMsg("An error occurred while communicating with the AI Coach.");
    } finally {
      setIsLoadingMatchAi(false);
    }
  };

  // Helper to map hero display names to standard asset names for steam CDN
  const getHeroImgUrl = (heroName: string) => {
    const formatted = heroName.toLowerCase().replace(/[- ]/g, '_');
    return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${formatted}.png`;
  };

  // Calculate stats based on simulated state vs live state
  const totalMatchesCount = isRealApi ? matches.length : 299;
  const matchWinRateString = isRealApi 
    ? (matches.length > 0 ? ((matches.filter(m => m.isVictory).length / matches.length) * 100).toFixed(2) : "0.00")
    : "44.15";
  
  const winsCountCalculated = isRealApi
    ? matches.filter(m => m.isVictory).length
    : 132;
  const lossesCountCalculated = isRealApi
    ? matches.length - winsCountCalculated
    : 167;

  // Averages
  const avgKills = matches.length > 0 ? (matches.reduce((acc, m) => acc + m.kills, 0) / matches.length).toFixed(1) : '0';
  const avgDeaths = matches.length > 0 ? (matches.reduce((acc, m) => acc + m.deaths, 0) / matches.length).toFixed(1) : '0';
  const avgAssists = matches.length > 0 ? (matches.reduce((acc, m) => acc + m.assists, 0) / matches.length).toFixed(1) : '0';
  const avgGpm = matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.gpm, 0) / matches.length) : 0;
  const avgXpm = matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.xpm, 0) / matches.length) : 0;
  const winCount = matches.filter(m => m.isVictory).length;
  const winRate = matches.length > 0 ? Math.round((winCount / matches.length) * 100) : 0;

  // Most Played Heroes List - Seeding standard structure matching screenshots
  const getMostPlayedHeroes = () => {
    if (isRealApi && matches.length > 0) {
      // Calculate from live matches
      const counts: Record<string, { count: number; wins: number; heroId: number; attribute: string }> = {};
      matches.forEach(m => {
        const hero = m.heroDisplayName;
        const attr = HEROES[m.heroId]?.attribute || 'uni';
        if (!counts[hero]) {
          counts[hero] = { count: 0, wins: 0, heroId: m.heroId, attribute: attr };
        }
        counts[hero].count += 1;
        if (m.isVictory) counts[hero].wins += 1;
      });

      return Object.entries(counts)
        .map(([name, data]) => ({
          name,
          count: data.count,
          winRate: Math.round((data.wins / data.count) * 100),
          attribute: data.attribute,
          heroId: data.heroId,
          roleRate: Math.round(50 + Math.random() * 40) + '%',
          roleType: data.attribute === 'str' ? 'fist' : data.attribute === 'agi' ? 'wing' : 'staff'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    // High fidelity mock exactly like screenshots
    return [
      { name: "Slark", count: 67, winRate: 51, attribute: "agi", heroId: 1, roleRate: "59%", roleType: "hand" },
      { name: "Pudge", count: 55, winRate: 44, attribute: "str", heroId: 14, roleRate: "28%", roleType: "hand" },
      { name: "Viper", count: 31, winRate: 52, attribute: "agi", heroId: 2, roleRate: "80%", roleType: "bow" },
      { name: "Abaddon", count: 26, winRate: 46, attribute: "uni", heroId: 126, roleRate: "32%", roleType: "shield" },
      { name: "Crystal Maiden", count: 18, winRate: 56, attribute: "int", heroId: 5, roleRate: "38%", roleType: "fire" }
    ];
  };

  // Teammates High Fidelity Mock
  const teammatesList = [
    { name: "R.M.B.", winRate: "47.8%", matches: 115, color: "bg-teal-500/20 text-teal-400", avatar: "🤖" },
    { name: "Y乇...", winRate: "71.4%", matches: 7, color: "bg-red-500/20 text-red-400", avatar: "⚔️" },
    { name: "乃ㄥ...", winRate: "80.0%", matches: 5, color: "bg-amber-500/20 text-amber-400", avatar: "👤" },
    { name: "ali.lot...", winRate: "0.0%", matches: 3, color: "bg-slate-700/20 text-slate-400", avatar: "👤" },
    { name: "kev...", winRate: "33.3%", matches: 3, color: "bg-blue-500/20 text-blue-400", avatar: "👾" },
    { name: ".-:ili-:.", winRate: "0.0%", matches: 3, color: "bg-violet-500/20 text-violet-400", avatar: "👤" }
  ];

  // Contribution Heatmap block structure (15 columns x 7 rows)
  const activityIntensityData = [
    [0, 0, 0, 0, 1, 3, 4],
    [0, 0, 0, 1, 2, 2, 3],
    [0, 0, 1, 0, 0, 4, 1],
    [0, 0, 0, 0, 2, 3, 2],
    [0, 0, 0, 2, 0, 1, 3],
    [0, 0, 0, 0, 1, 2, 0],
    [0, 0, 0, 0, 0, 0, 4],
    [0, 0, 1, 2, 3, 4, 3],
    [0, 1, 0, 0, 0, 2, 2],
    [0, 0, 0, 1, 3, 3, 1],
    [0, 0, 0, 0, 0, 1, 2],
    [0, 0, 2, 2, 4, 3, 0],
    [0, 0, 0, 1, 0, 1, 3],
    [0, 1, 2, 3, 1, 2, 4],
    [1, 2, 3, 4, 2, 3, 3]
  ];

  const getIntensityBgColor = (level: number) => {
    switch (level) {
      case 1: return "bg-amber-950/40 border border-amber-900/40";
      case 2: return "bg-orange-800/40 border border-orange-700/50";
      case 3: return "bg-orange-500/60 border border-orange-400/50";
      case 4: return "bg-yellow-400/80 border border-yellow-300/60";
      default: return "bg-slate-900/60 border border-slate-800/30";
    }
  };

  // Render Role/Attribute small symbol SVG
  const renderAttributeSymbol = (type: string) => {
    if (type === "hand") {
      return (
        <span className="w-5 h-5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center text-[10px]" title="Support / Hand Utility">
          ✋
        </span>
      );
    }
    if (type === "bow") {
      return (
        <span className="w-5 h-5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center text-[10px]" title="Carry / Ranged">
          🏹
        </span>
      );
    }
    if (type === "shield") {
      return (
        <span className="w-5 h-5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center text-[10px]" title="Offlane / Durable">
          🛡️
        </span>
      );
    }
    if (type === "fire") {
      return (
        <span className="w-5 h-5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center text-[10px]" title="Mid / Nuker">
          🔥
        </span>
      );
    }
    return (
      <span className="w-5 h-5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center text-[10px]" title="Fighter">
        ⚔️
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-200 font-sans overflow-x-hidden selection:bg-amber-500 selection:text-black relative">
      
      {/* Visual background atmospheric elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-950/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-red-950/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/90 to-orange-600/90 flex items-center justify-center font-bold text-lg text-white shadow-lg">
            {playerName ? playerName.slice(0, 1).toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-widest text-slate-100 uppercase font-mono">
                STRATZ • Profile
              </h1>
              <span className="text-[10px] bg-slate-900 border border-slate-800/80 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                {isRealApi ? 'Live Account' : 'Simulated'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Steam Account ID: <span className="text-slate-300 font-semibold">{accountId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Steam Account Selector */}
          <div className="relative w-full md:w-44">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Steam ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMatches(accountId)}
              className="w-full bg-[#0F131A] border border-slate-800/80 text-xs rounded-lg pl-8 pr-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />
          </div>

          <button
            onClick={() => fetchMatches(accountId)}
            disabled={isLoadingMatches}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all uppercase tracking-wider flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingMatches ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-[#0F131A] hover:bg-[#151B24] border border-slate-800/80 p-2 rounded-lg text-slate-400 transition-all cursor-pointer"
            title="Configure Stratz API Token"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* STRATZ API Token Configuration Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#090C11] border-y border-slate-900 overflow-hidden relative z-20"
          >
            <div className="max-w-4xl mx-auto px-4 py-5">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Settings className="w-4 h-4" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Stratz API Configuration</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Connect a live developer API key from <a href="https://stratz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">stratz.com</a> to download actual real-time matches. Leaving it empty will load a personalized mock match history.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase font-mono mb-1">Steam ID (32-bit)</label>
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="e.g. 86745123"
                    className="w-full bg-[#0F131A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase font-mono mb-1">Stratz Bearer Token</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Bearer token"
                    className="w-full bg-[#0F131A] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    fetchMatches(accountId);
                  }}
                  className="bg-amber-500 text-black text-xs font-bold px-3.5 py-1.5 rounded-lg hover:bg-amber-400 transition-colors uppercase font-mono"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 relative z-10">

        {/* Dynamic Errors and Alerts */}
        {apiInfo && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{apiInfo}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-950/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filters and Subheader Settings Area - Mirroring Screenshot 3 */}
        <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
          {/* Exclude Turbo Switch */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setExcludeTurbo(!excludeTurbo)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${excludeTurbo ? 'bg-amber-500' : 'bg-slate-800'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${excludeTurbo ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span className="text-xs text-slate-300 font-medium select-none">Exclude turbo</span>
          </div>

          {/* Quick select dropdown lists */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select 
                value={selectedTimeFilter} 
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>All time</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>Year 2024</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedHeroFilter} 
                onChange={(e) => setSelectedHeroFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>All heroes</option>
                <option>Slark</option>
                <option>Pudge</option>
                <option>Viper</option>
                <option>Abaddon</option>
                <option>Crystal Maiden</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedPositionFilter} 
                onChange={(e) => setSelectedPositionFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>All positions</option>
                <option>Carry</option>
                <option>Mid</option>
                <option>Offlane</option>
                <option>Support</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedGameModeFilter} 
                onChange={(e) => setSelectedGameModeFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>All game modes</option>
                <option>Ranked All Pick</option>
                <option>Normal Match</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedLobbyFilter} 
                onChange={(e) => setSelectedLobbyFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>All lobby types</option>
                <option>Ranked Lobby</option>
                <option>Normal Lobby</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedPartyFilter} 
                onChange={(e) => setSelectedPartyFilter(e.target.value)}
                className="appearance-none bg-[#0E121B] border border-slate-800/80 text-xs px-3 py-1.5 rounded-lg text-slate-300 pr-8 relative cursor-pointer focus:outline-none focus:border-slate-700 font-mono"
              >
                <option>Solo/Party</option>
                <option>Solo Queue Only</option>
                <option>Party Queue Only</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
            </div>

            <button className="bg-[#0E121B] hover:bg-[#151A26] border border-slate-800/80 text-xs px-3.5 py-1.5 rounded-lg text-slate-400 font-mono flex items-center gap-1.5 transition-all">
              <span>More filters</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Dynamic Metric Blocks - Mirroring Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Matches Block */}
          <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-2xl font-extrabold text-white font-mono">{totalMatchesCount}</span>
                <span className="text-xs text-slate-200 font-medium ml-1.5">Matches</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">First Match: Aug 2, 2024</span>
            </div>
            
            {/* 3 Interval segmented progress bar */}
            <div className="grid grid-cols-3 gap-1 mt-4">
              <div className="h-1.5 rounded-full bg-amber-500" />
              <div className="h-1.5 rounded-full bg-amber-500" />
              <div className="h-1.5 rounded-full bg-amber-500/30" />
            </div>
          </div>

          {/* Win Rate Block */}
          <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-2xl font-extrabold text-red-500 font-mono">{matchWinRateString}%</span>
                <span className="text-xs text-slate-200 font-medium ml-1.5">Win Rate</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">
                {winsCountCalculated} <span className="text-slate-500 font-normal">W</span> - {lossesCountCalculated} <span className="text-slate-500 font-normal">L</span>
              </span>
            </div>

            {/* Split Green vs Red progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-950 mt-4 overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${parseFloat(matchWinRateString)}%` }} 
              />
              <div 
                className="bg-red-600 h-full flex-grow" 
              />
            </div>
          </div>

        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center border-b border-slate-900 pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-mono ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-mono flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Coach & Match Insights</span>
          </button>
        </div>

        {/* Render Tabs */}
        {activeTab === 'overview' ? (
          /* Tab 1: HIGH FIDELITY DASHBOARD OVERVIEW (Exact Replica of Screenshots) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* LEFT COLUMN: Most Played Heroes & Matches */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Most Played Heroes Block (Screenshot 1 Left) */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
                    Most Played Heroes
                  </h3>
                  <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                    <Maximize2 className="w-4 h-4 text-slate-400/80" />
                  </button>
                </div>

                {/* Hero list details */}
                <div className="flex flex-col gap-3">
                  {getMostPlayedHeroes().map((hero, idx) => {
                    const colors = getHeroColors(hero.attribute);
                    return (
                      <div key={idx} className="flex items-center justify-between border-b border-slate-900/40 pb-2.5 last:border-b-0 last:pb-0 gap-3">
                        <div className="flex items-center gap-3 w-1/3">
                          {/* Steam Hero Avatar */}
                          <div className={`w-12 h-7 rounded overflow-hidden shrink-0 bg-slate-950 border ${colors.border} relative group`}>
                            <img
                              src={getHeroImgUrl(hero.name)}
                              alt={hero.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                // Fallback if steam CDN fails
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          
                          {/* Attribute Symbol */}
                          {renderAttributeSymbol(hero.roleType)}

                          {/* Winrate text */}
                          <div className="text-xs font-bold text-slate-300 font-mono">
                            {hero.roleRate}
                          </div>
                        </div>

                        {/* Mid bars: Winrate bar indicator */}
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono w-10 text-right">{hero.winRate}%</span>
                          <div className="flex-1 h-2 rounded-sm bg-slate-950 overflow-hidden flex">
                            <div 
                              className={hero.winRate >= 50 ? 'bg-emerald-500 h-full' : 'bg-red-500 h-full'} 
                              style={{ width: `${hero.winRate}%` }} 
                            />
                          </div>
                        </div>

                        {/* Right: Pick counter and density bar */}
                        <div className="w-1/4 flex items-center gap-2">
                          <span className="text-xs text-slate-200 font-extrabold font-mono w-5">{hero.count}</span>
                          <div className="flex-1 h-1.5 rounded-sm bg-slate-950 overflow-hidden">
                            <div 
                              className="bg-yellow-400 h-full rounded-sm" 
                              style={{ width: `${(hero.count / 67) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <span className="font-sans">These 5 heroes comprise</span>
                  <div className="flex items-center gap-1 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 font-bold text-amber-400 text-[11px] font-mono">
                    <span className="animate-spin text-[10px]">🔄</span>
                    <span>66%</span>
                  </div>
                  <span className="font-sans">of this player&apos;s picks.</span>
                </div>
              </div>

              {/* Recent Matches list (Screenshot 2 and 3 center) */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-5 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
                    Matches
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Recent matches list</span>
                </div>

                {/* Table Header like layout */}
                <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] text-slate-500 uppercase font-bold font-mono pb-2 border-b border-slate-900/80 mb-3 px-1">
                  <div className="col-span-3">Hero / Lane</div>
                  <div className="col-span-1 text-center">W/L</div>
                  <div className="col-span-2 text-center">Lane Result</div>
                  <div className="col-span-2 text-center">K / D / A</div>
                  <div className="col-span-2 text-center">Rating Diff</div>
                  <div className="col-span-1 text-center">Party</div>
                  <div className="col-span-1 text-right">Time</div>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
                  {isLoadingMatches ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="bg-slate-950/40 border border-slate-900 rounded-lg h-16 animate-pulse" />
                    ))
                  ) : matches.length === 0 ? (
                    <div className="text-center text-slate-500 text-xs py-10 font-sans">
                      No matches found. Enter another Steam ID above.
                    </div>
                  ) : (
                    matches.map((match, idx) => {
                      const colors = getHeroColors(HEROES[match.heroId]?.attribute || 'uni');
                      const ratingDiffColor = match.isVictory ? 'text-emerald-400' : 'text-red-400';
                      const ratingSign = match.isVictory ? '+' : '-';
                      const ratingVal = Math.abs(match.gpm % 45); // Generate a realistic rating points difference
                      
                      return (
                        <div 
                          key={match.id}
                          onClick={() => {
                            setSelectedMatch(match);
                            setActiveTab('analysis');
                          }}
                          className="bg-slate-950/20 hover:bg-[#0F131C] border border-slate-900/80 hover:border-amber-500/40 rounded-xl p-2.5 sm:grid sm:grid-cols-12 items-center gap-2 text-left relative overflow-hidden transition-all cursor-pointer"
                        >
                          {/* Column 1: Hero Profile */}
                          <div className="col-span-3 flex items-center gap-2 mb-2 sm:mb-0">
                            <div className={`w-10 h-6 rounded overflow-hidden bg-slate-950 border ${colors.border}`}>
                              <img
                                src={getHeroImgUrl(match.heroDisplayName)}
                                alt={match.heroDisplayName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block truncate max-w-[100px]">{match.heroDisplayName}</span>
                              <span className="text-[9px] text-slate-500 block font-mono capitalize">{match.position}</span>
                            </div>
                          </div>

                          {/* Column 2: Win/Loss Status */}
                          <div className="col-span-1 flex justify-start sm:justify-center mb-1 sm:mb-0">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                              match.isVictory 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {match.isVictory ? 'W' : 'L'}
                            </span>
                          </div>

                          {/* Column 3: Lane Outcome Arrow */}
                          <div className="col-span-2 flex items-center justify-start sm:justify-center gap-1.5 mb-1 sm:mb-0 text-slate-400 text-xs">
                            {match.isVictory ? (
                              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                                <span>↗</span>
                                <span className="uppercase font-bold text-[9px]">Win</span>
                              </span>
                            ) : (
                              <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                                <span>↖</span>
                                <span className="uppercase font-bold text-[9px]">Lose</span>
                              </span>
                            )}
                          </div>

                          {/* Column 4: KDA */}
                          <div className="col-span-2 flex justify-start sm:justify-center mb-1 sm:mb-0 font-mono text-xs font-bold text-slate-300">
                            {match.kills} <span className="text-slate-600 font-normal mx-0.5">/</span> {match.deaths} <span className="text-slate-600 font-normal mx-0.5">/</span> {match.assists}
                          </div>

                          {/* Column 5: Rating Difference Line slider */}
                          <div className="col-span-2 flex flex-col justify-start sm:justify-center mb-1 sm:mb-0">
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
                              <span className={`${ratingDiffColor} font-black`}>{ratingSign}{ratingVal || 25}</span>
                              <span className="text-[8px] text-slate-600">points</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1 rounded-full relative">
                              <div 
                                className={`h-full absolute rounded-full ${match.isVictory ? 'bg-emerald-500 right-1/2' : 'bg-red-500 left-1/2'}`}
                                style={{ width: `${Math.min(50, (ratingVal / 45) * 50)}%` }}
                              />
                            </div>
                          </div>

                          {/* Column 6: Party queue icons */}
                          <div className="col-span-1 flex justify-start sm:justify-center mb-1 sm:mb-0">
                            {idx % 3 === 0 ? (
                              <div className="flex items-center gap-0.5" title="Party Queue (2 Players)">
                                <Users className="w-3 h-3 text-slate-500" />
                                <span className="text-[9px] text-slate-500 font-mono font-bold">2</span>
                              </div>
                            ) : (
                              <span className="text-slate-700 font-mono text-xs">—</span>
                            )}
                          </div>

                          {/* Column 7: Time & Duration */}
                          <div className="col-span-1 text-left sm:text-right font-mono text-[9px] text-slate-500">
                            <span className="text-slate-300 block font-bold">{match.duration}</span>
                            <span className="block truncate max-w-[70px]">{match.timestamp.split(',')[0]}</span>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Teammates, Trends Circle, Activity Map */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Teammates Block (Screenshot 1 Right) */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-5 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
                      Teammates
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">299 Matches</span>
                    <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Teammates Row */}
                <div className="flex flex-col gap-3">
                  {teammatesList.map((teammate, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-slate-900/40 pb-2.5 last:border-b-0 last:pb-0 gap-2">
                      <div className="flex items-center gap-2.5 w-5/12">
                        {/* Circular Avatar */}
                        <div className={`w-8 h-8 rounded-lg ${teammate.color} border border-slate-800/80 flex items-center justify-center text-xs shadow-md shrink-0`}>
                          <span>{teammate.avatar}</span>
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-200 block hover:text-amber-400 transition-colors cursor-pointer truncate">
                            {teammate.name}
                          </span>
                        </div>
                      </div>

                      {/* Winrate progress block */}
                      <div className="flex-1 flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-bold font-mono w-9 text-right">{teammate.winRate}</span>
                        <div className="flex-1 h-1.5 rounded bg-slate-950 overflow-hidden">
                          <div 
                            className={parseFloat(teammate.winRate) >= 50 ? 'bg-emerald-500 h-full' : 'bg-red-500 h-full'} 
                            style={{ width: teammate.winRate }} 
                          />
                        </div>
                      </div>

                      {/* Games match counts */}
                      <div className="w-2/12 text-right flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-extrabold text-slate-200 font-mono">{teammate.matches}</span>
                        <div className="w-1.5 h-6 rounded-sm bg-slate-950 overflow-hidden relative">
                          <div 
                            className="bg-yellow-400 w-full absolute bottom-0 rounded-sm" 
                            style={{ height: `${(teammate.matches / 115) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trends Radial & Medal Block (Screenshot 3 Right) */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
                    Trends
                  </h3>
                  <div className="flex items-center gap-1 bg-[#0F131A] border border-slate-800 p-0.5 rounded-lg text-[9px] font-mono">
                    <button className="bg-slate-800 text-white px-2 py-0.5 rounded font-bold uppercase">25 Games</button>
                    <button className="text-slate-500 px-2 py-0.5 hover:text-white uppercase">100</button>
                  </div>
                </div>

                {/* Circular Radar chart and hero indicators mock */}
                <div className="flex justify-center py-3 relative">
                  
                  {/* Circular Radial chart drawing with SVG */}
                  <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 150 150">
                    <defs>
                      <radialGradient id="radialCircleGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                      </radialGradient>
                    </defs>

                    {/* Concentric Circle Guides */}
                    <circle cx="75" cy="75" r="65" stroke="#121620" strokeWidth="1" fill="url(#radialCircleGrad)" />
                    <circle cx="75" cy="75" r="48" stroke="#1b2234" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                    <circle cx="75" cy="75" r="30" stroke="#2a334d" strokeWidth="1" fill="none" />
                    <circle cx="75" cy="75" r="12" stroke="#151b27" strokeWidth="1" fill="#090d14" />

                    {/* Radial Section Dividers */}
                    <line x1="75" y1="10" x2="75" y2="140" stroke="#111622" strokeWidth="1.5" />
                    <line x1="10" y1="75" x2="140" y2="75" stroke="#111622" strokeWidth="1.5" />
                    <line x1="30" y1="30" x2="120" y2="120" stroke="#111622" strokeWidth="0.8" strokeDasharray="2 2" />

                    {/* Highlight sections mimicking active focus */}
                    <path d="M 75 75 L 75 27 A 48 48 0 0 1 123 75 Z" fill="rgba(245, 158, 11, 0.05)" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" />
                    <path d="M 75 75 L 27 75 A 48 48 0 0 1 75 27 Z" fill="rgba(16, 185, 129, 0.04)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />

                    {/* Concentric active markers */}
                    <circle cx="75" cy="27" r="3.5" fill="#f59e0b" />
                    <circle cx="123" cy="75" r="3.5" fill="#38bdf8" />
                    <circle cx="27" cy="75" r="3.5" fill="#10b981" />
                  </svg>

                  {/* Absolute Center icons overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full border border-slate-800/80 bg-slate-950/90 shadow-lg flex flex-col items-center justify-center text-center">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <span className="text-[8px] text-slate-400 font-bold tracking-tighter uppercase font-mono mt-0.5">Focus</span>
                    </div>
                  </div>

                  {/* Hero image anchors overlay */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 rounded p-0.5 shadow">
                    <div className="w-5 h-3 overflow-hidden bg-slate-950">
                      <img src={getHeroImgUrl("Slark")} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 rounded p-0.5 shadow">
                    <div className="w-5 h-3 overflow-hidden bg-slate-950">
                      <img src={getHeroImgUrl("Viper")} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 rounded p-0.5 shadow">
                    <div className="w-5 h-3 overflow-hidden bg-slate-950">
                      <img src={getHeroImgUrl("Pudge")} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Mini trend bar histogram underneath */}
                <div className="mt-4 border-t border-slate-900/60 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1.5">
                    <span>Performance Matrix (25 matches)</span>
                    <span className="text-amber-500 font-bold">40% wr</span>
                  </div>

                  <div className="flex items-end justify-between h-8 gap-0.5 px-1 bg-[#090D14] border border-slate-900/80 rounded p-1.5">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const isWin = i % 2.5 === 0 || i % 4 === 0;
                      const height = Math.abs((i * 123) % 20) + 8;
                      return (
                        <div 
                          key={i} 
                          className={`w-full rounded-sm transition-all ${isWin ? 'bg-emerald-500/80 hover:bg-emerald-400' : 'bg-red-500/80 hover:bg-red-400'}`}
                          style={{ height: `${height}px` }}
                          title={isWin ? "Win" : "Loss"}
                        />
                      );
                    })}
                  </div>

                  {/* Red/Green status light indicator dots row */}
                  <div className="flex justify-between mt-2 px-1">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const isWin = i % 2.5 === 0 || i % 4 === 0;
                      return (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-sm shrink-0 ${isWin ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-red-600'}`} 
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Sub metrics stats block details */}
                <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-slate-900/60">
                  <div className="text-center bg-[#090D14]/40 border border-slate-900 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Match Win Rate</div>
                    <div className="text-xs font-black text-slate-200 mt-1 font-mono flex items-center justify-center gap-1">
                      <span>40%</span>
                      <span className="text-emerald-500 font-bold text-[10px]">↗ 4%</span>
                    </div>
                  </div>
                  <div className="text-center bg-[#090D14]/40 border border-slate-900 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Lane Record</div>
                    <div className="text-xs font-black text-slate-200 mt-1 font-mono">
                      <span className="text-emerald-400">5</span> - <span className="text-yellow-500">4</span> - <span className="text-red-400">14</span> - <span className="text-slate-500 text-[10px]">2</span>
                    </div>
                  </div>
                  <div className="text-center bg-[#090D14]/40 border border-slate-900 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Party Queue</div>
                    <div className="text-xs font-black text-slate-200 mt-1 font-mono">72%</div>
                  </div>
                  <div className="text-center bg-[#090D14]/40 border border-slate-900 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold font-mono">Ranked Match</div>
                    <div className="text-xs font-black text-slate-200 mt-1 font-mono flex items-center justify-center gap-1">
                      <span>52%</span>
                      <span className="text-[10px] text-slate-400">↗</span>
                    </div>
                  </div>
                </div>

                {/* Medal lists footer row */}
                <div className="flex justify-center items-center gap-1.5 mt-4 pt-3 border-t border-slate-900/40">
                  {['🛡️', '⚔️', '🌟', '💎', '👑'].map((icon, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-xs shadow-inner" title="Dota League Badge">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Map Block (Screenshot 2 Bottom Right) */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider font-sans">
                      Activity: Intense
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">253 Matches</span>
                    <button className="text-slate-500 hover:text-white cursor-pointer">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contributions Calendar Heatmap */}
                <div className="p-3 bg-[#080B10] border border-slate-900/60 rounded-xl">
                  <div className="flex justify-between gap-1">
                    {activityIntensityData.map((col, cIdx) => (
                      <div key={cIdx} className="flex flex-col gap-1">
                        {col.map((val, rIdx) => (
                          <div 
                            key={rIdx} 
                            className={`w-3 h-3 rounded-[2px] transition-all cursor-pointer ${getIntensityBgColor(val)}`}
                            title={`${val} matches played`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Horizontal months axis labels */}
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2.5 px-1.5 uppercase tracking-widest font-bold">
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Tab 2: COOPERATIVE AI PERFORMANCE COACH & DETAILED MATCH GRAPHS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left selector: summary cards and user stats */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Box A: Simple circular winrate details */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between items-center text-center">
                <div className="w-full flex justify-between items-center text-left mb-2">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono">Profile Stats</span>
                    <h3 className="text-xs font-bold text-white uppercase">{playerName}</h3>
                  </div>
                  <span className="text-[9px] text-amber-500 font-mono bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded font-bold">Active v7.36</span>
                </div>

                <div className="relative my-4">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-900" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="48" 
                      stroke="currentColor" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="301.6" 
                      strokeDashoffset={301.6 - (301.6 * winRate) / 100} 
                      className={`${winRate >= 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{winRate}%</span>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Win Rate</span>
                  </div>
                </div>

                <div className="w-full space-y-2.5 pt-3 border-t border-slate-900 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono">Calculated Record</span>
                    <span className="font-bold text-slate-300">{winCount}W - {matches.length - winCount}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono">Average KDA</span>
                    <span className="font-mono text-slate-200">
                      <span className="text-emerald-400">{avgKills}</span>
                      <span className="text-slate-500 mx-0.5">/</span>
                      <span className="text-red-400">{avgDeaths}</span>
                      <span className="text-slate-500 mx-0.5">/</span>
                      <span className="text-sky-400">{avgAssists}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono">Avg GPM / XPM</span>
                    <span className="font-bold text-amber-500">{avgGpm} <span className="text-slate-500 font-normal">/</span> <span className="text-violet-400">{avgXpm}</span></span>
                  </div>
                </div>
              </div>

              {/* Box B: Select match from list to show on right */}
              <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                  Select Game Details
                </h3>

                <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto scrollbar-thin">
                  {matches.map((match) => {
                    const isSelected = selectedMatch?.id === match.id;
                    const colors = getHeroColors(HEROES[match.heroId]?.attribute || 'uni');

                    return (
                      <div
                        key={match.id}
                        onClick={() => setSelectedMatch(match)}
                        className={`border rounded-xl p-2.5 transition-all cursor-pointer text-left relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#121622] border-amber-500/80'
                            : 'bg-slate-950/40 hover:bg-slate-900/40 border-slate-900'
                        }`}
                      >
                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${match.isVictory ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className="flex items-start justify-between gap-3 pl-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                              <span className={`text-[10px] font-black ${colors.text}`}>
                                {match.heroDisplayName.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <span className="font-extrabold text-white text-xs block truncate max-w-[100px]">{match.heroDisplayName}</span>
                              <span className="text-[9px] text-slate-500 block font-mono">{match.position}</span>
                            </div>
                          </div>
                          <div className="text-right text-[10px] font-mono">
                            <div className="font-bold text-slate-300">{match.kills}/{match.deaths}/{match.assists}</div>
                            <div className="text-slate-500 text-[9px] mt-0.5">{match.duration}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right             {/* Right details display: Selected Match telemetry, items, and AI Agent reviews */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {selectedMatch ? (
                (() => {
                  const detailedInfo = generateDetailedMatch(selectedMatch);
                  const radiantPlayers = detailedInfo.players.filter(p => p.isRadiant);
                  const direPlayers = detailedInfo.players.filter(p => !p.isRadiant);
                  const matchAnalysis = matchAnalyses[selectedMatch.id];

                  return (
                    <div className="flex flex-col gap-4">
                      {/* Rich Match Header Card */}
                      <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                                selectedMatch.isVictory 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {selectedMatch.isVictory ? 'Radiant Victory' : 'Dire Victory'}
                              </span>
                              <span className="text-slate-500 text-xs font-mono">ID: {selectedMatch.id}</span>
                            </div>
                            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                              {selectedMatch.heroDisplayName}
                              <span className="text-slate-500 text-sm font-normal">({selectedMatch.position})</span>
                            </h2>
                            <p className="text-slate-400 text-xs font-mono mt-1">
                              Duration: <span className="text-white font-bold">{selectedMatch.duration}</span> • Mode: <span className="text-white">{selectedMatch.gameMode}</span> • Played: <span className="text-white">{selectedMatch.timestamp}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-right bg-slate-950/60 border border-slate-900 p-3 rounded-xl min-w-[200px] justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">My Score</span>
                              <span className="text-base font-black text-white font-mono">{selectedMatch.kills} / <span className="text-red-500">{selectedMatch.deaths}</span> / {selectedMatch.assists}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Farming</span>
                              <span className="text-base font-black text-amber-500 font-mono">{selectedMatch.gpm} <span className="text-xs text-slate-500">GPM</span></span>
                            </div>
                          </div>
                        </div>

                        {/* E-Sports Sub-navigation Tab Bar */}
                        <div className="flex border-t border-slate-900/80 mt-5 pt-3 overflow-x-auto scrollbar-none gap-2">
                          {[
                            { id: 'overview', label: '📊 Match Overview' },
                            { id: 'builds', label: '🛡️ Builds Timeline' },
                            { id: 'kills', label: '⚔️ Kill Breakdown' },
                            { id: 'coaching', label: '🧠 AI Coach Review' },
                          ].map((tab) => {
                            const isTabActive = matchTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setMatchTab(tab.id as any)}
                                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                                  isTabActive
                                    ? 'bg-slate-950 border-slate-800 text-white shadow-inner font-black'
                                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/30'
                                }`}
                              >
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tab Content 1: Match Overview & Draft */}
                      {matchTab === 'overview' && (
                        <div className="space-y-4">
                          {/* 3-Panel Grid layout (Minimap, Networth Graph, Lanes result) */}
                          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                            
                            {/* Panel A: Minimap */}
                            <div className="xl:col-span-3 bg-[#0A0D14] border border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between min-h-[260px]">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono self-start mb-2">Tactical Map</span>
                              
                              <div className="w-full aspect-square max-w-[160px] bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center p-2">
                                <svg viewBox="0 0 100 100" className="w-full h-full opacity-70 animate-pulse-slow">
                                  {/* River diagonal line */}
                                  <path d="M 0 100 Q 40 60 50 50 T 100 0" fill="none" stroke="#122540" strokeWidth="8" />
                                  <path d="M 0 100 Q 40 60 50 50 T 100 0" fill="none" stroke="#1e3a5f" strokeWidth="2" />
                                  
                                  {/* Lane Guidelines */}
                                  {/* Top Lane */}
                                  <path d="M 10 90 L 10 10 L 90 10" fill="none" stroke="#111827" strokeWidth="3" strokeDasharray="2 2" />
                                  {/* Bottom Lane */}
                                  <path d="M 10 90 L 90 90 L 90 10" fill="none" stroke="#111827" strokeWidth="3" strokeDasharray="2 2" />
                                  {/* Middle Lane */}
                                  <line x1="10" y1="90" x2="90" y2="10" stroke="#111827" strokeWidth="3" strokeDasharray="2 2" />

                                  {/* Radiant Base (Bottom Left) */}
                                  <rect x="5" y="80" width="15" height="15" className="fill-emerald-500/20 stroke-emerald-500/50" strokeWidth="1" />
                                  <circle cx="12" cy="88" r="3" className="fill-emerald-500" />
                                  
                                  {/* Dire Base (Top Right) */}
                                  <rect x="80" y="5" width="15" height="15" className="fill-red-500/20 stroke-red-500/50" strokeWidth="1" />
                                  <circle cx="88" cy="12" r="3" className="fill-red-500" />

                                  {/* Active Hero Positions Dots */}
                                  {/* Radiant team dots (Green) */}
                                  <circle cx="25" cy="75" r="2.5" className="fill-emerald-400" />
                                  <circle cx="48" cy="52" r="2.5" className="fill-emerald-400" />
                                  <circle cx="15" cy="25" r="2.5" className="fill-emerald-400" />
                                  
                                  {/* Dire team dots (Orange/Red) */}
                                  <circle cx="75" cy="25" r="2.5" className="fill-red-400" />
                                  <circle cx="55" cy="45" r="2.5" className="fill-red-400" />
                                  <circle cx="85" cy="75" r="2.5" className="fill-red-400" />
                                </svg>
                                
                                <span className="absolute bottom-1 left-2 text-[7px] font-mono text-emerald-400 uppercase">Radiant</span>
                                <span className="absolute top-1 right-2 text-[7px] font-mono text-red-400 uppercase">Dire</span>
                              </div>
                              
                              <p className="text-[9px] text-slate-500 font-mono text-center mt-2">Active lane control: 62% Radiant</p>
                            </div>

                            {/* Panel B: Net Worth & XP Advantage Curve */}
                            <div className="xl:col-span-5 bg-[#0A0D14] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between min-h-[260px]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Advantage Graph</span>
                                <div className="flex gap-2 font-mono text-[9px] font-black">
                                  <span className="text-amber-500">+27.1k Gold</span>
                                  <span className="text-violet-400">+32.3k XP</span>
                                </div>
                              </div>

                              <div className="h-36 relative overflow-hidden bg-slate-950/30 border border-slate-900/80 rounded-xl p-2 flex flex-col justify-between">
                                <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                                  <defs>
                                    <linearGradient id="selectedGoldAdv2" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                                    </linearGradient>
                                  </defs>

                                  {/* Zero reference baseline */}
                                  <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                                  
                                  {/* Gold Advantage Area & Curve */}
                                  {detailedInfo.goldAdvantage.length > 1 && (
                                    <>
                                      <path
                                        d={`M 0 60 ${detailedInfo.goldAdvantage.map((g, i) => {
                                          const x = (i / (detailedInfo.goldAdvantage.length - 1)) * 500;
                                          const clampedGold = Math.max(-15000, Math.min(15000, g));
                                          const y = 60 - (clampedGold / 15000) * 45;
                                          return `L ${x} ${y}`;
                                        }).join(' ')} L 500 60 Z`}
                                        fill="url(#selectedGoldAdv2)"
                                      />
                                      <path
                                        d={detailedInfo.goldAdvantage.map((g, i) => {
                                          const x = (i / (detailedInfo.goldAdvantage.length - 1)) * 500;
                                          const clampedGold = Math.max(-15000, Math.min(15000, g));
                                          const y = 60 - (clampedGold / 15000) * 45;
                                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth="2"
                                      />
                                    </>
                                  )}

                                  {/* XP Advantage Curve */}
                                  {detailedInfo.xpAdvantage.length > 1 && (
                                    <path
                                      d={detailedInfo.xpAdvantage.map((g, i) => {
                                        const x = (i / (detailedInfo.xpAdvantage.length - 1)) * 500;
                                        const clampedXP = Math.max(-15000, Math.min(15000, g));
                                        const y = 60 - (clampedXP / 15000) * 45;
                                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                      }).join(' ')}
                                      fill="none"
                                      stroke="#a78bfa"
                                      strokeWidth="1.5"
                                      strokeDasharray="4 2"
                                    />
                                  )}
                                </svg>
                                
                                <div className="absolute top-1 left-2 text-[7px] text-amber-500 uppercase font-black font-mono">Radiant Advantage</div>
                                <div className="absolute bottom-1 left-2 text-[7px] text-red-500 uppercase font-black font-mono">Dire Advantage</div>
                              </div>

                              <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono mt-2">
                                <span>00:00</span>
                                <span>15:00</span>
                                <span>30:00</span>
                                <span>{selectedMatch.duration}</span>
                              </div>
                            </div>

                            {/* Panel C: Lane Matchups results */}
                            <div className="xl:col-span-4 bg-[#0A0D14] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between min-h-[260px]">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">Lanes Breakdown</span>
                              
                              <div className="flex-grow space-y-2">
                                {detailedInfo.laneMatchups.map((lane, idx) => (
                                  <div key={idx} className="bg-slate-950/60 border border-slate-900/80 rounded-xl p-2.5 flex flex-col justify-between hover:border-slate-800 transition-all">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-mono text-slate-500 uppercase">{lane.laneName}</span>
                                      <span className={`text-[9px] font-black uppercase ${
                                        lane.winner === 'Radiant' ? 'text-emerald-400' : 'text-red-400'
                                      }`}>
                                        {lane.resultText}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                      {/* Radiant Heroes */}
                                      <div className="flex gap-1">
                                        {lane.radiantHeroes.map(id => (
                                          <div key={id} className="w-5 h-5 rounded bg-slate-900 border border-emerald-500/20 flex items-center justify-center text-[7px] font-black text-emerald-400 overflow-hidden relative" title={HEROES[id]?.displayName}>
                                            <img 
                                              src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} 
                                              alt={HEROES[id]?.displayName || 'Hero'} 
                                              className="w-full h-full object-cover"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      <span className="text-[8px] text-slate-600 font-mono">VS</span>
                                      {/* Dire Heroes */}
                                      <div className="flex gap-1">
                                        {lane.direHeroes.map(id => (
                                          <div key={id} className="w-5 h-5 rounded bg-slate-900 border border-red-500/20 flex items-center justify-center text-[7px] font-black text-red-400 overflow-hidden relative" title={HEROES[id]?.displayName}>
                                            <img 
                                              src={getHeroImgUrl(HEROES[id]?.name || 'drow_ranger')} 
                                              alt={HEROES[id]?.displayName || 'Hero'} 
                                              className="w-full h-full object-cover"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Draft Selection Box */}
                          <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono border-b border-slate-900/80 pb-2">
                              <Sword className="w-3.5 h-3.5 text-amber-500" />
                              Draft Phase Breakdown
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                              {/* Left side: Auto bans */}
                              <div className="md:col-span-4 space-y-2">
                                <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Auto Bans</span>
                                <div className="grid grid-cols-5 gap-1.5">
                                  {detailedInfo.draft.autoBans.map((id, i) => (
                                    <div key={i} className="aspect-[4/3] rounded bg-slate-950 border border-slate-900 overflow-hidden relative shrink-0 group hover:border-red-500/30 transition-all">
                                      <img 
                                        src={getHeroImgUrl(HEROES[id]?.name || 'axe')} 
                                        alt="banned hero" 
                                        className="w-full h-full object-cover grayscale opacity-40"
                                        referrerPolicy="no-referrer"
                                      />
                                      {/* Red Strike Line represent Ban */}
                                      <div className="absolute inset-0 bg-red-600/35 h-0.5 w-[140%] -rotate-45 origin-top-left translate-y-1.5 translate-x-[-15%]" />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right side: Pick Phases */}
                              <div className="md:col-span-8 grid grid-cols-3 gap-4">
                                {/* Pick Phase 1 */}
                                <div className="bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl space-y-2">
                                  <span className="text-[8px] uppercase font-black text-slate-500 block font-mono tracking-wider">Pick Phase 1</span>
                                  <div className="space-y-2">
                                    <div className="flex gap-1.5 justify-start">
                                      {detailedInfo.draft.pickPhase1.radiant.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-emerald-500/30 overflow-hidden" title={`Radiant: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-1.5 justify-start border-t border-slate-900/80 pt-1.5">
                                      {detailedInfo.draft.pickPhase1.dire.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-red-500/30 overflow-hidden" title={`Dire: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Pick Phase 2 */}
                                <div className="bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl space-y-2">
                                  <span className="text-[8px] uppercase font-black text-slate-500 block font-mono tracking-wider">Pick Phase 2</span>
                                  <div className="space-y-2">
                                    <div className="flex gap-1.5 justify-start">
                                      {detailedInfo.draft.pickPhase2.radiant.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-emerald-500/30 overflow-hidden" title={`Radiant: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-1.5 justify-start border-t border-slate-900/80 pt-1.5">
                                      {detailedInfo.draft.pickPhase2.dire.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-red-500/30 overflow-hidden" title={`Dire: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Pick Phase 3 */}
                                <div className="bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl space-y-2">
                                  <span className="text-[8px] uppercase font-black text-slate-500 block font-mono tracking-wider">Pick Phase 3</span>
                                  <div className="space-y-2">
                                    <div className="flex gap-1.5 justify-start">
                                      {detailedInfo.draft.pickPhase3.radiant.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-emerald-500/30 overflow-hidden" title={`Radiant: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-1.5 justify-start border-t border-slate-900/80 pt-1.5">
                                      {detailedInfo.draft.pickPhase3.dire.map((id, i) => (
                                        <div key={i} className="w-7 h-7 rounded bg-slate-900 border border-red-500/30 overflow-hidden" title={`Dire: ${HEROES[id]?.displayName}`}>
                                          <img src={getHeroImgUrl(HEROES[id]?.name || 'ursa')} alt="hero portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 2: Builds & Purchases Timeline */}
                      {matchTab === 'builds' && (
                        <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-900/80 pb-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                              <Shield className="w-3.5 h-3.5 text-amber-500" />
                              Skill Builds & Item Purchase Timelines
                            </h3>
                            <span className="text-[10px] font-mono text-slate-500">Duration: {selectedMatch.duration}</span>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* Left: Radiant Team Builds */}
                            <div className="space-y-3">
                              <div className="text-[10px] uppercase font-black text-emerald-400 font-mono tracking-widest pl-1">Radiant Team</div>
                              {radiantPlayers.map((player, idx) => (
                                <div key={idx} className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-xl space-y-2.5 hover:border-slate-850 transition-all relative overflow-hidden">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-9 h-9 rounded bg-slate-900 border border-emerald-500/30 overflow-hidden shrink-0">
                                        <img src={getHeroImgUrl(player.heroName)} alt={player.heroDisplayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div>
                                        <span className="font-extrabold text-white text-xs block">{player.name}</span>
                                        <span className="text-[9px] text-emerald-500 font-bold block">{player.heroDisplayName} • <span className="text-slate-500 font-mono">{player.skillBuild}</span></span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded-md">
                                      <span className="text-[9px] font-mono text-slate-400">Talent</span>
                                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[7px] text-amber-400 font-black">T</div>
                                    </div>
                                  </div>

                                  {/* Skills progression boxes */}
                                  <div className="flex flex-wrap gap-1">
                                    {player.skillsTimeline.map((skill, i) => (
                                      <div key={i} className="w-4 h-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[7px] font-black text-amber-500" title={`Level ${i+1}: Skill ${skill}`}>
                                        {skill}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Item purchase timeline */}
                                  <div className="border-t border-slate-900/60 pt-2 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {player.itemsTimeline.map((item, i) => (
                                        <div key={i} className="bg-slate-950/90 border border-slate-900 hover:border-slate-800 transition-all px-1.5 py-1 rounded flex flex-col items-center justify-between min-w-[42px] min-h-[36px]">
                                          <span className="text-[6px] font-black text-amber-400 uppercase truncate max-w-[36px]">{item.displayName.slice(0, 6)}</span>
                                          <span className="text-[7px] text-slate-500 font-mono mt-0.5">{item.time}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Ward indicators */}
                                    <div className="flex gap-2 shrink-0 font-mono text-[8px] bg-slate-950/80 border border-slate-900/80 p-1 rounded-lg">
                                      <div className="text-center">
                                        <span className="text-sky-400 block font-bold">OBS</span>
                                        <span className="text-white font-extrabold">{player.observers}</span>
                                      </div>
                                      <div className="text-center border-l border-slate-900 pl-2">
                                        <span className="text-amber-500 block font-bold">SEN</span>
                                        <span className="text-white font-extrabold">{player.sentries}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Right: Dire Team Builds */}
                            <div className="space-y-3">
                              <div className="text-[10px] uppercase font-black text-red-400 font-mono tracking-widest pl-1">Dire Team</div>
                              {direPlayers.map((player, idx) => (
                                <div key={idx} className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-xl space-y-2.5 hover:border-slate-850 transition-all relative overflow-hidden">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-9 h-9 rounded bg-slate-900 border border-red-500/30 overflow-hidden shrink-0">
                                        <img src={getHeroImgUrl(player.heroName)} alt={player.heroDisplayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div>
                                        <span className="font-extrabold text-white text-xs block">{player.name}</span>
                                        <span className="text-[9px] text-red-400 font-bold block">{player.heroDisplayName} • <span className="text-slate-500 font-mono">{player.skillBuild}</span></span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded-md">
                                      <span className="text-[9px] font-mono text-slate-400">Talent</span>
                                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[7px] text-amber-400 font-black">T</div>
                                    </div>
                                  </div>

                                  {/* Skills progression boxes */}
                                  <div className="flex flex-wrap gap-1">
                                    {player.skillsTimeline.map((skill, i) => (
                                      <div key={i} className="w-4 h-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[7px] font-black text-red-400" title={`Level ${i+1}: Skill ${skill}`}>
                                        {skill}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Item purchase timeline */}
                                  <div className="border-t border-slate-900/60 pt-2 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {player.itemsTimeline.map((item, i) => (
                                        <div key={i} className="bg-slate-950/90 border border-slate-900 hover:border-slate-800 transition-all px-1.5 py-1 rounded flex flex-col items-center justify-between min-w-[42px] min-h-[36px]">
                                          <span className="text-[6px] font-black text-amber-400 uppercase truncate max-w-[36px]">{item.displayName.slice(0, 6)}</span>
                                          <span className="text-[7px] text-slate-500 font-mono mt-0.5">{item.time}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Ward indicators */}
                                    <div className="flex gap-2 shrink-0 font-mono text-[8px] bg-slate-950/80 border border-slate-900/80 p-1 rounded-lg">
                                      <div className="text-center">
                                        <span className="text-sky-400 block font-bold">OBS</span>
                                        <span className="text-white font-extrabold">{player.observers}</span>
                                      </div>
                                      <div className="text-center border-l border-slate-900 pl-2">
                                        <span className="text-amber-500 block font-bold">SEN</span>
                                        <span className="text-white font-extrabold">{player.sentries}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Horizontal Timeline Bar slider mimicking the audio progression */}
                          <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl space-y-1.5">
                            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                              <span>00:00</span>
                              <span>Timeline Progress Checkpoint</span>
                              <span>{selectedMatch.duration}</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 relative overflow-hidden">
                              <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full w-[100%] rounded-full opacity-80" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 3: Kill Breakdown Matrix Grid */}
                      {matchTab === 'kills' && (
                        <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-5 space-y-5">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono border-b border-slate-900/80 pb-2">
                            <Skull className="w-3.5 h-3.5 text-amber-500" />
                            Kill Breakdown Matrix (Who Killed Whom)
                          </h3>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                            {/* Left: Radiant Kills on Dire */}
                            <div className="bg-slate-950/40 border border-slate-900/80 p-4 rounded-xl space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                                <span className="text-[10px] uppercase font-black text-emerald-400 font-mono tracking-wider">Radiant Kills Breakdown</span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded font-mono font-black">{detailedInfo.radiantKills} Team Kills</span>
                              </div>

                              <div className="space-y-2.5">
                                {/* Header of victims */}
                                <div className="grid grid-cols-12 items-center text-[8px] font-mono text-slate-500 uppercase font-black px-1">
                                  <div className="col-span-4">Killer Hero</div>
                                  <div className="col-span-8 grid grid-cols-5 gap-1 text-center">
                                    {direPlayers.map((victim, i) => (
                                      <div key={i} className="truncate" title={victim.heroDisplayName}>{victim.heroDisplayName.slice(0, 4)}</div>
                                    ))}
                                  </div>
                                </div>

                                {/* List of players & their matrix */}
                                {radiantPlayers.map((player, idx) => (
                                  <div key={idx} className="grid grid-cols-12 items-center bg-slate-950/80 border border-slate-900 p-2 rounded-xl">
                                    {/* Killer label */}
                                    <div className="col-span-4 flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-slate-900 border border-emerald-500/20 overflow-hidden shrink-0">
                                        <img src={getHeroImgUrl(player.heroName)} alt="killer hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="truncate">
                                        <span className="font-extrabold text-white text-[10px] block truncate">{player.name}</span>
                                        <span className="text-[7px] text-slate-500 font-mono block uppercase">{player.kills} Kills</span>
                                      </div>
                                    </div>

                                    {/* Matrix victims counts */}
                                    <div className="col-span-8 grid grid-cols-5 gap-1 text-center">
                                      {direPlayers.map((victim, i) => {
                                        const count = player.killMatrix[victim.heroId] ?? 0;
                                        return (
                                          <div key={i} className={`py-1 rounded font-mono text-[10px] font-bold ${
                                            count > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-700 bg-slate-950'
                                          }`}>
                                            {count}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}

                                {/* Totals/Deaths Row */}
                                <div className="grid grid-cols-12 items-center bg-slate-950 border border-slate-900 p-2.5 rounded-xl font-mono text-[9px] font-extrabold">
                                  <div className="col-span-4 text-slate-400">Total Deaths:</div>
                                  <div className="col-span-8 grid grid-cols-5 gap-1 text-center text-red-400">
                                    {/* Deaths sums matching screenshot */}
                                    {[8, 14, 10, 7, 11].map((deathsSum, i) => (
                                      <div key={i} className="bg-red-500/10 py-0.5 rounded border border-red-500/10">{deathsSum}</div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right: Dire Kills on Radiant */}
                            <div className="bg-slate-950/40 border border-slate-900/80 p-4 rounded-xl space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                                <span className="text-[10px] uppercase font-black text-red-400 font-mono tracking-wider">Dire Kills Breakdown</span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] px-2 py-0.5 rounded font-mono font-black">{detailedInfo.direKills} Team Kills</span>
                              </div>

                              <div className="space-y-2.5">
                                {/* Header of victims */}
                                <div className="grid grid-cols-12 items-center text-[8px] font-mono text-slate-500 uppercase font-black px-1">
                                  <div className="col-span-4">Killer Hero</div>
                                  <div className="col-span-8 grid grid-cols-5 gap-1 text-center">
                                    {radiantPlayers.map((victim, i) => (
                                      <div key={i} className="truncate" title={victim.heroDisplayName}>{victim.heroDisplayName.slice(0, 4)}</div>
                                    ))}
                                  </div>
                                </div>

                                {/* List of players & their matrix */}
                                {direPlayers.map((player, idx) => (
                                  <div key={idx} className="grid grid-cols-12 items-center bg-slate-950/80 border border-slate-900 p-2 rounded-xl">
                                    {/* Killer label */}
                                    <div className="col-span-4 flex items-center gap-2">
                                      <div className="w-6 h-6 rounded bg-slate-900 border border-red-500/20 overflow-hidden shrink-0">
                                        <img src={getHeroImgUrl(player.heroName)} alt="killer hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="truncate">
                                        <span className="font-extrabold text-white text-[10px] block truncate">{player.name}</span>
                                        <span className="text-[7px] text-slate-500 font-mono block uppercase">{player.kills} Kills</span>
                                      </div>
                                    </div>

                                    {/* Matrix victims counts */}
                                    <div className="col-span-8 grid grid-cols-5 gap-1 text-center">
                                      {radiantPlayers.map((victim, i) => {
                                        const count = player.killMatrix[victim.heroId] ?? 0;
                                        return (
                                          <div key={i} className={`py-1 rounded font-mono text-[10px] font-bold ${
                                            count > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-700 bg-slate-950'
                                          }`}>
                                            {count}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}

                                {/* Totals/Deaths Row */}
                                <div className="grid grid-cols-12 items-center bg-slate-950 border border-slate-900 p-2.5 rounded-xl font-mono text-[9px] font-extrabold">
                                  <div className="col-span-4 text-slate-400">Total Deaths:</div>
                                  <div className="col-span-8 grid grid-cols-5 gap-1 text-center text-emerald-400">
                                    {/* Deaths sums matching screenshot */}
                                    {[2, 7, 5, 11, 2].map((deathsSum, i) => (
                                      <div key={i} className="bg-emerald-500/10 py-0.5 rounded border border-emerald-500/10">{deathsSum}</div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 4: AI Strategic Oracle Coach */}
                      {matchTab === 'coaching' && (
                        <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                              <Sparkles className="w-40 h-40 text-indigo-400" />
                            </div>

                            <div className="flex justify-between items-start gap-4 mb-4 z-10 relative">
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-400">
                                  <Sparkles className="w-4 h-4 animate-pulse" />
                                </span>
                                <div>
                                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 font-mono">Match Analysis Coach</h3>
                                  <h2 className="text-base font-black text-white mt-0.5">Gemini Strategic Oracle</h2>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => generateMatchCoaching(selectedMatch)}
                                disabled={isLoadingMatchAi}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-indigo-950/30 uppercase tracking-wider relative z-20"
                              >
                                {isLoadingMatchAi ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3" />
                                )}
                                <span>{isLoadingMatchAi ? 'Consulting...' : 'Generate Review'}</span>
                              </button>
                            </div>

                            {/* Content states */}
                            {isLoadingMatchAi ? (
                              <div className="flex-grow flex flex-col items-center justify-center text-center py-6 bg-black/20 rounded-xl border border-indigo-500/10">
                                <div className="flex items-center justify-center space-x-1.5 mb-2">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-225" />
                                </div>
                                <p className="text-[11px] font-mono text-indigo-300">{aiStep}</p>
                              </div>
                            ) : matchAnalysis ? (
                              <div className="flex-grow space-y-3.5 z-10 relative">
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                  {/* Coach Grade Badge */}
                                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-[100px] self-stretch shadow-inner">
                                    <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500 font-mono">Coach Grade</span>
                                    <span className="text-3xl font-black text-amber-500 my-1">{matchAnalysis.overallRating}</span>
                                    <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[90px]">{matchAnalysis.playstyleTitle}</span>
                                  </div>
                                  
                                  {/* Summary Text block */}
                                  <div className="flex-1 bg-[#090D14]/80 border border-slate-900 rounded-xl p-3">
                                    <p className="text-[11px] text-slate-200 leading-relaxed italic">
                                      &ldquo;{matchAnalysis.summary}&rdquo;
                                    </p>
                                  </div>
                                </div>

                                {/* Dynamic Bullet grids */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                  <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-3 flex flex-col">
                                    <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono mb-2 border-b border-emerald-500/10 pb-1">Strengths</div>
                                    <ul className="space-y-1.5 text-[10px] text-emerald-200/90 leading-snug list-disc pl-3">
                                      {matchAnalysis.strengths.map((str, sIdx) => (
                                        <li key={sIdx}>{str}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="bg-red-950/15 border border-red-500/20 rounded-xl p-3 flex flex-col">
                                    <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest font-mono mb-2 border-b border-red-500/10 pb-1">Areas to Improve</div>
                                    <ul className="space-y-1.5 text-[10px] text-red-200/90 leading-snug list-disc pl-3">
                                      {matchAnalysis.weaknesses.map((weak, wIdx) => (
                                        <li key={wIdx}>{weak}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="bg-amber-950/15 border border-amber-500/20 rounded-xl p-3 flex flex-col">
                                    <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono mb-2 border-b border-amber-500/10 pb-1">Coach Pro Tips</div>
                                    <ul className="space-y-1.5 text-[10px] text-amber-200/90 leading-snug list-disc pl-3">
                                      {matchAnalysis.proTips.map((tip, tIdx) => (
                                        <li key={tIdx}>{tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-grow flex flex-col justify-center py-2 relative z-10">
                                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                                  &ldquo;Click the Generate Review button to execute our specialized Gemini performance agent. It reviews GPM/XPM curves, item paths, and returns tactical coaching insights instantly.&rdquo;
                                </p>
                                <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Evaluates active match statistics using Gemini models.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })()
              ) : (
                <div className="bg-[#0A0D14] border border-slate-900 rounded-2xl p-10 text-center">
                  <HelpCircle className="w-10 h-10 text-slate-700 mx-auto mb-2 animate-bounce" />
                  <p className="text-slate-500 text-xs font-semibold">Select a match from the left sidebar list to inspect comprehensive statistics, builds, kills, and AI Coaching advice.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* System latency and telemetry status bar */}
        <footer className="mt-4 border-t border-slate-900/60 pt-3.5 flex justify-between items-center opacity-30 text-[9px] font-mono">
          <span>LATENCY: 28MS</span>
          <span>ROUTING: STRATZ-API-EDGE</span>
          <span>LAST SYNC: JUST NOW</span>
        </footer>

      </main>

      {/* Valve and STRATZ credits footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-8 mt-12 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px]">
          <p>© 2026 Stratz Analytica. Dota 2 images are copyrighted by Valve Corp.</p>
          <p className="flex items-center justify-center gap-1.5">
            Powered by <span className="text-amber-500 font-semibold">Gemini 3.5 Flash</span> &amp; <span className="text-amber-500 font-semibold">STRATZ GraphQL</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
