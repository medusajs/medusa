import React from "react"
import App from "./App"
import { Providers } from "./providers/providers"
import RouteRegistry from "./registries/route-registry"
import WidgetRegistry from "./registries/widget-registry"
import { ExtensionsEntry } from "./types/extensions"
import { isRouteExtension, isWidgetExtension } from "./utils/extensions"

type MedusaAppConfig = {
  entries?: ExtensionsEntry[]
}

class MedusaApp {
  private widgets: WidgetRegistry = new WidgetRegistry()
  private routes: RouteRegistry = new RouteRegistry()

  constructor({ entries = [] }: MedusaAppConfig) {
    entries.forEach((entry) => {
      const origin = entry.identifier

      entry.extensions.forEach((extension) => {
        if (isRouteExtension(extension)) {
          this.routes.register(origin, extension)
        }

        if (isWidgetExtension(extension)) {
          this.widgets.register(origin, extension)
        }
      })
    })
  }

  render() {
    return (
      <React.StrictMode>
        <Providers widgetRegistry={this.widgets} routeRegistry={this.routes}>
          <App />
        </Providers>
      </React.StrictMode>
    )
  }
}

export default MedusaApp
