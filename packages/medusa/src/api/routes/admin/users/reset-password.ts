import { IsEmail, IsString } from "class-validator"
import jwt from "jsonwebtoken"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /users/password-token
 * operationId: "PostUsersUserPassword"
 * summary: "Set the password for a User."
 * description: "Sets the password for a User given the correct token."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - token
 *           - password
 *         properties:
 *           email:
 *             description: "The Users email."
 *             type: string
 *           token:
 *             description: "The token generated from the 'password-token' endpoint."
 *             type: string
 *           password:
 *             description: "The Users new password."
 *             type: string
 * tags:
 *   - Users
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/user"
 */
export default async (req, res) => {
  const validated = await validator(AdminResetPasswordRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const user = await userService.retrieveByEmail(validated.email)

  const decodedToken = jwt.verify(validated.token, user.password_hash) as {
    user_id: string
  }

  if (!decodedToken || decodedToken.user_id !== user.id) {
    res.status(401).send("Invalid or expired password reset token")
    return
  }

  const data = await userService.setPassword(user.id, validated.password)

  res.status(200).json({ user: data })
}

export class AdminResetPasswordRequest {
  @IsEmail()
  email: string

  @IsString()
  token: string

  @IsString()
  password: string
}
