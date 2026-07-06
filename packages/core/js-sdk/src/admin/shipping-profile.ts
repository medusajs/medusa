import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class ShippingProfile {
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
   * This method creates a new shipping profile. It sends a request to the
   * [Create Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofiles)
   * API route.
   * 
   * @param body - The details of the shipping profile to create.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   * 
   * @example
   * sdk.admin.shippingProfile.create({
   *   name: "Default Shipping Profile",
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateShippingProfile,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a shipping profile. It sends a request to the
   * [Update Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofilesid)
   * API route.
   * 
   * @param id - The ID of the shipping profile to update.
   * @param body - The details of the shipping profile to update.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   * 
   * @example
   * sdk.admin.shippingProfile.update("sp_123", {
   *   name: "Updated Shipping Profile",
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateShippingProfile,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes a shipping profile. It sends a request to the
   * [Delete Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_deleteshippingprofilesid)
   * API route.
   * 
   * @param id - The ID of the shipping profile to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.shippingProfile.delete("sp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileDeleteResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a list of shipping profiles. It sends a request to the
   * [List Shipping Profiles](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofiles)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of shipping profiles.
   * 
   * @example
   * To retrieve the list of shipping profiles:
   * 
   * ```ts
   * sdk.admin.shippingProfile.list()
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.shippingProfile.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping profile:
   * 
   * ```ts
   * sdk.admin.shippingProfile.list({
   *   fields: "id,name"
   * })
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminShippingProfileListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileListResponse>(
      `/admin/shipping-profiles`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a shipping profile. It sends a request to the
   * [Get Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofilesid)
   * API route.
   * 
   * @param id - The ID of the shipping profile to retrieve.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   * 
   * @example
   * To retrieve a shipping profile by its ID:
   * 
   * ```ts
   * sdk.admin.shippingProfile.retrieve("sp_123")
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.shippingProfile.retrieve("sp_123", {
   *   fields: "id,name"
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
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
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
