import {
  AdminInviteDeleteRes,
  AdminListInvitesRes,
  AdminPostInvitesInviteAcceptReq,
} from "@medusajs/medusa"
import { AdminPostInvitesPayload, ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminInvitesResource extends BaseResource {
  accept(
    payload: AdminPostInvitesInviteAcceptReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/admin/invites/accept`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  create(
    payload: AdminPostInvitesPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/admin/invites`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInviteDeleteRes> {
    const path = `/admin/invites/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminListInvitesRes> {
    const path = `/admin/invites`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  resend(id: string, customHeaders: Record<string, any> = {}): ResponsePromise {
    const path = `/admin/invites/${id}`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default AdminInvitesResource
