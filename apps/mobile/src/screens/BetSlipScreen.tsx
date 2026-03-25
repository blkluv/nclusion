import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function BetSlipScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>BetSlipScreen</Text>
			<Text style={styles.subtitle}>Placeholder — populated in Phase 2</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#141518",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: "#FFC600",
		fontSize: 24,
		fontWeight: "700",
	},
	subtitle: {
		color: "rgb(209, 213, 219)",
		fontSize: 16,
		marginTop: 8,
	},
});
