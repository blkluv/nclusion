import { describe, expect, it } from "vitest";
import { app } from "./index.js";

const validIntent = {
	userId: "usr_test",
	marketId: "mkt_001",
	selection: "home" as const,
	stakeHtgn: 500,
	displayedOdds: 2.5,
	idempotencyKey: "idem_test_001",
};

describe("betting service", () => {
	it("should return health check", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
	});

	it("should accept a valid bet intent", async () => {
		const res = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(validIntent),
		});
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.betId).toBeDefined();
		expect(body.bet.stakeHtgn).toBe(500);
		expect(body.bet.potentialPayoutHtgn).toBe(1250);
		expect(body.bet.status).toBe("confirmed");
	});

	it("should deduplicate on same idempotency key", async () => {
		const res = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(validIntent),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.deduplicated).toBe(true);
	});

	it("should reject zero stake", async () => {
		const res = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...validIntent, stakeHtgn: 0, idempotencyKey: "idem_zero" }),
		});
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error.code).toBe("INVALID_STAKE");
	});

	it("should get bet by ID", async () => {
		// Place a bet first
		const placeRes = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...validIntent, idempotencyKey: "idem_get_test" }),
		});
		const { betId } = await placeRes.json();

		const res = await app.request(`/${betId}`);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.bet.selection).toBe("home");
	});

	it("should 404 for unknown bet", async () => {
		const res = await app.request("/bet_nonexistent");
		expect(res.status).toBe(404);
	});

	it("should settle a bet as won", async () => {
		const placeRes = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...validIntent, idempotencyKey: "idem_settle_win" }),
		});
		const { betId } = await placeRes.json();

		const settleRes = await app.request(`/${betId}/settle`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ result: "home" }),
		});
		expect(settleRes.status).toBe(200);
		const body = await settleRes.json();
		expect(body.bet.outcome).toBe("won");
	});

	it("should settle a bet as lost", async () => {
		const placeRes = await app.request("/intents", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...validIntent, idempotencyKey: "idem_settle_loss" }),
		});
		const { betId } = await placeRes.json();

		const settleRes = await app.request(`/${betId}/settle`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ result: "away" }),
		});
		expect(settleRes.status).toBe(200);
		const body = await settleRes.json();
		expect(body.bet.outcome).toBe("lost");
	});
});
