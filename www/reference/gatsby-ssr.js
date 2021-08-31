import React from "react"
import { NavigationProvider } from "./src/context/navigation-context"

export const wrapPageElement = ({ element }) => {
  return <NavigationProvider>{element}</NavigationProvider>
}
