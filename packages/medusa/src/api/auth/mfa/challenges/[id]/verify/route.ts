import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ConfigModule, IAuthModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "../../../../utils/generate-jwt-token"
import { AuthMfaVerifyChallengeRequestType } from "../../../../validators"

export const POST = async (
  req: MedusaRequest<AuthMfaVerifyChallengeRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { method, code } = req.validatedBody

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const challenge = await authService.verifyAuthMfaChallenge({
    id,
    method,
    code,
  })

  if (!challenge.auth_identity_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "MFA challenge is missing an auth identity"
    )
  }

  if (!challenge.actor_type) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "MFA challenge is missing an actor type"
    )
  }

  const authIdentity = await authService.retrieveAuthIdentity(
    challenge.auth_identity_id,
    { relations: ["provider_identities"] }
  )

  if (
    challenge.auth_provider &&
    !authIdentity.provider_identities?.some(
      (identity) => identity.provider === challenge.auth_provider
    )
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Auth identity does not have a provider identity for "${challenge.auth_provider}"`
    )
  }

  const { http } = req.scope.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  const token = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: challenge.actor_type,
      authProvider: challenge.auth_provider ?? undefined,
      container: req.scope,
    },
    {
      secret: http.jwtSecret!,
      expiresIn: http.jwtExpiresIn,
      options: http.jwtOptions,
    }
  )

  return res.status(200).json({ token })
}
