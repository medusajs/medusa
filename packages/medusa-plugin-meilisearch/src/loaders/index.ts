import { Logger, MedusaContainer } from "@medusajs/modules-sdk"
import MeiliSearchService from "../services/meilisearch"
import { MeilisearchPluginOptions } from "../types"

export default async (
  container: MedusaContainer,
  options: MeilisearchPluginOptions
) => {
  const logger: Logger = container.resolve("logger")

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
