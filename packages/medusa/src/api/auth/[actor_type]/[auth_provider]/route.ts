import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AuthenticationInput,
  IAuthModuleService,
  ConfigModule,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { generateJwtToken } from "../../../utils/auth/token"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const authMethods = (config.projectConfig?.http as any)?.authMethods ?? {}
  // Not having the config defined would allow for all auth providers for the particular actor.
  if (authMethods[actor_type]) {
    if (!authMethods[actor_type].includes(auth_provider)) {
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
    const { http } = req.scope.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const queryObject = remoteQueryObjectFromString({
      entryPoint: "auth_identity",
      fields: [`${actor_type}.id`],
      variables: { id: authIdentity.id },
    })
    const [actorData] = await remoteQuery(queryObject)
    const entityId = actorData?.[actor_type]?.id

    const { jwtSecret, jwtExpiresIn } = http
    const token = generateJwtToken(
      {
        actor_id: entityId,
        actor_type,
        auth_identity_id: authIdentity.id,
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
