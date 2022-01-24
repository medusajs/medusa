import {
  AdminInviteDeleteRes,
  AdminListInvitesRes,
  AdminPostInvitesInviteAcceptReq,
} from "@medusajs/medusa"
import { AdminPostInvitesPayload, ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminInvitesResource extends BaseResource {
  accept(payload: AdminPostInvitesInviteAcceptReq, customHeaders: object = {}): ResponsePromise {
    const path = `/admin/invites/accept`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  create(payload: AdminPostInvitesPayload, customHeaders: object = {}): ResponsePromise {
    const path = `/admin/invites`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(id: string, customHeaders: object = {}): ResponsePromise<AdminInviteDeleteRes> {
    const path = `/admin/invites/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  list(customHeaders: object = {}): ResponsePromise<AdminListInvitesRes> {
    const path = `/admin/invites`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  resend(id: string, customHeaders: object = {}): ResponsePromise {
    const path = `/admin/invites/${id}`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }
}

export default AdminInvitesResource
