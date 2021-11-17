import BaseResource from "./base"
import { AxiosPromise } from "axios"
import { StoreReturnsRes, StorePostReturnsReq } from "@medusajs/medusa"

class ReturnsResource extends BaseResource {
  /**
   * Creates a return request
   * @param {StorePostReturnsReq} payload details needed to create a return
   * @return {AxiosPromise<StoreReturnsRes>}
   */
  create(payload: StorePostReturnsReq): AxiosPromise<StoreReturnsRes> {
    const path = `/store/returns`
    return this.client.request("POST", path, payload)
  }
}

export default ReturnsResource
