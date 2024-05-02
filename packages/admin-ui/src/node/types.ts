import type { Configuration } from "webpack"

type WebSocketURL = {
  hostname?: string | undefined
  password?: string | undefined
  pathname?: string | undefined
  port?: string | number | undefined
  protocol?: string | undefined
  username?: string | undefined
}

export type DevelopOptions = {
  /**
   * Determines whether the development server should open the admin dashboard
   * in the browser.
   *
   * @default true
   */
  open?: boolean
  /**
   * The host the development server should run on.
   *
   * @default "localhost"
   */
  host?: string
  /**
   * The port the development server should run on.
   * @default 7001
   * */
  port?: number
  /**
   * Determines the log level of the development server.
   * @default "error"
   */
  logLevel?: "error" | "none" | "warn" | "info" | "log" | "verbose"
  /**
   * Determines the verbosity of the development server.
   * @default "normal"
   */
  stats?: "normal" | "debug"
  /**
   * The development server allowed hosts.
   * @default "auto"
   */
  allowedHosts?: "auto" | "all" | string[]
  /**
   * Specifying URL to web socket server
   */
  webSocketURL?: string | WebSocketURL | undefined
}

export type AdminOptions = {
  /**
   * The URL of your Medusa instance.
   *
   * This option will only be used if `serve` is `false`.
   */
  backend?: string
  /**
   * The path to the admin dashboard. The path must be in the format of `/<path>`.
   * The chosen path cannot be one of the reserved paths: "admin", "store".
   * @default "/app"
   */
  path?: string
  /**
   * The directory to output the build to. By default the plugin will build
   * the dashboard to the `build` directory in the root folder.
   * @default undefined
   */
  outDir?: string
  /**
   * Options for the development server.
   */
  develop?: DevelopOptions
}

type BuildReporting = "minimal" | "fancy"

export type WebpackConfigArgs = {
  entry: string
  dest: string
  cacheDir: string
  env: "development" | "production"
  options?: AdminOptions
  template?: string
  publicFolder?: string
  reporting?: BuildReporting
}

export type CustomWebpackConfigArgs = WebpackConfigArgs & {
  devServer?: Configuration["devServer"]
}

type BaseArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
  options?: AdminOptions
}

export type BuildArgs = BaseArgs & {
  reporting?: BuildReporting
}

export type DevelopArgs = BaseArgs
