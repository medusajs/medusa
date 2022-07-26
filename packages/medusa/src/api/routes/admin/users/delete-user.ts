import UserService from "../../../../services/user"

/**
 * @oas [delete] /users/{id}
 * operationId: "DeleteUsersUser"
 * summary: "Delete a User"
 * description: "Deletes a User"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the User.
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
 *               description: The id of the deleted user.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 */
export default async (req, res) => {
  const { user_id } = req.params

  const userService: UserService = req.scope.resolve("userService")
  await userService.delete(user_id)

  res.status(200).send({
    id: user_id,
    object: "user",
    deleted: true,
  })
}
