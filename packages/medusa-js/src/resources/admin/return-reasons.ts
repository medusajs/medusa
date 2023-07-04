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
   * @param customHeaders
   * @returns Created return reason.
   */
  create(
    payload: AdminPostReturnReasonsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates a return reason
   * @param id id of the return reason to update.
   * @param payload update to apply to return reason.
   * @param customHeaders
   * @returns the updated return reason.
   */
  update(
    id: string,
    payload: AdminPostReturnReasonsReasonReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description deletes a return reason
   * @param id id of return reason to delete.
   * @param customHeaders
   * @returns Deleted response
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsDeleteRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description retrieves a return reason
   * @param id id of the return reason to retrieve.
   * @param customHeaders
   * @returns the return reason with the given id
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists return reasons matching a query
   * @returns a list of return reasons matching the query.
   * @param customHeaders
   */
  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsListRes> {
    const path = `/admin/return-reasons`

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminReturnReasonsResource
