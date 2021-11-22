import { IsEmail, IsEnum } from "class-validator"
import { UserRoles } from "../../../../models/user"
import InviteService from "../../../../services/invite"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /invites
 * operationId: "PostInvites"
 * summary: "Create an Invite"
 * description: "Creates an Invite and triggers an 'invite' created event"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - user
 *           - role
 *         properties:
 *           user:
 *             description: "The email for the user to be created."
 *             type: string
 *           role:
 *             description: "The role of the user to be created."
 *             type: string
 * tags:
 *   - Invites
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(AdminPostInvitesReq, req.body)

  const inviteService: InviteService = req.scope.resolve("inviteService")

  await inviteService.create(validated.user, validated.role)
  res.sendStatus(200)
}
export class AdminPostInvitesReq {
  @IsEmail()
  user: string

  @IsEnum(UserRoles)
  role: UserRoles
}
