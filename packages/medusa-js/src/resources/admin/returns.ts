import {
  AdminGetReturnsParams,
  AdminOrdersRes,
  AdminReturnsListRes,
  AdminReturnsRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminReturnsResource extends BaseResource {
  /**
   * @description cancels a return
   * @param id id of return to cancel
   * @returns the order for which the return was canceled
   */
  cancel(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/returns/${id}/cancel`
    return this.client.request("DELETE", path)
  }

  /**
   * @description receive a return
   * @param id id of the return to receive.
   * @returns the return with the given id
   */
  receive(id: string): ResponsePromise<AdminReturnsRes> {
    const path = `/admin/returns/${id}/receive`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists returns matching a query
   * @param query Query for searching returns
   * @returns a list of returns matching the query
   */
  list(query?: AdminGetReturnsParams): ResponsePromise<AdminReturnsListRes> {
    let path = `/admin/returns/`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/returns?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminReturnsResource
