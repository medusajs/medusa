import React from "react"
import { createRoot } from "react-dom/client"

const App = () => {
  return <div>Hello world!</div>
}

const rootContainer = document.getElementById("root")
const root = createRoot(rootContainer!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
