import _ from "lodash"

/**
 * @oas [get] /auth
 * operationId: "GetAuth"
 * summary: "Get Session"
 * description: "Gets the currently logged in User."
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
 */
export default async (req, res) => {
  const userService = req.scope.resolve("userService")
  const user = await userService.retrieve(req.user.userId)

  const cleanRes = _.omit(user, ["password_hash"])
  res.status(200).json({ user: cleanRes })
}
