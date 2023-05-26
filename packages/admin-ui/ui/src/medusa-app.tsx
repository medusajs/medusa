import {
  ExtensionsEntry,
  isNestedRouteExtension,
  isRouteExtension,
  isWidgetExtension,
  RouteRegistry,
  WidgetRegistry,
} from "@medusajs/admin-shared"
import React from "react"
import App from "./App"
import { Providers } from "./providers/providers"

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
          this.routes.registerRoute(origin, extension)
        }

        if (isNestedRouteExtension(extension)) {
          this.routes.registerNestedRoute(origin, extension)
        }

        if (isWidgetExtension(extension)) {
          this.widgets.registerWidget(origin, extension)
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
