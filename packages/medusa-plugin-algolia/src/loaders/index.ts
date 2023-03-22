import { Logger, MedusaContainer } from "@medusajs/modules-sdk"
import AlgoliaService from "../services/algolia"
import { AlgoliaPluginOptions } from "../types"

export default async (
  container: MedusaContainer,
  options: AlgoliaPluginOptions
) => {
  const logger: Logger = container.resolve("logger")
  try {
    const algoliaService: AlgoliaService = container.resolve("algoliaService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings || {}).map(async ([indexName, value]) => {
        return await algoliaService.updateSettings(indexName, value)
      })
    )
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
