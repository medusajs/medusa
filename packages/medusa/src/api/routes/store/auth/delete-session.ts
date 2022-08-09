/**
 * @oas [delete] /auth
 * operationId: "DeleteAuth"
 * summary: "Log out"
 * description: "Destroys a Customer's authenticated session."
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/store/auth' \
 *       --header 'Cookie: connect.sid={sid}'
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
