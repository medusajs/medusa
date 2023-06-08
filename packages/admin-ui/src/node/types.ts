import type { Configuration } from "webpack"

export type AdminOptions = {
  backend?: string
  publicPath?: string
}

export type WebpackConfigArgs = {
  entry: string
  dest: string
  cacheDir: string
  env: "development" | "production"
  options?: AdminOptions
}

export type CustomWebpackConfigArgs = WebpackConfigArgs & {
  devServer?: Configuration["devServer"]
}
