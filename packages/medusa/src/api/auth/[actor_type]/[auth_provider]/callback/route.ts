import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  generateJwtToken,
} from "@medusajs/utils"
import crypto from "node:crypto"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

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

  const { success, error, authIdentity, successRedirectUrl } =
    await service.validateCallback(auth_provider, authData)

  const entityIdKey = `${actor_type}_id`
  const entityId = authIdentity?.app_metadata?.[entityIdKey] as
    | string
    | undefined
  if (success) {
    const { http } = req.scope.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const { jwtSecret, jwtExpiresIn, jwtTokenStorageKey, csrfTokenStorageKey } = http
    const authToken = generateJwtToken(
      {
        actor_id: entityId ?? "",
        actor_type,
        auth_identity_id: authIdentity?.id ?? "",
        app_metadata: {
          [entityIdKey]: entityId,
        },
      },
      {
        // @ts-expect-error
        secret: jwtSecret,
        // @ts-expect-error
        expiresIn: jwtExpiresIn,
      }
    )

    const csrfToken = crypto.randomBytes(32).toString("hex")

    res.cookie(csrfTokenStorageKey as string, csrfToken)

    // TODO: save the csrf Token in cache

    if (successRedirectUrl) {
      res.cookie(jwtTokenStorageKey as string, authToken, {
          httpOnly: true,
          secure: true,
      })

      return res.redirect(successRedirectUrl)
    }

    return res.json({ authToken, csrfToken })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
