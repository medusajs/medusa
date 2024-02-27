import {
  AdminPostReturnReasonsReq,
  AdminReturnReasonsRes,
  AdminReturnReasonsDeleteRes,
  AdminReturnReasonsListRes,
  AdminPostReturnReasonsReasonReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Return Reason API Routes](https://docs.medusajs.com/api/admin#return-reasons). All its method
 * are available in the JS Client under the `medusa.admin.returnReasons` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Return reasons are key-value pairs that are used to specify why an order return is being created.
 * Admins can manage available return reasons, and they can be used by both admins and customers when creating a return.
 * 
 * Related Guide: [How to manage return reasons](https://docs.medusajs.com/modules/orders/admin/manage-returns#manage-return-reasons).
 */
class AdminReturnReasonsResource extends BaseResource {
  /**
   * Create a return reason.
   * @param {AdminPostReturnReasonsReq} payload - The return reason to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnReasonsRes>} Resolves to the return reason's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returnReasons.create({
   *   label: "Damaged",
   *   value: "damaged"
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason.id);
   * });
   */
  create(
    payload: AdminPostReturnReasonsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a return reason's details.
   * @param {string} id - The return reason's ID.
   * @param {AdminPostReturnReasonsReasonReq} payload - The attributes to update in the return reason.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnReasonsRes>} Resolves to the return reason's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returnReasons.update(returnReasonId, {
   *   label: "Damaged"
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason.id);
   * });
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
   * Delete a return reason.
   * @param {string} id - The ID of the return reason.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnReasonsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returnReasons.delete(returnReasonId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * });
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsDeleteRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a return reason's details.
   * @param {string} id - The return reason's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnReasonsRes>} Resolves to the return reason's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returnReasons.retrieve(returnReasonId)
   * .then(({ return_reason }) => {
   *   console.log(return_reason.id);
   * });
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsRes> {
    const path = `/admin/return-reasons/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of return reasons.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnReasonsListRes>} Resolves to the list of return reasons.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returnReasons.list()
   * .then(({ return_reasons }) => {
   *   console.log(return_reasons.length);
   * });
   */
  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnReasonsListRes> {
    const path = `/admin/return-reasons`

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminReturnReasonsResource
