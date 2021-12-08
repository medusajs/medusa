import { Type } from "class-transformer"
import { IsNotEmpty, IsString, ValidateNested } from "class-validator"
import InviteService from "../../../../services/invite"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /invites/accept
 * operationId: "PostInvitesInviteAccept"
 * summary: "Accept an Invite"
 * description: "Accepts an Invite and creates a corresponding user"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - token
 *           - user
 *         properties:
 *           token:
 *             description: "The invite token provided by the admin."
 *             type: string
 *           user:
 *             description: "The User to create."
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: the first name of the User
 *               last_name:
 *                 type: string
 *                 description: the last name of the User
 *               password:
 *                 description: The desired password for the User
 *                 type: string
 * tags:
 *   - Invites
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(AdminPostInvitesInviteAcceptReq, req.body)

  const inviteService: InviteService = req.scope.resolve("inviteService")

  await inviteService.accept(validated.token, validated.user)

  res.sendStatus(200)
}

export class AdminPostInvitesInviteAcceptUserReq {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  password: string
}

export class AdminPostInvitesInviteAcceptReq {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdminPostInvitesInviteAcceptUserReq)
  user: AdminPostInvitesInviteAcceptUserReq
}
