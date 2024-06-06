import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

const taxRegionUrl = "/admin/tax-regions"

// TODO: Add support for updating a tax region
export class TaxRegion {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateTaxRegion,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionResponse>(
      taxRegionUrl,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionDeleteResponse>(
      `${taxRegionUrl}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionResponse>(
      `${taxRegionUrl}/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminTaxRegionListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionListResponse>(
      taxRegionUrl,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
