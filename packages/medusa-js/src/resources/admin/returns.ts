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

/**
 * This class is used to send requests to [Admin Return API Routes](https://docs.medusajs.com/api/admin#returns). All its method
 * are available in the JS Client under the `medusa.admin.returns` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A return can be created by a customer or an admin to return items in an order.
 * Admins can manage these returns and change their state.
 * 
 * Related Guide: [How to manage returns](https://docs.medusajs.com/modules/orders/admin/manage-returns).
 */
class AdminReturnsResource extends BaseResource {
  /**
   * Registers a return as canceled. The return can be associated with an order, claim, or swap.
   * @param {string} id - The return's ID. 
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnsCancelRes>} Resolves to the details of the order associated with the return. If the return is associated with a claim or a swap, then it'll be the order
   * that the claim or swap belongs to.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returns.cancel(returnId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * });
   */
  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminReturnsCancelRes> {
    const path = `/admin/returns/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Mark a return as received. This also updates the status of associated order, claim, or swap accordingly.
   * @param {string} id - The return's ID.
   * @param {AdminPostReturnsReturnReceiveReq} payload - The received return.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnsRes>} Resolves to the return's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returns.receive(returnId, {
   *   items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then((data) => {
   *   console.log(data.return.id);
   * });
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
   * Retrieve a list of Returns. The returns can be paginated.
   * @param {AdminGetReturnsParams} query - Paignation configurations to be applied on the retrieved returns.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminReturnsListRes>} Resolves to the list of returns with pagination fields.
   * 
   * @example
   * To list returns:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returns.list()
   * .then(({ returns, limit, offset, count }) => {
   *   console.log(returns.length)
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.returns.list({
   *   limit,
   *   offset
   * })
   * .then(({ returns, limit, offset, count }) => {
   *   console.log(returns.length)
   * })
   * ```
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
