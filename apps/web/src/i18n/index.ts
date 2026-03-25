import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";
import ht from "./ht.json";

i18next.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		ht: { translation: ht },
		fr: { translation: fr },
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: { escapeValue: false },
});

export default i18next;
