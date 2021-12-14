import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminAuthResource extends BaseResource {
  /**
   * @description Retrieves an authenticated session
   * Usually used to check if authenticated session is alive.
   * @return {ResponsePromise<AdminAuthRes>}
   */
  getSession(): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("GET", path)
  }

  /**
   * @description destroys an authenticated session
   * @return {ResponsePromise<void>}
   */
  deleteSession(): ResponsePromise<void> {
    const path = `/admin/auth`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Creates an authenticated session
   * @param {AdminPostAuthReq} payload
   * @return {ResponsePromise<AdminAuthRes>}
   */
  createSession(payload: AdminPostAuthReq): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("POST", path, payload)
  }
}

export default AdminAuthResource
