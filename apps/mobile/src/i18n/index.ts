import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ht from "./ht.json";
import fr from "./fr.json";

i18next.use(initReactI18next).init({
	resources: {
		ht: { translation: ht },
		fr: { translation: fr },
	},
	lng: "ht", // Haitian Creole default
	fallbackLng: "ht",
	interpolation: {
		escapeValue: false, // React handles escaping
	},
});

export default i18next;
