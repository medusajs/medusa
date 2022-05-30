import "./index.css"

import DarkMode from "../icons/dark-mode"
import LightMode from "../icons/light-mode"
import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { useColorMode } from 'theme-ui'

export default function ColorModeToggler () {
  const [, setColorMode] = useColorMode()

  function checkLocalStorage (currentTheme, toggleTheme) {
    //check that theme local storage values are set correctly
    let themeUiColorMode = window.localStorage.getItem('theme-ui-color-mode');
    let theme = window.localStorage.getItem('theme')
    if (!themeUiColorMode) {
      themeUiColorMode = theme || currentTheme
      window.localStorage.setItem('theme-ui-color-mode', themeUiColorMode);
      setColorMode(themeUiColorMode);
    }
    if (!theme) {
      theme = themeUiColorMode || currentTheme
      window.localStorage.setItem('theme', theme);
      toggleTheme(theme)
    }

    return theme || themeUiColorMode || currentTheme;
  }
  
  return (
    <ThemeToggler>
        {({ theme, toggleTheme }) => {
          const currentTheme = checkLocalStorage(theme, toggleTheme);
          return (
            <button onClick={() => {
              const mode = currentTheme === 'dark' ? 'light' : 'dark';
              toggleTheme(mode);
              setColorMode(mode);
            }} className="dark-mode-toggler">
              {currentTheme === "light" && <LightMode />}
              {currentTheme === "dark" && <DarkMode />}
            </button>
          );
        }}
    </ThemeToggler>
  )
}