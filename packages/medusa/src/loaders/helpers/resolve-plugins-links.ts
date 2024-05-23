import { glob } from "glob"
import {
  MedusaContainer,
  ModuleJoinerConfig,
  PluginDetails,
} from "@medusajs/types"
import { isObject } from "@medusajs/utils"

/**
 * import files from the links directory to retrieve the links to be loaded
 * @param plugins
 * @param container
 */
export async function resolvePluginsLinks(
  plugins: PluginDetails[],
  container: MedusaContainer
): Promise<ModuleJoinerConfig[]> {
  const logger = container.resolve("logger") ?? console
  return (
    await Promise.all(
      plugins.map(async (pluginDetails) => {
        const files = glob.sync(
          `${pluginDetails.resolve}/links/*.{ts,js,mjs,mts}`,
          {
            ignore: ["**/*.d.ts", "**/*.map"],
          }
        )
        return (
          await Promise.all(
            files.map(async (file) => {
              const import_ = await import(file)
              if (import_.default && !isObject(import_.default)) {
                logger.warn(
                  `Links file ${file} does not export a default object`
                )
                return
              }

              return import_.default
            })
          )
        ).filter(Boolean)
      })
    )
  ).flat(Infinity)
}
