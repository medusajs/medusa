import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

const taxRegionUrl = "/admin/tax-regions"

/**
 * @privateRemarks
 *
 * TODO: Add support for updating a tax region
 */
export class TaxRegion {
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
   * This method creates a tax region. It sends a request to the
   * [Create Tax Region](https://docs.medusajs.com/api/admin#tax-regions_posttaxregions)
   * API route.
   *
   * @param body - The details of the tax region to create.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * sdk.admin.taxRegion.create({
   *   country_code: "us",
   *   province_code: "ca",
   *   default_tax_rate: {
   *     code: "VAT",
   *     name: "VAT",
   *     rate: 20, // 20%
   *     is_combinable: true,
   *   },
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   */
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

  /**
   * This method updates a tax region. It sends a request to the
   * [Update Tax Region](https://docs.medusajs.com/api/admin#tax-regions_posttaxregionsid)
   * API route.
   * 
   * @since 2.8.0
   *
   * @param id - The ID of the tax region to update.
   * @param body - The details of the tax region to update.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * sdk.admin.taxRegion.update("txreg_123", {
   *   province_code: "ca",
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateTaxRegion,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionResponse>(
      `${taxRegionUrl}/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a tax region. It sends a request to the
   * [Delete Tax Region](https://docs.medusajs.com/api/admin#tax-regions_deletetaxregionsid)
   * API route.
   *
   * @param id - The ID of the tax region to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.taxRegion.delete("txreg_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTaxRegionDeleteResponse>(
      `${taxRegionUrl}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a tax region. It sends a request to the
   * [Get Tax Region](https://docs.medusajs.com/api/admin#tax-regions_gettaxregionsid)
   * API route.
   *
   * @param id - The ID of the tax region to retrieve.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * To retrieve a tax region by its ID:
   *
   * ```ts
   * sdk.admin.taxRegion.retrieve("txreg_123")
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.taxRegion.retrieve("txreg_123", {
   *   fields: "id,*tax_rates"
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
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

  /**
   * This method retrieves a list of tax regions. It sends a request to the
   * [List Tax Regions](https://docs.medusajs.com/api/admin#tax-regions_gettaxregions)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax regions.
   *
   * @example
   * To retrieve the list of tax regions:
   *
   * ```ts
   * sdk.admin.taxRegion.list()
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxRegion.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each tax region:
   *
   * ```ts
   * sdk.admin.taxRegion.list({
   *   fields: "id,*tax_rates"
   * })
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
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
