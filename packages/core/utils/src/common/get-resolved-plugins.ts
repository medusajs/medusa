import { ConfigModule, PluginDetails } from "@zjedene-medusa/types"
import fs from "fs/promises"
import path from "path"
import { isString } from "./is-string"
import { readDir } from "./read-dir-recursive"

const MEDUSA_APP_SOURCE_PATH = "src"
const MEDUSA_PLUGIN_SOURCE_PATH = ".medusa/server/src"
const MEDUSA_PLUGIN_OPTIONS_FILE_PATH =
  ".medusa/server/medusa-plugin-options.json"
export const MEDUSA_PROJECT_NAME = "project-plugin"

function createPluginId(name: string): string {
  return name
}

function createFileContentHash(path: string, files: string): string {
  return path + files
}

/**
 * Returns the absolute path to the package.json file for a
 * given plugin identifier.
 */
async function resolvePluginPkgFile(
  rootDirectory: string,
  pluginPath: string
): Promise<{ path: string; contents: any }> {
  try {
    const pkgJSONPath = require.resolve(path.join(pluginPath, "package.json"), {
      paths: [rootDirectory],
    })
    const packageJSONContents = JSON.parse(
      await fs.readFile(pkgJSONPath, "utf-8")
    )
    return { path: pkgJSONPath, contents: packageJSONContents }
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" || error.code === "ENOENT") {
      throw new Error(
        `Unable to resolve plugin "${pluginPath}". Make sure the plugin directory has a package.json file`
      )
    }
    throw error
  }
}

/**
 * Reads the "medusa-plugin-options.json" file from the plugin root
 * directory and returns its contents as an object.
 */
async function resolvePluginOptions(
  pluginRootDir: string
): Promise<Record<string, any>> {
  try {
    const contents = await fs.readFile(
      path.join(pluginRootDir, MEDUSA_PLUGIN_OPTIONS_FILE_PATH),
      "utf-8"
    )
    return JSON.parse(contents)
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" || error.code === "ENOENT") {
      return {}
    }
    throw error
  }
}

/**
 * Finds the correct path for the plugin. If it is a local plugin it will be
 * found in the plugins folder. Otherwise we will look for the plugin in the
 * installed npm packages.
 * @param {string} pluginPath - the name of the plugin to find. Should match
 *    the name of the folder where the plugin is contained.
 * @return {object} the plugin details
 */
async function resolvePlugin(
  rootDirectory: string,
  pluginPath: string,
  options?: any
): Promise<PluginDetails> {
  const pkgJSON = await resolvePluginPkgFile(rootDirectory, pluginPath)
  const resolvedPath = path.dirname(pkgJSON.path)

  const name = pkgJSON.contents.name || pluginPath

  const resolve = path.join(resolvedPath, MEDUSA_PLUGIN_SOURCE_PATH)
  const pluginStaticOptions = await resolvePluginOptions(resolvedPath)
  const modules = await readDir(path.join(resolve, "modules"), {
    ignoreMissing: true,
  })
  const pluginOptions = options ?? {}

  const hasAdmin =
    !!pkgJSON.contents.exports?.["./admin"] || !!pluginStaticOptions.srcDir
  const isAdminLocal = hasAdmin && !!pluginStaticOptions.srcDir

  const adminConfig = hasAdmin
    ? {
        type: isAdminLocal ? ("local" as const) : ("package" as const),
        resolve: path.posix.join(
          isAdminLocal ? pluginStaticOptions.srcDir : name,
          "admin"
        ),
      }
    : undefined

  return {
    resolve,
    name,
    id: createPluginId(name),
    options: pluginOptions,
    version: pkgJSON.contents.version || "0.0.0",
    admin: adminConfig,
    modules: modules.map((mod) => {
      return {
        resolve: `${pluginPath}/${MEDUSA_PLUGIN_SOURCE_PATH}/modules/${mod.name}`,
        options: pluginOptions,
      }
    }),
  }
}

export async function getResolvedPlugins(
  rootDirectory: string,
  configModule: ConfigModule,
  isMedusaProject = false
): Promise<PluginDetails[]> {
  const resolved = await Promise.all(
    (configModule?.plugins || []).map(async (plugin) => {
      if (isString(plugin)) {
        return resolvePlugin(rootDirectory, plugin)
      }
      return resolvePlugin(rootDirectory, plugin.resolve, plugin.options)
    })
  )

  if (isMedusaProject) {
    const extensionDirectory = path.join(rootDirectory, MEDUSA_APP_SOURCE_PATH)
    resolved.push({
      resolve: extensionDirectory,
      name: MEDUSA_PROJECT_NAME,
      id: createPluginId(MEDUSA_PROJECT_NAME),
      admin: {
        type: "local",
        resolve: path.join(extensionDirectory, "admin"),
      },
      options: configModule,
      version: createFileContentHash(process.cwd(), `**`),
    })
  }

  return resolved
}
