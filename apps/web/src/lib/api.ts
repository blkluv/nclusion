const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: { message: res.statusText } }));
		throw new Error(error.error?.message || `API error: ${res.status}`);
	}

	return res.json();
}

export const api = {
	getMatches: () => request<{
		matches: Array<{
			matchId: string;
			homeTeam: string;
			awayTeam: string;
			startTime: string;
			status: string;
			competition: string;
			oddsHome: number;
			oddsDraw: number;
			oddsAway: number;
		}>;
		cachedAt: string;
	}>("/api/matches"),

	getMatch: (matchId: string) => request<{
		match: { matchId: string; homeTeam: string; awayTeam: string; startTime: string; status: string; competition: string };
		market: { marketId: string; oddsHome: number; oddsDraw: number; oddsAway: number; oddsVersion: number };
	}>(`/api/matches/${matchId}`),

	getBalance: (userId: string) => request<{
		userId: string;
		availableHtgn: number;
		reservedHtgn: number;
		pendingSettlementHtgn: number;
	}>(`/api/balance/${userId}`),

	placeBet: (data: {
		userId: string;
		marketId: string;
		selection: "home" | "draw" | "away";
		stakeHtgn: number;
		displayedOdds: number;
		idempotencyKey: string;
	}) => request<{
		betId: string;
		bet: {
			betId: string;
			selection: string;
			stakeHtgn: number;
			acceptedOdds: number;
			potentialPayoutHtgn: number;
			status: string;
			createdAt: string;
		};
	}>("/api/betting/intents", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Idempotency-Key": data.idempotencyKey },
	}),

	getUserBets: (userId: string) => request<{
		bets: Array<{
			betId: string;
			selection: string;
			stakeHtgn: number;
			potentialPayoutHtgn: number;
			status: string;
			createdAt: string;
			outcome?: string;
		}>;
	}>(`/api/betting/user/${userId}`),
};
