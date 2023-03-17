import { Logger } from "@medusajs/modules-sdk"
import MeiliSearchService from "../services/meilisearch"
import { MeilisearchPluginOptions } from "../types"
import { CommonTypes } from "@medusajs/types";


export default async (
  container: CommonTypes.MedusaContainer,
  options: MeilisearchPluginOptions
) => {
  const logger: Logger = container.resolve("logger")

  try {
    const meilisearchService: MeiliSearchService =
      container.resolve("meilisearchService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings ?? []).map(([indexName, value]) =>
        meilisearchService.updateSettings(indexName, value)
      )
    )
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
