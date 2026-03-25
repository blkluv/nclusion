import { Hono } from "hono";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth.js";
import { idempotencyMiddleware } from "./middleware/idempotency.js";
import { rateLimitMiddleware } from "./middleware/rate-limit.js";

const app = new Hono();

// --- Public routes (no auth) ---

app.get("/health", (c) => {
	return c.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

// --- Global middleware ---

app.use("/api/*", logger());
app.use("/api/*", rateLimitMiddleware);
app.use("/api/*", idempotencyMiddleware);
app.use("/api/*", authMiddleware);

// --- Authenticated API routes (service stubs) ---

app.get("/api/matches", (c) => {
	return c.json({ matches: [], message: "stub" });
});

app.get("/api/matches/:id", (c) => {
	return c.json({ match: null, message: "stub" });
});

app.post("/api/betting/intents", (c) => {
	return c.json({ intentId: null, message: "stub" });
});

app.get("/api/betting/:betId", (c) => {
	return c.json({ bet: null, message: "stub" });
});

app.get("/api/balance", (c) => {
	return c.json({ balance: null, message: "stub" });
});

app.get("/api/history", (c) => {
	return c.json({ bets: [], message: "stub" });
});

app.get("/api/history/:betId", (c) => {
	return c.json({ receipt: null, message: "stub" });
});

export { app };
