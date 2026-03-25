import type { Context, Next } from "hono";

/**
 * Simple JWT auth middleware.
 * Validates Bearer token from Authorization header.
 * Sets `userId` on the context variable for downstream handlers.
 *
 * For MVP: uses a simple JWT verification.
 * Production: replace with proper JWT library + key rotation.
 */
export async function authMiddleware(c: Context, next: Next) {
	const authHeader = c.req.header("Authorization");

	if (!authHeader?.startsWith("Bearer ")) {
		return c.json({ error: { code: "UNAUTHORIZED", message: "Missing or invalid token" } }, 401);
	}

	const token = authHeader.slice(7);

	try {
		// MVP: decode a simple base64-encoded JSON payload
		// Production: use proper JWT verification with jose or similar
		const payload = JSON.parse(atob(token));

		if (!payload.userId || typeof payload.userId !== "string") {
			return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid token payload" } }, 401);
		}

		c.set("userId", payload.userId);
		await next();
	} catch {
		return c.json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } }, 401);
	}
}
