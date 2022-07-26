import InviteService from "../../../../services/invite"

/**
 * @oas [get] /invites
 * operationId: "GetInvites"
 * summary: "Lists all Invites"
 * description: "Lists all Invites"
 * x-authenticated: true
 * tags:
 *   - Invite
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             invites:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/invite"
 */
export default async (req, res) => {
  const inviteService: InviteService = req.scope.resolve("inviteService")
  const invites = await inviteService.list({})

  res.status(200).json({ invites })
}
