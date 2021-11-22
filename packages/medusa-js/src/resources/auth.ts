import {
  StoreGetAuthEmailRes,
  StorePostAuthReq,
  StoreAuthRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class AuthResource extends BaseResource {
  /**
   * @description Authenticates a customer using email and password combination
   * @param {StorePostAuthReq} payload authentication payload
   * @return {ResponsePromise<StoreAuthRes>}
   */
  authenticate(payload: StorePostAuthReq): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @return {ResponsePromise<StoreAuthRes>}
   */
  getSession(): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("GET", path)
  }

  /**
   * @description Check if email exists
   * @param {string} email is required
   * @return {ResponsePromise<StoreGetAuthEmailRes>}
   */
  exists(email: string): ResponsePromise<StoreGetAuthEmailRes> {
    const path = `/store/auth/${email}`
    return this.client.request("GET", path)
  }
}

export default AuthResource
