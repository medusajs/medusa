import UserService from "../../../../services/user"

/**
 * @oas [get] /users/{id}
 * operationId: "GetUsersUser"
 * summary: "Retrieve a User"
 * description: "Retrieves a User."
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
 *             user:
 *               $ref: "#/components/schemas/user"
 */
export default async (req, res) => {
  const { user_id } = req.params

  const userService: UserService = req.scope.resolve("userService")

  const user = await userService.retrieve(user_id)
  res.json({ user })
}
