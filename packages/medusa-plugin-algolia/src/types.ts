import { SearchTypes } from "@medusajs/types"

export type SearchOptions = {
  paginationOptions: Record<string, unknown>
  filter: string
  additionalOptions: Record<string, unknown>
}

export type AlgoliaPluginOptions = {
  applicationId: string
  adminApiKey: string
  /**
   * Index settings
   */
  settings?: {
    [key: string]: SearchTypes.IndexSettings
  }
}
