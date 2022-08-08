import { EntityManager } from "typeorm"
import { IsEmail } from "class-validator"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /users/password-token
 * operationId: "PostUsersUserPasswordToken"
 * summary: "Generate a password token for a User."
 * description: "Generates a password token for a User with a given email."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *         properties:
 *           email:
 *             description: "The Users email."
 *             type: string
 *             format: email
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
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'localhost:9000/admin/users/password-token' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * tags:
 *   - User
 * responses:
 *   204:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(AdminResetPasswordTokenRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const user = await userService.retrieveByEmail(validated.email)

  // Should call a email service provider that sends the token to the user
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .generateResetPasswordToken(user.id)
  })

  res.sendStatus(204)
}

export class AdminResetPasswordTokenRequest {
  @IsEmail()
  email: string
}
