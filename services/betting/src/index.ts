import { Hono } from "hono";
import crypto from "node:crypto";

const app = new Hono();

// --- In-memory bet store (MVP, production: PostgreSQL) ---

interface BetRecord {
	betId: string;
	intentId: string;
	userId: string;
	marketId: string;
	selection: "home" | "draw" | "away";
	stakeHtgn: number;
	acceptedOdds: number;
	potentialPayoutHtgn: number;
	status: string;
	txSignature?: string;
	createdAt: string;
	settledAt?: string;
	outcome?: "won" | "lost" | "cancelled";
}

const bets = new Map<string, BetRecord>();
const idempotencyKeys = new Map<string, string>(); // key → betId

/** BET-007: Generate deterministic bet ID */
function generateBetId(userId: string, marketId: string, intentId: string): string {
	const hash = crypto.createHash("sha256").update(`${userId}:${marketId}:${intentId}`).digest("hex");
	return `bet_${hash.slice(0, 16)}`;
}

app.get("/health", (c) => c.json({ status: "ok", service: "betting" }));

/** BET-004: Accept bet intent with idempotency key */
app.post("/intents", async (c) => {
	const body = await c.req.json<{
		userId: string;
		marketId: string;
		selection: "home" | "draw" | "away";
		stakeHtgn: number;
		displayedOdds: number;
		idempotencyKey: string;
	}>();

	// Check idempotency
	const existingBetId = idempotencyKeys.get(body.idempotencyKey);
	if (existingBetId) {
		const existingBet = bets.get(existingBetId);
		return c.json({ betId: existingBetId, bet: existingBet, deduplicated: true });
	}

	// BET-005: Validate
	if (body.stakeHtgn <= 0) {
		return c.json({ error: { code: "INVALID_STAKE", message: "Stake must be positive" } }, 400);
	}
	if (!["home", "draw", "away"].includes(body.selection)) {
		return c.json({ error: { code: "INVALID_SELECTION", message: "Selection must be home, draw, or away" } }, 400);
	}

	// Generate IDs
	const intentId = `int_${crypto.randomUUID().slice(0, 8)}`;
	const betId = generateBetId(body.userId, body.marketId, intentId);
	const potentialPayout = Math.round(body.stakeHtgn * body.displayedOdds * 100) / 100;

	const bet: BetRecord = {
		betId,
		intentId,
		userId: body.userId,
		marketId: body.marketId,
		selection: body.selection,
		stakeHtgn: body.stakeHtgn,
		acceptedOdds: body.displayedOdds,
		potentialPayoutHtgn: potentialPayout,
		status: "confirmed", // MVP: skip relay, go straight to confirmed
		createdAt: new Date().toISOString(),
	};

	bets.set(betId, bet);
	idempotencyKeys.set(body.idempotencyKey, betId);

	return c.json({ betId, bet }, 201);
});

/** Get bet by ID */
app.get("/:betId", (c) => {
	const betId = c.req.param("betId");
	const bet = bets.get(betId);

	if (!bet) {
		return c.json({ error: { code: "NOT_FOUND", message: "Bet not found" } }, 404);
	}

	return c.json({ betId, bet });
});

/** Get all bets for a user */
app.get("/user/:userId", (c) => {
	const userId = c.req.param("userId");
	const userBets = Array.from(bets.values()).filter((b) => b.userId === userId);

	return c.json({
		bets: userBets,
		count: userBets.length,
	});
});

/** Settlement endpoint — called by settlement service */
app.post("/:betId/settle", async (c) => {
	const betId = c.req.param("betId");
	const { result } = await c.req.json<{ result: "home" | "draw" | "away" }>();
	const bet = bets.get(betId);

	if (!bet) {
		return c.json({ error: { code: "NOT_FOUND", message: "Bet not found" } }, 404);
	}

	bet.outcome = bet.selection === result ? "won" : "lost";
	bet.status = bet.outcome;
	bet.settledAt = new Date().toISOString();

	return c.json({ betId, bet });
});

export { app, bets, generateBetId };
