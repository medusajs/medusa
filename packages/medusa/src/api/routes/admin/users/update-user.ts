import { IsEnum, IsObject, IsOptional, IsString } from "class-validator"

import { UserRoles } from "../../../../models/user"
import UserService from "../../../../services/user"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /users/{id}
 * operationId: "PostUsersUser"
 * summary: "Update a User"
 * description: "Updates a User"
 * parameters:
 *   - (path) id=* {string} The ID of the User.
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
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
 *           api_token:
 *             description: "The api token of the User."
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 * 
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
  const { user_id } = req.params

  const validated = await validator(AdminUpdateUserRequest, req.body)

  const userService: UserService = req.scope.resolve("userService")
  const manager: EntityManager = req.scope.resolve("manager")
  const data = await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .update(user_id, validated)
  })

  res.status(200).json({ user: data })
}

export class AdminUpdateUserRequest {
  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles

  @IsString()
  @IsOptional()
  api_token?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
