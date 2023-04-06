import {
  AdminGetReturnsParams,
  AdminPostReturnsReturnReceiveReq,
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
  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnsCancelRes> {
    const path = `/admin/returns/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * @description receive a return
   * @param id id of the return to receive.
   * @param payload items to receive and an optional refund amount
   * @param customHeaders
   * @returns the return
   */
  receive(
    id: string,
    payload: AdminPostReturnsReturnReceiveReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnsRes> {
    const path = `/admin/returns/${id}/receive`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description lists returns matching a query
   * @param query query for searching returns
   * @param customHeaders
   * @returns a list of returns matching the query
   */
  list(
    query?: AdminGetReturnsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnsListRes> {
    let path = `/admin/returns/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/returns?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminReturnsResource
