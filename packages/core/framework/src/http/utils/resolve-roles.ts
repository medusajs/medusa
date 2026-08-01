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
   * The scope should always be resolved by the application. But it can be provided for
   * unscoped requests, to resolve roles for a specific scope.
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

  const assignments = await rbacModule.listRbacRoleAssignments({
    $and: [
      {
        $or: authzContext.grantees.map((g) => ({
          reference: g.type,
          reference_id: g.id,
        })),
      },
      ...(scope
        ? [
            {
              $or: [
                { scope: scope.type, scope_id: scope.id },
                // Unscoped role assignments allow exercising privileges across all scopes.
                { scope: null, scope_id: null },
              ],
            },
          ]
        : []),
    ],
  })

  return deduplicate(assignments.map((assignment) => assignment.role_id))
}
