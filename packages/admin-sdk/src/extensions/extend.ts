import type { Extension, ExtensionConfig } from "@medusajs/types"

export function extend(config: ExtensionConfig): Extension {
  const { identifier, widgets } = config

  return {
    setup(app) {
      if (widgets) {
        app.registerWidgets(identifier, widgets)
      }
    },
  }
}
