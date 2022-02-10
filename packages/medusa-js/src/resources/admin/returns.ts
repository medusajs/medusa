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
   * @returns the order for which the return was canceled
   */
  cancel(id: string): ResponsePromise<AdminReturnsCancelRes> {
    const path = `/admin/returns/${id}/cancel`
    return this.client.request("POST", path)
  }

  /**
   * @description receive a return
   * @param id id of the return to receive.
   * @param payload items to receive and an optional refund amount
   * @returns the return
   */
  receive(
    id: string,
    payload: AdminPostReturnsReturnReceiveReq
  ): ResponsePromise<AdminReturnsRes> {
    const path = `/admin/returns/${id}/receive`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description lists returns matching a query
   * @param query query for searching returns
   * @returns a list of returns matching the query
   */
  list(query?: AdminGetReturnsParams): ResponsePromise<AdminReturnsListRes> {
    let path = `/admin/returns/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/returns?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminReturnsResource
