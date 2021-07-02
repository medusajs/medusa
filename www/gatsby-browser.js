import React from "react"
import { ThemeProvider as Provider } from "./src/theme"
import { Global } from "@emotion/react"

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
