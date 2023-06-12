export type PluginOptions = {
  /**
   * Determines whether the admin dashboard should be served.
   */
  serve?: boolean

  /**
   * The path to the admin dashboard. The path must be in the format of `/<path>`.
   * The chosen path cannot be one of the reserved paths: "admin", "store".
   * @default "/app"
   */
  path?: string

  /**
   * The URL of your Medusa instance.
   *
   * This option will only be used if `serve` is `false`.
   */
  backend?: string

  /**
   * The directory to output the build to. By default the plugin will build
   * the dashboard to the `build` directory in the root folder.
   * @default undefined
   */
  outDir?: string

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
