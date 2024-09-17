import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { generateJwtTokenForAuthIdentity } from "../../../utils/generate-jwt-token"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params

  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity } = await service.validateCallback(
    auth_provider,
    authData
  )

  if (success && authIdentity) {
    const { http } = config.projectConfig

    const token = generateJwtTokenForAuthIdentity(
      { authIdentity, actorType: actor_type },
      {
        secret: http.jwtSecret,
        expiresIn: http.jwtExpiresIn,
      }
    )

    return res.json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
