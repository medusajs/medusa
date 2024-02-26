import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminV2AuthResource extends BaseResource {
  createSession(
    payload: AdminPostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    // TODO: The authentication should be linked to a valid admin user, we need an endpoint that
    // does that and checks if the user has the scopes for admin auth.
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
