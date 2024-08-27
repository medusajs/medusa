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
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { generateJwtTokenForAuthIdentity } from "../../utils/generate-jwt-token"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const authMethodsPerActor =
    config.projectConfig?.http?.authMethodsPerActor ?? {}
  // Not having the config defined would allow for all auth providers for the particular actor.
  if (authMethodsPerActor[actor_type]) {
    if (!authMethodsPerActor[actor_type].includes(auth_provider)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The actor type ${actor_type} is not allowed to use the auth provider ${auth_provider}`
      )
    }
  }

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

  const { success, error, authIdentity, location } = await service.authenticate(
    auth_provider,
    authData
  )

  if (location) {
    res.redirect(location)
    return
  }

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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
