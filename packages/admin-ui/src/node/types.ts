import type { Configuration } from "webpack"

export type AdminOptions = {
  backend?: string
  path?: string
  outDir?: string
}

type BuildReporting = "minimal" | "fancy"

export type WebpackConfigArgs = {
  entry: string
  dest: string
  cacheDir: string
  env: "development" | "production"
  options?: AdminOptions
  template?: string
  reporting?: BuildReporting
}

export type CustomWebpackConfigArgs = WebpackConfigArgs & {
  devServer?: Configuration["devServer"]
}

export type BuildArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
  options?: AdminOptions
  reporting?: BuildReporting
}

export type DevelopArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
  open?: boolean
  port?: number
  options?: AdminOptions
}
