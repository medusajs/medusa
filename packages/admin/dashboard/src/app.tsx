import config from "virtual:medusa/config"
import { MedusaApp } from "./core/medusa-app/medusa-app"
import { Providers } from "./providers/providers"
import { RouterProvider } from "./providers/router-provider"

import "./index.css"

function App() {
  const app = new MedusaApp({ config })

  return (
    <Providers api={app.api}>
      <RouterProvider />
    </Providers>
  )
}

export default App
