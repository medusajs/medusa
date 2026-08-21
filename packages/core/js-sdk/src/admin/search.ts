import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

/**
 * This class is used to send requests to Admin Search API routes.
 *
 * @since 2.19.0
 */
export class Search {
  /**
   * @ignore
   */
  private client: Client

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method searches across entities. Per entity, results come from the
   * Search Module when that entity is indexed; otherwise each entity is queried
   * with the same free-text `q` filter the list endpoints support.
   *
   * Results are grouped per entity and paginated independently.
   *
   * @param {HttpTypes.AdminSearchParams} query - Search query and pagination parameters.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminSearchResponse>} The grouped search results.
   *
   * @example
   * sdk.admin.search.list({ q: "shirt", limit: 5 })
   * .then(({ results }) => {
   *   console.log(results)
   * })
   *
   * @tags search
   * @since 2.19.0
   */
  async list(query?: HttpTypes.AdminSearchParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminSearchResponse>(
      `/admin/search`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves the registered search indexes, their status, and the
   * fields each stores. `enabled` is `false` when the Search Module is not
   * configured.
   *
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminSearchIndexListResponse>} The registered search indexes.
   *
   * @example
   * sdk.admin.search.listIndexes()
   * .then(({ search_indexes, enabled }) => {
   *   console.log(search_indexes, enabled)
   * })
   *
   * @tags search
   */
  async listIndexes(headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminSearchIndexListResponse>(
      `/admin/search-indexes`,
      {
        headers,
      }
    )
  }

  /**
   * This method rebuilds a search index from its seed.
   *
   * @param {string} id - The name of the index to reindex.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminSearchIndexReindexResponse>} The reindex job.
   *
   * @example
   * sdk.admin.search.reindex("product")
   * .then(({ job_id, indexes }) => {
   *   console.log(job_id, indexes)
   * })
   *
   * @tags search
   */
  async reindex(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminSearchIndexReindexResponse>(
      `/admin/search-indexes/${id}/reindex`,
      {
        method: "POST",
        headers,
      }
    )
  }
}
