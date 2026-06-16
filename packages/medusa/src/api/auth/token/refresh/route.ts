import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ConfigModule, IAuthModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  generateJwtTokenForAuthIdentity,
  generateJwtTokenWithChecks,
} from "../../utils/generate-jwt-token"

// Retrieve a newly generated JWT token. Checking the existing token is valid already happens in the auth middleware.
// Note: We probably want to disallow refreshes if the password changes, and require reauth.
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const service: IAuthModuleService = req.scope.resolve(Modules.AUTH)

  if (!req.auth_context.auth_provider) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "The auth provider is not set while refreshing token"
    )
  }

  // If the token is already with an actor attached to it, it means it passed all checks, so we can just regenerate the token.
  // Otherwise we want to validate they passed mfa before proceeding.
  if (req.auth_context.actor_id) {
    const { http } = req.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const authIdentity = await service.retrieveAuthIdentity(
      req.auth_context.auth_identity_id,
      { relations: ["provider_identities"] }
    )

    if (!authIdentity) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "Invalid auth identity while refreshing token"
      )
    }

    // We don't do additinal checks here as initial authentication has to be done before doing the MFA challenge.
    const token = await generateJwtTokenForAuthIdentity(
      {
        authIdentity,
        actorType: req.auth_context.actor_type,
        authProvider: req.auth_context.auth_provider,
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

  // This will get results (and perform checks), similar to the authenticate call.
  const { authIdentity, mfaChallenge } = await service.validateAuthIdentity(
    req.auth_context.auth_identity_id,
    req.auth_context.auth_provider,
    { relations: ["provider_identities"] }
  )

  if (!authIdentity) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Invalid auth identity while refreshing token"
    )
  }

  const result = await generateJwtTokenWithChecks(req.scope, {
    authIdentity,
    mfaChallenge,
    actorType: req.auth_context.actor_type,
    authProvider: req.auth_context.auth_provider,
  })

  return res.json(result)
}
