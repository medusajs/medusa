import { OauthService } from "../../../../services"

/**
 * @oas [get] /admin/apps
 * operationId: "GetApps"
 * summary: "List Applications"
 * description: "Retrieve a list of applications registered in the Medusa backend."
 * x-authenticated: true
 * x-codegen:
 *   method: list
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/apps' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Apps Oauth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminAppsListRes"
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
  const oauthService: OauthService = req.scope.resolve("oauthService")
  const data = await oauthService.list({})

  res.status(200).json({ apps: data })
}
