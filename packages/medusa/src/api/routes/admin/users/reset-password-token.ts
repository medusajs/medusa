import { IsEmail } from "class-validator"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/users/password-token
 * operationId: "PostUsersUserPasswordToken"
 * summary: "Request Password Reset"
 * description: "Generate a password token for an admin user with a given email. This also triggers the `user.password_reset` event. So, if you have a Notification Service installed
 * that can handle this event, a notification, such as an email, will be sent to the user. The token is triggered as part of the `user.password_reset` event's payload.
 * That token must be used later to reset the password using the [Reset Password](https://docs.medusajs.com/api/admin#users_postusersuserpassword) API Route."
 * externalDocs:
 *   description: How to reset a user's password
 *   url: https://docs.medusajs.com/modules/users/admin/manage-profile#reset-password
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
 *         email: "user@example.com"
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // error occurred
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/users/password-token' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
 *     description: "The User's email."
 *     type: string
 *     format: email
 */
export class AdminResetPasswordTokenRequest {
  @IsEmail()
  email: string
}
