import BaseResource from "./base"
import { ResponsePromise } from "../typings"
import { StoreReturnsRes, StorePostReturnsReq } from "@medusajs/medusa"

/**
 * This class is used to send requests to [Store Return API Routes](https://docs.medusajs.com/api/store#returns). All its method
 * are available in the JS Client under the `medusa.returns` property.
 * 
 * A return can be created by a customer to return items in an order.
 * 
 * Related Guide: [How to create a return in a storefront](https://docs.medusajs.com/modules/orders/storefront/create-return).
 */
class ReturnsResource extends BaseResource {
  /**
   * Create a return for an order. If a return shipping method is specified, the return is automatically fulfilled.
   * @param {StorePostReturnsReq} payload - The data of the return to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreReturnsRes>} Resolves to the return's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.returns.create({
   *   order_id,
   *   items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then((data) => {
   *   console.log(data.return.id);
   * })
   */
  create(payload: StorePostReturnsReq, customHeaders: Record<string, any> = {}): ResponsePromise<StoreReturnsRes> {
    const path = `/store/returns`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default ReturnsResource
