import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { app as matchOddsApp } from "@nclusion/match-odds";
import { app as bettingApp } from "@nclusion/betting";
import { app as balanceApp } from "@nclusion/balance";

const app = new Hono();

// --- CORS for web app ---
app.use("/*", cors());

// --- Public routes ---

app.get("/health", (c) => {
	return c.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

// --- API routes (mount service sub-apps) ---

app.use("/api/*", logger());

// Match and odds — public for browsing
app.route("/api/matches", matchOddsApp);

// Betting — accepts intents
app.route("/api/betting", bettingApp);

// Balance — per user
app.route("/api/balance", balanceApp);

export { app };
