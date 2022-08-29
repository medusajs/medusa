import InviteService from "../../../../services/invite"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /invites/{invite_id}/resend
 * operationId: "PostInvitesInviteResend"
 * summary: "Resend an Invite"
 * description: "Resends an Invite by triggering the 'invite' created event again"
 * x-authenticated: true
 * parameters:
 *   - (path) invite_id=* {string} The ID of the Invite
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
