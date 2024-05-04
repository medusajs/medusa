import {
  AdminInviteDeleteRes,
  AdminListInvitesRes,
  AdminPostInvitesInviteAcceptReq,
} from "@medusajs/medusa"
import { AdminPostInvitesPayload, ResponsePromise } from "../.."
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Invite API Routes](https://docs.medusajs.com/api/admin#invites). All its method
 * are available in the JS Client under the `medusa.admin.invites` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * An admin can invite new users to manage their team. This would allow new users to authenticate as admins and perform admin functionalities.
 * 
 * Related Guide: [How to manage invites](https://docs.medusajs.com/modules/users/admin/manage-invites).
 */
class AdminInvitesResource extends BaseResource {
  /**
   * Accept an Invite. This will also delete the invite and create a new user that can log in and perform admin functionalities. 
   * The user will have the email associated with the invite, and the password provided in the `payload` parameter.
   * @param {AdminPostInvitesInviteAcceptReq} payload - The user accepting the invite.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when the invite is accepted successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.invites.accept({
   *   token,
   *   user: {
   *     first_name: "Brigitte",
   *     last_name: "Collier",
   *     password: "supersecret"
   *   }
   * })
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // an error occurred
   * })
   */
  accept(
    payload: AdminPostInvitesInviteAcceptReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/admin/invites/accept`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create an invite. This will generate a token associated with the invite and trigger an `invite.created` event. If you have a Notification Provider installed that handles this
   * event, a notification should be sent to the email associated with the invite to allow them to accept the invite.
   * @param {AdminPostInvitesPayload} payload - The invite to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when the invite is created successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.invites.create({
   *   user: "user@example.com",
   *   role: "admin"
   * })
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // an error occurred
   * })
   */
  create(
    payload: AdminPostInvitesPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/admin/invites`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete an invite. Only invites that weren't accepted can be deleted.
   * @param {string} id - The invite's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInviteDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.invites.delete(inviteId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInviteDeleteRes> {
    const path = `/admin/invites/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of invites.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminListInvitesRes>} Resolves to the list of invites.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.invites.list()
   * .then(({ invites }) => {
   *   console.log(invites.length);
   * })
   */
  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminListInvitesRes> {
    const path = `/admin/invites`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Resend an invite. This renews the expiry date by seven days and generates a new token for the invite. It also triggers the `invite.created` event, 
   * so if you have a Notification Provider installed that handles this event, a notification should be sent to the email associated with the 
   * invite to allow them to accept the invite.
   * @param {string} id - The invite's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when the invite is resent successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.invites.resend(inviteId)
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // an error occurred
   * })
   */
  resend(id: string, customHeaders: Record<string, any> = {}): ResponsePromise {
    const path = `/admin/invites/${id}/resend`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default AdminInvitesResource
