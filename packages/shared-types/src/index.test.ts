import { describe, expect, it } from "vitest";
import {
	BalanceViewSchema,
	BetIntentSchema,
	BetRecordSchema,
	BetStatus,
	MarketSchema,
	MarketType,
	MatchSchema,
	Selection,
	SettlementRecordSchema,
	UserFacingStatus,
	UserSchema,
} from "./index.js";

describe("enums", () => {
	it("should have all bet statuses", () => {
		expect(BetStatus.INTENT_CREATED).toBe("intent_created");
		expect(BetStatus.CHAIN_CONFIRMED).toBe("chain_confirmed");
		expect(BetStatus.SETTLEMENT_CONFIRMED).toBe("settlement_confirmed");
	});

	it("should have all user-facing statuses", () => {
		expect(UserFacingStatus.DRAFT).toBe("draft");
		expect(UserFacingStatus.WON).toBe("won");
		expect(UserFacingStatus.FAILED).toBe("failed");
	});

	it("should have all selections", () => {
		expect(Selection.HOME).toBe("home");
		expect(Selection.DRAW).toBe("draw");
		expect(Selection.AWAY).toBe("away");
	});

	it("should have market type", () => {
		expect(MarketType.ONE_X_TWO).toBe("1x2");
	});
});

describe("UserSchema", () => {
	it("should validate a valid user", () => {
		const user = {
			userId: "usr_abc123",
			phoneOrIdentityRef: "+50937001234",
			languagePreference: "ht",
			managedWalletId: "wal_xyz789",
			status: "active",
		};
		expect(UserSchema.parse(user)).toEqual(user);
	});

	it("should reject invalid language", () => {
		expect(() =>
			UserSchema.parse({
				userId: "usr_abc",
				phoneOrIdentityRef: "+509",
				languagePreference: "en",
				managedWalletId: "wal_1",
				status: "active",
			}),
		).toThrow();
	});
});

describe("MatchSchema", () => {
	it("should validate a valid match", () => {
		const match = {
			matchId: "match_001",
			competition: "FIFA World Cup 2026",
			homeTeam: "Haiti",
			awayTeam: "Brazil",
			startTime: "2026-06-15T18:00:00Z",
			status: "upcoming",
		};
		expect(MatchSchema.parse(match)).toEqual(match);
	});
});

describe("MarketSchema", () => {
	it("should validate a valid market", () => {
		const market = {
			marketId: "mkt_001",
			matchId: "match_001",
			marketType: "1x2",
			oddsHome: 3.5,
			oddsDraw: 3.2,
			oddsAway: 2.1,
			oddsVersion: 1,
			expiresAt: "2026-06-15T17:55:00Z",
		};
		expect(MarketSchema.parse(market)).toEqual(market);
	});

	it("should reject negative odds", () => {
		expect(() =>
			MarketSchema.parse({
				marketId: "mkt_001",
				matchId: "match_001",
				marketType: "1x2",
				oddsHome: -1,
				oddsDraw: 3.2,
				oddsAway: 2.1,
				oddsVersion: 1,
				expiresAt: "2026-06-15T17:55:00Z",
			}),
		).toThrow();
	});
});

describe("BetIntentSchema", () => {
	it("should validate a valid bet intent", () => {
		const intent = {
			intentId: "int_001",
			userId: "usr_abc",
			marketId: "mkt_001",
			selection: "home",
			stakeHtgn: 500,
			displayedOdds: 3.5,
			idempotencyKey: "idem_abc123",
			clientCreatedAt: "2026-06-15T17:50:00Z",
			submissionExpiry: "2026-06-15T17:55:00Z",
		};
		expect(BetIntentSchema.parse(intent)).toEqual(intent);
	});

	it("should reject zero stake", () => {
		expect(() =>
			BetIntentSchema.parse({
				intentId: "int_001",
				userId: "usr_abc",
				marketId: "mkt_001",
				selection: "home",
				stakeHtgn: 0,
				displayedOdds: 3.5,
				idempotencyKey: "idem_abc123",
				clientCreatedAt: "2026-06-15T17:50:00Z",
				submissionExpiry: "2026-06-15T17:55:00Z",
			}),
		).toThrow();
	});
});

describe("BetRecordSchema", () => {
	it("should validate a valid bet record", () => {
		const bet = {
			betId: "bet_001",
			intentId: "int_001",
			userId: "usr_abc",
			acceptedOdds: 3.5,
			stakeHtgn: 500,
			potentialPayoutHtgn: 1750,
			status: "chain_confirmed",
		};
		expect(BetRecordSchema.parse(bet)).toEqual(bet);
	});
});

describe("BalanceViewSchema", () => {
	it("should validate a valid balance view", () => {
		const balance = {
			userId: "usr_abc",
			availableHtgn: 1000,
			reservedHtgn: 500,
			pendingSettlementHtgn: 0,
			lastReconciledAt: "2026-06-15T18:00:00Z",
		};
		expect(BalanceViewSchema.parse(balance)).toEqual(balance);
	});

	it("should reject negative balances", () => {
		expect(() =>
			BalanceViewSchema.parse({
				userId: "usr_abc",
				availableHtgn: -100,
				reservedHtgn: 0,
				pendingSettlementHtgn: 0,
				lastReconciledAt: "2026-06-15T18:00:00Z",
			}),
		).toThrow();
	});
});

describe("SettlementRecordSchema", () => {
	it("should validate a valid settlement record", () => {
		const settlement = {
			settlementId: "set_001",
			matchId: "match_001",
			providerResult: "home",
			status: "confirmed",
		};
		expect(SettlementRecordSchema.parse(settlement)).toEqual(settlement);
	});
});
