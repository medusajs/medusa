import { getRequestActorRoleIds, resolvePermissions } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  isDefined,
  Policy,
  WILDCARD,
} from "@medusajs/framework/utils"
import RbacFeatureFlag from "../../../../../feature-flags/rbac"

/**
 * Returns the authenticated actor's effective permission set as a flat array
 * of `resource:operation` strings, with wildcards already expanded.
 *
 * The "universe" of meaningful permissions is the union of:
 *   - policies registered in code via `definePolicies()` (the global `Policy`
 *     registry), and
 *   - distinct `(resource, operation)` rows currently in `rbac_policy` (covers
 *     policies registered at runtime by admins or plugins).
 *
 * Wildcard-only tuples are excluded — they're grants, not permissions.
 *
 * Clients can rely on literal set membership.
 *
 * @ignore
 * @featureFlag rbac
 */
// TODO: revisit when we have role resolution
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    { scope?: string; scope_id?: string }
  >,
  res: MedusaResponse<HttpTypes.AdminRbacMePermissionsResponse>
) => {
  const actorId = req.auth_context.actor_id
  const actorType = req.auth_context.actor_type

  if (!actorId || !actorType) {
    res.status(200).json({ permissions: [] })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { scope, scope_id } = req.validatedQuery
  if (isDefined(scope) && isDefined(scope_id)) {
    req.rbacScopes = { type: scope, id: scope_id }
  }

  const roleIds = await getRequestActorRoleIds(req)

  // Build the universe from code-registered + DB-persisted policies.
  const universe: Array<{ resource: string; operation: string }> = []
  const seen = new Set<string>()

  const consider = (resource?: string, operation?: string) => {
    if (
      !resource ||
      !operation ||
      resource === WILDCARD ||
      operation === WILDCARD
    ) {
      return
    }
    const key = `${resource}:${operation}`
    if (seen.has(key)) {
      return
    }
    seen.add(key)
    universe.push({ resource, operation })
  }

  for (const definition of Object.values(Policy)) {
    consider(definition?.resource, definition?.operation)
  }

  const { data: persistedPolicies } = await query.graph({
    entity: "rbac_policy",
    fields: ["resource", "operation"],
  })

  for (const policy of persistedPolicies ?? []) {
    consider(policy?.resource, policy?.operation)
  }

  const granted = await resolvePermissions({
    roles: roleIds,
    universe,
    container: req.scope,
  })

  res.status(200).json({ permissions: Array.from(granted).sort() })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
