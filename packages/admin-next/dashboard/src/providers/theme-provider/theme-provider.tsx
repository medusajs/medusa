import { PropsWithChildren, useEffect, useState } from "react"
import { Theme, ThemeContext } from "./theme-context"

const THEME_KEY = "medusa_admin_theme"

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<Theme>(
    (localStorage?.getItem(THEME_KEY) as Theme) || "light"
  )

  const setTheme = (theme: Theme) => {
    localStorage.setItem(THEME_KEY, theme)
    setState(theme)
  }

  useEffect(() => {
    const html = document.querySelector("html")
    if (html) {
      /**
       * Temporarily disable transitions to prevent
       * the theme change from flashing.
       */
      const css = document.createElement("style")
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`
        )
      )
      document.head.appendChild(css)

      html.classList.remove(state === "light" ? "dark" : "light")
      html.classList.add(state)

      /**
       * Re-enable transitions after the theme has been set,
       * and force the browser to repaint.
       */
      window.getComputedStyle(css).opacity
      document.head.removeChild(css)
    }
  }, [state])

  return (
    <ThemeContext.Provider value={{ theme: state, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
