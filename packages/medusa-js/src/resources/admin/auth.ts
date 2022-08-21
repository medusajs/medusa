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
  getSession(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description destroys an authenticated session
   * @param customHeaders
   * @return {ResponsePromise<void>}
   */
  deleteSession(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<void> {
    const path = `/admin/auth`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Creates an authenticated session
   * @param {AdminPostAuthReq} payload
   * @param customHeaders
   * @return {ResponsePromise<AdminAuthRes>}
   */
  createSession(
    payload: AdminPostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminAuthResource
