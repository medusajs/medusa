/**
 * How to derive a scope id while walking a role source's `path`.
 */
export interface RoleSourceScope {
  type: string
  path: string
}

/**
 * A declarative role source. Roles are resolved by counting
 * `rbac_role_assignment` rows for a reference entity reachable from the actor.
 *
 * @example
 * ```ts
 * {
 *   reference: "user",
 *   path: "memberships.organization.id",
 *   scope: { type: "organization", path: "memberships.organization.id" },
 * }
 * ```
 */
export interface DeclarativeRoleSource {
  /**
   * The query-graph entity name whose `rbac_role_assignment` rows count as
   * roles for the actor (e.g. `user`, `invite`, `custom`).
   */
  reference: string
  /**
   * An optional query-graph field path from the actor entity to the reference
   * entity's `id` (ending at the `id` field). When omitted, the actor itself is
   * the reference (i.e. `reference_id = actor id`).
   */
  path?: string
  /**
   * Optionally declares how to derive a scope id along the `path`. Its `path`
   * must share a leading prefix with the source `path` and likewise end at an
   * `id` field.
   *
   * @example
   * ```ts
   * {
   *   type: "organization",
   *   path: "organizations.id",
   * }
   * ```
   */
  scope?: RoleSourceScope
}

/**
 * A role resolved for an actor.
 *
 * @property role_id - The ID of the role.
 * @property source - The assigned source entity for the role from which it was resolved.
 * @property scope - The scope entity that was applied when resolving the role.
 *
 * @example
 * ```ts
 * {
 *   role_id: "role_123",
 *   source: { reference: "membership", reference_id: "mem_456" },
 *   scope: { type: "organization", id: "org_xyz" },
 * }
 * ```
 */
export interface ResolvedRole {
  role_id: string
  source: { reference: string; reference_id: string }
  scope?: { type: string; id: string }
}

/**
 * A function role source. Used as an escape hatch when a declarative path
 * cannot express how the actor's roles are derived.
 */
export interface FunctionRoleSource {
  resolve: (args: {
    actorType: string
    actorId: string
    container: unknown
  }) => Promise<ResolvedRole[]>
}

export type RoleSource = DeclarativeRoleSource | FunctionRoleSource

/**
 * Global registry mapping an actor type to its registered role sources.
 */
const RoleSources: Record<string, RoleSource[]> = global.RoleSources ?? {}

global.RoleSources ??= RoleSources

function isFunctionRoleSource(
  source: RoleSource
): source is FunctionRoleSource {
  return typeof (source as FunctionRoleSource).resolve === "function"
}

/**
 * Register the role sources used to resolve effective roles for an actor type.
 *
 * Registration follows REPLACE semantics: registering for an actor type fully
 * replaces any prior registration for that actor type. Include the direct
 * source (`{ reference: actorType }`) explicitly when both the direct and a
 * path source are wanted.
 *
 * @param actorType - The actor type these sources resolve roles for.
 * @param sources - A single role source or array of role sources.
 *
 * @example
 * ```ts
 * defineRoleSources("end_user", [
 *   { reference: "end_user" },
 *   {
 *     reference: "membership",
 *     path: "memberships.organization.id",
 *     scope: { type: "organization", path: "organization.id" },
 *   },
 * ])
 *
 * defineRoleSources("machine_client", {
 *   resolve: async ({ actorId, container }) => resolvedRoles,
 * })
 * ```
 */
export function defineRoleSources(
  actorType: string,
  sources: RoleSource | RoleSource[]
): void {
  if (!actorType) {
    throw new Error("Role source definition must include a non-empty actorType")
  }

  const sourcesArray = Array.isArray(sources) ? sources : [sources]

  if (!sourcesArray.length) {
    throw new Error(
      `Role source definition for actor type "${actorType}" must include at least one source`
    )
  }

  for (const source of sourcesArray) {
    const isFunction = isFunctionRoleSource(source)

    if (!isFunction && !(source as DeclarativeRoleSource).reference) {
      throw new Error(
        `Declarative role source for actor type "${actorType}" must include a non-empty "reference"`
      )
    }
  }

  RoleSources[actorType] = sourcesArray
}

/**
 * Return the role sources registered for an actor type, or the default
 * `[{ reference: actorType }]` when nothing is registered.
 *
 * @param actorType - The actor type to look up sources for.
 */
export function getRoleSources(actorType: string): RoleSource[] {
  return RoleSources[actorType] ?? [{ reference: actorType }]
}

export { RoleSources }

/**
 * Cache key under which an actor's resolved roles are stored.
 */
export function buildActorRolesCacheKey(
  actorType: string,
  actorId: string
): string {
  return `rbac:actor_roles:${actorType}:${actorId}`
}

/**
 * Cache tag tying an actor's resolved-roles cache entry to a reference entity
 * whose `rbac_role_assignment` rows were consulted (including references that
 * currently have no assignments). Assignment mutations invalidate this tag so
 * affected actors are re-resolved on their next request.
 */
export function buildRoleAssignmentCacheTag(
  reference: string,
  referenceId: string
): string {
  return `rbac_assignments:${reference}:${referenceId}`
}
