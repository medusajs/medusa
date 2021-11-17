import _ from "lodash"
import jwt from "jsonwebtoken"
import config from "../../../../config"
import { validator } from "../../../../utils/validator"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import AuthService from "../../../../services/auth"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate a User"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) email=* {string} The User's email.
 *   - (body) password=* {string} The User's password.
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
 */
export default async (req, res) => {
  if (!config.jwtSecret) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Please configure jwtSecret in your environment"
    )
  }
  const validated = await validator(AdminPostAuthReq, req.body)

  const authService: AuthService = req.scope.resolve("authService")
  const result = await authService.authenticate(
    validated.email,
    validated.password
  )

  if (result.success && result.user) {
    // Add JWT to cookie
    req.session.jwt = jwt.sign({ userId: result.user.id }, config.jwtSecret, {
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
