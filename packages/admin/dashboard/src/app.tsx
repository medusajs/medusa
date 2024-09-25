import "./index.css"
import { MedusaApp } from "./medusa-app"
import { Providers } from "./providers/providers"
import { RouterProvider } from "./providers/router-provider"

type AppProps = {
  getMenu: MedusaApp["getMenu"]
  getWidgets: MedusaApp["getWidgets"]
}

function App({ getMenu, getWidgets }: AppProps) {
  return (
    <Providers getMenu={getMenu} getWidgets={getWidgets}>
      <RouterProvider />
    </Providers>
  )
}

export default App
