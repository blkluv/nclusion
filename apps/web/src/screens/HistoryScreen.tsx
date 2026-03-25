import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";

interface Bet {
	betId: string;
	selection: string;
	stakeHtgn: number;
	potentialPayoutHtgn: number;
	status: string;
	createdAt: string;
	outcome?: string;
}

const STATUS_COLORS: Record<string, string> = {
	confirmed: "bg-green-900/30 text-green-400 border-green-700",
	won: "bg-green-900/30 text-green-400 border-green-700",
	lost: "bg-red-900/30 text-red-400 border-red-700",
	processing: "bg-blue-900/30 text-blue-400 border-blue-700",
	cancelled: "bg-gray-800 text-gray-400 border-gray-700",
	failed: "bg-red-900/30 text-red-400 border-red-700",
};

export function HistoryScreen() {
	const { t } = useTranslation();
	const [bets, setBets] = useState<Bet[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getUserBets("usr_demo")
			.then((data) => setBets(data.bets))
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="px-4 pb-20">
			<h1 className="text-white font-bold text-2xl mt-4 mb-4">{t("nav.history")}</h1>

			{loading && <p className="text-gray-400 text-center mt-8">{t("general.loading")}</p>}

			{!loading && bets.length === 0 && (
				<div className="bg-dark-card border border-gray-700 rounded-lg p-8 text-center">
					<p className="text-gray-400">No bets yet</p>
					<p className="text-gray-400 text-sm mt-1">Place your first bet!</p>
				</div>
			)}

			<div className="space-y-3">
				{bets.map((bet) => (
					<div key={bet.betId} className="bg-dark-card border border-gray-700 rounded-lg p-4">
						<div className="flex justify-between items-center mb-2">
							<span className="text-white font-semibold capitalize">{bet.selection}</span>
							<span
								className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[bet.status] || "bg-gray-800 text-gray-400 border-gray-700"}`}
							>
								{t(`status.${bet.status}`, bet.status)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-400">
								{t("bet.stake")}: <span className="text-white">{bet.stakeHtgn.toFixed(2)} HTGN</span>
							</span>
							<span className="text-gray-400">
								{t("bet.potential_payout")}:{" "}
								<span className="text-gold">{bet.potentialPayoutHtgn.toFixed(2)} HTGN</span>
							</span>
						</div>
						<p className="text-gray-400 text-xs mt-2">
							{new Date(bet.createdAt).toLocaleString()}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
