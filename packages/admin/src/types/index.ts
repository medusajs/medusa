type DevPluginOptions = {
  /**
   * Determines whether the admin dashboard should be served in development.
   * @default true
   */
  serve?: boolean

  /**
   * The path to the admin dashboard. Should not be prefixed or suffixed with a slash.
   * The chosen path cannot be one of the reserved paths: "admin", "store".
   * @default "app"
   */
  path?: string
}

export type PluginOptions = {
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

  /**
   * The path to the admin dashboard. Should not be prefixed or suffixed with a slash.
   * The chosen path cannot be one of the reserved paths: "admin", "store".
   * @default "app"
   */
  path?: string

  /**
   * The directory to output the build to. By default the plugin will build
   * the dashboard to the `build` directory.
   * @default undefined
   */
  buildDir?: string

  /**
   * Backend to use for the admin dashboard. This should only be used if you
   * intend on hosting the dashboard separately from your Medusa server.
   * @default undefined
   */
  backend?: string

  /**
   * Optional array of paths to include in the build output. This can be used to
   * include host specific assets, such a routing redirects, or additional HTML such
   * as a `200.html` file if that is required by your host.
   *
   * Option is ignored if `outDir` is not specified.
   * @default undefined
   */
  include?: string[]

  /**
   * Optional path for where to place the files specified in the `include` option.
   * Useful if you want to include files in a subdirectory of the build output,
   * such as `/public`.
   *
   * Option is ignored if `outDir` and `include` is not specified.
   */
  includeDist?: string

  /**
   * Development options.
   * @default undefined
   */
  dev?: DevPluginOptions
}

type PluginObject = {
  resolve: string
  options: Record<string, unknown>
}

export type ConfigModule = {
  plugins: [PluginObject | string]
}
