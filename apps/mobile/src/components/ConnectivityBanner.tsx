import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { type ConnectionStatus, useNetworkState } from "../hooks/useNetworkState";

const BANNER_COLORS: Record<ConnectionStatus, { bg: string; text: string }> = {
	offline: { bg: "#dc2626", text: "#ffffff" },
	limited: { bg: "#FFC600", text: "#1D202E" },
	synced: { bg: "transparent", text: "transparent" },
};

export function ConnectivityBanner() {
	const { status } = useNetworkState();
	const { t } = useTranslation();

	if (status === "synced") {
		return null;
	}

	const colors = BANNER_COLORS[status];
	const label =
		status === "offline" ? t("connectivity.offline") : t("connectivity.limited");

	return (
		<View style={[styles.banner, { backgroundColor: colors.bg }]}>
			<Text style={[styles.text, { color: colors.text }]}>{label}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	banner: {
		paddingVertical: 6,
		paddingHorizontal: 16,
		alignItems: "center",
	},
	text: {
		fontSize: 14,
		fontWeight: "600",
	},
});
