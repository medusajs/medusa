import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

const taxRateUrl = "/admin/tax-rates"

export class TaxRate {
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
   * This method creates a tax rate. It sends a request to the
   * [Create Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_posttaxrates)
   * API route.
   *
   * @param body - The details of the tax rate to create.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * sdk.admin.taxRate.create({
   *   name: "VAT",
   *   tax_region_id: "txreg_123",
   *   code: "VAT",
   *   rate: 2, // 2%
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateTaxRate,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(taxRateUrl, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  /**
   * This method updates a tax rate. It sends a request to the
   * [Update Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_posttaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to update.
   * @param body - The details of the tax rate to update.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * sdk.admin.taxRate.update("txrat_123", {
   *   name: "VAT",
   *   code: "VAT",
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateTaxRate,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a tax rate. It sends a request to the
   * [Delete Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_deletetaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.taxRate.delete("txrat_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTaxRateDeleteResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a tax rate. It sends a request to the
   * [Get Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_gettaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to retrieve.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * To retrieve a tax rate by its ID:
   *
   * ```ts
   * sdk.admin.taxRate.retrieve("txrat_123")
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.taxRate.retrieve("txrat_123", {
   *   fields: "id,*tax_region"
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
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
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of tax rates. It sends a request to the
   * [List Tax Rates](https://docs.medusajs.com/api/admin#tax-rates_gettaxrates)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax rates.
   *
   * @example
   * To retrieve the list of tax rates:
   *
   * ```ts
   * sdk.admin.taxRate.list()
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxRate.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each tax rate:
   *
   * ```ts
   * sdk.admin.taxRate.list({
   *   fields: "id,*tax_region"
   * })
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminTaxRateListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateListResponse>(
      taxRateUrl,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
