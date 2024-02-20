import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminV2AuthResource extends BaseResource {
  createSession(
    payload: AdminPostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/auth/admin/emailpass`

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  getSession(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/admin/users/me`

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminV2AuthResource
