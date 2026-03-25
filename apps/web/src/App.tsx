import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { ConnectivityBanner } from "./components/ConnectivityBanner";
import { BetScreen } from "./screens/BetScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { WalletScreen } from "./screens/WalletScreen";

export function App() {
	return (
		<>
			<ConnectivityBanner />
			<Header />
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/bet" element={<BetScreen />} />
				<Route path="/history" element={<HistoryScreen />} />
				<Route path="/wallet" element={<WalletScreen />} />
			</Routes>
			<TabBar />
		</>
	);
}
