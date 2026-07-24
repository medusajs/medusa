import { MedusaError } from "@medusajs/utils"

/**
 * A role assigned reference entity collected while walking an actor's role source `path`, optionally
 * paired with the role's scope entity id used to bound it in scope aware role queries.
 *
 * @property reference_id - The ID of the reference entity the role is assigned to.
 * @property scope_id - The ID of the entity that expresses the role's scope.
 *
 * @example
 * ```ts
 * {
 *   reference_id: "mem_456",
 *   scope_id: "org_xyz",
 * }
 * ```
 */
export type CollectedReference = {
  reference_id: string
  scope_id?: string
}

/**
 * Walks the dot-separated `segments` starting from `node`, flattening any
 * to-many relation (array) encountered at any level, and returns every leaf
 * value reached.
 */
function collectValues(node: unknown, segments: string[]): unknown[] {
  if (node == null) {
    return []
  }

  if (Array.isArray(node)) {
    return node.flatMap((item) => collectValues(item, segments))
  }

  if (segments.length === 0) {
    return [node]
  }

  const [head, ...rest] = segments
  return collectValues((node as Record<string, unknown>)[head], rest)
}

function collectStrings(node: unknown, segments: string[]): string[] {
  return collectValues(node, segments).filter(
    (value): value is string => typeof value === "string"
  )
}

function commonPrefixLength(a: string[], b: string[]): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++
  }
  return i
}

/**
 * Collects the role assigned reference entity ids reachable from an actor entity node along a
 * role source's `path`, and — when a `scopePath` is provided — associates each
 * reference with the entity id that expresses the role's scope.
 *
 * Both `path` and `scopePath` are query-graph field paths evaluated from the
 * actor entity, each ending at the `id` field they resolve — `path` at the
 * role assigned reference entity's id, `scopePath` at the scope entity's id. Path segments may
 * traverse to-many relations, so arrays are flattened at any level.
 *
 * ### Scope association
 *
 * The scope is the entity a role assignment is granted _within_ (e.g. an
 * `organization`).
 *
 * `scopePath` must **share a leading prefix** with `path`: the shared prefix is
 * the common ancestor entity, and each role assigned reference is associated with the scope id
 * of the branch node at which that prefix ends, so the per-scope mapping is
 * derived structurally rather than guessed.
 *
 * ```ts
 * // actor "end_user", path "memberships.organization.id", scope "memberships.organization.id"
 * const root = {
 *   memberships: [
 *     { id: "mem_1", organization: { id: "org_A" } },
 *     { id: "mem_2", organization: { id: "org_B" } },
 *   ],
 * }
 * collectRoleReferences(root, "memberships.organization.id", "memberships.organization.id")
 * // => [
 * //   { reference_id: "mem_1", scope_id: "org_A" },
 * //   { reference_id: "mem_2", scope_id: "org_B" },
 * // ]
 * // The shared prefix "memberships" splits the traversal into one branch per
 * // organization, so each membership is scoped to the org it was reached through.
 * ```
 *
 * Two configurations are rejected with a {@link MedusaError} `INVALID_DATA`, as
 * both are role-source misconfigurations rather than data conditions:
 *
 * - `scopePath` shares no leading prefix with `path` — nothing links a scope
 *   value to a given reference.
 * - the scope sub-path _after_ the shared prefix fans out over a to-many
 *   relation, so a single branch yields multiple scope values with no basis for
 *   choosing one.
 *
 * ```ts
 * // path "team.memberships.id", scope "team.owners.id", where a team has many owners
 * const root = { team: { owners: [{ id: "u_1" }, { id: "u_2" }], memberships: [{ id: "mem_1" }] } }
 * collectRoleReferences(root, "team.memberships.id", "team.owners.id")
 * // => throws INVALID_DATA: which owner scopes mem_1? ambiguous.
 * ```
 *
 * @param root - The actor entity node (a single `query.graph` result row).
 * @param path - The field path from the actor to the reference's `id`.
 * @param scopePath - Optional field path from the actor to the scope's `id`.
 */
export function collectRoleReferences(
  root: unknown,
  path: string,
  scopePath?: string
): CollectedReference[] {
  const pathSegments = path.split(".")

  if (!scopePath) {
    return collectStrings(root, pathSegments).map((reference_id) => ({
      reference_id,
    }))
  }

  const scopeSegments = scopePath.split(".")
  const prefixLength = commonPrefixLength(pathSegments, scopeSegments)

  if (prefixLength === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Role source scope path "${scopePath}" must share a leading prefix with path "${path}" so each reference can be associated with the scope reached along its own branch.`
    )
  }

  // Each reference is associated with the scope id of the branch node at which
  // the shared prefix ends.
  const branchNodes = collectValues(root, pathSegments.slice(0, prefixLength))
  const pathRest = pathSegments.slice(prefixLength)
  const scopeRest = scopeSegments.slice(prefixLength)

  const collected: CollectedReference[] = []

  for (const branch of branchNodes) {
    // Every reference under this branch shares the branch node, so the branch's
    // scope must be a single value. If the scope sub-path past the shared prefix
    // fans out over a to-many relation, there is no basis for choosing one, so
    // reject it as a misconfiguration instead of arbitrarily taking the first.
    const scopeValues = Array.from(new Set(collectStrings(branch, scopeRest)))

    if (scopeValues.length > 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Role source scope path "${scopePath}" resolves to multiple values within a single branch of path "${path}". Each branch must yield a single scope value.`
      )
    }

    const scope_id = scopeValues[0]
    const referenceIds = collectStrings(branch, pathRest)

    for (const reference_id of referenceIds) {
      collected.push({ reference_id, scope_id })
    }
  }

  return collected
}
