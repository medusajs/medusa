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
