import { ResponsePromise } from "../typings"
import { StoreSwapsRes, StorePostSwapsReq } from "@medusajs/medusa"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Swap API Routes](https://docs.medusajs.com/api/store#swaps). All its method
 * are available in the JS Client under the `medusa.swaps` property.
 * 
 * A swap is created by a customer or an admin to exchange an item with a new one.
 * Creating a swap implicitely includes creating a return for the item being exchanged.
 * 
 * Related Guide: [How to create a swap in a storefront](https://docs.medusajs.com/modules/orders/storefront/create-swap)
 */
class SwapsResource extends BaseResource {
  /**
   * Create a Swap for an Order. This will also create a return and associate it with the swap. If a return shipping option is specified, the return will automatically be fulfilled.
   * To complete the swap, you must use the {@link CartsResource.complete} method passing it the ID of the swap's cart.
   * 
   * An idempotency key will be generated if none is provided in the header `Idempotency-Key` and added to
   * the response. If an error occurs during swap creation or the request is interrupted for any reason, the swap creation can be retried by passing the idempotency
   * key in the `Idempotency-Key` header.
   * @param {StorePostSwapsReq} payload - The data of the swap to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreSwapsRes>} Resolves to the swap's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.swaps.create({
   *   order_id,
   *   return_items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ],
   *   additional_items: [
   *     {
   *       variant_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ swap }) => {
   *   console.log(swap.id);
   * })
   */
  create(payload: StorePostSwapsReq, customHeaders: Record<string, any> = {}): ResponsePromise<StoreSwapsRes> {
    const path = `/store/swaps`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a Swap's details by the ID of its cart.
   * @param {string} cart_id - The cart's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreSwapsRes>} Resolves to the swap's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.swaps.retrieveByCartId(cartId)
   * .then(({ swap }) => {
   *   console.log(swap.id);
   * })
   */
  retrieveByCartId(cart_id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreSwapsRes> {
    const path = `/store/swaps/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default SwapsResource
