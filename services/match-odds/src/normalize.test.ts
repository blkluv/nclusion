import { describe, expect, it } from "vitest";
import type { ProviderMatch } from "./provider.js";
import { normalizeMatches } from "./normalize.js";

const mockProvider: ProviderMatch[] = [
	{
		id: "test_001",
		sport: "soccer_fifa_world_cup",
		homeTeam: "Haiti",
		awayTeam: "Brazil",
		commenceTime: "2026-06-15T18:00:00Z",
		oddsHome: 5.5,
		oddsDraw: 3.8,
		oddsAway: 1.65,
	},
];

describe("normalizeMatches", () => {
	it("should normalize provider data into matches and markets", () => {
		const { matches, markets } = normalizeMatches(mockProvider);

		expect(matches).toHaveLength(1);
		expect(markets).toHaveLength(1);

		expect(matches[0].matchId).toBe("match_test_001");
		expect(matches[0].homeTeam).toBe("Haiti");
		expect(matches[0].awayTeam).toBe("Brazil");
		expect(matches[0].competition).toBe("FIFA World Cup 2026");

		expect(markets[0].marketId).toBe("mkt_test_001");
		expect(markets[0].matchId).toBe("match_test_001");
		expect(markets[0].marketType).toBe("1x2");
		expect(markets[0].oddsHome).toBe(5.5);
		expect(markets[0].oddsDraw).toBe(3.8);
		expect(markets[0].oddsAway).toBe(1.65);
	});

	it("should set upcoming status for future matches", () => {
		const { matches } = normalizeMatches(mockProvider);
		expect(matches[0].status).toBe("upcoming");
	});

	it("should increment odds version", () => {
		const { markets: first } = normalizeMatches(mockProvider);
		const { markets: second } = normalizeMatches(mockProvider);
		expect(second[0].oddsVersion).toBeGreaterThan(first[0].oddsVersion);
	});
});
