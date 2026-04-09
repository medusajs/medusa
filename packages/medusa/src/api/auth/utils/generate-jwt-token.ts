import {
  AuthIdentityDTO,
  MedusaContainer,
  ProjectConfigOptions,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  FeatureFlag,
  generateJwtToken,
} from "@medusajs/framework/utils"
import { type Secret } from "jsonwebtoken"
import RbacFeatureFlag from "../../../feature-flags/rbac"

export async function generateJwtTokenForAuthIdentity(
  {
    authIdentity,
    actorType,
    authProvider,
    container,
  }: {
    authIdentity: AuthIdentityDTO
    actorType: string
    authProvider?: string
    container?: MedusaContainer
  },
  {
    secret,
    expiresIn,
    options,
  }: {
    secret: Secret
    expiresIn: string | undefined
    options?: ProjectConfigOptions["http"]["jwtOptions"]
  }
) {
  const expiresIn_ = expiresIn ?? options?.expiresIn
  const entityIdKey = `${actorType}_id`
  const entityId = authIdentity?.app_metadata?.[entityIdKey] as
    | string
    | undefined

  const providerIdentity = !authProvider
    ? undefined
    : authIdentity.provider_identities?.filter(
        (identity) => identity.provider === authProvider
      )[0]

  let roles: string[] | undefined

  if (FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key)) {
    if (container && entityId) {
      try {
        const query = container.resolve(ContainerRegistrationKeys.QUERY)
        const { data: userRoles } = await query.graph({
          entity: actorType,
          fields: ["rbac_roles.id"],
          filters: {
            id: entityId,
          },
        })

        if (userRoles?.[0]?.rbac_roles) {
          roles = userRoles[0].rbac_roles.map((role) => role.id)
        }
      } catch {
        // ignore
      }
    }
  }

  return generateJwtToken(
    {
      actor_id: entityId ?? "",
      actor_type: actorType,
      auth_identity_id: authIdentity?.id ?? "",
      app_metadata: {
        [entityIdKey]: entityId,
        roles,
      },
      user_metadata: providerIdentity?.user_metadata ?? {},
    },
    {
      secret,
      expiresIn: expiresIn_,
      jwtOptions: options,
    }
  )
}
