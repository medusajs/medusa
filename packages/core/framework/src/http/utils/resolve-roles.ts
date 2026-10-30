import { AuthContext, MedusaContainer, RbacScope } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  deduplicate,
  Modules,
  RBAC_CACHE_TAGS,
} from "@medusajs/utils"
import { RBAC_CACHE_TTL } from "../../policies/has-permission"
import { buildAuthzContext } from "./build-authz-context"

export const resolveRoles = async ({
  authContext,
  container,
  scope,
}: {
  authContext: Pick<AuthContext, "actor_type" | "actor_id">
  container: MedusaContainer
  /**
   * The scope the request acts within, resolved by the application. Role
   * assignments scoped to it, as well as unscoped assignments, are considered.
   *
   * When it is not provided, only unscoped assignments are considered.
   */
  scope?: RbacScope
}) => {
  const rbacModule = container.resolve(Modules.RBAC)

  const { actor_type, actor_id } = authContext

  const authzConfig =
    await rbacModule.retrieveActorAuthzContextConfig(actor_type)

  if (!authzConfig) {
    return []
  }

  const authzContext = await buildAuthzContext({
    actor_type,
    actor_id,
    config: authzConfig,
    container,
  })

  if (!authzContext.grantees.length) {
    return []
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: assignments } = await query.graph(
    {
      entity: "rbac_role_assignment",
      fields: ["role_id"],
      filters: {
        $and: [
          {
            $or: authzContext.grantees.map((g) => ({
              reference: g.type,
              reference_id: g.id,
            })),
          },
          {
            $or: [
              // Unscoped role assignments allow exercising privileges across all scopes.
              { scope: null, scope_id: null },
              ...(scope ? [{ scope: scope.type, scope_id: scope.id }] : []),
            ],
          },
        ],
      },
    },
    {
      cache: {
        enable: true,
        ttl: RBAC_CACHE_TTL,
      },
    }
  )

  return deduplicate(assignments.map((assignment) => assignment.role_id))
}
