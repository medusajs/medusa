import { resolvePermissions } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
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
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRbacMePermissionsResponse>
) => {
  const actorId = req.auth_context.actor_id
  const actorType = req.auth_context.actor_type

  if (!actorId || !actorType) {
    res.status(200).json({ permissions: [] })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: actors } = await query.graph({
    entity: actorType,
    fields: ["id", "rbac_roles.id"],
    filters: { id: actorId },
  })

  const roleIds: string[] =
    actors?.[0]?.rbac_roles?.map((r: { id: string }) => r.id).filter(Boolean) ??
    []

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
