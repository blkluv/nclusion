import { open, type DB } from "@op-engineering/op-sqlite";

let db: DB | null = null;

/** Get or create the database connection. */
export function getDatabase(): DB {
	if (!db) {
		db = open({ name: "nclusion.db" });
		// Enable WAL mode for concurrent reads during background sync
		db.execute("PRAGMA journal_mode = WAL;");
		db.execute("PRAGMA foreign_keys = ON;");
	}
	return db;
}

/** Run all pending migrations. */
export function runMigrations(): void {
	const database = getDatabase();

	// Migration version tracking
	database.execute(`
		CREATE TABLE IF NOT EXISTS migrations (
			version INTEGER PRIMARY KEY,
			applied_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);

	const applied = database.execute("SELECT MAX(version) as v FROM migrations;");
	const currentVersion = applied.rows?.[0]?.v ?? 0;

	const migrations = getMigrations();

	for (const migration of migrations) {
		if (migration.version > currentVersion) {
			database.execute(migration.sql);
			database.execute("INSERT INTO migrations (version) VALUES (?);", [migration.version]);
		}
	}
}

interface Migration {
	version: number;
	sql: string;
}

function getMigrations(): Migration[] {
	return [
		{
			version: 1,
			sql: `
				CREATE TABLE IF NOT EXISTS cached_matches (
					match_id TEXT PRIMARY KEY,
					data TEXT NOT NULL,
					fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
					expires_at TEXT NOT NULL
				);

				CREATE TABLE IF NOT EXISTS cached_markets (
					market_id TEXT PRIMARY KEY,
					match_id TEXT NOT NULL,
					data TEXT NOT NULL,
					odds_version INTEGER NOT NULL,
					fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
				);

				CREATE TABLE IF NOT EXISTS cached_bets (
					bet_id TEXT PRIMARY KEY,
					data TEXT NOT NULL,
					status TEXT NOT NULL,
					updated_at TEXT NOT NULL DEFAULT (datetime('now'))
				);

				CREATE TABLE IF NOT EXISTS cached_balance (
					user_id TEXT PRIMARY KEY,
					available_htgn REAL NOT NULL DEFAULT 0,
					reserved_htgn REAL NOT NULL DEFAULT 0,
					pending_settlement_htgn REAL NOT NULL DEFAULT 0,
					updated_at TEXT NOT NULL DEFAULT (datetime('now'))
				);

				CREATE TABLE IF NOT EXISTS pending_intents (
					intent_id TEXT PRIMARY KEY,
					data TEXT NOT NULL,
					created_at TEXT NOT NULL DEFAULT (datetime('now')),
					expires_at TEXT NOT NULL,
					status TEXT NOT NULL DEFAULT 'draft'
				);
			`,
		},
	];
}
