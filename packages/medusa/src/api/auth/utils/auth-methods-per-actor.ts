import { ConfigModule } from "@medusajs/framework/types"

/**
 * The actor types Medusa ships with. Any other actor type must have an entry
 * in `projectConfig.http.authMethodsPerActor` to use the `/auth` routes.
 */
export const BUILT_IN_ACTOR_TYPES = ["user", "customer"]

const getAuthMethodsPerActor = (
  config: ConfigModule
): Record<string, string[]> =>
  config.projectConfig?.http?.authMethodsPerActor ?? {}

const hasEntry = (
  authMethodsPerActor: Record<string, string[]>,
  actorType: string
) => Object.prototype.hasOwnProperty.call(authMethodsPerActor, actorType)

/**
 * Whether the app knows the given actor type: one Medusa ships with, or one
 * with an entry in `projectConfig.http.authMethodsPerActor`.
 */
export const isKnownActorType = (
  config: ConfigModule,
  actorType: string
): boolean => {
  return (
    BUILT_IN_ACTOR_TYPES.includes(actorType) ||
    hasEntry(getAuthMethodsPerActor(config), actorType)
  )
}

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
  const authMethodsPerActor = getAuthMethodsPerActor(config)

  return hasEntry(authMethodsPerActor, actorType)
    ? authMethodsPerActor[actorType]
    : undefined
}

/**
 * Whether a given auth provider is allowed for the given actor type.
 *
 * Unknown actor types (see `isKnownActorType`) are never allowed. A known
 * actor type without an allowlist can use every provider.
 */
export const isAuthProviderAllowedForActor = (
  config: ConfigModule,
  actorType: string,
  provider: string
): boolean => {
  if (!isKnownActorType(config, actorType)) {
    return false
  }

  const allowedProviders = getAllowedAuthProvidersForActor(config, actorType)

  return !allowedProviders || allowedProviders.includes(provider)
}
