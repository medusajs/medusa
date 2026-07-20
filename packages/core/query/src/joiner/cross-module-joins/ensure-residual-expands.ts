import { RemoteJoinerQuery } from "@medusajs/types"
import { deduplicate, isObject } from "@medusajs/utils"

/**
 * Ensures expand nodes exist for a residual cross-module filter path so stage 2
 * can load related rows. Filter field keys are requested as fields; the filters
 * themselves are applied in memory (not on expand args), which avoids fieldAlias
 * `forwardArgumentsOnPath` dropping them and keeps module fetches filter-agnostic.
 */
export function ensureResidualExpand(
  query: RemoteJoinerQuery,
  path: string,
  filters: Record<string, unknown>
): void {
  query.expands ??= []
  attachFieldsAlongPath(query, path.split("."), filters)
}

/**
 * Removes residual filters from an expand's args after they have been recorded
 * on the plan for in-memory evaluation.
 */
export function stripExpandFilters(
  expand: NonNullable<RemoteJoinerQuery["expands"]>[number]
): void {
  if (!expand.args?.length) {
    return
  }

  const remaining = expand.args.filter((arg) => arg.name !== "filters")
  if (remaining.length) {
    expand.args = remaining
  } else {
    delete expand.args
  }
}

function attachFieldsAlongPath(
  query: RemoteJoinerQuery,
  pathSegments: string[],
  filters: Record<string, unknown>
): void {
  const property = pathSegments.join(".")
  const expand = ensureExpandNode(query, property)

  const fieldFilters: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(filters)) {
    if (key === "$and" || key === "$or") {
      fieldFilters[key] = value
      continue
    }

    if (isNestedRelationFilter(key, value)) {
      attachFieldsAlongPath(
        query,
        [...pathSegments, key],
        value as Record<string, unknown>
      )
      continue
    }

    fieldFilters[key] = value
  }

  mergeFields(expand, collectFilterFields(fieldFilters))
}

function ensureExpandNode(
  query: RemoteJoinerQuery,
  property: string
): NonNullable<RemoteJoinerQuery["expands"]>[number] {
  const expands = query.expands!
  const existing = expands.find((expand) => expand.property === property)
  if (existing) {
    return existing
  }

  if (property.includes(".")) {
    ensureExpandNode(query, property.slice(0, property.lastIndexOf(".")))
  }

  const created = { property }
  expands.push(created)
  return created
}

function mergeFields(
  expand: NonNullable<RemoteJoinerQuery["expands"]>[number],
  fields: string[]
): void {
  if (!fields.length) {
    return
  }

  expand.fields = deduplicate([...(expand.fields ?? []), ...fields])
}

function collectFilterFields(filters: Record<string, unknown>): string[] {
  const fields: string[] = []

  for (const [key, value] of Object.entries(filters)) {
    if (key === "$and" || key === "$or") {
      if (Array.isArray(value)) {
        for (const condition of value) {
          if (isObject(condition)) {
            fields.push(
              ...collectFilterFields(condition as Record<string, unknown>)
            )
          }
        }
      }
      continue
    }

    if (key.startsWith("$") || isNestedRelationFilter(key, value)) {
      continue
    }

    fields.push(key)
  }

  return fields
}

/**
 * Plain object filter values whose keys are not operators are treated as
 * nested relation filters (same heuristic as stage-1 collectCandidates).
 */
function isNestedRelationFilter(key: string, value: unknown): boolean {
  if (key.startsWith("$") || !isObject(value) || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value)
  return keys.length > 0 && !keys.every((entry) => entry.startsWith("$"))
}
