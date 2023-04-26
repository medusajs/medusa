import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp from "./medusa-app"

// @ts-ignore file is generated pre-build
import plugins from "./extensions"

async function run() {
  const app = new MedusaApp({ customizations: plugins })

  app.initialize()

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
