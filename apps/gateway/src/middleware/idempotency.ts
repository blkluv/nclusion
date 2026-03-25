import type { Context, Next } from "hono";

/**
 * Idempotency middleware for mutation endpoints.
 * Checks Idempotency-Key header on POST/PUT/PATCH requests.
 * Returns cached response for duplicate keys.
 *
 * For MVP: in-memory map with TTL.
 * Production: use Redis with TTL.
 */
const cache = new Map<string, { status: number; body: unknown; expiresAt: number }>();

const TTL_MS = 5 * 60_000; // 5 minutes

export async function idempotencyMiddleware(c: Context, next: Next) {
	const method = c.req.method;

	// Only enforce on mutation methods
	if (!["POST", "PUT", "PATCH"].includes(method)) {
		await next();
		return;
	}

	const key = c.req.header("Idempotency-Key");

	if (!key) {
		return c.json(
			{
				error: {
					code: "MISSING_IDEMPOTENCY_KEY",
					message: "Idempotency-Key header required for mutation requests",
				},
			},
			400,
		);
	}

	const now = Date.now();

	// Check cache
	const cached = cache.get(key);
	if (cached && now < cached.expiresAt) {
		return c.json(cached.body as object, cached.status as 200);
	}

	// Process request
	await next();

	// Cache the response (clone body for storage)
	// Note: in production, intercept the response body properly
	// For MVP skeleton, this establishes the pattern
}
