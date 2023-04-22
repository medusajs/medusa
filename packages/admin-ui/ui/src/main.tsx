import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import MedusaApp, { Components, Library } from "./medusa-app"

// @ts-ignore file is generated pre-build
import plugins from "./extensions"

const library: Library = {
  components: new Components(),
}

async function run() {
  const app = new MedusaApp({ library, plugins: [] })

  if (plugins) {
    console.log(JSON.stringify(plugins, null, 2))
  }

  await app.initialize()

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
