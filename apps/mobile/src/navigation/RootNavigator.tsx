import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabs } from "./MainTabs";
import { MatchDetailScreen } from "../screens/MatchDetailScreen";
import { BetSlipScreen } from "../screens/BetSlipScreen";
import { ConfirmBetScreen } from "../screens/ConfirmBetScreen";
import { ReceiptScreen } from "../screens/ReceiptScreen";

export type RootStackParamList = {
	MainTabs: undefined;
	MatchDetail: { matchId: string };
	BetSlip: { matchId: string; selection: "home" | "draw" | "away"; odds: number };
	ConfirmBet: {
		matchId: string;
		selection: "home" | "draw" | "away";
		odds: number;
		stake: number;
	};
	Receipt: { betId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					animation: "slide_from_right",
				}}
			>
				<Stack.Screen name="MainTabs" component={MainTabs} />
				<Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
				<Stack.Screen name="BetSlip" component={BetSlipScreen} />
				<Stack.Screen name="ConfirmBet" component={ConfirmBetScreen} />
				<Stack.Screen name="Receipt" component={ReceiptScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
