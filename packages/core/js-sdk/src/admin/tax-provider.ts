import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

const taxProviderUrl = "/admin/tax-providers"

export class TaxProvider {
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
   * This method retrieves a list of tax providers. It sends a request to the
   * [List Tax Providers](https://docs.medusajs.com/api/admin#tax-providers_gettaxproviders)
   * API route.
   * 
   * @since 2.8.0
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax providers.
   *
   * @example
   * To retrieve the list of tax providers:
   *
   * ```ts
   * sdk.admin.taxProvider.list()
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxProvider.list({
   *   limit: 10,
   *   offset: 10,
   * })
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each products:
   *
   * ```ts
   * sdk.admin.taxProvider.list({
   *   fields: "id,*regions"
   * })
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminGetTaxProvidersParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxProviderListResponse>(
      taxProviderUrl,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
