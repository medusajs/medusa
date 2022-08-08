import { IsEmail, IsEnum } from "class-validator"

import { EntityManager } from "typeorm"
import InviteService from "../../../../services/invite"
import { UserRoles } from "../../../../models/user"
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
 *             format: email
 *           role:
 *             description: "The role of the user to be created."
 *             type: string
 *             enum: [admin, member, developer]
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.invites.create({
 *         user: "user@example.com",
 *         role: "admin"
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'localhost:9000/admin/invites' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "user": "user@example.com",
 *           "role": "admin"
 *       }'
 * tags:
 *   - Invite
 * responses:
 *   200:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(AdminPostInvitesReq, req.body)

  const inviteService: InviteService = req.scope.resolve("inviteService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await inviteService
      .withTransaction(transactionManager)
      .create(validated.user, validated.role)
  })

  res.sendStatus(200)
}
export class AdminPostInvitesReq {
  @IsEmail()
  user: string

  @IsEnum(UserRoles)
  role: UserRoles
}
