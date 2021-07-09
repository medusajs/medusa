import React from "react"
import { ThemeProvider as Provider } from "./src/theme"
import { Global } from "@emotion/react"

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    "We have updated the docs site. Reload to display the latest version?"
  )

  if (answer) {
    window.location.reload()
  }
}

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Global
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
        }}
      />
      <Provider>{element}</Provider>
    </>
  )
}
