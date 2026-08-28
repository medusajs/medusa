import { resolvePermissions } from "@medusajs/framework"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  resolveRoles,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  WILDCARD,
} from "@medusajs/framework/utils"
import RbacFeatureFlag from "../../../../feature-flags/rbac"

/**
 * Returns the authenticated actor's effective permission set as a flat array
 * of `resource:operation` strings, with wildcards already expanded.
 *
 * The "universe" of meaningful permissions is the set of distinct
 * `(resource, operation)` rows currently in `rbac_policy`. It covers both the
 * core policies seeded by the RBAC module's loader and policies created at
 * runtime by admins or plugins.
 *
 * Wildcard-only tuples are excluded — they're grants, not permissions.
 *
 * Clients can rely on literal set membership.
 *
 * The response also carries the actor's directly assigned roles, and the
 * names of the roles the actor "covers" — roles whose expanded grant set is a
 * subset of the actor's expanded grant set. Coverage is the useful semantic
 * for role-based UI guards: a super admin (`*:*`) covers every role without
 * being assigned any. Assigned roles are always covered.
 *
 * @ignore
 * @featureFlag rbac
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<
    undefined,
    { scope?: string; scope_id?: string }
  >,
  res: MedusaResponse<HttpTypes.AdminRbacMePermissionsResponse>
) => {
  const { actor_id, actor_type } = req.auth_context

  if (!actor_id || !actor_type) {
    res.status(200).json({ permissions: [], roles: [], covered_roles: [] })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { scope: providedScope, scope_id: providedScopeId } = req.validatedQuery
  const scope =
    providedScope && providedScopeId
      ? { type: providedScope, id: providedScopeId }
      : req.rbac_context?.scope

  // Build the universe from the persisted policies.
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

  const { data: persistedPolicies } = await query.graph({
    entity: "rbac_policy",
    fields: ["resource", "operation"],
  })

  for (const policy of persistedPolicies ?? []) {
    consider(policy?.resource, policy?.operation)
  }

  const roleIds = await resolveRoles({
    authContext: { actor_id, actor_type },
    container: req.scope,
    scope,
  })

  const granted = await resolvePermissions({
    roles: roleIds,
    universe,
    container: req.scope,
  })

  let roles: Array<{ id: string; name: string }> = []
  if (roleIds.length) {
    const { data: roleRows } = await query.graph(
      {
        entity: "rbac_role",
        fields: ["id", "name"],
        filters: { id: roleIds },
      },
      { cache: { enable: true } }
    )

    roles = (roleRows ?? [])
      .map((role) => ({ id: role.id, name: role.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  // Covered roles: every role whose expanded grant set is a subset of the
  // actor's expanded grant set. Expanding both sides against the same
  // universe makes wildcards on either side comparable literally.
  const { data: allRoles } = await query.graph(
    {
      entity: "rbac_role",
      fields: ["id", "name"],
    },
    { cache: { enable: true } }
  )

  const coverage = await Promise.all(
    (allRoles ?? []).map(async (role) => {
      const roleGrants = await resolvePermissions({
        roles: [role.id],
        universe,
        container: req.scope,
      })

      const isCovered =
        roleGrants.size > 0 &&
        Array.from(roleGrants).every((permission) => granted.has(permission))

      return isCovered ? (role.name as string) : null
    })
  )

  const coveredRoles = coverage
    .filter((name): name is string => name !== null)
    .sort()

  res.status(200).json({
    permissions: Array.from(granted).sort(),
    roles,
    covered_roles: coveredRoles,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
