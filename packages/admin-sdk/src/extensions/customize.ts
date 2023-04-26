import type { Customization, CustomizationConfig } from "@medusajs/types"

export function customize(config: CustomizationConfig): Customization {
  const { identifier, widgets } = config

  return {
    setup(app) {
      if (widgets) {
        app.registerWidgets(identifier, widgets)
      }
    },
  }
}
