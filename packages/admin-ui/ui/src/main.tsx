import { Customization } from "@medusajs/types"
import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"

async function run() {
  let ext: Customization[] = []

  try {
    // @ts-ignore - this file is generated at build time
    const { default: extensions } = await import("./extensions")
    ext = extensions
  } catch (_) {
    // noop - no extensions
  }

  const app = new MedusaApp({ customizations: ext })

  app.initialize()

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
