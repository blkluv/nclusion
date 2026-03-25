import { describe, expect, it } from "vitest";
import { app } from "./index.js";

describe("balance service", () => {
	it("should return health check", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
	});

	it("should seed new user with 5000 HTGN", async () => {
		const res = await app.request("/usr_new");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.availableHtgn).toBe(5000);
		expect(body.reservedHtgn).toBe(0);
		expect(body.pendingSettlementHtgn).toBe(0);
	});

	it("should reserve funds", async () => {
		const res = await app.request("/usr_reserve/reserve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: 500 }),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.availableHtgn).toBe(4500);
		expect(body.reservedHtgn).toBe(500);
	});

	it("should reject reserve with insufficient balance", async () => {
		const res = await app.request("/usr_broke/reserve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: 99999 }),
		});
		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body.error.code).toBe("INSUFFICIENT_BALANCE");
	});

	it("should release reserved funds", async () => {
		// Reserve first
		await app.request("/usr_release/reserve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: 300 }),
		});

		const res = await app.request("/usr_release/release", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: 300 }),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.availableHtgn).toBe(5000);
		expect(body.reservedHtgn).toBe(0);
	});

	it("should settle with payout (win)", async () => {
		await app.request("/usr_settle/reserve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount: 500 }),
		});

		const res = await app.request("/usr_settle/settle", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ stake: 500, payout: 1250 }),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.availableHtgn).toBe(4500 + 1250);
		expect(body.reservedHtgn).toBe(0);
	});
});
