import UserService from "../../../../services/user"
import _ from "lodash"

/**
 * @oas [get] /admin/auth
 * operationId: "GetAuth"
 * summary: "Get Current User"
 * x-authenticated: true
 * description: "Gets the currently logged in User."
 * x-codegen:
 *   method: getSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.auth.getSession()
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       });
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
 *          $ref: "#/components/schemas/AdminAuthRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
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
