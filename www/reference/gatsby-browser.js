import React from "react"
import { NavigationProvider } from "./src/context/navigation-context"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    "We have updated the docs site. Reload to display the latest version?"
  )

  if (answer) {
    window.location.reload()
  }
}

export const wrapPageElement = ({ element }) => {
  return <NavigationProvider>{element}</NavigationProvider>
}
