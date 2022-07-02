import {
  AdminPostShippingOptionsReq,
  AdminShippingOptionsRes,
  AdminPostShippingOptionsOptionReq,
  AdminShippingOptionsDeleteRes,
  AdminShippingOptionsListRes,
  AdminGetShippingOptionsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminShippingOptionsResource extends BaseResource {
  /**
   * @description creates a shipping option.
   * @param payload
   * @param customHeaders
   * @returns created shipping option.
   */
  create(
    payload: AdminPostShippingOptionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description updates a shipping option
   * @param id id of the shipping option to update.
   * @param payload update to apply to shipping option.
   * @param customHeaders
   * @returns the updated shipping option.
   */
  update(
    id: string,
    payload: AdminPostShippingOptionsOptionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description deletes a shipping option
   * @param id id of shipping option to delete.
   * @param customHeaders
   * @returns deleted response
   */
  delete(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingOptionsDeleteRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description get a shipping option
   * @param id id of the shipping option to retrieve.
   * @param customHeaders
   * @returns the shipping option with the given id
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description lists shipping options matching a query
   * @param query query for searching shipping options
   * @param customHeaders
   * @returns a list of shipping options matching the query.
   */
  list(
    query?: AdminGetShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminShippingOptionsListRes> {
    let path = `/admin/shipping-options`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/shipping-options?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminShippingOptionsResource
