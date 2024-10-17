import { DashboardExtensionManager } from "./extensions"
import { Providers } from "./providers/providers"
import { RouterProvider } from "./providers/router-provider"

// import displayModule from "virtual:medusa/displays"
// import formModule from "virtual:medusa/forms"
// import menuItemModule from "virtual:medusa/menu-items"
// import widgetModule from "virtual:medusa/widgets"

import "./index.css"

function App() {
  const manager = new DashboardExtensionManager({
    displayModule: { displays: {} },
    formModule: { customFields: {} },
    menuItemModule: { menuItems: [] },
    widgetModule: { widgets: [] },
  })

  return (
    <Providers api={manager.api}>
      <RouterProvider />
    </Providers>
  )
}

export default App
