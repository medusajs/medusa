import { AuthenticatedMedusaRequest } from "@medusajs/types"
import { deduplicate, Modules } from "@medusajs/utils"
import { buildAuthzContext } from "./build-authz-context"

export const resolveRoles = async (req: AuthenticatedMedusaRequest) => {
  const rbacModule = req.scope.resolve(Modules.RBAC)

  const authzConfig = await rbacModule.retrieveActorAutzContextConfig(
    req.auth_context.actor_type
  )

  if (!authzConfig) {
    return []
  }

  const { actor_type, actor_id } = req.auth_context
  const authzContext = await buildAuthzContext({
    actor_type,
    actor_id,
    config: authzConfig,
    container: req.scope,
  })

  const scope = await rbacModule.resolveScope(req)

  const assignments = await rbacModule.listRbacRoleAssignments({
    $or: authzContext.grantees.map((g) => ({
      reference: g.type,
      reference_id: g.id,
    })),
    ...(scope ? { scope: { scope: scope.type, scope_id: scope.id } } : {}),
  })

  return deduplicate(assignments.map((assignment) => assignment.role_id))
}
