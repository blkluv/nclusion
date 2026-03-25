import { create } from "zustand";

interface AppState {
	/** Current user ID (null if not logged in). */
	userId: string | null;
	/** Current language. */
	language: "ht" | "fr";
	/** Set user after login. */
	setUserId: (userId: string | null) => void;
	/** Switch language. */
	setLanguage: (language: "ht" | "fr") => void;
}

export const useAppStore = create<AppState>((set) => ({
	userId: null,
	language: "ht",
	setUserId: (userId) => set({ userId }),
	setLanguage: (language) => set({ language }),
}));
