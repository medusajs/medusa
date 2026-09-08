import { ConfigModule } from "@medusajs/framework/types"

/**
 * Returns the list of auth provider IDs allowed for the given actor type, as
 * configured in `projectConfig.http.authMethodsPerActor`.
 *
 * A return value of `undefined` means the actor type has no allowlist
 * configured, in which case every registered provider is allowed for it.
 */
export const getAllowedAuthProvidersForActor = (
  config: ConfigModule,
  actorType: string
): string[] | undefined => {
  const authMethodsPerActor =
    config.projectConfig?.http?.authMethodsPerActor ?? {}

  return authMethodsPerActor[actorType]
}

/**
 * Whether a given auth provider is allowed for the given actor type.
 *
 * When the actor type has no allowlist configured, every provider is allowed.
 */
export const isAuthProviderAllowedForActor = (
  config: ConfigModule,
  actorType: string,
  provider: string
): boolean => {
  const allowedProviders = getAllowedAuthProvidersForActor(config, actorType)

  // Not having the config defined would allow for all auth providers for the
  // particular actor.
  return !allowedProviders || allowedProviders.includes(provider)
}
