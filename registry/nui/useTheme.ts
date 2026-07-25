import { create } from "zustand";
import { nuiConfig } from "@/nui.config";

export type Theme = "light" | "dark";

const STORAGE_KEY = nuiConfig.themeStorageKey;

/** Read the persisted theme, falling back to the configured default. */
function getInitialTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        /* localStorage may be unavailable in some CEF contexts */
    }
    return nuiConfig.defaultTheme;
}

/** Reflect the theme onto <html> (the `.dark` class drives every token + dark: variant) and persist it. */
function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        /* ignore persistence failures */
    }
}

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>((set, get) => ({
    // The inline script in index.html has already set the class; mirror it here.
    theme: getInitialTheme(),
    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },
    toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
    },
}));
