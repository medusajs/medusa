import { IsNotEmpty, IsString, ValidateNested } from "class-validator"

import InviteService from "../../../../services/invite"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/invites/accept
 * operationId: "PostInvitesInviteAccept"
 * summary: "Accept an Invite"
 * description: "Accepts an Invite and creates a corresponding user"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInvitesInviteAcceptReq"
 * x-codegen:
 *   method: accept
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.invites.accept({
 *         token,
 *         user: {
 *           first_name: 'Brigitte',
 *           last_name: 'Collier',
 *           password: 'supersecret'
 *         }
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // an error occurred
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/invites/accept' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "token": "{token}",
 *           "user": {
 *             "first_name": "Brigitte",
 *             "last_name": "Collier",
 *             "password": "supersecret"
 *           }
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const validated = await validator(AdminPostInvitesInviteAcceptReq, req.body)

  const inviteService: InviteService = req.scope.resolve("inviteService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await inviteService
      .withTransaction(transactionManager)
      .accept(validated.token, validated.user)
  })

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

/**
 * @schema AdminPostInvitesInviteAcceptReq
 * type: object
 * required:
 *   - token
 *   - user
 * properties:
 *   token:
 *     description: "The invite token provided by the admin."
 *     type: string
 *   user:
 *     description: "The User to create."
 *     type: object
 *     required:
 *       - first_name
 *       - last_name
 *       - password
 *     properties:
 *       first_name:
 *         type: string
 *         description: the first name of the User
 *       last_name:
 *         type: string
 *         description: the last name of the User
 *       password:
 *         description: The desired password for the User
 *         type: string
 *         format: password
 */
export class AdminPostInvitesInviteAcceptReq {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdminPostInvitesInviteAcceptUserReq)
  user: AdminPostInvitesInviteAcceptUserReq
}
