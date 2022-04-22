import "./index.css"

import DarkMode from "../icons/dark-mode"
import LightMode from "../icons/light-mode"
import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { useColorMode } from 'theme-ui'

export default function ColorModeToggler () {
  const [colorMode, setColorMode] = useColorMode()
  
  return (
    <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <button onClick={() => {
            const mode = theme == 'dark' ? 'light' : 'dark';
            toggleTheme(mode);
            setColorMode(mode);
          }} className="dark-mode-toggler">
            {theme == "light" && <LightMode />}
            {theme == "dark" && <DarkMode />}
          </button>
        )}
    </ThemeToggler>
  )
}