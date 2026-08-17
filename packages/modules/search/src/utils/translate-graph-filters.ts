import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { flattenFields } from "./index"

const BRANCH_KEYS = new Set(["$and", "$or", "$not"])

/**
 * Every key an operator map may hold. A nested object is a field group only if
 * it holds none of these — see `isOperatorMap`.
 */
const OPERATOR_KEYS = new Set<string>([
  "$eq",
  "$ne",
  "$in",
  "$nin",
  "$lt",
  "$lte",
  "$gt",
  "$gte",
  "$exists",
  "$contains",
  "$overlaps",
  "$prefix",
  "$like",
  // Not in `SearchOperatorMap`, but recognised so a database filter carrying one
  // is left for `validateFieldUsage` to reject by name, rather than mistaken for
  // a field group and flattened into a nonsense path.
  "$ilike",
  "$re",
  "$overlap",
])

/**
 * `{ $gte: 1 }` constrains a field; `{ sku: "..." }` names one. Only the second
 * is descended into. An empty object is left alone — there is nothing to
 * flatten, and guessing either way would change meaning.
 */
function isOperatorMap(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((key) => OPERATOR_KEYS.has(key))
}

function isFieldGroup(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    Object.keys(value).length > 0 &&
    !isOperatorMap(value as Record<string, unknown>)
  )
}

/**
 * Rewrites `query.graph`-shaped filters into the flat, dotted form an index
 * takes: `{ variants: { sku } }` becomes `{ "variants.sku": ... }`.
 *
 * A field that declares `graph_path` is matched by that path instead of its own,
 * so an index need not mirror the graph's naming.
 *
 * Paths the index does not hold are passed through untouched rather than
 * dropped: `validateFieldUsage` then names the offending path, whereas silently
 * discarding a filter would report matches that should have been excluded.
 */
export function translateGraphFilters({
  filters,
  index,
}: {
  filters: SearchTypes.SearchFilters
  index: Pick<SearchTypes.ResolvedSearchIndexDefinition, "fields">
}): SearchTypes.SearchFilters {
  const byGraphPath = new Map<string, string>()

  for (const { path, field } of flattenFields(index.fields)) {
    if (field.graph_path) {
      byGraphPath.set(field.graph_path, path)
    }
  }

  const assign = (
    scope: Record<string, unknown>,
    path: string,
    value: unknown
  ) => {
    const target = byGraphPath.get(path) ?? path

    // Two graph paths landing on one index path would silently drop a
    // predicate, so the collision is surfaced instead.
    if (target in scope) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Filter path "${path}" maps to "${target}", which another filter in the same group already set`
      )
    }

    scope[target] = value
  }

  /**
   * Field groups flatten into the *same* scope with a longer prefix, while
   * `$and`/`$or`/`$not` open a new one — a path may legitimately repeat across
   * branches, and only within a branch is it a collision.
   */
  const walk = (
    node: SearchTypes.SearchFilters,
    prefix: string,
    scope: Record<string, unknown>
  ): void => {
    const branch = (value: SearchTypes.SearchFilters) => {
      const nested: Record<string, unknown> = {}
      walk(value, prefix, nested)
      return nested
    }

    for (const [key, value] of Object.entries(node)) {
      // `q` is not a field, and only ever sits at the root.
      if (!prefix && key === "q") {
        scope.q = value
        continue
      }

      if (BRANCH_KEYS.has(key)) {
        scope[key] = Array.isArray(value)
          ? value.map((entry) => branch(entry as SearchTypes.SearchFilters))
          : branch(value as SearchTypes.SearchFilters)
        continue
      }

      const path = prefix ? `${prefix}.${key}` : key

      // A path with its own mapping is taken as a leaf, even when it looks like
      // a group: the index declared it as one field.
      if (isFieldGroup(value) && !byGraphPath.has(path)) {
        walk(value as SearchTypes.SearchFilters, path, scope)
        continue
      }

      assign(scope, path, value)
    }
  }

  const out: Record<string, unknown> = {}
  walk(filters, "", out)

  return out as SearchTypes.SearchFilters
}
