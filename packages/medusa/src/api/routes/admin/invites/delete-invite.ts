import { EntityManager } from "typeorm"
import InviteService from "../../../../services/invite"

/**
 * @oas [delete] /invites/{invite_id}
 * operationId: "DeleteInvitesInvite"
 * summary: "Create an Invite"
 * description: "Creates an Invite and triggers an 'invite' created event"
 * x-authenticated: true
 * parameters:
 *   - (path) invite_id=* {string} The ID of the Invite
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.invites.delete(invite_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'localhost:9000/admin/invites/{invite_id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Invite
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Invite.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               format: invite
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Invite was deleted.
 *               default: true
 */
export default async (req, res) => {
  const { invite_id } = req.params

  const inviteService: InviteService = req.scope.resolve("inviteService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await inviteService.withTransaction(transactionManager).delete(invite_id)
  })

  res.status(200).send({
    id: invite_id,
    object: "invite",
    deleted: true,
  })
}
