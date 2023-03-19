import { Logger, MedusaContainer } from "@medusajs/modules-sdk"
import { AlgoliaPluginOptions } from "../types"

export default async (
  container: MedusaContainer,
  options: AlgoliaPluginOptions
) => {
  const logger: Logger = container.resolve("logger")
  try {
    const algoliaService = container.resolve("algoliaService")

    const { settings } = options

    await Promise.all(
      Object.entries(settings || {}).map(([indexName, value]) => {
        algoliaService.updateSettings(indexName, value)
      })
    )
  } catch (err) {
    // ignore
    logger.warn(err)
  }
}
