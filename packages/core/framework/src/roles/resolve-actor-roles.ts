import { IRbacModuleService, MedusaContainer } from "@medusajs/types"
import {
  buildActorRolesCacheKey,
  buildRoleAssignmentCacheTag,
  ContainerRegistrationKeys,
  DeclarativeRoleSource,
  FunctionRoleSource,
  getRoleSources,
  Modules,
  RbacScopeRef,
  ResolvedRole,
  RoleSource,
  useCache,
} from "@medusajs/utils"
import { FlagRouter } from "../feature-flags/flag-router"
import { applicableRoles } from "./applicable-roles"
import { collectRoleReferences } from "./resolve-role-references"

/**
 * The input to resolve an actor's roles.
 */
export type ResolveActorRolesInput = {
  actorType: string
  actorId: string
  container: MedusaContainer
  /**
   * The scope context the roles are resolved for. When provided — a single
   * scope, several, or an empty set — only roles applicable within it are
   * returned: unscoped roles always count, scoped roles only when their scope
   * is in the set. Omitted = the actor's full scope-union policies.
   *
   * Must be derived server-side, never from an arbitrary client claim.
   */
  scope?: RbacScopeRef | RbacScopeRef[]
}

/**
 * A role assigned reference entity consulted while resolving an actor's roles, identified by
 * its `reference` (query-graph entity name) and `reference_id`.
 *
 * @example
 * ```ts
 * {
 *   reference: "user",
 *   reference_id: "usr_123",
 * }
 * ```
 */
export type ConsultedReference = {
  reference: string
  reference_id: string
}

/**
 * The full resolution result: the resolved roles plus every reference entity
 * consulted during resolution (including references that had zero assignments).
 */
export type ResolveActorRolesWithReferencesResult = {
  roles: ResolvedRole[]
  /** Superset of roles.source it contains references with zero assignments.
   * Useful for cache invalidation.
   */
  references: ConsultedReference[]
}

// Default freshness bound for the cached actor-role resolution.
const DEFAULT_ACTOR_ROLES_CACHE_TTL = 60 * 5

/**
 * Resolves the cached actor-roles TTL (seconds). Overridable via the
 * `MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL` env var, falling back to the default on a
 * missing or invalid value.
 */
function resolveActorRolesCacheTtl(): number {
  const raw = process.env.MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL
  if (!raw) {
    return DEFAULT_ACTOR_ROLES_CACHE_TTL
  }

  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ACTOR_ROLES_CACHE_TTL
}

function isFunctionRoleSource(
  source: RoleSource
): source is FunctionRoleSource {
  return typeof (source as FunctionRoleSource).resolve === "function"
}

/**
 * Resolves a declarative role source into its reference entity ids (paired with
 * the scope derived along the traversal), then loads the matching
 * `rbac_role_assignment` rows and maps them to {@link ResolvedRole}s.
 *
 * Returns both the resolved roles and every consulted reference entity —
 * including references with zero assignments — so callers can tag the cache
 * against references that must invalidate the actor when they gain a first
 * assignment.
 */
async function resolveDeclarativeSource(
  source: DeclarativeRoleSource,
  actorType: string,
  actorId: string,
  container: MedusaContainer
): Promise<ResolveActorRolesWithReferencesResult> {
  let references: { reference_id: string; scope_id?: string }[]

  if (!source.path) {
    // Without a path the actor itself is the reference entity.
    references = [{ reference_id: actorId }]
  } else {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const {
      data: [actor],
    } = await query.graph({
      entity: actorType,
      fields: [source.path, ...(source.scope ? [source.scope.path] : [])],
      filters: { id: actorId },
    })

    const root = actor
    references = root
      ? collectRoleReferences(root, source.path, source.scope?.path)
      : []
  }

  const referenceIds = Array.from(
    new Set(references.map((reference) => reference.reference_id))
  )

  // Every collected reference id is a consulted reference, regardless of
  // whether it ends up carrying any assignment rows.
  const consultedReferences: ConsultedReference[] = referenceIds.map(
    (reference_id) => ({ reference: source.reference, reference_id })
  )

  if (!referenceIds.length) {
    return { roles: [], references: consultedReferences }
  }

  // A reference entity may be reached through more than one scoped branch, so
  // accumulate every distinct scope id per reference id rather than keeping only
  // the last one seen. The scope type is constant (source.scope.type), so only
  // the id needs deduping.
  const scopeIdsByReferenceId = new Map<string, Set<string>>()
  if (source.scope) {
    for (const reference of references) {
      if (!reference.scope_id) {
        continue
      }

      let scopeIds = scopeIdsByReferenceId.get(reference.reference_id)
      if (!scopeIds) {
        scopeIds = new Set()
        scopeIdsByReferenceId.set(reference.reference_id, scopeIds)
      }
      scopeIds.add(reference.scope_id)
    }
  }

  const rbacModule = container.resolve<IRbacModuleService>(Modules.RBAC)

  const assignments = await rbacModule.listRbacRoleAssignments(
    { reference: source.reference, reference_id: referenceIds },
    { select: ["role_id", "reference_id"] }
  )

  // Emit one ResolvedRole per (assignment row, scope) pair; references with no
  // scope emit a single entry with `scope` undefined.
  const roles = assignments.flatMap((assignment) => {
    const resolvedSource = {
      reference: source.reference,
      reference_id: assignment.reference_id,
    }
    const scopeIds = scopeIdsByReferenceId.get(assignment.reference_id)

    if (!scopeIds?.size) {
      return [{ role_id: assignment.role_id, source: resolvedSource }]
    }

    return Array.from(scopeIds).map((id) => ({
      role_id: assignment.role_id,
      source: resolvedSource,
      scope: { type: source.scope!.type, id },
    }))
  })

  return { roles, references: consultedReferences }
}

/**
 * Resolves the effective roles held by an actor across all of its registered
 * role sources, returning both the roles and every reference entity consulted
 * during resolution.
 *
 * Sources come from the {@link getRoleSources} registry (defaulting to a single
 * direct source `{ reference: actorType }` when nothing is registered).
 *
 * The `references` list is what enables precise cache invalidation: it contains
 * every consulted reference, **including references that currently have zero
 * assignments**, so that creating a first assignment for an already-consulted
 * reference can invalidate the actor's cached roles. For declarative sources the
 * references are the (deduped) collected reference ids. For function sources the
 * references are derived, best-effort, from the returned roles' `source` fields
 * — a function source that consults a reference but returns no role for it
 * therefore contributes no reference (it is opaque to this resolver).
 *
 * Roles are **not** deduplicated: the same `role_id` may appear more than once
 * (across sources or scopes) and those duplicates are meaningful.
 *
 * This is the raw resolution pass: it omits `input.scope` and always returns
 * every role and every consulted reference, since cache tagging must cover
 * references regardless of the scope a given call cares about. Scope narrowing
 * belongs to {@link resolveActorRoles} / {@link resolveActorRolesCached}.
 *
 * Returns empty `roles`/`references` when the `rbac` feature flag is disabled.
 *
 * @param input - The actor type, actor id, and Medusa container.
 */
export async function resolveActorRolesWithReferences(
  input: Omit<ResolveActorRolesInput, "scope">
): Promise<ResolveActorRolesWithReferencesResult> {
  const { actorType, actorId, container } = input

  const ffRouter = container.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  ) as FlagRouter

  if (!ffRouter.isFeatureEnabled("rbac")) {
    return { roles: [], references: [] }
  }

  const sources = getRoleSources(actorType)
  const resolved: ResolvedRole[] = []
  const referencesByKey = new Map<string, ConsultedReference>()

  const addReference = (reference: ConsultedReference) => {
    referencesByKey.set(
      `${reference.reference}:${reference.reference_id}`,
      reference
    )
  }

  for (const source of sources) {
    if (isFunctionRoleSource(source)) {
      const roles = await source.resolve({ actorType, actorId, container })
      resolved.push(...roles)
      for (const role of roles) {
        if (role.source) {
          addReference({
            reference: role.source.reference,
            reference_id: role.source.reference_id,
          })
        }
      }
      continue
    }

    const { roles, references } = await resolveDeclarativeSource(
      source,
      actorType,
      actorId,
      container
    )
    resolved.push(...roles)
    references.forEach(addReference)
  }

  return { roles: resolved, references: Array.from(referencesByKey.values()) }
}

/**
 * Resolves the effective roles held by an actor across all of its registered
 * role sources, optionally narrowed to a scope context. Thin wrapper around
 * {@link resolveActorRolesWithReferences} that returns only the roles.
 *
 * Pass `input.scope` to evaluate the actor within a scope (strict: unscoped
 * roles always count, scoped roles only on a match); omit it for the full
 * scope-union policies.
 *
 * Results are **not** deduplicated: the same `role_id` may appear more than once
 * (across sources or scopes) and those duplicates are meaningful. Callers that
 * only need role ids should use {@link resolveActorRoleIds}, which flattens and
 * dedupes.
 *
 * @param input - The actor type, actor id, Medusa container, and optional scope.
 *
 * @example
 * ```ts
 * const roles = await resolveActorRoles({
 *   actorType: "end_user",
 *   actorId: "eu_123",
 *   container,
 *   scope: { type: "organization", id: "org_A" },
 * })
 * ```
 */
export async function resolveActorRoles(
  input: ResolveActorRolesInput
): Promise<ResolvedRole[]> {
  const { roles } = await resolveActorRolesWithReferences(input)
  return applicableRoles(roles, input.scope)
}

/**
 * Resolves the effective roles held by an actor and returns the unique set of
 * role ids. Convenience wrapper around {@link resolveActorRoles} for callers
 * that do not need source/scope information, honoring `input.scope` the same
 * way.
 *
 * @param input - The actor type, actor id, Medusa container, and optional scope.
 */
export async function resolveActorRoleIds(
  input: ResolveActorRolesInput
): Promise<string[]> {
  const roles = await resolveActorRoles(input)
  return Array.from(new Set(roles.map((role) => role.role_id)))
}

/**
 * Resolves the roles held by an actor (with their scopes), cached.
 *
 * The cache entry is tagged with one tag per reference entity consulted during
 * resolution — including references with zero assignments — so assignment
 * mutations can invalidate exactly the affected actors.
 *
 * TTL defaults to 5 minutes and is overridable via
 * `MEDUSA_RBAC_ACTOR_ROLES_CACHE_TTL`. This bounds the freshness of indirect
 * (path-source) changes that cannot be tag-invalidated.
 *
 * Scope filtering happens **after** the cache: the cache key is scope-agnostic,
 * so the entry always holds every resolved `(role, scope)` pair (and is tagged
 * against every consulted reference), and `input.scope` narrows the returned
 * roles per call.
 *
 * @param input - The actor type, actor id, Medusa container, and optional scope.
 */
export async function resolveActorRolesCached(
  input: ResolveActorRolesInput
): Promise<ResolvedRole[]> {
  const { actorType, actorId, container, scope } = input

  // Reference tags are appended inside the callback once resolution has
  // determined which references were consulted
  const tags: string[] = []

  const roles = await useCache<ResolvedRole[]>(
    async () => {
      // Resolve unscoped: the cached entry must hold every role and be tagged
      // against every consulted reference, regardless of this call's scope.
      const { roles, references } = await resolveActorRolesWithReferences({
        actorType,
        actorId,
        container,
      })

      for (const reference of references) {
        tags.push(
          buildRoleAssignmentCacheTag(
            reference.reference,
            reference.reference_id
          )
        )
      }

      return roles
    },
    {
      container,
      key: buildActorRolesCacheKey(actorType, actorId),
      tags,
      ttl: resolveActorRolesCacheTtl(),
      enable: true,
    }
  )

  return applicableRoles(roles, scope)
}
