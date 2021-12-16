import {
  AdminPostShippingOptionsReq,
  AdminShippingOptionsRes,
  AdminPostShippingOptionsOptionReq,
  AdminShippingOptionsDeleteRes,
  AdminShippingOptionsListRes,
  AdminGetShippingOptionsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminShippingOptionsResource extends BaseResource {
  /**
   * @description creates a shipping option.
   * @param payload
   * @returns created shipping option.
   */
  create(
    payload: AdminPostShippingOptionsReq
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description updates a shipping option
   * @param id id of the shipping option to update.
   * @param payload update to apply to shipping option.
   * @returns the updated shipping option.
   */
  update(
    id: string,
    payload: AdminPostShippingOptionsOptionReq
  ): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description deletes a shipping option
   * @param id id of shipping option to delete.
   * @returns deleted response
   */
  delete(id: string): ResponsePromise<AdminShippingOptionsDeleteRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description get a shipping option
   * @param id id of the shipping option to retrieve.
   * @returns the shipping option with the given id
   */
  retrieve(id: string): ResponsePromise<AdminShippingOptionsRes> {
    const path = `/admin/shipping-options/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description lists shipping options matching a query
   * @param query query for searching shipping options
   * @returns a list of shipping options matching the query.
   */
  list(
    query?: AdminGetShippingOptionsParams
  ): ResponsePromise<AdminShippingOptionsListRes> {
    let path = `/admin/shipping-options`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/shipping-options?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminShippingOptionsResource
