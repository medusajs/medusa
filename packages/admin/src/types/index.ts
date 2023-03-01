export type PluginOptions = {
  /**
   * Determines whether the admin dashboard should be served.
   */
  serve?: boolean
  /**
   * The path to the admin dashboard. Should not be either prefixed or suffixed with a slash.
   * The chosen path cannot be one of the reserved paths: "admin", "store".
   * @default "app"
   */
  path?: string
  /**
   * Backend to use for the admin dashboard. This should only be used if you
   * intend on hosting the dashboard separately from your Medusa server.
   * @default undefined
   */
  backend?: string
  /**
   * The directory to output the build to. By default the plugin will build
   * the dashboard to the `build` directory of the `@medusajs/admin-ui` package.
   * If you intend on hosting the dashboard separately from your Medusa server,
   * you should use this option to specify a custom build directory, that you can
   * deploy to your host of choice.
   * @default undefined
   */
  outDir?: string
}

type PluginObject = {
  resolve: string
  options: Record<string, unknown>
}

export type ConfigModule = {
  plugins: [PluginObject | string]
}
