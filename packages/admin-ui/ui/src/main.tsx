import ReactDOM from "react-dom/client"
import "./assets/styles/global.css"
import { plugins } from "./extensions"
import MedusaApp, { Components, Library } from "./medusa-app"

const library: Library = {
  components: new Components(),
}

// const plugin: Plugin = {
//   id: "test-plugin",
//   extension: {
//     async register(app) {
//       app.injectComponent("order", "details", {
//         name: "test-component",
//         Component: () => {
//           return (
//             <div>
//               <h1>Test component</h1>
//               <div>I am a injected component</div>
//             </div>
//           )
//         },
//       })
//     },
//   },
// }

async function run() {
  const app = new MedusaApp({ library, plugins: plugins })

  await app.initialize()

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    app.render()
  )
}

run()
