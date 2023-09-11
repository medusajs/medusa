"use client"

import { Moon, Sun } from "@medusajs/icons"
import { Button } from "@medusajs/ui"
import { useTheme } from "next-themes"
import * as React from "react"

import { useMatchMedia } from "@/hooks/use-match-media"

const ModeToggle = () => {
  const { setTheme, theme } = useTheme()

  const isDarkMode = React.useMemo(() => theme === "dark", [theme])

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const isMobileView = useMatchMedia("(max-width: 1024px)")

  return (
    <Button
      variant={isMobileView ? "transparent" : "secondary"}
      format={"icon"}
      onClick={toggleTheme}
    >
      {isDarkMode ? (
        <Moon className="text-ui-fg-muted" />
      ) : (
        <Sun className="text-ui-fg-muted" />
      )}
    </Button>
  )
}

export { ModeToggle }
