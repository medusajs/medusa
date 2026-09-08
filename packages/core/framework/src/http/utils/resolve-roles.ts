import { AuthContext, MedusaContainer, RbacScope } from "@medusajs/types"
import { deduplicate, Modules } from "@medusajs/utils"
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

  const authzConfig = await rbacModule.retrieveActorAutzContextConfig(
    actor_type
  )

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

  const assignments = await rbacModule.listRbacRoleAssignments({
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
  })

  return deduplicate(assignments.map((assignment) => assignment.role_id))
}
