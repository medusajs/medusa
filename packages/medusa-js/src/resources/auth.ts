import {
  StoreGetAuthEmailRes,
  StorePostAuthReq,
  StoreAuthRes,
  StoreBearerAuthRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import JwtTokenManager from "../jwt-token-manager"
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
   * @description Removes authentication session
   * @return {ResponsePromise<void>}
   */
   deleteSession(customHeaders: Record<string, any> = {}): ResponsePromise<void> {
    const path = `/store/auth`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @param customHeaders
   * @return {ResponsePromise<StoreAuthRes>}
   */
  getSession(customHeaders: Record<string, any> = {}): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Check if email exists
   * @param {string} email is required
   * @param customHeaders
   * @return {ResponsePromise<StoreGetAuthEmailRes>}
   */
  exists(email: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreGetAuthEmailRes> {
    const path = `/store/auth/${email}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a new JWT access token
   * @param {AdminPostAuthReq} payload
   * @param customHeaders
   * @return {ResponsePromise<AdminBearerAuthRes>}
   */
  getToken(
    payload: StorePostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreBearerAuthRes> {
    const path = `/store/auth/token`
    return this.client.request("POST", path, payload, {}, customHeaders)
      .then((res) => {
        JwtTokenManager.registerJwt(res.access_token, "store");
        
        return res
      });
  }
}

export default AuthResource
