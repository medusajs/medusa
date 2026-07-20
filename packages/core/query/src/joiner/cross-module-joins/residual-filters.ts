import { JoinerArgument, RemoteJoinerQuery } from "@medusajs/types"
import { isObject } from "@medusajs/utils"
import { GraphCatalog } from "../catalog"
import { getNestedItems } from "../helpers"
import {
  InternalJoinerServiceConfig,
  ResidualCrossModuleFilter,
  ResidualHiddenProperty,
} from "../types"
import { resolvePathHops } from "./build-chain"
import { isOperatorMap, matchesFilters } from "./in-memory-filter"

/**
 * Stage-2 cross-module filtering: residual filters (reported by
 * {@link extractCrossModuleJoins}) cannot be pushed down to SQL, so they are
 * completed in memory after execution.
 *
 * Compile side ({@link consumeResidualFilters}): the residual filters are
 * stripped from the query so no module DAL receives filter fields it cannot
 * handle, and the relation paths/fields the filters reference are injected as
 * regular expand entries. The existing expand machinery then loads the data —
 * child fetches are keyed by parent ids and never paginated, so the full
 * related sets needed for evaluation are available. Every property added
 * solely for evaluation is recorded so the execute stage can hide it from the
 * returned payload.
 *
 * Execute side ({@link applyResidualFilters} / {@link hideResidualProperties}):
 * after all expands are joined and fieldAlias shortcuts collapsed, root items
 * are filtered with EXISTS semantics along each residual path, and synthetic
 * properties are hidden. Pagination is re-applied by the caller afterwards so
 * page boundaries match the filtered set.
 */

type ConsumeContext = {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  /** Alias paths the user's query references (including prefixes). */
  visiblePaths: Set<string>
  hidden: ResidualHiddenProperty[]
  hiddenKeys: Set<string>
}

export function consumeResidualFilters(
  params: {
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    residuals: ResidualCrossModuleFilter[]
  },
  catalog: GraphCatalog
): ResidualHiddenProperty[] {
  const { query, serviceConfig, residuals } = params

  const context: ConsumeContext = {
    query,
    serviceConfig,
    catalog,
    visiblePaths: collectVisiblePaths(query),
    hidden: [],
    hiddenKeys: new Set(),
  }

  for (const residual of residuals) {
    stripResidualFilters(query, residual)
    ensureResidualData(context, residual.path.split("."), residual.filters)
  }

  return context.hidden
}

/**
 * Alias paths (and their prefixes) that carry user-requested content: fields
 * or non-filter args. Anything loaded outside this set exists only for
 * residual evaluation and gets hidden from the payload.
 */
function collectVisiblePaths(query: RemoteJoinerQuery): Set<string> {
  const visible = new Set<string>()

  for (const expand of query.expands ?? []) {
    const hasContent =
      !!expand.fields?.length ||
      (expand.args ?? []).some((arg) => arg.name !== "filters")

    if (!hasContent) {
      continue
    }

    const segments = expand.property.split(".")
    for (let i = 1; i <= segments.length; i++) {
      visible.add(segments.slice(0, i).join("."))
    }
  }

  return visible
}

/**
 * Removes the residual filters from wherever they live on the query: the
 * expand node that carried them, or the root filters arg.
 */
function stripResidualFilters(
  query: RemoteJoinerQuery,
  residual: ResidualCrossModuleFilter
): void {
  const expand = query.expands?.find(
    (entry) =>
      entry.property === residual.path &&
      getFiltersArg(entry.args)?.value === residual.filters
  )

  if (expand) {
    const remaining = (expand.args ?? []).filter(
      (arg) => arg.name !== "filters"
    )
    if (remaining.length) {
      expand.args = remaining
    } else {
      delete expand.args
    }
    return
  }

  const rootFilters = getFiltersArg(query.args)?.value
  if (
    isObject(rootFilters) &&
    rootFilters[residual.path] === residual.filters
  ) {
    delete rootFilters[residual.path]
  }
}

/**
 * Walks a residual filters object and makes sure everything it references is
 * loaded: plain fields become select fields on the path's expand, computed
 * (non-crossjoinable) fields become child value nodes — the mechanism modules
 * use to serve computed fields like `calculated_price` — and relation keys
 * recurse deeper.
 */
function ensureResidualData(
  context: ConsumeContext,
  segments: string[],
  filters: Record<string, unknown>
): void {
  const selectFields: string[] = []
  const childValueNodes = new Set<string>()
  const nestedRelations: [string, Record<string, unknown>][] = []

  const entity = resolveLeafEntity(context, segments)
  const crossjoinable = context.catalog.getAliasMetadata(entity)?.crossjoinable

  const collect = (level: Record<string, unknown>): void => {
    for (const [key, value] of Object.entries(level)) {
      if (key === "$and" || key === "$or") {
        const conditions = Array.isArray(value) ? value : []
        conditions.forEach(
          (condition) =>
            isObject(condition) && collect(condition as Record<string, unknown>)
        )
        continue
      }

      if (key === "$not") {
        if (isObject(value)) {
          collect(value as Record<string, unknown>)
        }
        continue
      }

      if (key.startsWith("$")) {
        continue
      }

      if (
        isObject(value) &&
        !isOperatorMap(value) &&
        resolvesToRelations(context, [...segments, key])
      ) {
        nestedRelations.push([key, value as Record<string, unknown>])
        continue
      }

      if (crossjoinable && !crossjoinable.includes(key)) {
        childValueNodes.add(key)
        continue
      }

      selectFields.push(key)
    }
  }

  collect(filters)

  // Parent entries must exist before deeper ones: parseProperties expects the
  // fieldAlias-bearing entry to be walked before entries that continue past it.
  ensureExpandPath(context, segments, selectFields)

  for (const key of childValueNodes) {
    ensureExpandPath(context, [...segments, key], ["*"])
  }

  for (const [key, value] of nestedRelations) {
    ensureResidualData(context, [...segments, key], value)
  }
}

/**
 * Ensures expand entries exist for the path (and each prefix) and merges the
 * given fields onto the leaf entry, recording hidden properties for anything
 * the user's query did not request itself.
 */
function ensureExpandPath(
  context: ConsumeContext,
  segments: string[],
  fields: string[]
): void {
  for (let i = 1; i < segments.length; i++) {
    ensureExpandEntry(context, segments.slice(0, i), [])
  }

  ensureExpandEntry(context, segments, fields)
}

function ensureExpandEntry(
  context: ConsumeContext,
  segments: string[],
  fields: string[]
): void {
  // The shallowest prefix the user did not request is hidden; hiding it hides
  // the whole subtree, so deeper entries need no bookkeeping of their own.
  let subtreeHidden = false
  for (let i = 1; i <= segments.length; i++) {
    if (!context.visiblePaths.has(segments.slice(0, i).join("."))) {
      addHidden(context, segments.slice(0, i - 1), segments[i - 1])
      subtreeHidden = true
      break
    }
  }

  const property = segments.join(".")
  context.query.expands ??= []

  let expand = context.query.expands.find(
    (entry) => entry.property === property
  )
  if (!expand) {
    expand = { property, fields: [] }
    context.query.expands.push(expand)
  }

  expand.fields ??= []
  if (expand.fields.includes("*")) {
    return
  }

  for (const field of fields) {
    if (field === "*") {
      // Value-object nodes (computed fields) need their full value loaded.
      // When the user requested a subset of the node this widens what is
      // returned for it, which we accept for a property the user already sees.
      expand.fields = ["*"]
      return
    }

    if (expand.fields.includes(field)) {
      continue
    }

    expand.fields.push(field)

    if (!subtreeHidden) {
      addHidden(context, segments, field)
    }
  }
}

function addHidden(
  context: ConsumeContext,
  location: string[],
  property: string
): void {
  const key = [...location, property].join(".")
  if (context.hiddenKeys.has(key)) {
    return
  }

  context.hiddenKeys.add(key)
  context.hidden.push({ location, property })
}

function resolvesToRelations(
  context: ConsumeContext,
  segments: string[]
): boolean {
  return !!resolvePathHops(
    { rootConfig: context.serviceConfig, pathSegments: segments },
    context.catalog
  )
}

function resolveLeafEntity(
  context: ConsumeContext,
  segments: string[]
): string | undefined {
  const hops = resolvePathHops(
    { rootConfig: context.serviceConfig, pathSegments: segments },
    context.catalog
  )

  return hops?.[hops.length - 1]?.entity
}

function getFiltersArg(args?: JoinerArgument[]): JoinerArgument | undefined {
  return args?.find((arg) => arg.name === "filters")
}

/**
 * Filters root items against the residual cross-module filters. An item
 * matches when, for every residual, some related record at the end of the
 * residual's path satisfies its filters (EXISTS semantics, matching the SQL
 * pushdown of stage 1).
 */
export function applyResidualFilters(params: {
  items: any[]
  residuals: ResidualCrossModuleFilter[]
}): any[] {
  const parsed = params.residuals.map((residual) => ({
    segments: residual.path.split("."),
    filters: residual.filters,
  }))

  return params.items.filter(
    (item) =>
      item &&
      parsed.every(({ segments, filters }) =>
        matchesRelatedPath(item, segments, filters)
      )
  )
}

function matchesRelatedPath(
  value: unknown,
  segments: string[],
  filters: Record<string, unknown>
): boolean {
  if (value == null) {
    return false
  }

  if (Array.isArray(value)) {
    return value.some((entry) => matchesRelatedPath(entry, segments, filters))
  }

  if (segments.length) {
    return matchesRelatedPath(
      (value as Record<string, unknown>)[segments[0]],
      segments.slice(1),
      filters
    )
  }

  return matchesFilters(value, filters)
}

/**
 * Hides properties that were loaded solely to evaluate residual filters, the
 * same way applyShortcuts hides intermediate alias nodes.
 */
export function hideResidualProperties(params: {
  items: any[]
  hidden: ResidualHiddenProperty[]
}): void {
  for (const { location, property } of params.hidden) {
    let targets = params.items
    for (const segment of location) {
      targets = getNestedItems(targets, segment)
    }

    for (const target of targets) {
      if (!target || typeof target !== "object" || !(property in target)) {
        continue
      }

      Object.defineProperty(target, property, {
        value: undefined,
        enumerable: false,
      })
    }
  }
}
