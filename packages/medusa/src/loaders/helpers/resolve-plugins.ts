import { ConfigModule, PluginDetails } from "@medusajs/framework/types"
import { isString } from "@medusajs/framework/utils"
import fs from "fs"
import { sync as existsSync } from "fs-exists-cached"
import path, { isAbsolute } from "path"

export const MEDUSA_PROJECT_NAME = "project-plugin"
function createPluginId(name: string): string {
  return name
}

function createFileContentHash(path, files): string {
  return path + files
}

function getExtensionDirectoryPath() {
  return "src"
}

/**
 * Load plugin details from a path. Return undefined if does not contains a package.json
 * @param pluginName
 * @param path
 * @param includeExtensionDirectoryPath should include src | dist for the resolved details
 */
function loadPluginDetails({
  pluginName,
  resolvedPath,
  includeExtensionDirectoryPath,
}: {
  pluginName: string
  resolvedPath: string
  includeExtensionDirectoryPath?: boolean
}) {
  if (existsSync(`${resolvedPath}/package.json`)) {
    const packageJSON = JSON.parse(
      fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
    )
    const name = packageJSON.name || pluginName

    const extensionDirectoryPath = getExtensionDirectoryPath()
    const resolve = includeExtensionDirectoryPath
      ? path.join(resolvedPath, extensionDirectoryPath)
      : resolvedPath

    return {
      resolve,
      name,
      id: createPluginId(name),
      options: {},
      version: packageJSON.version || createFileContentHash(path, `**`),
    }
  }

  // Make package.json a requirement for local plugins too
  throw new Error(`Plugin ${pluginName} requires a package.json file`)
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
  if (!isAbsolute(pluginName)) {
    let resolvedPath = path.resolve(`./plugins/${pluginName}`)
    const doesExistsInPlugin = existsSync(resolvedPath)

    if (doesExistsInPlugin) {
      return loadPluginDetails({
        pluginName,
        resolvedPath,
      })
    }

    // Find the plugin in the file system
    resolvedPath = path.resolve(pluginName)
    const doesExistsInFileSystem = existsSync(resolvedPath)

    if (doesExistsInFileSystem) {
      return loadPluginDetails({
        pluginName,
        resolvedPath,
        includeExtensionDirectoryPath: true,
      })
    }

    throw new Error(`Unable to find the plugin "${pluginName}".`)
  }

  try {
    // If the path is absolute, resolve the directory of the internal plugin,
    // otherwise resolve the directory containing the package.json
    const resolvedPath = require.resolve(pluginName, {
      paths: [process.cwd()],
    })

    const packageJSON = JSON.parse(
      fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`)
    )

    const computedResolvedPath = path.join(resolvedPath, "dist")

    return {
      resolve: computedResolvedPath,
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
  const resolved = configModule?.plugins?.map((plugin) => {
    if (isString(plugin)) {
      return resolvePlugin(plugin)
    }

    const details = resolvePlugin(plugin.resolve)
    details.options = plugin.options

    return details
  })

  if (isMedusaProject) {
    const extensionDirectoryPath = getExtensionDirectoryPath()
    const extensionDirectory = path.join(rootDirectory, extensionDirectoryPath)
    resolved.push({
      resolve: extensionDirectory,
      name: MEDUSA_PROJECT_NAME,
      id: createPluginId(MEDUSA_PROJECT_NAME),
      options: configModule,
      version: createFileContentHash(process.cwd(), `**`),
    })
  }

  return resolved
}
