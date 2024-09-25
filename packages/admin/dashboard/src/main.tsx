import config from "virtual:medusa/extensions"
import { render } from "./render.js"

render(document.getElementById("root")!, {
  config,
})

if (import.meta.hot) {
  import.meta.hot.accept()
}
