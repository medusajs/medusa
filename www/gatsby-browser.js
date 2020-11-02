import React from "react"
import { ThemeProvider as Provider } from "./src/theme"

export const wrapPageElement = ({ element }) => {
  return <Provider>{element}</Provider>
}
