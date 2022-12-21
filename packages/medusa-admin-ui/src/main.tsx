import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

const App = () => {
  return <div className="text-indigo-700 font-bold text-2xl">Hello world!</div>
}

const rootContainer = document.getElementById("root")
const root = createRoot(rootContainer!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
