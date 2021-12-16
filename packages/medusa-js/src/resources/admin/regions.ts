import {
  AdminPostRegionsReq,
  AdminRegionsRes,
  AdminPostRegionsRegionReq,
  AdminRegionsDeleteRes,
  AdminRegionsListRes,
  AdminGetRegionsParams,
  AdminPostRegionsRegionCountriesReq,
  AdminPostRegionsRegionFulfillmentProvidersReq,
  AdminPostRegionsRegionPaymentProvidersReq,
  AdminPostRegionsRegionMetadata,
  AdminGetRegionsRegionFulfillmentOptionsRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminRegionsResource extends BaseResource {
  /**
   * @description creates a region.
   * @param payload
   * @returns created region.
   */
  create(payload: AdminPostRegionsReq): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description updates a region
   * @param id id of the region to update.
   * @param payload update to apply to region.
   * @returns the updated region.
   */
  update(
    id: string,
    payload: AdminPostRegionsRegionReq
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description deletes a region
   * @param id id of region to delete.
   * @returns Deleted response
   */
  delete(id: string): ResponsePromise<AdminRegionsDeleteRes> {
    const path = `/admin/regions/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description get a region
   * @param id id of the region to retrieve.
   * @returns the region with the given id
   */
  retrieve(id: string): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description lists regions matching a query
   * @param query query for searching regions
   * @returns a list of regions matching the query.
   */
  list(query?: AdminGetRegionsParams): ResponsePromise<AdminRegionsListRes> {
    let path = `/admin/regions`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/regions?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  /**
   * @description adds metadata to a region
   * @param id region id
   * @param payload metadata
   * @returns updated region
   */
  setMetadata(
    id: string,
    payload: AdminPostRegionsRegionMetadata
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/metadata`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description delete a region's metadata key value pair
   * @param id region id
   * @param key metadata key
   * @returns updated region
   */
  deleteMetadata(id: string, key: string): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/metadata/${key}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description adds a country to the list of countries in a region
   * @param id region id
   * @param payload country data
   * @returns updated region
   */
  addCountry(
    id: string,
    payload: AdminPostRegionsRegionCountriesReq
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description remove a country from a region's list of coutnries
   * @param id region id
   * @param country_code the 2 character ISO code for the Country.
   * @returns updated region
   */
  deleteCountry(
    id: string,
    country_code: string
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries/${country_code}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description adds a fulfillment provider to a region
   * @param id region id
   * @param payload fulfillment provider data
   * @returns updated region
   */
  addFulfillmentProvider(
    id: string,
    payload: AdminPostRegionsRegionFulfillmentProvidersReq
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description remove a fulfillment provider from a region
   * @param id region id
   * @param provider_id the if of the fulfillment provider
   * @returns updated region
   */
  deleteFulfillmentProvider(
    id: string,
    provider_id: string
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers/${provider_id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description retrieves the list of fulfillment options available in a region
   * @param id region id
   * @returns list of fulfillment options
   */
  retrieveFulfillmentOptions(
    id: string
  ): ResponsePromise<AdminGetRegionsRegionFulfillmentOptionsRes> {
    const path = `/admin/regions/${id}/fulfillment-options`
    return this.client.request("GET", path)
  }

  /**
   * @description adds a payment provider to a region
   * @param id region id
   * @param payload payment provider data
   * @returns updated region
   */
  addPaymentProvider(
    id: string,
    payload: AdminPostRegionsRegionPaymentProvidersReq
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description removes a payment provider from a region
   * @param id region id
   * @param provider_id the id of the payment provider
   * @returns updated region
   */
  deletePaymentProvider(
    id: string,
    provider_id: string
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers/${provider_id}`
    return this.client.request("DELETE", path)
  }
}

export default AdminRegionsResource
