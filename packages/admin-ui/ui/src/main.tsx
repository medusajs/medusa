import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"
import { ExtensionsEntry } from "./types/extensions"
import "./i18n"

async function run() {
  let exts: ExtensionsEntry[] = []

  try {
    const { default: extensions } = (await import(
      // @ts-ignore - this file is generated at build time
      "./extensions/_main-entry.ts"
    )) as { default: ExtensionsEntry[] }
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
