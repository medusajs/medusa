import path from "node:path"
import type { Plugin } from "vite"

interface ResolvePluginsOptions {
  plugins?: string[]
}

const ADMIN_EXPORT_SUFFIX = "/admin"

function resolvePluginPkgFile(plugin: string): string | undefined {
  const pkgName = plugin.endsWith(ADMIN_EXPORT_SUFFIX)
    ? plugin.slice(0, -ADMIN_EXPORT_SUFFIX.length)
    : plugin

  try {
    return require.resolve(path.posix.join(pkgName, "package.json"), {
      paths: [process.cwd()],
    })
  } catch (_e) {
    return undefined
  }
}

export const resolvePlugins = (options: ResolvePluginsOptions): Plugin => {
  const plugins = new Set(options.plugins ?? [])

  return {
    name: "medusa:resolve-plugins",
    // Only reached when Vite can't resolve the plugin from the project, e.g. a
    // plugin installed as a dependency of @medusajs/medusa in a pnpm project.
    async resolveId(source, _importer, resolveOptions) {
      if (!plugins.has(source)) {
        return null
      }

      const pkgFile = resolvePluginPkgFile(source)
      if (!pkgFile) {
        return null
      }

      return await this.resolve(source, pkgFile, {
        ...resolveOptions,
        skipSelf: true,
      })
    },
  }
}
