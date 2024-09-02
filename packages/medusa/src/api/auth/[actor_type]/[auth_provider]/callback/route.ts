import { AuthenticationInput, IAuthModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  generateJwtToken,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params

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

    const { jwtSecret, jwtExpiresIn } = http
    const token = generateJwtToken(
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

    if (successRedirectUrl) {
      const url = new URL(successRedirectUrl!)
      url.searchParams.append("access_token", token)

      return res.redirect(url.toString())
    }

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
