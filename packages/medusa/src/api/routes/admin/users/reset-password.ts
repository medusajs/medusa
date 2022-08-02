import { IsEmail, IsOptional, IsString } from "class-validator"
import jwt from "jsonwebtoken"
import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { User } from "../../../.."
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

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

  try {
    const userService: UserService = req.scope.resolve("userService")

    const decoded = (await jwt.decode(validated.token)) as payload

    let user: User
    try {
      user = await userService.retrieveByEmail(
        validated.email || decoded?.email,
        {
          select: ["id", "password_hash"],
        }
      )
    } catch (err) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "invalid token")
    }

    const verifiedToken = (await jwt.verify(
      validated.token,
      user.password_hash
    )) as payload
    if (!verifiedToken || verifiedToken.user_id !== user.id) {
      res.status(401).send("Invalid or expired password reset token")
      return
    }

    const manager: EntityManager = req.scope.resolve("manager")
    const userResult = await manager.transaction(async (transactionManager) => {
      return await userService
        .withTransaction(transactionManager)
        .setPassword_(user.id, validated.password)
    })

    res.status(200).json({ user: _.omit(userResult, ["password_hash"]) })
  } catch (error) {
    if (error.message === "invalid token") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }
    throw error
  }
}

export type payload = {
  email: string
  user_id: string
  password: string
}
export class AdminResetPasswordRequest {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  token: string

  @IsString()
  password: string
}
