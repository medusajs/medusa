import { IsEmail, IsNotEmpty, IsString } from "class-validator"

import jwt from "jsonwebtoken"
import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import AuthService from "../../../../services/auth"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "User Login"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) email=* {string} The User's email.
 *   - (body) password=* {string} The User's password.
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
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       }).then((({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/auth' \
 *       --header 'Content-Type: application/json' \
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
  const {
    projectConfig: { jwt_secret },
  } = req.scope.resolve("configModule")
  if (!jwt_secret) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Please configure jwt_secret in your environment"
    )
  }
  const validated = await validator(AdminPostAuthReq, req.body)

  const authService: AuthService = req.scope.resolve("authService")
  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await authService
      .withTransaction(transactionManager)
      .authenticate(validated.email, validated.password)
  })

  if (result.success && result.user) {
    // Add JWT to cookie
    req.session.jwt = jwt.sign({ userId: result.user.id }, jwt_secret, {
      expiresIn: "24h",
    })

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
 *     description: The User's email.
 *     format: email
 *   password:
 *     type: string
 *     description: The User's password.
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
