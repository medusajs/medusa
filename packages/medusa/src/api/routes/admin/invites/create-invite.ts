import { IsEmail, IsEnum } from "class-validator"

import InviteService from "../../../../services/invite"
import { UserRoles } from "../../../../models/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/invites
 * operationId: "PostInvites"
 * summary: "Create an Invite"
 * description: "Create an Invite. This will generate a token associated with the invite and trigger an `invite.created` event. If you have a Notification Provider installed that handles this
 *  event, a notification should be sent to the email associated with the invite to allow them to accept the invite."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInvitesReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.invites.create({
 *         user: "user@example.com",
 *         role: "admin"
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // an error occurred
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/invites' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "user": "user@example.com",
 *           "role": "admin"
 *       }'
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

/**
 * @schema AdminPostInvitesReq
 * type: object
 * required:
 *   - user
 *   - role
 * properties:
 *   user:
 *     description: "The email associated with the invite. Once the invite is accepted, the email will be associated with the created user."
 *     type: string
 *     format: email
 *   role:
 *     description: "The role of the user to be created. This does not actually change the privileges of the user that is eventually created."
 *     type: string
 *     enum: [admin, member, developer]
 */
export class AdminPostInvitesReq {
  @IsEmail()
  user: string

  @IsEnum(UserRoles)
  role: UserRoles
}
