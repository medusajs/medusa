import { createContext } from "react"

export type ThemeOption = "light" | "dark" | "system"
export type ThemeValue = "light" | "dark"

type ThemeContextValue = {
  theme: ThemeOption
  setTheme: (theme: ThemeOption) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
