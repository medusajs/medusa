import { EntityManager } from "typeorm"
import UserService from "../../../../services/user"

/**
 * @oas [delete] /users/{id}
 * operationId: "DeleteUsersUser"
 * summary: "Delete a User"
 * description: "Deletes a User"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the User.
 * tags:
 *   - Users
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted user.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: user
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req, res) => {
  const { user_id } = req.params

  const userService: UserService = req.scope.resolve("userService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await userService.withTransaction(transactionManager).delete(user_id)
  })

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
