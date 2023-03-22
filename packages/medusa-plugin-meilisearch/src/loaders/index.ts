import { ModulesSdkTypes } from "@medusajs/modules-sdk"
import MeiliSearchService from "../services/meilisearch"
import { MeilisearchPluginOptions } from "../types"

export default async (
  container: ModulesSdkTypes.MedusaContainer,
  options: MeilisearchPluginOptions
) => {
  const logger: ModulesSdkTypes.Logger = container.resolve("logger")

  try {
    const meilisearchService: MeiliSearchService =
      container.resolve("meilisearchService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings || {}).map(async ([indexName, value]) => {
        return await meilisearchService.updateSettings(indexName, value)
      })
    )
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
