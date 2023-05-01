import fse from "fs-extra"
import path from "path"

export const getLocalExtensions = async () => {
  const entry = path.resolve(process.cwd(), "dist", "admin", "index.js")

  const hasLocalEntry = await fse.pathExists(entry)

  if (!hasLocalEntry) {
    return null
  }

  return entry
}

export const getPluginExtensions = async (): Promise<string[] | undefined> => {
  const config = path.resolve(process.cwd(), "medusa-config.js")

  const hasConfig = await fse.pathExists(config)

  if (!hasConfig) {
    return null
  }

  const { plugins } = require(config) as {
    plugins: ({ resolve: string; options: Record<string, unknown> } | string)[]
  }

  if (!plugins) {
    return null
  }

  const pluginPaths = plugins.map((p) => {
    if (typeof p === "string") {
      return p
    }

    return p.resolve
  })

  const pluginPathsResolved = pluginPaths.map((p) => {
    return path.resolve(process.cwd(), "node_modules", p)
  })

  const pluginExtensions = await Promise.all(
    pluginPathsResolved.map(async (p) => {
      const entry = path.resolve(p, "dist", "admin", "index.js")

      const hasEntry = await fse.pathExists(entry)

      if (!hasEntry) {
        return null
      }

      return entry
    })
  )

  return pluginExtensions.filter((p) => p !== null) as string[]
}

export const getExtensions = async () => {
  const localExtensions = await getLocalExtensions()
  const pluginExtensions = await getPluginExtensions()

  if (!localExtensions && !pluginExtensions) {
    return null
  }

  return [localExtensions, ...pluginExtensions]
}
