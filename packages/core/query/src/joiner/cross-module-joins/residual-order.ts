import { ResidualOrderBy } from "../types"
import { compareValues } from "./in-memory-filter"
import {
  addHidden,
  ConsumeContext,
  ensureExpandPath,
  ensureResidualData,
  resolvesToRelations,
} from "./residual-filters"

/**
 * Stage 2 of cross-module sorting: applies in memory the root ordering that
 * stage 1 could not push down to SQL. Sort keys are lexicographically
 * significant, so a single residual key moves the whole ordering here (see
 * rewriteRootOrder).
 *
 * At compile time, {@link consumeResidualOrderBy} loads the values the sort
 * keys read, reusing the residual-filter machinery. At execute time,
 * {@link sortByResidualOrder} sorts the (already filtered) root items before
 * hiding and pagination.
 */

/** Loads the values the sort keys read, recording additions for hiding. */
export function consumeResidualOrderBy(
  context: ConsumeContext,
  residualOrderBy: ResidualOrderBy[]
): void {
  for (const orderBy of residualOrderBy) {
    ensureOrderByData(context, orderBy.segments)
  }
}

/**
 * Loads the value one sort key reads. The longest relation-resolving prefix
 * of the key becomes the expand path and the remainder a field path into its
 * target, loaded like a residual filter would be (computed fields become
 * child value nodes). Keys with no relation prefix read root-level fields.
 */
function ensureOrderByData(context: ConsumeContext, segments: string[]): void {
  let prefixLength = 0
  for (let end = segments.length; end >= 1; end--) {
    if (resolvesToRelations(context, segments.slice(0, end))) {
      prefixLength = end
      break
    }
  }

  const fieldPath = segments.slice(prefixLength)

  if (!prefixLength) {
    ensureRootField(context, fieldPath[0])
    return
  }

  if (!fieldPath.length) {
    ensureExpandPath(context, segments, [])
    return
  }

  const shape = fieldPath.reduceRight<unknown>(
    (acc, key) => ({ [key]: acc }),
    true
  )

  ensureResidualData(
    context,
    segments.slice(0, prefixLength),
    shape as Record<string, unknown>
  )
}

function ensureRootField(context: ConsumeContext, field: string): void {
  const fields = (context.query.fields ??= [])

  if (fields.includes("*") || fields.includes(field)) {
    return
  }

  fields.push(field)
  addHidden(context, [], field)
}

/**
 * Sorts items in place, most significant key first. To-many hops sort by
 * their first element; nulls sort last ascending and first descending
 * (Postgres defaults).
 */
export function sortByResidualOrder(params: {
  items: any[]
  orderBy: ResidualOrderBy[]
}): void {
  const { items, orderBy } = params

  items.sort((left, right) => {
    for (const { segments, direction } of orderBy) {
      const result = compareSortValues(
        getSortValue(left, segments),
        getSortValue(right, segments),
        direction
      )
      if (result !== 0) {
        return result
      }
    }
    return 0
  })
}

function getSortValue(item: unknown, segments: string[]): unknown {
  let current = item
  for (const segment of segments) {
    if (current == null) {
      return null
    }
    if (Array.isArray(current)) {
      current = current[0]
    }
    current = (current as Record<string, unknown>)?.[segment]
  }
  return Array.isArray(current) ? current[0] : current
}

function compareSortValues(
  left: unknown,
  right: unknown,
  direction: "ASC" | "DESC"
): number {
  let result: number
  if (left == null || right == null) {
    if (left == null && right == null) {
      return 0
    }
    result = left == null ? 1 : -1
  } else {
    result = compareValues(left, right) ?? 0
  }

  return direction === "DESC" ? -result : result
}
