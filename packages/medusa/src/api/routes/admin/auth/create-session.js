import _ from "lodash"
import jwt from "jsonwebtoken"
import { Validator } from "medusa-core-utils"
import config from "../../../../config"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate a User"
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
  const { body } = req
  const schema = Validator.object().keys({
    email: Validator.string().required(),
    password: Validator.string().required(),
  })
  const { value, error } = schema.validate(body)

  if (error) {
    throw error
  }

  const authService = req.scope.resolve("authService")
  const result = await authService.authenticate(value.email, value.password)
  if (!result.success) {
    res.sendStatus(401)
    return
  }

  // Add JWT to cookie
  req.session.jwt = jwt.sign({ userId: result.user.id }, config.jwtSecret, {
    expiresIn: "24h",
  })

  const cleanRes = _.omit(result.user, ["password_hash"])

  res.json({ user: cleanRes })
}
