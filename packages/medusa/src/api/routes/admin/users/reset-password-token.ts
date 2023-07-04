import { IsEmail } from "class-validator"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/users/password-token
 * operationId: "PostUsersUserPasswordToken"
 * summary: "Request Password Reset"
 * description: "Generates a password token for a User with a given email."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminResetPasswordTokenRequest"
 * x-codegen:
 *   method: sendResetPasswordToken
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.sendResetPasswordToken({
 *         email: 'user@example.com'
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // error occurred
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/users/password-token' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Users
 * responses:
 *   204:
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
  const validated = await validator(AdminResetPasswordTokenRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const user = await userService
    .retrieveByEmail(validated.email)
    .catch(() => undefined)

  if (user) {
    // Should call a email service provider that sends the token to the user
    const manager: EntityManager = req.scope.resolve("manager")
    await manager.transaction(async (transactionManager) => {
      return await userService
        .withTransaction(transactionManager)
        .generateResetPasswordToken(user.id)
    })
  }

  res.sendStatus(204)
}

/**
 * @schema AdminResetPasswordTokenRequest
 * type: object
 * required:
 *   - email
 * properties:
 *   email:
 *     description: "The Users email."
 *     type: string
 *     format: email
 */
export class AdminResetPasswordTokenRequest {
  @IsEmail()
  email: string
}
