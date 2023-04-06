import { SearchTypes } from "@medusajs/types"
import { Config } from "meilisearch"

export const meilisearchErrorCodes = {
  INDEX_NOT_FOUND: "index_not_found",
}

export interface MeilisearchPluginOptions {
  /**
   * Meilisearch client configuration
   */
  config: Config
  /**
   * Index settings
   */
  settings?: {
    [key: string]: SearchTypes.IndexSettings
  }
}