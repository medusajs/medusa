import BaseResource from "./base"
import { ResponsePromise } from "../typings"
import { StoreReturnsRes, StorePostReturnsReq } from "@medusajs/medusa"

class ReturnsResource extends BaseResource {
  /**
   * Creates a return request
   * @param {StorePostReturnsReq} payload details needed to create a return
   * @return {ResponsePromise<StoreReturnsRes>}
   */
  create(payload: StorePostReturnsReq): ResponsePromise<StoreReturnsRes> {
    const path = `/store/returns`
    return this.client.request("POST", path, payload)
  }
}

export default ReturnsResource
