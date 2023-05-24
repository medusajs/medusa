import { ExtensionsEntry } from "@medusajs/admin-shared"
import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"

async function run() {
  let exts: ExtensionsEntry[] = []

  try {
    // @ts-ignore - this file is generated at build time
    const { default: extensions }: ExtensionsEntry[] = await import(
      "./extensions"
    )
    exts = extensions
  } catch (_) {
    // noop - no extensions
  }

  const app = new MedusaApp({ entries: exts })

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
