import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { generateJwtToken } from "../../../utils/auth/token"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    authScope: scope,
    protocol: req.protocol,
  } as AuthenticationInput

  const authResult = await service.authenticate(auth_provider, authData)

  const { success, error, authIdentity, location } = authResult

  if (location) {
    res.redirect(location)
    return
  }

  if (success) {
    const { http } = req.scope.resolve("configModule").projectConfig

    const { jwtSecret, jwtExpiresIn } = http
    // TODO: Dynamically determine the actor information
    const token = generateJwtToken(
      {
        actor_id: authIdentity.id,
        actor_type: "user",
        auth_identity_id: authIdentity.id,
        app_metadata: {},
        scope,
      },
      {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      }
    )

    return res.status(200).json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
