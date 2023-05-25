import {
  ExtensionsEntry,
  isPageExtension,
  isWidgetExtension,
  PageRegistry,
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
  private pages: PageRegistry = new PageRegistry()

  constructor({ entries = [] }: MedusaAppConfig) {
    entries.forEach((entry) => {
      const origin = entry.identifier

      entry.extensions.forEach((extension) => {
        if (isPageExtension(extension)) {
          this.pages.registerPage(origin, extension)
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
        <Providers widgetRegistry={this.widgets} pageRegistry={this.pages}>
          <App />
        </Providers>
      </React.StrictMode>
    )
  }
}

export default MedusaApp
