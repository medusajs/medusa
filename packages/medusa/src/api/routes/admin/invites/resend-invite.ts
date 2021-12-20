import InviteService from "../../../../services/invite"

/**
 * @oas [post] /invites/{invite_id}/resend
 * operationId: "PostInvitesInviteResend"
 * summary: "Resend an Invite"
 * description: "Resends an Invite by triggering the 'invite' created event again"
 * x-authenticated: true
 * parameters:
 *   - (path) invite_id=* {string} The id of the Invite
 * tags:
 *   - Invites
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const { invite_id } = req.params
  const inviteService: InviteService = req.scope.resolve("inviteService")

  await inviteService.resend(invite_id)

  res.sendStatus(200)
}
