import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("gateway health check", () => {
	it("should return ok status", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.status).toBe("ok");
		expect(body.service).toBe("gateway");
	});
});

describe("api routes", () => {
	it("GET /api/matches returns match list", async () => {
		const res = await app.request("/api/matches");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.matches).toBeDefined();
		expect(body.matches.length).toBeGreaterThan(0);
	});

	it("GET /api/matches/:id returns match detail", async () => {
		const listRes = await app.request("/api/matches");
		const list = await listRes.json();
		const matchId = list.matches[0].matchId;

		const res = await app.request(`/api/matches/${matchId}`);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.match.matchId).toBe(matchId);
	});

	it("GET /api/balance/:userId returns balance", async () => {
		const res = await app.request("/api/balance/usr_test");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.availableHtgn).toBe(5000);
	});

	it("POST /api/betting/intents places a bet", async () => {
		const res = await app.request("/api/betting/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: "usr_gw_test",
				marketId: "mkt_001",
				selection: "home",
				stakeHtgn: 100,
				displayedOdds: 2.5,
				idempotencyKey: "gw_test_001",
			}),
		});
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.betId).toBeDefined();
		expect(body.bet.status).toBe("confirmed");
	});
});
