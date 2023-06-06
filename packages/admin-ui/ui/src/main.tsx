import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import { getExtensions, loadExtensions } from "./dynamic-extensions"
import MedusaApp from "./medusa-app"

async function run() {
  await loadExtensions()

  const exts = getExtensions()

  const app = new MedusaApp({ entries: exts })

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
