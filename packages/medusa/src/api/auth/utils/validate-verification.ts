import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { AuthIdentityDTO, ConfigModule, MedusaContainer } from "@medusajs/types"
import { AuthTypes } from "@medusajs/framework/types"

// The method checks for whether a verification is required for the given auth provider and identity.
export const validateVerification = async (
  container: MedusaContainer,
  {
    actor_type,
    auth_provider,
    auth_identity,
  }: {
    actor_type: string
    auth_provider: string
    auth_identity: AuthIdentityDTO
  }
): Promise<{
  requiresVerification: boolean
  verification: AuthTypes.AuthVerificationDTO | undefined
}> => {
  const config: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const service = container.resolve(Modules.AUTH)

  const verificationsForActor =
    config.projectConfig.http.authVerificationsPerActor?.[actor_type]

  if (!verificationsForActor || verificationsForActor.length === 0) {
    return {
      requiresVerification: false,
      verification: undefined,
    }
  }

  const verificationForAuthProvider = verificationsForActor.find(
    (verification) => verification.auth_provider === auth_provider
  )

  // This auth provider does not require verification.
  if (!verificationForAuthProvider) {
    return {
      requiresVerification: false,
      verification: undefined,
    }
  }

  const providerIdentity = auth_identity.provider_identities?.filter(
    (identity) => identity.provider === auth_provider
  )[0]

  if (!providerIdentity) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Provider identity not found while checking verification"
    )
  }

  const verification = await service.listAuthVerifications({
    auth_identity_id: auth_identity.id,
    entity_id: providerIdentity.entity_id,
    entity_type: verificationForAuthProvider.entity_type,
  })

  // We return whether the verification even configured/required, and the verification itself and its status.
  return {
    requiresVerification: true,
    verification: verification[0],
  }
}
