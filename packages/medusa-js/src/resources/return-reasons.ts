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
   * @return {ResponsePromise<StoreReturnReasonsRes>}
   */
  retrieve(id: string): ResponsePromise<StoreReturnReasonsRes> {
    const path = `/store/return-reasons/${id}`
    return this.client.request("GET", path)
  }

  /**
   * Lists return reasons defined in Medusa Admin
   * @return {ResponsePromise<StoreReturnReasonsListRes>}
   */
  list(): ResponsePromise<StoreReturnReasonsListRes> {
    const path = `/store/return-reasons`
    return this.client.request("GET", path)
  }
}

export default ReturnReasonsResource
