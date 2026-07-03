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

  /* A request would have the actor ID set on it only after it:
    - Creates an actor after registration
    - Passes MFA and other verifications
  Once that is done we can safely just regenerate a token without performing any additional checks.

  However, if the actor is not set we have to perform the MFA and verification checks - for the refresh
  call we don't return verification/mfa required, but instead throw as the call to refresh the token is
  not expected until mfa/verifications are completed.
  */
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
