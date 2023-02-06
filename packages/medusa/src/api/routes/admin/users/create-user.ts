import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"

import { UserRoles } from "../../../../models/user"
import UserService from "../../../../services/user"
import _ from "lodash"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /users
 * operationId: "PostUsers"
 * summary: "Create a User"
 * description: "Creates a User"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminCreateUserRequest"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.create({
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       })
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/users' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "password": "supersecret"
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
  const validated = await validator(AdminCreateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const data = _.omit(validated, ["password"])

  const manager: EntityManager = req.scope.resolve("manager")
  const user = await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .create(data, validated.password)
  })

  res.status(200).json({ user: _.omit(user, ["password_hash"]) })
}

/**
 * @schema AdminCreateUserRequest
 * type: object
 * required:
 *   - email
 *   - password
 * properties:
 *   email:
 *     description: "The Users email."
 *     type: string
 *     format: email
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
 *   password:
 *     description: "The Users password."
 *     type: string
 *     format: password
 */
export class AdminCreateUserRequest {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles

  @IsString()
  password: string
}
