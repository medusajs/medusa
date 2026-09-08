import type {
  PluginDetails,
  ConfigModule,
  InputConfigModules,
} from "@medusajs/types"
import { transformModules } from "./define-config"

/**
 * Mutates the configModules object and merges the plugin modules with
 * the modules defined inside the user-config file
 */
export function mergePluginModules(
  configModule: ConfigModule,
  plugins: PluginDetails[],
  /**
   * Root directory of the Medusa application. The modules exposed by a plugin
   * are referenced by a bare specifier, so they have to be resolved from the
   * application and not from wherever `@medusajs/utils` was hoisted to.
   */
  rootDirectory: string = process.cwd()
) {
  /**
   * Create a flat array of all the modules exposed by the registered
   * plugins
   */
  const pluginsModules = plugins.reduce((result, plugin) => {
    if (plugin.modules) {
      result = result.concat(plugin.modules)
    }
    return result
  }, [] as InputConfigModules)

  /**
   * Merge plugin modules with the modules defined within the
   * config file.
   */
  configModule.modules = {
    ...transformModules(pluginsModules, rootDirectory),
    ...configModule.modules,
  }
}
