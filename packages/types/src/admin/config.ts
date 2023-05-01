import { Application } from "./application"
import { WidgetsConfig } from "./widget"

export type ExtensionConfig = {
  /**
   * A unique identifier for the customization configuration, used to differentiate it from other customization sources.
   * It is recommended to use the name of the package where the customization configuration is defined, for example, `my-medusa-plugin`.
   */
  identifier: string
  /**
   * The configuration for custom widgets in the admin panel.
   * Define your own widgets here to use in the admin panel.
   */
  widgets?: WidgetsConfig
}

export type Extension = {
  setup(app: Application): void
}
