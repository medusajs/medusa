import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminAuthResource extends BaseResource {
  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @param customHeaders
   * @return {ResponsePromise<AdminAuthRes>}
   */
  getSession(customHeaders: object = {}): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description destroys an authenticated session
   * @param customHeaders
   * @return {ResponsePromise<void>}
   */
  deleteSession(customHeaders: object = {}): ResponsePromise<void> {
    const path = `/admin/auth`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * @description Creates an authenticated session
   * @param {AdminPostAuthReq} payload
   * @param customHeaders
   * @return {ResponsePromise<AdminAuthRes>}
   */
  createSession(payload: AdminPostAuthReq, customHeaders: object = {}): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminAuthResource
