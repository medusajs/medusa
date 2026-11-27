import { ConfigModule } from "@medusajs/framework/types"

/**
 * The verification that `projectConfig.http.authVerificationsPerActor`
 * requires for the actor type and auth provider, when it sets
 * `hide_existing_identities`. Registering and logging in then answer the same
 * way whether or not an identity exists.
 */
export const getVerificationHidingExistingIdentities = (
  config: ConfigModule,
  actorType: string,
  authProvider: string
) => {
  return config.projectConfig?.http?.authVerificationsPerActor?.[
    actorType
  ]?.find(
    (verification) =>
      verification.auth_provider === authProvider &&
      verification.hide_existing_identities
  )
}
