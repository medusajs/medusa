import { PluginDetails } from "@medusajs/types"
import { glob } from "glob"
import { getResolvedPlugins } from "./resolve-plugins"

/**
 * import files from the workflows directory to run the registration of the wofklows
 * @param pluginDetails
 */
async function registerWorkflows(pluginDetails: PluginDetails): Promise<void> {
  const files = glob.sync(`${pluginDetails.resolve}/workflows/*.js`, {})
  await Promise.all(files.map(async (file) => import(file)))
}

export async function registerProjectWorkflows({
  rootDirectory,
  configModule,
}) {
  const [resolved] =
    getResolvedPlugins(
      rootDirectory,
      configModule,
      configModule.directories?.srcDir ?? "dist",
      true
    ) || []
  await registerWorkflows(resolved)
}
