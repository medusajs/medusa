import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ConfigModule, IAuthModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../../../utils/generate-jwt-token"
import { VerificationConfirmRequestType } from "../../../../validators"

export const POST = async (
  req: MedusaRequest<VerificationConfirmRequestType>,
  res: MedusaResponse
) => {
  const { actor_type, auth_provider } = req.params
  const { token: verificationToken } = req.validatedBody

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const confirmInput: Parameters<
    IAuthModuleService["confirmAuthVerification"]
  >[0] & { provider: string } = {
    token: verificationToken,
    provider: auth_provider,
  }
  const result = await authService.confirmAuthVerification(confirmInput)

  const authIdentity = await authService.retrieveAuthIdentity(
    result.auth_identity_id,
    { relations: ["provider_identities"] }
  )

  const providerIdentity = authIdentity.provider_identities?.find(
    (identity) =>
      identity.id === result.provider_identity_id &&
      identity.provider === auth_provider
  )

  if (!providerIdentity) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Auth identity does not have a provider identity for "${auth_provider}"`
    )
  }

  let mfaChallenge:
    | Awaited<ReturnType<IAuthModuleService["createAuthMfaChallenge"]>>
    | undefined
  try {
    mfaChallenge = await authService.createAuthMfaChallenge({
      auth_identity_id: authIdentity.id,
      actor_type,
      auth_provider,
    })
  } catch (error) {
    if (
      !MedusaError.isMedusaError(error) ||
      error.type !== MedusaError.Types.NOT_ALLOWED ||
      error.message !== "Auth identity does not have any enabled MFA methods"
    ) {
      throw error
    }
  }

  if (mfaChallenge) {
    return res.status(200).json({
      mfa_required: true,
      mfa_challenge: mfaChallenge,
      entity_id: result.entity_id,
      verified: result.verified,
    })
  }

  const { http } = req.scope.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  const token = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: actor_type,
      authProvider: auth_provider,
      container: req.scope,
    },
    {
      secret: http.jwtSecret!,
      expiresIn: http.jwtExpiresIn,
      options: http.jwtOptions,
    }
  )

  return res.status(200).json({
    token,
    entity_id: result.entity_id,
    verified: result.verified,
  })
}
