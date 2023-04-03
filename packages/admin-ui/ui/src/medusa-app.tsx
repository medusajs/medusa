import React from "react"
import App from "./App"
import { Providers } from "./providers/providers"

class MedusaApp {
  render() {
    return (
      <React.StrictMode>
        <Providers>
          <App />
        </Providers>
      </React.StrictMode>
    )
  }
}

export default MedusaApp
