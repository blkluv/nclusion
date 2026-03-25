import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { WalletScreen } from "../screens/WalletScreen";

export type MainTabParamList = {
	Home: undefined;
	History: undefined;
	Wallet: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#141518",
					borderTopColor: "rgb(55, 65, 81)",
				},
				tabBarActiveTintColor: "#FFC600",
				tabBarInactiveTintColor: "rgb(156, 163, 175)",
			}}
		>
			<Tab.Screen name="Home" component={HomeScreen} options={{ title: "Akèy" }} />
			<Tab.Screen name="History" component={HistoryScreen} options={{ title: "Istwa" }} />
			<Tab.Screen name="Wallet" component={WalletScreen} options={{ title: "Bous" }} />
		</Tab.Navigator>
	);
}
