import { Extension } from "@medusajs/types"
import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"

async function run() {
  let exts: Extension[] = []

  try {
    // @ts-ignore - this file is generated at build time
    const { default: extensions }: Extension[] = await import("./extensions")
    exts = extensions
  } catch (_) {
    // noop - no extensions
  }

  const app = new MedusaApp({ extensions: exts })

  app.initialize()

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
