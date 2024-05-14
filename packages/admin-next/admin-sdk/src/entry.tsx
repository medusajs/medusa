import App from "@medusajs/dashboard"
import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

const container = document.getElementById("app")
const root = createRoot(container!)
root.render(<App />)