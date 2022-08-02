import UserService from "../../../../services/user"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /users/{user_id}
 * operationId: "DeleteUsersUser"
 * summary: "Delete a User"
 * description: "Deletes a User"
 * x-authenticated: true
 * parameters:
 *   - (path) user_id=* {string} The id of the User.
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
 *               description: The id of the deleted Shipping Profile.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
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
