import { getConfigFile } from "medusa-core-utils"
import { reporter } from "../reporter"
import { AdminPluginOptions } from "../types"

type PluginObject = {
  resolve: string
  options: Record<string, unknown>
}

type ConfigModule = {
  plugins: [PluginObject | string]
}

type ReturnGetConfigFile =
  | {
      configModule: ConfigModule
      configFilePath: string
    }
  | {
      error: Error
    }

export function loadConfig(rootDir?: string) {
  const root = rootDir || process.cwd()

  const config = getConfigFile(root, "medusa-config") as ReturnGetConfigFile

  if (getConfigFailed(config)) {
    reporter.error(config.error.message)
    return
  }

  const { configModule } = config

  let options: AdminPluginOptions = {
    serve: true,
    serve_dev: true,
    path: "/app/",
  }

  const plugin = configModule.plugins.find(
    (p) =>
      (typeof p === "string" && p === "@medusajs/admin") ||
      (typeof p === "object" && p.resolve === "@medusajs/admin")
  )

  if (!plugin) {
    return null
  }

  if (hasOptions(plugin)) {
    const valid = validateOptions(plugin.options)

    if (!valid) {
      reporter.error("Invalid options in medusa-config")
      return null
    }

    options = {
      ...options,
      ...plugin.options,
    }
  }

  return options
}

function getConfigFailed(
  config: ReturnGetConfigFile
): config is { error: any } {
  return (config as { error: Error }).error !== undefined
}

function hasOptions(plugin: PluginObject | string): plugin is PluginObject {
  return typeof plugin === "object"
}

function validateOptions(options: Record<string, unknown>) {
  return Object.keys(options).every((key) => {
    return ["serve", "serve_dev", "base", "backend_url"].includes(key)
  })
}
