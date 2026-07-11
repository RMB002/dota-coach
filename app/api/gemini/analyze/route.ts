import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is not configured. Please add your key in Settings > Secrets." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const body = await req.json();
    const { matches, playerName, selectedMatch, detailedMatchInfo } = body;

    let systemInstruction = "";
    let prompt = "";

    if (selectedMatch && detailedMatchInfo) {
      // Find player stats in detailedMatchInfo
      // We can identify the player in detailedMatchInfo.players by matching heroId
      const playerStats = detailedMatchInfo.players.find(
        (p: any) => p.heroId === selectedMatch.heroId
      ) || detailedMatchInfo.players[0];

      const teammateStats = detailedMatchInfo.players.filter(
        (p: any) => p.isRadiant === playerStats.isRadiant && p.heroId !== playerStats.heroId
      );

      const enemyStats = detailedMatchInfo.players.filter(
        (p: any) => p.isRadiant !== playerStats.isRadiant
      );

      // Map kill matrix for readability
      const killMatrixReadable = Object.entries(playerStats.killMatrix || {}).map(([victimId, killsCount]) => {
        const victimHero = detailedMatchInfo.players.find((p: any) => p.heroId === Number(victimId));
        return {
          victimHero: victimHero?.heroDisplayName || `Hero ID ${victimId}`,
          kills: killsCount
        };
      });

      systemInstruction = `
        You are an elite, highly professional Dota 2 Esports Coach and Performance Analyst.
        Your job is to analyze a SINGLE specific match in-depth and provide elite tactical coaching.
        Be extremely objective, direct, and esports-focused. Use correct Dota 2 terms (lane control, power spikes, itemization window, net worth advantage, fight execution, target priority).
        
        Analyze:
        - Player's KDA, GPM/XPM, and general role.
        - Skill build selection and talent milestones.
        - Item choices and purchase timings (e.g. was BKB bought? Did they get a fast blink/manta?).
        - Laning matchup outcomes.
        - Kill matrix target prioritization (did they focus the carry/mid or support?).
        
        Return your analysis strictly conforming to the requested JSON Schema. Do not output raw text, only valid JSON.
      `;

      prompt = `
        Player Name: ${playerName}
        Hero Played: ${selectedMatch.heroDisplayName}
        Position: ${selectedMatch.position}
        Match Result: ${selectedMatch.isVictory ? "Victory" : "Defeat"}
        Duration: ${selectedMatch.duration}
        My Stats:
        - KDA: ${selectedMatch.kills} kills, ${selectedMatch.deaths} deaths, ${selectedMatch.assists} assists
        - GPM: ${selectedMatch.gpm} | XPM: ${selectedMatch.xpm}
        - Lasthits: ${selectedMatch.lastHits} | Denies: ${selectedMatch.denies}
        - Items: ${selectedMatch.items.join(", ")}
        - Skill Build: ${playerStats?.skillBuild}
        - Skill Timeline: ${playerStats?.skillsTimeline?.join(" -> ")}
        - Item Purchase Times: ${JSON.stringify(playerStats?.itemsTimeline)}
        - Wards Placed: Observers: ${playerStats?.observers}, Sentries: ${playerStats?.sentries}
        
        Lane Matchups Results:
        ${JSON.stringify(detailedMatchInfo.laneMatchups, null, 2)}
        
        My Kill Matrix (enemies I killed and how many times):
        ${JSON.stringify(killMatrixReadable, null, 2)}

        Teammates list:
        ${teammateStats.map((t: any) => `${t.name} (${t.heroDisplayName}): KDA ${t.kills}/${t.deaths}/${t.assists}`).join("\n")}

        Enemies list:
        ${enemyStats.map((e: any) => `${e.name} (${e.heroDisplayName}): KDA ${e.kills}/${e.deaths}/${e.assists}`).join("\n")}

        Provide a rigorous, highly detailed single-match coaching analysis. Highlight EXACTLY why they won or lost, assess their laning phase efficiency, critique their item build and timing windows (using the purchase times provided), analyze their kill targets (matrix), and give three professional pro tips to optimize their gameplay.
      `;
    } else {
      // General profile coaching
      if (!matches || !Array.isArray(matches) || matches.length === 0) {
        return NextResponse.json({ error: "Match list is empty or invalid." }, { status: 400 });
      }

      const formattedMatches = matches.map((m: any) => ({
        hero: m.heroDisplayName,
        result: m.isVictory ? "Victory" : "Defeat",
        position: m.position,
        duration: m.duration,
        kda: `${m.kills}/${m.deaths}/${m.assists}`,
        gpm: m.gpm,
        xpm: m.xpm,
        lastHits: m.lastHits,
        denies: m.denies,
        heroDamage: m.heroDamage,
        towerDamage: m.towerDamage,
        items: m.items.join(", ")
      }));

      systemInstruction = `
        You are an elite, highly professional Dota 2 Esports Coach and Performance Analyst.
        Your job is to analyze the user's overall profile matches and give top-tier, strategic, and direct coaching advice.
        Be objective, encouraging but strict, using correct Dota 2 esports terminology (e.g. laning phase, creep equilibrium, itemization, power spikes, map pressure, positioning, buyback management).
        
        Look at their:
        - Win rate and recent streaks
        - KDA ratios (high deaths usually mean bad positioning or overextending)
        - GPM and XPM depending on their role (e.g. Carry should have >650 GPM, support doesn't need high GPM but should have high assists/healing/tower damage support)
        - Last hit counts relative to match durations
        - Item builds (e.g. whether Black King Bar was bought, blink dagger initiation)
        
        Return your analysis strictly conforming to the requested JSON Schema. Do not output raw text, only valid JSON.
      `;

      prompt = `
        Player Name: ${playerName}
        Recent Matches:
        ${JSON.stringify(formattedMatches, null, 2)}
        
        Provide a comprehensive coaching analysis of these matches.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRating: { 
              type: Type.STRING, 
              description: "A single grade representing performance, e.g. 'S', 'A', 'B+', 'B', 'C', 'D'" 
            },
            playstyleTitle: { 
              type: Type.STRING, 
              description: "A descriptive title for their playstyle, e.g., 'Unyielding Farmer', 'Hyper-Aggressive Ganker', 'Sacrificial Wardmaster', 'Calculated Tactician'" 
            },
            summary: { 
              type: Type.STRING, 
              description: "A detailed 3-4 sentence paragraph analyzing their general match flow, hero comfort, and victory impact." 
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 bullet points highlighting their clear, stat-driven strengths (e.g., strong laning, high GPM sustainability)."
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 bullet points highlighting mechanical or strategic areas of concern (e.g., dying too often, low tower pressure)."
            },
            proTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 actionable, high-level strategic coaching tips to win more matches, including specific itemization or lane rotation tips."
            }
          },
          required: ["overallRating", "playstyleTitle", "summary", "strengths", "weaknesses", "proTips"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API.");
    }

    const analysisData = JSON.parse(resultText.trim());
    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("Error in Gemini analysis route:", error);
    return NextResponse.json({ error: "Failed to generate AI performance coaching analysis." }, { status: 500 });
  }
}
