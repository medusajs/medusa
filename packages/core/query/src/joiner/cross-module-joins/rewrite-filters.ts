import { JoinerArgument, RemoteJoinerQuery } from "@medusajs/types"
import { isObject } from "@medusajs/utils"
import { GraphCatalog } from "../catalog"
import {
  InternalJoinerServiceConfig,
  ResidualCrossModuleFilter,
} from "../types"
import { resolveChain } from "./build-chain"
import { registerCandidates } from "./spec-registry"
import { ChainLevel, PushdownCandidate, SpecRegistry } from "./types"

// Operators the DAL cross-module `buildFilterSql` understands.
const SUPPORTED_OPERATORS = new Set([
  "$eq",
  "$ne",
  "$in",
  "$nin",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$like",
  "$ilike",
  "$is",
])

/**
 * Cross-module filters expressed on the root filters object, e.g.
 * `filters: { price_set: { id: "..." } }` on the `variant` entry point.
 */
export function rewriteRootFilters(params: {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  registry: SpecRegistry
  residual: ResidualCrossModuleFilter[]
}): void {
  const { query, serviceConfig, catalog, registry, residual } = params
  const rootFilters = getFiltersArg(query.args)?.value

  if (!isObject(rootFilters)) {
    return
  }

  for (const [key, value] of Object.entries(rootFilters)) {
    if (key.startsWith("$") || !isObject(value)) {
      continue
    }

    const resolution = resolveChain(
      { rootConfig: serviceConfig, pathSegments: [key] },
      catalog
    )

    // Same-module paths (and plain object-valued filters) are handled
    // natively by the root module — leave them in place.
    if (resolution.outcome === "native") {
      continue
    }

    // Paths that cross modules but cannot be pushed down are residual.
    if (resolution.outcome === "residual") {
      residual.push({
        path: key,
        filters: value as Record<string, unknown>,
      })
      continue
    }

    const candidates = collectCandidates(
      {
        pathSegments: [key],
        levels: resolution.levels,
        filters: value as Record<string, unknown>,
        rootConfig: serviceConfig,
      },
      catalog
    )

    if (!candidates || !registerCandidates(registry, candidates)) {
      residual.push({ path: key, filters: value as Record<string, unknown> })
      continue
    }

    delete rootFilters[key]
  }
}

/**
 * Cross-module filters that were assigned to nested expand nodes, e.g.
 * `filters: { price_set: { prices: { amount: 10 } } }` lands on the
 * `price_set.prices` expand.
 */
export function rewriteExpandFilters(params: {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  registry: SpecRegistry
  residual: ResidualCrossModuleFilter[]
}): void {
  const { query, serviceConfig, catalog, registry, residual } = params

  // Iterate a snapshot: pruning removes entries from query.expands.
  const expandsWithFilters = (query.expands ?? []).filter((expand) => {
    const filters = getFiltersArg(expand.args)?.value
    return isObject(filters) && Object.keys(filters).length > 0
  })

  for (const expand of expandsWithFilters) {
    const filters = getFiltersArg(expand.args)!.value as Record<string, unknown>
    const pathSegments = expand.property.split(".")

    const resolution = resolveChain(
      { rootConfig: serviceConfig, pathSegments },
      catalog
    )

    // Same-module expand filters keep their native behavior (they filter the
    // children fetch within the module).
    if (resolution.outcome === "native") {
      continue
    }

    const candidates =
      resolution.outcome === "pushable" &&
      collectCandidates(
        {
          pathSegments,
          levels: resolution.levels,
          filters,
          rootConfig: serviceConfig,
        },
        catalog
      )

    if (!candidates || !registerCandidates(registry, candidates)) {
      residual.push({ path: expand.property, filters })
      continue
    }

    pruneFiltersFromExpand(query, expand)
  }
}

/**
 * Splits a filters object located at `pathSegments` into pushdown candidates:
 * field filters apply to the path's own target, while plain-object values
 * whose key resolves to a further pushable hop become deeper candidates.
 *
 * All-or-nothing: returns undefined when anything at this location cannot be
 * pushed down, so a location is never left half-applied.
 */
function collectCandidates(
  params: {
    pathSegments: string[]
    levels: ChainLevel[]
    filters: Record<string, unknown>
    rootConfig: InternalJoinerServiceConfig
  },
  catalog: GraphCatalog
): PushdownCandidate[] | undefined {
  const { pathSegments, levels, filters, rootConfig } = params

  const leaf = levels[levels.length - 1]
  const metadata = catalog.getAliasMetadata(leaf.entity)
  const crossjoinable = new Set(metadata?.crossjoinable ?? [])

  const fieldFilters: Record<string, unknown> = {}
  const candidates: PushdownCandidate[] = []

  for (const [key, value] of Object.entries(filters)) {
    const isRelationCandidate =
      !key.startsWith("$") && !crossjoinable.has(key) && isObject(value)

    if (isRelationCandidate) {
      const deeperSegments = [...pathSegments, key]
      // The path prefix already crosses modules, so anything other than
      // pushable — including unresolvable — fails the location.
      const resolution = resolveChain(
        { rootConfig, pathSegments: deeperSegments },
        catalog
      )

      if (resolution.outcome !== "pushable") {
        return undefined
      }

      const nested = collectCandidates(
        {
          pathSegments: deeperSegments,
          levels: resolution.levels,
          filters: value as Record<string, unknown>,
          rootConfig,
        },
        catalog
      )

      if (!nested) {
        return undefined
      }

      candidates.push(...nested)
      continue
    }

    fieldFilters[key] = value
  }

  if (!areFiltersPushable(fieldFilters, crossjoinable)) {
    return undefined
  }

  // Even without own filters the level must be registered so deeper
  // candidates can correlate to it through `parent`.
  candidates.unshift({ levels, filters: fieldFilters })

  return candidates
}

/**
 * Whether a filters object can be handed to the DAL cross-module SQL builder
 * as-is: every field is crossjoinable (a non-computed DML column), every
 * operator is supported, and no value smuggles in a nested object.
 */
function areFiltersPushable(
  filters: Record<string, unknown>,
  crossjoinable: Set<string>
): boolean {
  return Object.entries(filters).every(([key, value]) => {
    if (key === "$and" || key === "$or") {
      return (
        Array.isArray(value) &&
        value.every(
          (condition) =>
            isObject(condition) &&
            areFiltersPushable(
              condition as Record<string, unknown>,
              crossjoinable
            )
        )
      )
    }

    if (key.startsWith("$")) {
      return false
    }

    if (!crossjoinable.has(key)) {
      return false
    }

    return isPushableFilterValue(value)
  })
}

function isPushableFilterValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.every((entry) => !isObject(entry))
  }

  if (isObject(value)) {
    const operators = Object.keys(value)

    if (!operators.length) {
      return false
    }

    return operators.every(
      (operator) =>
        SUPPORTED_OPERATORS.has(operator) &&
        isPushableOperatorValue((value as Record<string, unknown>)[operator])
    )
  }

  return true
}

function isPushableOperatorValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.every((entry) => !isObject(entry))
  }

  return !isObject(value)
}

/**
 * Removes the pushed-down filters arg from the expand, then drops the expand
 * (and any ancestors that only existed to reach it) when nothing else —
 * requested fields, other args, or remaining descendants — needs the fetch.
 */
function pruneFiltersFromExpand(
  query: RemoteJoinerQuery,
  expand: NonNullable<RemoteJoinerQuery["expands"]>[number]
): void {
  const remainingArgs = (expand.args ?? []).filter(
    (arg) => arg.name !== "filters"
  )
  if (remainingArgs.length) {
    expand.args = remainingArgs
  } else {
    delete expand.args
  }

  const expands = query.expands!

  let property: string | undefined = expand.property
  while (property) {
    const node = expands.find((entry) => entry.property === property)
    if (!node) {
      break
    }

    const prefix = property + "."
    const hasDescendants = expands.some(
      (entry) => entry !== node && entry.property.startsWith(prefix)
    )

    if (
      hasDescendants ||
      node.fields?.length ||
      node.args?.length ||
      node.directives
    ) {
      break
    }

    expands.splice(expands.indexOf(node), 1)
    property = property.includes(".")
      ? property.slice(0, property.lastIndexOf("."))
      : undefined
  }
}

function getFiltersArg(args?: JoinerArgument[]): JoinerArgument | undefined {
  return args?.find((arg) => arg.name === "filters")
}
