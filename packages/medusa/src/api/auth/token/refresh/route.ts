import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../utils/generate-jwt-token"

// Retrieve a newly generated JWT token. All checks that the existing token is valid already happen in the auth middleware.
// The token will include the actor ID, even if the token used to refresh didn't have one.
// Note: We probably want to disallow refreshes if the password changes, and require reauth.
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  const authIdentity = await service.retrieveAuthIdentity(
    req.auth_context.auth_identity_id
  )

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  const token = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: req.auth_context.actor_type,
      container: req.scope,
    },
    {
      secret: http.jwtSecret!,
      expiresIn: http.jwtExpiresIn,
      options: http.jwtOptions,
    }
  )

  return res.json({ token })
}
