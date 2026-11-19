import { AuthContext, MedusaContainer, RbacScope } from "@medusajs/types"
import {
  listRolePermissions,
  PermissionSet,
} from "../../policies/has-permission"
import { resolveRoles } from "./resolve-roles"

/**
 * The permissions an actor holds, as `resource:operation` keys with wildcards
 * kept as stored. Check them with `isGranted`.
 *
 * The actor's unscoped role assignments always count. Those scoped to `scope`
 * only count when it is provided, so without a scope the result is the
 * actor's unscoped privileges.
 */
export const getActorPermissions = async ({
  authContext,
  container,
  scope,
}: {
  authContext: Pick<AuthContext, "actor_type" | "actor_id">
  container: MedusaContainer
  scope?: RbacScope
}): Promise<PermissionSet> => {
  const roles = await resolveRoles({ authContext, container, scope })

  if (!roles.length) {
    return new Set()
  }

  return new Set(await listRolePermissions({ roles, container }))
}
