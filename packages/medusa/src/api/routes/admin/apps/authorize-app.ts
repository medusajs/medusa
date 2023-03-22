import { IsNotEmpty, IsString } from "class-validator"

import { OauthService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/apps/authorizations
 * operationId: "PostApps"
 * summary: "Generate Token for App"
 * description: "Generates a token for an application."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostAppsReq"
 * x-codegen:
 *   method: authorize
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/apps/authorizations' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "application_name": "example",
 *           "state": "ready",
 *           "code": "token"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Apps
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminAppsRes"
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
  const validated = await validator(AdminPostAppsReq, req.body)
  const oauthService: OauthService = req.scope.resolve("oauthService")
  const data = await oauthService.generateToken(
    validated.application_name,
    validated.code,
    validated.state
  )
  res.status(200).json({ apps: data })
}

/**
 * @schema AdminPostAppsReq
 * type: object
 * required:
 *   - application_name
 *   - state
 *   - code
 * properties:
 *   application_name:
 *     type: string
 *     description:  Name of the application for the token to be generated for.
 *   state:
 *     type: string
 *     description: State of the application.
 *   code:
 *     type: string
 *     description: The code for the generated token.
 */
export class AdminPostAppsReq {
  @IsString()
  @IsNotEmpty()
  application_name: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  code: string
}
