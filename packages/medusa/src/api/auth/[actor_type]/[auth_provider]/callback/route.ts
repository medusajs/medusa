import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  AuthenticationInput,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { generateJwtTokenWithChecks } from "../../../utils/generate-jwt-token"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { actor_type, auth_provider } = req.params
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authData = {
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    protocol: req.protocol,
  } as AuthenticationInput

  const { success, error, authIdentity, mfaChallenge } =
    await service.validateCallback(auth_provider, authData)

  if (success && authIdentity) {
    const result = await generateJwtTokenWithChecks(req.scope, {
      authIdentity,
      mfaChallenge,
      actorType: actor_type,
      authProvider: auth_provider,
    })

    return res.json(result)
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Authentication failed"
  )
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  await GET(req, res)
}
