/**
 * ODDS-001: Odds provider integration
 * Supports The Odds API and a mock provider for development.
 */

export interface ProviderMatch {
	id: string;
	sport: string;
	homeTeam: string;
	awayTeam: string;
	commenceTime: string;
	oddsHome: number;
	oddsDraw: number;
	oddsAway: number;
}

export interface OddsProvider {
	fetchMatches(): Promise<ProviderMatch[]>;
}

/** The Odds API provider — requires ODDS_API_KEY env var */
export class TheOddsApiProvider implements OddsProvider {
	constructor(private apiKey: string) {}

	async fetchMatches(): Promise<ProviderMatch[]> {
		const url = `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${this.apiKey}&regions=us,eu&markets=h2h&oddsFormat=decimal`;
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Odds API error: ${res.status} ${res.statusText}`);
		}

		const data = await res.json();

		return data.map((event: Record<string, unknown>) => {
			const bookmaker = (event.bookmakers as Array<Record<string, unknown>>)?.[0];
			const market = (bookmaker?.markets as Array<Record<string, unknown>>)?.[0];
			const outcomes = (market?.outcomes as Array<{ name: string; price: number }>) ?? [];

			const homeOutcome = outcomes.find((o) => o.name === event.home_team);
			const awayOutcome = outcomes.find((o) => o.name === event.away_team);
			const drawOutcome = outcomes.find((o) => o.name === "Draw");

			return {
				id: event.id as string,
				sport: event.sport_key as string,
				homeTeam: event.home_team as string,
				awayTeam: event.away_team as string,
				commenceTime: event.commence_time as string,
				oddsHome: homeOutcome?.price ?? 0,
				oddsDraw: drawOutcome?.price ?? 0,
				oddsAway: awayOutcome?.price ?? 0,
			};
		});
	}
}

/** Mock provider for development without an API key */
export class MockOddsProvider implements OddsProvider {
	async fetchMatches(): Promise<ProviderMatch[]> {
		return [
			{
				id: "mock_001",
				sport: "soccer_fifa_world_cup",
				homeTeam: "Haiti",
				awayTeam: "Brazil",
				commenceTime: "2026-06-15T18:00:00Z",
				oddsHome: 5.5,
				oddsDraw: 3.8,
				oddsAway: 1.65,
			},
			{
				id: "mock_002",
				sport: "soccer_fifa_world_cup",
				homeTeam: "France",
				awayTeam: "Argentina",
				commenceTime: "2026-06-16T20:00:00Z",
				oddsHome: 2.1,
				oddsDraw: 3.4,
				oddsAway: 3.6,
			},
			{
				id: "mock_003",
				sport: "soccer_fifa_world_cup",
				homeTeam: "Germany",
				awayTeam: "Japan",
				commenceTime: "2026-06-17T15:00:00Z",
				oddsHome: 1.85,
				oddsDraw: 3.5,
				oddsAway: 4.2,
			},
			{
				id: "mock_004",
				sport: "soccer_fifa_world_cup",
				homeTeam: "USA",
				awayTeam: "Mexico",
				commenceTime: "2026-06-18T21:00:00Z",
				oddsHome: 2.4,
				oddsDraw: 3.2,
				oddsAway: 2.9,
			},
			{
				id: "mock_005",
				sport: "soccer_fifa_world_cup",
				homeTeam: "England",
				awayTeam: "Spain",
				commenceTime: "2026-06-19T18:00:00Z",
				oddsHome: 2.75,
				oddsDraw: 3.3,
				oddsAway: 2.6,
			},
		];
	}
}

export function createProvider(apiKey?: string): OddsProvider {
	if (apiKey && apiKey !== "mock") {
		return new TheOddsApiProvider(apiKey);
	}
	return new MockOddsProvider();
}
