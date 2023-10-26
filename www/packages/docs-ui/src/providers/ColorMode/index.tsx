"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ColorMode = "light" | "dark"

export type ColorModeContextType = {
  colorMode: ColorMode
  setColorMode: (value: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType | null>(null)

export type ColorModeProviderProps = {
  children: React.ReactNode
}

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [colorMode, setColorMode] = useState<ColorMode>("light")
  const [loaded, setLoaded] = useState(false)

  const toggleColorMode = () =>
    setColorMode(colorMode === "light" ? "dark" : "light")

  useEffect(() => {
    if (loaded) {
      return
    }

    const theme = localStorage.getItem("theme")
    if (theme && (theme === "light" || theme === "dark")) {
      setColorMode(theme)
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", colorMode)
  }, [colorMode])

  useEffect(() => {
    if (!loaded) {
      return
    }

    const theme = localStorage.getItem("theme")
    if (theme !== colorMode) {
      localStorage.setItem("theme", colorMode)
    }
  }, [loaded, colorMode])

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

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error("useColorMode must be used inside a ColorModeProvider")
  }

  return context
}
