"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type ColorMode = "light" | "dark"

type ColorModeContextType = {
  colorMode: ColorMode
  setColorMode: (value: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType | null>(null)

type ColorModeProviderProps = {
  children: React.ReactNode
}

const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [colorMode, setColorMode] = useState<ColorMode>("light")

  const toggleColorMode = () =>
    setColorMode(colorMode === "light" ? "dark" : "light")

  const init = () => {
    const theme = localStorage.getItem("theme")
    if (theme && (theme === "light" || theme === "dark")) {
      setColorMode(theme)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    if (theme !== colorMode) {
      localStorage.setItem("theme", colorMode)
    }

    document.querySelector("html")?.setAttribute("data-theme", colorMode)
  }, [colorMode])

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode,
        toggleColorMode,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  )
}

export default ColorModeProvider

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error("useColorMode must be used inside a ColorModeProvider")
  }

  return context
}
