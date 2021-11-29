import { UserService, ServiceIdentifiers } from "../../../../services"

/**
 * @oas [get] /users
 * operationId: "GetUsers"
 * summary: "Retrieve all users"
 * description: "Retrieves all users."
 * x-authenticated: true
 * tags:
 *   - Users
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
  const userService: UserService = req.scope.resolve(ServiceIdentifiers.userService)
  const users = await userService.list({})

  res.status(200).json({ users })
}
