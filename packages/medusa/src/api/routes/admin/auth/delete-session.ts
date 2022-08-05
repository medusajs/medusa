/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Delete Session"
 * x-authenticated: true
 * description: "Deletes the current session for the logged in user."
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 */
export default async (req, res) => {
  req.session.destroy()
  res.status(200).end()
}
