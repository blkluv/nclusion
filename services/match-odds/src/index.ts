import { Hono } from "hono";
import { createProvider } from "./provider.js";
import { type NormalizedMarket, type NormalizedMatch, normalizeMatches } from "./normalize.js";

const app = new Hono();

// --- In-memory cache (ODDS-005) ---

interface Cache {
	matches: NormalizedMatch[];
	markets: NormalizedMarket[];
	fetchedAt: number;
}

let cache: Cache | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getOrRefreshCache(): Promise<Cache> {
	if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache;
	}

	const provider = createProvider(process.env.ODDS_API_KEY);
	const raw = await provider.fetchMatches();
	const { matches, markets } = normalizeMatches(raw);

	cache = { matches, markets, fetchedAt: Date.now() };
	return cache;
}

// --- Routes ---

app.get("/health", (c) => {
	return c.json({ status: "ok", service: "match-odds" });
});

/** ODDS-003: Compact match list */
app.get("/", async (c) => {
	const data = await getOrRefreshCache();

	const compactMatches = data.matches.map((m) => {
		const market = data.markets.find((mkt) => mkt.matchId === m.matchId);
		return {
			matchId: m.matchId,
			homeTeam: m.homeTeam,
			awayTeam: m.awayTeam,
			startTime: m.startTime,
			status: m.status,
			competition: m.competition,
			oddsHome: market?.oddsHome ?? 0,
			oddsDraw: market?.oddsDraw ?? 0,
			oddsAway: market?.oddsAway ?? 0,
		};
	});

	return c.json({
		matches: compactMatches,
		cachedAt: new Date(data.fetchedAt).toISOString(),
	});
});

/** ODDS-004: Match detail with full odds */
app.get("/:matchId", async (c) => {
	const matchId = c.req.param("matchId");
	const data = await getOrRefreshCache();

	const match = data.matches.find((m) => m.matchId === matchId);
	const market = data.markets.find((m) => m.matchId === matchId);

	if (!match) {
		return c.json({ error: { code: "NOT_FOUND", message: "Match not found" } }, 404);
	}

	return c.json({
		match,
		market,
		cachedAt: new Date(data.fetchedAt).toISOString(),
	});
});

/** Force cache refresh */
app.post("/refresh", async (c) => {
	cache = null;
	const data = await getOrRefreshCache();
	return c.json({ refreshed: true, matchCount: data.matches.length });
});

export { app };
