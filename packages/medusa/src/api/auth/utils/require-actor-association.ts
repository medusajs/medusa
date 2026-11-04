import { ConfigModule } from "@medusajs/framework/types"

/**
 * Whether the given auth provider only authenticates auth identities already
 * associated with an actor of the requested actor type, as configured in
 * `projectConfig.http.requireActorAssociation`.
 */
export const isActorAssociationRequired = (
  config: ConfigModule,
  authProvider: string
): boolean => {
  return !!config.projectConfig?.http?.requireActorAssociation?.[authProvider]
}
