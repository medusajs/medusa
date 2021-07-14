import React from "react"
import { ThemeProvider as Provider } from "./src/theme"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    "We have updated the docs site. Reload to display the latest version?"
  )

  if (answer) {
    window.location.reload()
  }
}

export const wrapPageElement = ({ element }) => {
  return <Provider>{element}</Provider>
}
