export type PluginOptions = {
  serve?: boolean
  path?: string
  build?: {
    backend: string
    outDir?: string
  }
  dev?: {
    autoOpen?: boolean
  }
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
