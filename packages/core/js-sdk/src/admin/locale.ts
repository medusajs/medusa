import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Locale {
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
   * This method retrieves a paginated list of locales. It sends a request to the
   * [List Locales](https://docs.medusajs.com/api/admin#locales_getlocales)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of locales.
   *
   * @example
   * To retrieve the list of locales:
   *
   * ```ts
   * sdk.admin.locale.list()
   * .then(({ locales, count, limit, offset }) => {
   *   console.log(locales)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.locale.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ locales, count, limit, offset }) => {
   *   console.log(locales)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each locale:
   *
   * ```ts
   * sdk.admin.locale.list({
   *   fields: "code,name"
   * })
   * .then(({ locales, count, limit, offset }) => {
   *   console.log(locales)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(query?: HttpTypes.AdminLocaleListParams, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminLocaleListResponse>(
      `/admin/locales`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a locale by its code. It sends a request to the
   * [Get Locale](https://docs.medusajs.com/api/admin#locales_getlocalescode) API route.
   *
   * @param code - The locale's code in BCP 47 format.
   * @param query - Configure the fields to retrieve in the locale.
   * @param headers - Headers to pass in the request
   * @returns The locale's details.
   *
   * @example
   * To retrieve a locale by its code:
   *
   * ```ts
   * sdk.admin.locale.retrieve("en-US")
   * .then(({ locale }) => {
   *   console.log(locale)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.locale.retrieve("en-US", {
   *   fields: "code,name"
   * })
   * .then(({ locale }) => {
   *   console.log(locale)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    code: string,
    query?: HttpTypes.AdminLocaleParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminLocaleResponse>(
      `/admin/locales/${code}`,
      {
        headers,
        query,
      }
    )
  }
}
