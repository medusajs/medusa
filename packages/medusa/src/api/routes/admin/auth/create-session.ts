import { IsEmail, IsNotEmpty, IsString } from "class-validator"

import AuthService from "../../../../services/auth"
import { EntityManager } from "typeorm";
import { MedusaError } from "medusa-core-utils"
import _ from "lodash"
import jwt from "jsonwebtoken"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate a User"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) email=* {string} The User's email.
 *   - (body) password=* {string} The User's password.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             description: The User's email.
 *             format: email
 *           password:
 *             type: string
 *             description: The User's password.
 *             format: password
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            user:
 *              $ref: "#/components/schemas/user"
 *  "401":
 *    description: The user doesn't exist or the credentials are incorrect.
 */
export default async (req, res) => {
  const { projectConfig: { jwt_secret } } = req.scope.resolve('configModule')
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
     return await authService.withTransaction(transactionManager).authenticate(
      validated.email,
      validated.password
    )
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

export class AdminPostAuthReq {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
