import {
  AdminGetReturnsParams,
  AdminReturnsCancelRes,
  AdminReturnsListRes,
  AdminReturnsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminReturnsResource extends BaseResource {
  /**
   * @description cancels a return
   * @param id id of return to cancel
   * @param customHeaders
   * @returns the order for which the return was canceled
   */
  cancel(id: string, customHeaders: object = {}): ResponsePromise<AdminReturnsCancelRes> {
    const path = `/admin/returns/${id}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  /**
   * @description receive a return
   * @param id id of the return to receive.
   * @param customHeaders
   * @returns the return
   */
  receive(id: string, customHeaders: object = {}): ResponsePromise<AdminReturnsRes> {
    const path = `/admin/returns/${id}/receive`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  /**
   * @description lists returns matching a query
   * @param query query for searching returns
   * @param customHeaders
   * @returns a list of returns matching the query
   */
  list(query?: AdminGetReturnsParams, customHeaders: object = {}): ResponsePromise<AdminReturnsListRes> {
    let path = `/admin/returns/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/returns?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminReturnsResource
