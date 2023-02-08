import { IsEnum, IsObject, IsOptional, IsString } from "class-validator"

import { UserRoles } from "../../../../models/user"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /users/{id}
 * operationId: "PostUsersUser"
 * summary: "Update a User"
 * description: "Updates a User"
 * parameters:
 *   - (path) id=* {string} The ID of the User.
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminUpdateUserRequest"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.update(user_id, {
 *         first_name: 'Marcellus'
 *       })
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/users/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "first_name": "Marcellus"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUserRes"
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
  const { user_id } = req.params

  const validated = await validator(AdminUpdateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const manager: EntityManager = req.scope.resolve("manager")
  const data = await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .update(user_id, validated)
  })

  res.status(200).json({ user: data })
}

/**
 * @schema AdminUpdateUserRequest
 * type: object
 * properties:
 *   first_name:
 *     description: "The name of the User."
 *     type: string
 *   last_name:
 *     description: "The name of the User."
 *     type: string
 *   role:
 *     description: "Userrole assigned to the user."
 *     type: string
 *     enum: [admin, member, developer]
 *   api_token:
 *     description: "The api token of the User."
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
export class AdminUpdateUserRequest {
  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles

  @IsString()
  @IsOptional()
  api_token?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
