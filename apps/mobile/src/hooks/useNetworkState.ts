import { useEffect, useState } from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export type ConnectionStatus = "offline" | "limited" | "synced";

export function useNetworkState() {
	const [status, setStatus] = useState<ConnectionStatus>("synced");
	const [details, setDetails] = useState<NetInfoState | null>(null);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setDetails(state);

			if (!state.isConnected) {
				setStatus("offline");
			} else if (
				state.isInternetReachable === false ||
				(state.type === "cellular" &&
					state.details?.cellularGeneration &&
					["2g", "3g"].includes(state.details.cellularGeneration))
			) {
				setStatus("limited");
			} else {
				setStatus("synced");
			}
		});

		return () => unsubscribe();
	}, []);

	return { status, details, isOffline: status === "offline" };
}
