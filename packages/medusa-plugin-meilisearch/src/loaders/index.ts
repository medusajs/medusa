import MeiliSearchService from "../services/meilisearch"
import { MeilisearchPluginOptions } from "../types"

export default async (container, options) => {
  try {
    const meilisearchService: MeiliSearchService = container.resolve("meilisearchService")
    
    const { settings } = options as MeilisearchPluginOptions

    await Promise.all(
      Object.entries(settings ?? []).map(([indexName, value]) =>
        meilisearchService.updateSettings(indexName, value)
      )
    )
  } catch (err) {
    // ignore
    console.log(err)
  }
}
