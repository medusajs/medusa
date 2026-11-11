import {
  AuthContext,
  AuthIdentityDTO,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * Throws when the token was issued before the credentials of the auth identity
 * were last updated in its provider, so that a password reset invalidates earlier tokens.
 */
export async function validateTokenIssuedAfterCredentialsUpdate(
  authService: IAuthModuleService,
  {
    authContext,
    authIdentity,
    authProvider,
  }: {
    authContext: Pick<AuthContext, "iat">
    authIdentity: AuthIdentityDTO
    authProvider?: string
  }
) {
  const providerIdentity = authIdentity.provider_identities?.find(
    (identity) => identity.provider === authProvider
  )

  if (!authProvider || !providerIdentity) {
    return
  }

  const credentialsUpdatedAt = await authService.getCredentialsUpdatedAt(
    authProvider,
    providerIdentity
  )

  if (!credentialsUpdatedAt) {
    return
  }

  const updatedAtSeconds = Math.floor(
    new Date(credentialsUpdatedAt).getTime() / 1000
  )

  if (
    typeof authContext.iat !== "number" ||
    authContext.iat < updatedAtSeconds
  ) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "The token was issued before the credentials were updated"
    )
  }
}
