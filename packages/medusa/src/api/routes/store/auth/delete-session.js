/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Log out"
 * description: "Destroys a Customer's authenticated session."
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req, res) => {
  req.session.jwt = {}
  res.json({})
}
