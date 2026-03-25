import { describe, expect, it } from "vitest";
import { app } from "./index.js";

describe("match-odds service", () => {
	it("should return health check", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.status).toBe("ok");
	});

	it("GET / should return match list with mock data", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.matches).toBeDefined();
		expect(body.matches.length).toBeGreaterThan(0);
		expect(body.matches[0].homeTeam).toBeDefined();
		expect(body.matches[0].oddsHome).toBeGreaterThan(0);
		expect(body.cachedAt).toBeDefined();
	});

	it("GET /:matchId should return match detail", async () => {
		// First get the list to find a valid ID
		const listRes = await app.request("/");
		const list = await listRes.json();
		const matchId = list.matches[0].matchId;

		const res = await app.request(`/${matchId}`);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.match.matchId).toBe(matchId);
		expect(body.market.marketType).toBe("1x2");
	});

	it("GET /:matchId should 404 for unknown match", async () => {
		const res = await app.request("/match_nonexistent");
		expect(res.status).toBe(404);
	});
});
