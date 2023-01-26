export type PluginOptions = {
  serve?: boolean
  base?: string
}

export type BuildOptions = {
  base?: string
  appDir?: string
  outDir?: string
}

export type CleanOptions = {
  appDir: string
  outDir: string
}

type PluginObject = {
  resolve: string
  options: Record<string, unknown>
}

export type ConfigModule = {
  plugins: [PluginObject | string]
}
