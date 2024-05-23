import { ConfigModule, PluginDetails } from "@medusajs/types"
import { isString } from "@medusajs/utils"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import { createRequireFromPath } from "medusa-core-utils"
import path from "path"

export const MEDUSA_PROJECT_NAME = "project-plugin"
function createPluginId(name: string): string {
  return name
}

function createFileContentHash(path, files): string {
  return path + files
}

/**
 * Finds the correct path for the plugin. If it is a local plugin it will be
 * found in the plugins folder. Otherwise we will look for the plugin in the
 * installed npm packages.
 * @param {string} pluginName - the name of the plugin to find. Should match
 *    the name of the folder where the plugin is contained.
 * @return {object} the plugin details
 */
function resolvePlugin(pluginName: string): {
  resolve: string
  id: string
  name: string
  options: Record<string, unknown>
  version: string
} {
  // Only find plugins when we're not given an absolute path
  if (!existsSync(pluginName)) {
    // Find the plugin in the local plugins folder
    const resolvedPath = path.resolve(`./plugins/${pluginName}`)

    if (existsSync(resolvedPath)) {
      if (existsSync(`${resolvedPath}/package.json`)) {
        const packageJSON = JSON.parse(
          fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
        )
        const name = packageJSON.name || pluginName
        // warnOnIncompatiblePeerDependency(name, packageJSON)

        return {
          resolve: resolvedPath,
          name,
          id: createPluginId(name),
          options: {},
          version:
            packageJSON.version || createFileContentHash(resolvedPath, `**`),
        }
      } else {
        // Make package.json a requirement for local plugins too
        throw new Error(`Plugin ${pluginName} requires a package.json file`)
      }
    }
  }

  const rootDir = path.resolve(".")

  /**
   *  Here we have an absolute path to an internal plugin, or a name of a module
   *  which should be located in node_modules.
   */
  try {
    const requireSource =
      rootDir !== null
        ? createRequireFromPath(`${rootDir}/:internal:`)
        : require

    // If the path is absolute, resolve the directory of the internal plugin,
    // otherwise resolve the directory containing the package.json
    const resolvedPath = path.dirname(
      requireSource.resolve(`${pluginName}/package.json`)
    )

    const packageJSON = JSON.parse(
      fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
    )
    // warnOnIncompatiblePeerDependency(packageJSON.name, packageJSON)

    const computedResolvedPath =
      resolvedPath + (process.env.DEV_MODE ? "/src" : "")

    // Add support for a plugin to output the build into a dist directory
    const resolvedPathToDist = resolvedPath + "/dist"
    const isDistExist =
      resolvedPathToDist &&
      !process.env.DEV_MODE &&
      existsSync(resolvedPath + "/dist")

    return {
      resolve: isDistExist ? resolvedPathToDist : computedResolvedPath,
      id: createPluginId(packageJSON.name),
      name: packageJSON.name,
      options: {},
      version: packageJSON.version,
    }
  } catch (err) {
    throw new Error(
      `Unable to find plugin "${pluginName}". Perhaps you need to install its package?`
    )
  }
}

export function getResolvedPlugins(
  rootDirectory: string,
  configModule: ConfigModule,
  isMedusaProject = false
): undefined | PluginDetails[] {
  if (isMedusaProject) {
    /**
     * Grab directory for loading resources inside a starter kit from
     * the medusa-config file.
     *
     * When using ts-node we will read resources from "src" directory
     * otherwise from "dist" directory.
     */
    const extensionDirectoryPath = process[
      Symbol.for("ts-node.register.instance")
    ]
      ? "src"
      : "dist"
    const extensionDirectory = path.join(rootDirectory, extensionDirectoryPath)
    return [
      {
        resolve: extensionDirectory,
        name: MEDUSA_PROJECT_NAME,
        id: createPluginId(MEDUSA_PROJECT_NAME),
        options: configModule,
        version: createFileContentHash(process.cwd(), `**`),
      },
    ]
  }

  const extensionDirectoryPath = "dist"
  const resolved = configModule?.plugins.map((plugin) => {
    if (isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  const extensionDirectory = path.join(rootDirectory, extensionDirectoryPath)
  // Resolve user's project as a plugin for loading purposes
  resolved.push({
    resolve: extensionDirectory,
    name: MEDUSA_PROJECT_NAME,
    id: createPluginId(MEDUSA_PROJECT_NAME),
    options: configModule,
    version: createFileContentHash(process.cwd(), `**`),
  })

  return resolved
}
