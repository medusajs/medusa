import { SearchIndexLoader } from "@medusajs/framework/search"
import { ConfigModule, Logger, PluginDetails } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { join } from "path"

/**
 * Whether the Search Module is registered. It is part of the default modules
 * (Postgres provider), and Cloud may swap that for Lakebase or Medusa Cloud
 * search based on environment variables.
 */
export function isSearchModuleEnabled(configModule: ConfigModule): boolean {
  // `false` is accepted alongside `{ disable: true }`, the same way the module
  // loader reads it.
  const declaration = configModule.modules?.[Modules.SEARCH] as
    | boolean
    | { disable?: boolean }
    | undefined

  if (!declaration) {
    return false
  }

  return declaration === true || !declaration.disable
}

/**
 * Registers the definitions declared under `search/`. `defineSearchIndex` does the
 * registering, so importing the files is all there is to do, and what was
 * registered reaches the Search Module as its `indexes` option — which is why this
 * runs before the app boots.
 */
export async function loadSearchIndexes({
  plugins,
  configModule,
  logger,
}: {
  plugins: PluginDetails[]
  configModule: ConfigModule
  logger: Logger
}): Promise<void> {
  if (!isSearchModuleEnabled(configModule)) {
    return
  }

  const searchSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "search")
  )

  await new SearchIndexLoader(searchSourcePaths, logger).load()
}
