import UserService from "../../../../services/user"

/**
 * @oas [get] /users
 * operationId: "GetUsers"
 * summary: "Retrieve all users"
 * description: "Retrieves all users."
 * x-authenticated: true
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/user"
 */
export default async (req, res) => {
  const userService: UserService = req.scope.resolve("userService")
  const users = await userService.list({})

  res.status(200).json({ users })
}
