import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"

import { UserRoles } from "../../../../models/user"
import UserService from "../../../../services/user"
import _ from "lodash"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

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
 *             format: email
 *           first_name:
 *             description: "The name of the User."
 *             type: string
 *           last_name:
 *             description: "The name of the User."
 *             type: string
 *           role:
 *             description: "Userrole assigned to the user."
 *             type: string
 *             enum: [admin, member, developer]
 *           password:
 *             description: "The Users password."
 *             type: string
 *             format: password
 * tags:
 *   - User
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
  const data = _.omit(validated, ["password"])

  const manager: EntityManager = req.scope.resolve("manager")
  const user = await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .create(data, validated.password)
  })

  res.status(200).json({ user: _.omit(user, ["password_hash"]) })
}

export class AdminCreateUserRequest {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles

  @IsString()
  password: string
}
