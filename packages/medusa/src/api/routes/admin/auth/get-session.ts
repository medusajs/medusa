import UserService from "../../../../services/user"
import _ from "lodash"

/**
 * @oas [get] /auth
 * operationId: "GetAuth"
 * summary: "Get Session"
 * x-authenticated: true
 * description: "Gets the currently logged in User."
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.auth.getSession()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/auth' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            user:
 *              $ref: "#/components/schemas/user"
 *  "400":
 *    description: An error occurred.
 */
export default async (req, res) => {
  try {
    const userService: UserService = req.scope.resolve("userService")
    const user = await userService.retrieve(req.user.userId)

    const cleanRes = _.omit(user, ["password_hash"])
    res.status(200).json({ user: cleanRes })
  } catch (err) {
    res.sendStatus(400)
  }
}
