import BaseResource from "./base"
import {
  StoreReturnReasonsListRes,
  StoreReturnReasonsRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"

/**
 * This class is used to send requests to [Store Return Reason API Routes](https://docs.medusajs.com/api/store#return-reasons). All its method
 * are available in the JS Client under the `medusa.returnReasons` property.
 * 
 * Return reasons are key-value pairs that are used to specify why an order return is being created.
 */
class ReturnReasonsResource extends BaseResource {
  /**
   * Retrieve a Return Reason's details.
   * @param {string} id - The ID of the return reason.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreReturnReasonsRes>} Resolves to the return reason's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.returnReasons.retrieve(reasonId)
   * .then(({ return_reason }) => {
   *   console.log(return_reason.id);
   * })
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreReturnReasonsRes> {
    const path = `/store/return-reasons/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Return Reasons. This is useful when implementing a Create Return flow in the storefront.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreReturnReasonsListRes>} Resolves to the list of return reasons.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.returnReasons.list()
   * .then(({ return_reasons }) => {
   *   console.log(return_reasons.length);
   * })
   */
  list(customHeaders: Record<string, any> = {}): ResponsePromise<StoreReturnReasonsListRes> {
    const path = `/store/return-reasons`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ReturnReasonsResource
