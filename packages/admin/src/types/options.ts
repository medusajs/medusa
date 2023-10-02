import type { AdminOptions } from "@medusajs/admin-ui"

export type PluginOptions = AdminOptions & {
  /**
   * Determines whether the admin dashboard should be served.
   */
  serve?: boolean

  /**
   * Re-build the admin automatically when options have changed since the last server start.
   * Be aware that building the dashboard is a memory intensive process. Therefore, this option should
   * only be used in production if your server has the memory required to support it.
   *
   * Only used if `serve` is `true`.
   * @default false
   */
  autoRebuild?: boolean
}

export type BuildOptions = AdminOptions & {
  deployment?: boolean
}
