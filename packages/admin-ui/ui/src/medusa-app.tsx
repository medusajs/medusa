import React from "react"
import App from "./App"
import KitchenSink from "./providers/kitchen-sink"

class MedusaApp {
  render() {
    return (
      <React.StrictMode>
        <KitchenSink>
          <App />
        </KitchenSink>
      </React.StrictMode>
    )
  }
}

export default MedusaApp
