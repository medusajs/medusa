import BaseResource from "./base"
import {
  StoreReturnReasonsListRes,
  StoreReturnReasonsRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"

class ReturnReasonsResource extends BaseResource {
  /**
   * @description Retrieves a single Return Reason
   * @param {string} id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreReturnReasonsRes>}
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreReturnReasonsRes> {
    const path = `/store/return-reasons/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * Lists return reasons defined in Medusa Admin
   * @param customHeaders
   * @return {ResponsePromise<StoreReturnReasonsListRes>}
   */
  list(customHeaders: Record<string, any> = {}): ResponsePromise<StoreReturnReasonsListRes> {
    const path = `/store/return-reasons`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default ReturnReasonsResource
