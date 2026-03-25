import { Hono } from "hono";

const app = new Hono();

/**
 * BAL-001: In-memory balance model (MVP)
 * Production: backed by PostgreSQL via Drizzle
 */
const balances = new Map<
	string,
	{
		availableHtgn: number;
		reservedHtgn: number;
		pendingSettlementHtgn: number;
	}
>();

export function getBalance(userId: string) {
	if (!balances.has(userId)) {
		// Demo: seed new users with 5000 HTGN
		balances.set(userId, { availableHtgn: 5000, reservedHtgn: 0, pendingSettlementHtgn: 0 });
	}
	return balances.get(userId)!;
}

app.get("/health", (c) => c.json({ status: "ok", service: "balance" }));

/** Get user balance breakdown */
app.get("/:userId", (c) => {
	const userId = c.req.param("userId");
	const balance = getBalance(userId);
	return c.json({ userId, ...balance, lastReconciledAt: new Date().toISOString() });
});

/** BET-006: Reserve funds for a bet */
app.post("/:userId/reserve", async (c) => {
	const userId = c.req.param("userId");
	const { amount } = await c.req.json<{ amount: number }>();
	const balance = getBalance(userId);

	if (amount <= 0) {
		return c.json(
			{ error: { code: "INVALID_AMOUNT", message: "Amount must be positive" } },
			400,
		);
	}
	if (balance.availableHtgn < amount) {
		return c.json(
			{ error: { code: "INSUFFICIENT_BALANCE", message: "Not enough HTGN available" } },
			400,
		);
	}

	balance.availableHtgn -= amount;
	balance.reservedHtgn += amount;

	return c.json({ userId, reserved: amount, ...balance });
});

/** Release reserved funds (bet failed/cancelled) */
app.post("/:userId/release", async (c) => {
	const userId = c.req.param("userId");
	const { amount } = await c.req.json<{ amount: number }>();
	const balance = getBalance(userId);

	balance.reservedHtgn = Math.max(0, balance.reservedHtgn - amount);
	balance.availableHtgn += amount;

	return c.json({ userId, released: amount, ...balance });
});

/** SET-004: Settle — credit winnings or remove loss */
app.post("/:userId/settle", async (c) => {
	const userId = c.req.param("userId");
	const { stake, payout } = await c.req.json<{ stake: number; payout: number }>();
	const balance = getBalance(userId);

	balance.reservedHtgn = Math.max(0, balance.reservedHtgn - stake);
	if (payout > 0) {
		balance.availableHtgn += payout;
	}

	return c.json({ userId, settled: true, payout, ...balance });
});

export { app };
