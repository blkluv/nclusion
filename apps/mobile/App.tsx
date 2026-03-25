import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ConnectivityBanner } from "./src/components/ConnectivityBanner";
import "./src/i18n";

function App() {
	return (
		<SafeAreaProvider>
			<StatusBar barStyle="light-content" backgroundColor="#141518" />
			<ConnectivityBanner />
			<RootNavigator />
		</SafeAreaProvider>
	);
}

export default App;
