import { glob } from "glob"
import { PluginDetails } from "@medusajs/types"

/**
 * import files from the workflows directory to run the registration of the wofklows
 * @param pluginDetails
 */
export async function registerWorkflows(
  plugins: PluginDetails[]
): Promise<void> {
  await Promise.all(
    plugins.map(async (pluginDetails) => {
      const files = glob.sync(
        `${pluginDetails.resolve}/workflows/*(.js|.ts|.mjs)`,
        {}
      )
      return Promise.all(files.map(async (file) => import(file)))
    })
  )
}
