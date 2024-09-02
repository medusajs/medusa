import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { generateJwtTokenForAuthIdentity } from "../../../utils/generate-jwt-token"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity } = await service.register(
    auth_provider,
    authData
  )

  if (success) {
    const { http } = config.projectConfig

    const token = generateJwtTokenForAuthIdentity(
      {
        authIdentity,
        actorType: actor_type,
      },
      {
        secret: http.jwtSecret,
        expiresIn: http.jwtExpiresIn,
      }
    )

    return res.status(200).json({ token })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}
