import UserService from "../../../../services/user"

/**
 * @oas [get] /users
 * operationId: "GetUsers"
 * summary: "Retrieve all users"
 * description: "Retrieves all users."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/users' \
 *       --header 'Authorization: Bearer {api_token}'
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
