import { IsEmail, IsNotEmpty, IsString } from "class-validator"

import jwt from "jsonwebtoken"
import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import AuthService from "../../../../services/auth"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/auth
 * operationId: "PostAuth"
 * summary: "User Login"
 * x-authenticated: false
 * description: "Log a User in and includes the Cookie session in the response header. The cookie session can be used in subsequent requests to authorize the user to perform admin functionalities.
 * When using Medusa's JS or Medusa React clients, the cookie is automatically attached to subsequent requests."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostAuthReq"
 * x-codegen:
 *   method: createSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.admin.auth.createSession({
 *         email: "user@example.com",
 *         password: "supersecret"
 *       })
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/auth' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "user@example.com",
 *         "password": "supersecret"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminAuthRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/incorrect_credentials"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const validated = await validator(AdminPostAuthReq, req.body)

  const authService: AuthService = req.scope.resolve("authService")
  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await authService
      .withTransaction(transactionManager)
      .authenticate(validated.email, validated.password)
  })

  if (result.success && result.user) {
    // Set user id on session, this is stored on the server.
    req.session.user_id = result.user.id

    const cleanRes = _.omit(result.user, ["password_hash"])

    res.json({ user: cleanRes })
  } else {
    res.sendStatus(401)
  }
}

/**
 * @schema AdminPostAuthReq
 * type: object
 * required:
 *   - email
 *   - password
 * properties:
 *   email:
 *     type: string
 *     description: The user's email.
 *     format: email
 *   password:
 *     type: string
 *     description: The user's password.
 *     format: password
 */
export class AdminPostAuthReq {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
