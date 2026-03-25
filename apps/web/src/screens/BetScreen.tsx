import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";

export function BetScreen() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [stake, setStake] = useState("");
	const [placing, setPlacing] = useState(false);
	const [result, setResult] = useState<{ betId: string; payout: number } | null>(null);
	const [error, setError] = useState<string | null>(null);

	const matchId = params.get("matchId") || "";
	const selection = (params.get("selection") || "home") as "home" | "draw" | "away";
	const odds = Number(params.get("odds")) || 0;
	const homeTeam = params.get("home") || "";
	const awayTeam = params.get("away") || "";

	const stakeNum = Number(stake) || 0;
	const payout = Math.round(stakeNum * odds * 100) / 100;

	const selectionLabels: Record<string, string> = {
		home: `${t("bet.home_win")} — ${homeTeam}`,
		draw: t("bet.draw"),
		away: `${t("bet.away_win")} — ${awayTeam}`,
	};

	async function handlePlaceBet() {
		if (stakeNum <= 0) return;
		setPlacing(true);
		setError(null);

		try {
			const data = await api.placeBet({
				userId: "usr_demo",
				marketId: `mkt_${matchId.replace("match_", "")}`,
				selection,
				stakeHtgn: stakeNum,
				displayedOdds: odds,
				idempotencyKey: `idem_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			});
			setResult({ betId: data.betId, payout: data.bet.potentialPayoutHtgn });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to place bet");
		} finally {
			setPlacing(false);
		}
	}

	if (result) {
		return (
			<div className="px-4 pb-20 mt-4">
				<div className="bg-dark-card border border-gold/50 rounded-lg p-6 text-center">
					<div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
						<span className="text-3xl">✓</span>
					</div>
					<h2 className="text-gold text-xl font-bold mb-2">{t("status.confirmed")}</h2>
					<p className="text-gray-300 mb-4">
						{selectionLabels[selection]} — {odds.toFixed(2)}
					</p>
					<div className="bg-dark-navy rounded-lg p-4 mb-4">
						<div className="flex justify-between mb-2">
							<span className="text-gray-400">{t("bet.stake")}</span>
							<span className="text-white font-bold">{stakeNum.toFixed(2)} HTGN</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">{t("bet.potential_payout")}</span>
							<span className="text-gold font-bold">{result.payout.toFixed(2)} HTGN</span>
						</div>
					</div>
					<p className="text-gray-400 text-xs mb-4">ID: {result.betId}</p>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="w-full bg-gold text-dark-navy font-bold py-3 rounded-lg"
					>
						{t("nav.home")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 pb-20 mt-4">
			{/* Back button */}
			<button type="button" onClick={() => navigate(-1)} className="text-gold text-sm mb-4">
				← Back
			</button>

			{/* Match info */}
			<div className="bg-dark-card border border-gray-700 rounded-lg p-4 mb-4">
				<p className="text-white font-semibold">
					{homeTeam} <span className="text-gray-400">vs</span> {awayTeam}
				</p>
				<p className="text-gold font-bold mt-2">{selectionLabels[selection]}</p>
				<p className="text-gray-400 text-sm">
					{t("bet.accepted_odds")}: <span className="text-white">{odds.toFixed(2)}</span>
				</p>
			</div>

			{/* Stake input */}
			<div className="mb-4">
				<label className="text-gray-400 text-sm block mb-2">{t("bet.stake")} (HTGN)</label>
				<input
					type="number"
					value={stake}
					onChange={(e) => setStake(e.target.value)}
					placeholder="0.00"
					className="w-full bg-dark-navy border border-gray-700 rounded-lg px-4 py-3 text-white text-lg font-bold focus:border-gold outline-none transition-colors"
				/>
			</div>

			{/* Payout preview */}
			{stakeNum > 0 && (
				<div className="bg-dark-navy border border-gray-700 rounded-lg p-4 mb-6">
					<div className="flex justify-between mb-2">
						<span className="text-gray-400">{t("bet.stake")}</span>
						<span className="text-white">{stakeNum.toFixed(2)} HTGN</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-400">{t("bet.potential_payout")}</span>
						<span className="text-gold font-bold">{payout.toFixed(2)} HTGN</span>
					</div>
				</div>
			)}

			{error && (
				<div className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4 text-center">
					<p className="text-red-400 text-sm">{error}</p>
				</div>
			)}

			{/* Confirm button */}
			<button
				type="button"
				onClick={handlePlaceBet}
				disabled={stakeNum <= 0 || placing}
				className="w-full bg-gold text-dark-navy font-bold py-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
			>
				{placing ? t("general.loading") : t("bet.confirm_bet")}
			</button>
		</div>
	);
}
