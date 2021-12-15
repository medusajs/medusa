import {
  AdminPostReturnReasonsReq,
  AdminReturnReasonsRes,
  AdminReturnReasonsDeleteRes,
  AdminReturnReasonsListRes,
  AdminPostReturnReasonsReasonReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminReturnReasonsResource extends BaseResource {
  /**
   * @description Creates a return reason.
   * @param payload
   * @returns Created return reason.
   */
  create(
    payload: AdminPostReturnReasonsReq
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Updates a return reason
   * @param id id of the return reason to update.
   * @param payload update to apply to return reason.
   * @returns the updated return reason.
   */
  update(
    id: string,
    payload: AdminPostReturnReasonsReasonReq
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description deletes a return reason
   * @param id id of return reason to delete.
   * @returns Deleted response
   */
  delete(id: string): ResponsePromise<AdminReturnReasonsDeleteRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description retrieves a return reason
   * @param id id of the return reason to retrieve.
   * @returns the return reason with the given id
   */
  retrieve(id: string): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists return reasons matching a query
   * @param query Query for searching return reasons
   * @returns a list of return reasons matching the query.
   */
  list(): ResponsePromise<AdminReturnReasonsListRes> {
    const path = `/admin/return-reasons`

    return this.client.request("GET", path)
  }
}

export default AdminReturnReasonsResource
