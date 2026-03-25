import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";

interface Match {
	matchId: string;
	homeTeam: string;
	awayTeam: string;
	startTime: string;
	status: string;
	competition: string;
	oddsHome: number;
	oddsDraw: number;
	oddsAway: number;
}

interface Balance {
	availableHtgn: number;
	reservedHtgn: number;
	pendingSettlementHtgn: number;
}

export function HomeScreen() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [matches, setMatches] = useState<Match[]>([]);
	const [balance, setBalance] = useState<Balance | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			try {
				const [matchData, balanceData] = await Promise.all([
					api.getMatches(),
					api.getBalance("usr_demo"),
				]);
				setMatches(matchData.matches);
				setBalance(balanceData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load");
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	function formatTime(iso: string) {
		return new Date(iso).toLocaleDateString("en", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function handleOddsClick(match: Match, selection: "home" | "draw" | "away", odds: number) {
		navigate(`/bet?matchId=${match.matchId}&selection=${selection}&odds=${odds}&home=${encodeURIComponent(match.homeTeam)}&away=${encodeURIComponent(match.awayTeam)}`);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-400">{t("general.loading")}</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="px-4 mt-4">
				<div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
					<p className="text-red-400">{error}</p>
					<button type="button" onClick={() => window.location.reload()} className="mt-2 text-gold text-sm font-semibold">
						{t("general.try_again")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 pb-20">
			{/* Balance card */}
			{balance && (
				<div className="bg-dark-card border border-gray-700 rounded-lg p-4 mt-4">
					<p className="text-gray-400 text-sm mb-1">{t("balance.available")}</p>
					<p className="text-gold text-3xl font-bold">
						{balance.availableHtgn.toLocaleString("en", { minimumFractionDigits: 2 })}{" "}
						<span className="text-lg">HTGN</span>
					</p>
					<div className="flex gap-4 mt-3 text-sm">
						<div>
							<span className="text-gray-400">{t("balance.in_active_bets")}: </span>
							<span className="text-white">{balance.reservedHtgn.toFixed(2)}</span>
						</div>
						<div>
							<span className="text-gray-400">{t("balance.pending_settlement")}: </span>
							<span className="text-white">{balance.pendingSettlementHtgn.toFixed(2)}</span>
						</div>
					</div>
				</div>
			)}

			{/* Matches */}
			<h2 className="text-white font-bold text-lg mt-6 mb-3">Matches</h2>
			<div className="space-y-3">
				{matches.map((match) => (
					<div key={match.matchId} className="bg-dark-card border border-gray-700 rounded-lg p-4">
						<div className="flex justify-between items-center mb-3">
							<span className="text-white font-semibold">
								{match.homeTeam} <span className="text-gray-400">vs</span> {match.awayTeam}
							</span>
							<span className="text-gray-400 text-sm">{formatTime(match.startTime)}</span>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<button
								type="button"
								onClick={() => handleOddsClick(match, "home", match.oddsHome)}
								className="bg-dark-navy border border-gray-700 rounded-lg py-2 text-center hover:border-gold active:bg-gold/10 transition-colors"
							>
								<div className="text-gray-400 text-xs mb-1">{t("bet.home_win")}</div>
								<div className="text-white font-bold">{match.oddsHome.toFixed(2)}</div>
							</button>
							<button
								type="button"
								onClick={() => handleOddsClick(match, "draw", match.oddsDraw)}
								className="bg-dark-navy border border-gray-700 rounded-lg py-2 text-center hover:border-gold active:bg-gold/10 transition-colors"
							>
								<div className="text-gray-400 text-xs mb-1">{t("bet.draw")}</div>
								<div className="text-white font-bold">{match.oddsDraw.toFixed(2)}</div>
							</button>
							<button
								type="button"
								onClick={() => handleOddsClick(match, "away", match.oddsAway)}
								className="bg-dark-navy border border-gray-700 rounded-lg py-2 text-center hover:border-gold active:bg-gold/10 transition-colors"
							>
								<div className="text-gray-400 text-xs mb-1">{t("bet.away_win")}</div>
								<div className="text-white font-bold">{match.oddsAway.toFixed(2)}</div>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
