import { EntityManager } from "typeorm"
import InviteService from "../../../../services/invite"

/**
 * @oas [post] /invites/{invite_id}/resend
 * operationId: "PostInvitesInviteResend"
 * summary: "Resend an Invite"
 * description: "Resends an Invite by triggering the 'invite' created event again"
 * x-authenticated: true
 * parameters:
 *   - (path) invite_id=* {string} The ID of the Invite
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.invites.resend(invite_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/invites/{invite_id}/resend' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Invite
 * responses:
 *   200:
 *     description: OK
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
