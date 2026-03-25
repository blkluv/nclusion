import type { Context, Next } from "hono";

/**
 * Simple in-memory rate limiter.
 * Limits requests per IP within a sliding window.
 *
 * For MVP: in-memory map. Resets on server restart.
 * Production: use Redis or similar distributed store.
 */
const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export async function rateLimitMiddleware(c: Context, next: Next) {
	const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
	const now = Date.now();

	const entry = requests.get(ip);

	if (!entry || now > entry.resetAt) {
		requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		await next();
		return;
	}

	if (entry.count >= MAX_REQUESTS) {
		return c.json(
			{ error: { code: "RATE_LIMITED", message: "Too many requests. Try again later." } },
			429,
		);
	}

	entry.count++;
	await next();
}
