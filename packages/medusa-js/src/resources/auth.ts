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
   * @param customHeaders
   * @return {ResponsePromise<StoreAuthRes>}
   */
  authenticate(payload: StorePostAuthReq, customHeaders: Record<string, any> = {}): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @param customHeaders
   * @return {ResponsePromise<StoreAuthRes>}
   */
  getSession(customHeaders: Record<string, any> = {}): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Check if email exists
   * @param {string} email is required
   * @param customHeaders
   * @return {ResponsePromise<StoreGetAuthEmailRes>}
   */
  exists(email: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreGetAuthEmailRes> {
    const path = `/store/auth/${email}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AuthResource
