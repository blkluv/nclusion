import { describe, expect, it } from "vitest";
import { app } from "./app.js";

// Helper to create a valid auth token
function makeToken(userId: string): string {
	return btoa(JSON.stringify({ userId }));
}

describe("gateway health check", () => {
	it("should return ok status without auth", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);

		const body = await res.json();
		expect(body.status).toBe("ok");
		expect(body.service).toBe("gateway");
	});
});

describe("auth middleware", () => {
	it("should reject requests without Authorization header", async () => {
		const res = await app.request("/api/balance");
		expect(res.status).toBe(401);

		const body = await res.json();
		expect(body.error.code).toBe("UNAUTHORIZED");
	});

	it("should reject requests with invalid token", async () => {
		const res = await app.request("/api/balance", {
			headers: { Authorization: "Bearer invalid-not-base64-json" },
		});
		expect(res.status).toBe(401);
	});

	it("should reject tokens without userId", async () => {
		const token = btoa(JSON.stringify({ name: "test" }));
		const res = await app.request("/api/balance", {
			headers: { Authorization: `Bearer ${token}` },
		});
		expect(res.status).toBe(401);
	});

	it("should accept valid token and return stub response", async () => {
		const res = await app.request("/api/balance", {
			headers: { Authorization: `Bearer ${makeToken("usr_001")}` },
		});
		expect(res.status).toBe(200);

		const body = await res.json();
		expect(body.message).toBe("stub");
	});
});

describe("idempotency middleware", () => {
	it("should reject POST without Idempotency-Key", async () => {
		const res = await app.request("/api/betting/intents", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${makeToken("usr_001")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
		expect(res.status).toBe(400);

		const body = await res.json();
		expect(body.error.code).toBe("MISSING_IDEMPOTENCY_KEY");
	});

	it("should accept POST with Idempotency-Key", async () => {
		const res = await app.request("/api/betting/intents", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${makeToken("usr_001")}`,
				"Idempotency-Key": "test-key-001",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
		expect(res.status).toBe(200);
	});

	it("should not require Idempotency-Key on GET", async () => {
		const res = await app.request("/api/matches", {
			headers: { Authorization: `Bearer ${makeToken("usr_001")}` },
		});
		expect(res.status).toBe(200);
	});
});

describe("api route stubs", () => {
	const headers = { Authorization: `Bearer ${makeToken("usr_001")}` };

	it("GET /api/matches returns stub", async () => {
		const res = await app.request("/api/matches", { headers });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.matches).toEqual([]);
	});

	it("GET /api/history returns stub", async () => {
		const res = await app.request("/api/history", { headers });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.bets).toEqual([]);
	});

	it("GET /api/history/:betId returns stub", async () => {
		const res = await app.request("/api/history/bet_001", { headers });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.receipt).toBeNull();
	});
});
