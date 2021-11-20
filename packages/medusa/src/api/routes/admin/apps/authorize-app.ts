import { IsNotEmpty, IsString } from "class-validator"
import { OauthService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /apps
 * operationId: "PostApps"
 * summary: "Generates a token for an application."
 * description: "Generates a token for an application."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - application_name
 *           - state
 *           - code
 *         properties:
 *           application_name:
 *             type: string
 *             description:  Name of the application for the token to be generated for.
 *           state:
 *             type: string
 *             description: State of the application.
 *           code:
 *             type: string
 *             description: The code for the generated token.
 * tags:
 *   - Apps
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            apps:
 *              $ref: "#/components/schemas/OAuth"
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
