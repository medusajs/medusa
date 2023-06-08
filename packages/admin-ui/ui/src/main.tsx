import ReactDOM from "react-dom/client"
import { ExtensionsEntry } from "../../src/client/types"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"

async function run() {
  let exts: ExtensionsEntry[] = []

  try {
    const extensions = await import(
      /* webpackIgnore: true */
      // @ts-ignore - this file is generated at build time
      "./extensions/_main_entry"
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
