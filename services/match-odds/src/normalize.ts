/**
 * ODDS-002: Normalize provider data into internal Match and Market models.
 */

import type { ProviderMatch } from "./provider.js";

export interface NormalizedMatch {
	matchId: string;
	competition: string;
	homeTeam: string;
	awayTeam: string;
	startTime: string;
	status: "upcoming" | "live" | "finished";
}

export interface NormalizedMarket {
	marketId: string;
	matchId: string;
	marketType: "1x2";
	oddsHome: number;
	oddsDraw: number;
	oddsAway: number;
	oddsVersion: number;
	expiresAt: string;
}

let oddsVersionCounter = 0;

function mapCompetition(sport: string): string {
	if (sport.includes("world_cup")) return "FIFA World Cup 2026";
	if (sport.includes("epl")) return "English Premier League";
	if (sport.includes("la_liga")) return "La Liga";
	if (sport.includes("champions")) return "UEFA Champions League";
	return "International Football";
}

function determineStatus(commenceTime: string): "upcoming" | "live" | "finished" {
	const start = new Date(commenceTime).getTime();
	const now = Date.now();
	if (now < start) return "upcoming";
	if (now < start + 120 * 60 * 1000) return "live";
	return "finished";
}

export function normalizeMatches(
	providerMatches: ProviderMatch[],
): { matches: NormalizedMatch[]; markets: NormalizedMarket[] } {
	const matches: NormalizedMatch[] = [];
	const markets: NormalizedMarket[] = [];

	for (const pm of providerMatches) {
		const matchId = `match_${pm.id}`;

		matches.push({
			matchId,
			competition: mapCompetition(pm.sport),
			homeTeam: pm.homeTeam,
			awayTeam: pm.awayTeam,
			startTime: pm.commenceTime,
			status: determineStatus(pm.commenceTime),
		});

		oddsVersionCounter++;
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

		markets.push({
			marketId: `mkt_${pm.id}`,
			matchId,
			marketType: "1x2",
			oddsHome: pm.oddsHome,
			oddsDraw: pm.oddsDraw,
			oddsAway: pm.oddsAway,
			oddsVersion: oddsVersionCounter,
			expiresAt,
		});
	}

	return { matches, markets };
}
