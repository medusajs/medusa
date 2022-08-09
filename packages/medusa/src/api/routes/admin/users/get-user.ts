import UserService from "../../../../services/user"

/**
 * @oas [get] /users/{id}
 * operationId: "GetUsersUser"
 * summary: "Retrieve a User"
 * description: "Retrieves a User."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the User.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.retrieve(user_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/users/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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

  const userService: UserService = req.scope.resolve("userService")

  const user = await userService.retrieve(user_id)
  res.json({ user })
}
