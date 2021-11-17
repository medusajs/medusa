import { IsEmail, IsOptional, IsString } from "class-validator"
import _ from "lodash"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /users
 * operationId: "PostUsers"
 * summary: "Create a User"
 * description: "Creates a User"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             description: "The Users email."
 *             type: string
 *           name:
 *             description: "The name of the User."
 *             type: string
 *           password:
 *             description: "The Users password."
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
  const validated = await validator(AdminCreateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const data = _.pick(validated, ["email", "name"])

  const user = await userService.create(data, validated.password)

  res.status(200).json({ user })
}

export class AdminCreateUserRequest {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  name?: string

  @IsString()
  password: string
}
