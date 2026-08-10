import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

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
   * This method searches across entities. When the Search Module is enabled,
   * results come from its indexes; otherwise each entity is queried with the
   * same free-text `q` filter the list endpoints support.
   *
   * Results are grouped per entity and paginated independently.
   *
   * @param query - Search query and pagination parameters.
   * @param headers - Headers to pass in the request.
   * @returns The grouped search results.
   *
   * @example
   * sdk.admin.search.list({ q: "shirt", limit: 5 })
   * .then(({ results }) => {
   *   console.log(results)
   * })
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
}
