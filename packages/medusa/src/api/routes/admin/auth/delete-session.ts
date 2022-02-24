/**
 * @oas [get] /auth
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
import { Request } from "@interfaces/http"

export default async (req: Request, res) => {
  req.session.destroy()
  res.status(200).end()
}
