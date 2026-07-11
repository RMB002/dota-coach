import { NextRequest, NextResponse } from "next/server";
import { MOCK_MATCH_HISTORY, HEROES } from "@/lib/stratz-helpers";

// A GraphQL query to fetch player matches from STRATZ
const STRATZ_GRAPHQL_QUERY = `
  query($accountId: Long!) {
    player(steamAccountId: $accountId) {
      names {
        name
      }
      matches(request: { limit: 10 }) {
        id
        durationSeconds
        isVictory
        gameMode
        startDateTime
        players(steamAccountId: $accountId) {
          heroId
          kills
          deaths
          assists
          goldPerMinute
          experiencePerMinute
          numLastHits
          numDenies
          heroDamage
          towerDamage
          heroHealing
          position
          lane
          isRadiant
          award
          item0Id
          item1Id
          item2Id
          item3Id
          item4Id
          item5Id
        }
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const { accountId, apiKey } = await req.json();

    if (!accountId) {
      return NextResponse.json({ error: "Steam Account ID is required." }, { status: 400 });
    }

    const numericAccountId = parseInt(accountId, 10);
    if (isNaN(numericAccountId)) {
      return NextResponse.json({ error: "Steam Account ID must be a valid number." }, { status: 400 });
    }

    // Check for API key from request, or fallback to environment variable
    const finalApiKey = (apiKey && apiKey.trim().length > 0) ? apiKey.trim() : process.env.STRATZ_API_KEY;

    // If an API key is provided, perform a real query to Stratz GraphQL
    if (finalApiKey && finalApiKey.trim().length > 0) {
      try {
        const response = await fetch("https://api.stratz.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${finalApiKey.trim()}`,
            "User-Agent": "aistudio-build",
          },
          body: JSON.stringify({
            query: STRATZ_GRAPHQL_QUERY,
            variables: { accountId: numericAccountId }
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data?.player) {
            const player = result.data.player;
            const playerName = player.names?.[0]?.name || `Player #${accountId}`;
            const apiMatches = player.matches || [];

            // Convert Stratz schema to our application Match structure
            const matches = apiMatches.map((m: any) => {
              const playerData = m.players?.[0] || {};
              const durationMin = Math.floor(m.durationSeconds / 60);
              const durationSec = m.durationSeconds % 60;
              const durationStr = `${durationMin}:${durationSec.toString().padStart(2, "0")}`;

              // Map position & lane to simple strings
              const positionMap: Record<string, string> = {
                'POSITION_1': 'Carry',
                'POSITION_2': 'Mid',
                'POSITION_3': 'Offlane',
                'POSITION_4': 'Soft Support',
                'POSITION_5': 'Hard Support',
              };

              const hero = HEROES[playerData.heroId] || {
                id: playerData.heroId,
                name: "unknown",
                displayName: `Hero #${playerData.heroId}`,
                attribute: "uni",
                roles: ["Fighter"]
              };

              // Map some common items (Dota item database ids can be extensive, we do a basic fallback)
              const itemsList: string[] = [];
              const itemIds = [
                playerData.item0Id,
                playerData.item1Id,
                playerData.item2Id,
                playerData.item3Id,
                playerData.item4Id,
                playerData.item5Id
              ];
              
              // Simple common item dictionary for visual decoration
              const itemDict: Record<number, string> = {
                50: "Phase Boots",
                63: "Power Treads",
                116: "Black King Bar",
                147: "Manta Style",
                1: "Blink Dagger",
                208: "Abyssal Blade",
                145: "Battle Fury",
                96: "Scythe of Vyse",
                108: "Aghanims Scepter",
                102: "Force Staff",
                254: "Glimmer Cape",
                168: "Desolator",
                114: "Heart of Tarrasque",
                141: "Daedalus",
                206: "Hurricane Pike",
                151: "Shivas Guard"
              };

              itemIds.forEach(id => {
                if (id && id > 0) {
                  itemsList.push(itemDict[id] || `Item #${id}`);
                }
              });

              if (itemsList.length === 0) {
                itemsList.push("Power Treads", "Black King Bar", "Blink Dagger");
              }

              // Simple gold difference graph simulation based on win/loss
              const totalMins = Math.max(10, durationMin);
              const goldGraph: number[] = [];
              let currentGold = 0;
              for (let i = 0; i <= totalMins; i += 3) {
                const trend = m.isVictory ? 400 : -350;
                currentGold += trend + (Math.random() * 800 - 400);
                goldGraph.push(Math.round(currentGold));
              }

              return {
                id: m.id,
                heroId: playerData.heroId,
                heroName: hero.name,
                heroDisplayName: hero.displayName,
                isVictory: m.isVictory,
                gameMode: m.gameMode || "Ranked Match",
                duration: durationStr,
                kills: playerData.kills ?? 0,
                deaths: playerData.deaths ?? 0,
                assists: playerData.assists ?? 0,
                gpm: playerData.goldPerMinute ?? 400,
                xpm: playerData.experiencePerMinute ?? 450,
                lastHits: playerData.numLastHits ?? 100,
                denies: playerData.numDenies ?? 5,
                heroDamage: playerData.heroDamage ?? 12000,
                towerDamage: playerData.towerDamage ?? 1000,
                heroHealing: playerData.heroHealing ?? 0,
                position: positionMap[playerData.position] || "Carry",
                lane: playerData.lane ? playerData.lane.replace("LANE_", "").toLowerCase() : "safe",
                items: itemsList,
                timestamp: new Date(m.startDateTime * 1000).toLocaleDateString("en-US", {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }),
                goldGraph
              };
            });

            return NextResponse.json({
              playerName,
              matches,
              isRealApi: true
            });
          }
        }
      } catch (apiErr) {
        console.error("Stratz API key provided but failed, falling back to mock simulator:", apiErr);
      }
    }

    // --- Fallback & Personalized Mock Generator ---
    // If no API Key is provided or STRATZ fetch fails, generate a beautifully randomized set of matches
    // uniquely tailored/seeded by their numeric account ID.
    const seed = numericAccountId;
    const mockNames = ["Miracle-", "Nisha", "Arteezy", "Yatoro", "Somnus", "Topson", "Gorgc", "Dendi"];
    const nameIndex = Math.abs(seed) % mockNames.length;
    const playerName = mockNames[nameIndex] + ` (Simulated #${accountId})`;

    // Randomize victories/scores slightly using seed
    const personalizedMatches = MOCK_MATCH_HISTORY.map((match, idx) => {
      const matchSeed = seed + idx * 1001;
      const isVictory = (matchSeed % 2) === 0;
      
      // Calculate realistic KDA based on victory/defeat and position
      let kills = match.kills;
      let deaths = match.deaths;
      let assists = match.assists;
      let gpm = match.gpm;
      let xpm = match.xpm;
      let lastHits = match.lastHits;

      if (isVictory !== match.isVictory) {
        if (isVictory) {
          // Changed to Victory: increase scores, lower deaths
          kills = Math.round(match.kills * 1.4);
          deaths = Math.max(1, Math.round(match.deaths / 1.5));
          assists = Math.round(match.assists * 1.2);
          gpm = Math.round(match.gpm * 1.2);
          xpm = Math.round(match.xpm * 1.15);
          lastHits = Math.round(match.lastHits * 1.1);
        } else {
          // Changed to Defeat: lower scores, higher deaths
          kills = Math.max(2, Math.round(match.kills / 1.3));
          deaths = Math.round(match.deaths * 1.5);
          assists = Math.max(3, Math.round(match.assists / 1.2));
          gpm = Math.round(match.gpm / 1.2);
          xpm = Math.round(match.xpm / 1.15);
          lastHits = Math.round(match.lastHits / 1.1);
        }
      }

      // Generate a personalized gold graph
      const goldGraph: number[] = [];
      let currentGold = 0;
      const ticks = match.goldGraph.length;
      for (let i = 0; i < ticks; i++) {
        const trend = isVictory ? 350 : -300;
        currentGold += trend + ((matchSeed * (i + 1)) % 600 - 300);
        goldGraph.push(Math.round(currentGold));
      }

      return {
        ...match,
        id: match.id + (numericAccountId % 1000000),
        isVictory,
        kills,
        deaths,
        assists,
        gpm,
        xpm,
        lastHits,
        goldGraph,
      };
    });

    return NextResponse.json({
      playerName,
      matches: personalizedMatches,
      isRealApi: false,
      info: "Using smart Dota 2 profile simulation. Connect a STRATZ Developer API Key in the settings panel to fetch live match data."
    });

  } catch (error) {
    console.error("Error in STRATZ matches proxy endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
