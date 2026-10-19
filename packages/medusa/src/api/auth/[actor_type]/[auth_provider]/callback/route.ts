import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  AuthenticationInput,
  ConfigModule,
  IAuthModuleService,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenWithChecks } from "../../../utils/generate-jwt-token"
import { isActorAssociationRequired } from "../../../utils/require-actor-association"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)
  const config: ConfigModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const requiresActorAssociation = isActorAssociationRequired(
    config,
    auth_provider
  )

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity, mfaChallenge } =
    await service.validateCallback(auth_provider, authData)

  if (
    success &&
    authIdentity &&
    (!requiresActorAssociation ||
      !!authIdentity.app_metadata?.[`${actor_type}_id`])
  ) {
    const result = await generateJwtTokenWithChecks(req.scope, {
      authIdentity,
      mfaChallenge,
      actorType: actor_type,
      authProvider: auth_provider,
    })

    return res.json(result)
  }

  // A distinct error would reveal whether the credentials are valid.
  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    requiresActorAssociation
      ? "Authentication failed"
      : error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
