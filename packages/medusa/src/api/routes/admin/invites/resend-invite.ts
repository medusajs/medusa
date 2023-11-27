import InviteService from "../../../../services/invite"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/invites/{invite_id}/resend
 * operationId: "PostInvitesInviteResend"
 * summary: "Resend an Invite"
 * description: "Resend an Invite. This renews the expiry date by 7 days and generates a new token for the invite. It also triggers the `invite.created` event, so if you have a Notification Provider installed that handles this
 *  event, a notification should be sent to the email associated with the invite to allow them to accept the invite."
 * x-authenticated: true
 * parameters:
 *   - (path) invite_id=* {string} The ID of the Invite
 * x-codegen:
 *   method: resend
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.invites.resend(inviteId)
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // an error occurred
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/invites/{invite_id}/resend' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Invites
 * responses:
 *   200:
 *     description: OK
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { invite_id } = req.params
  const inviteService: InviteService = req.scope.resolve("inviteService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await inviteService.withTransaction(transactionManager).resend(invite_id)
  })

  res.sendStatus(200)
}
