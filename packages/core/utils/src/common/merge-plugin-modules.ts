import type {
  PluginDetails,
  ConfigModule,
  InputConfigModules,
} from "@zjedene-medusa/types"
import { transformModules } from "./define-config"

/**
 * Mutates the configModules object and merges the plugin modules with
 * the modules defined inside the user-config file
 */
export function mergePluginModules(
  configModule: ConfigModule,
  plugins: PluginDetails[]
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
    ...transformModules(pluginsModules),
    ...configModule.modules,
  }
}
