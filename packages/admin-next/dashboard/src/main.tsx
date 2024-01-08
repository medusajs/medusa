import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app.js"
import "./i18n/config.js"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
