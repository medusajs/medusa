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
 * Stage 2 of cross-module filtering: completes in memory the filters stage 1
 * could not push down to SQL.
 *
 * At compile time, {@link consumeResidualFilters} removes each residual
 * filter from the query (so no module receives a field it cannot handle) and
 * injects expand entries for the data the filter reads — the regular expand
 * machinery then loads it, unpaginated. Properties added only for evaluation
 * are recorded for hiding.
 *
 * At execute time, {@link applyResidualFilters} keeps the root items whose
 * related data matches (EXISTS semantics, same as the SQL pushdown), and
 * {@link hideResidualProperties} hides the synthetic properties. The caller
 * re-applies pagination afterwards so pages reflect the filtered set.
 *
 * Residual ordering lives in `residual-order.ts` and reuses the loading and
 * hiding helpers exported here; `consumeResiduals` in the module index runs
 * both.
 */

/** Shared state for one residual-consumption pass at compile time. */
export type ConsumeContext = {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  /** Alias paths the user's query references (including prefixes). */
  visiblePaths: Set<string>
  hidden: ResidualHiddenProperty[]
  hiddenKeys: Set<string>
}

export function createConsumeContext(
  params: {
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
  },
  catalog: GraphCatalog
): ConsumeContext {
  return {
    query: params.query,
    serviceConfig: params.serviceConfig,
    catalog,
    visiblePaths: collectVisiblePaths(params.query),
    hidden: [],
    hiddenKeys: new Set(),
  }
}

/**
 * Strips each residual filter from the query and loads the data it evaluates
 * against.
 */
export function consumeResidualFilters(
  context: ConsumeContext,
  residualFilters: ResidualCrossModuleFilter[]
): void {
  for (const residual of residualFilters) {
    stripResidualFilters(context.query, residual)
    ensureResidualData(context, residual.path.split("."), residual.filters)
  }
}

/**
 * The alias paths (and their prefixes) the user's query actually requests —
 * fields or non-filter args. Anything loaded outside this set is hidden from
 * the payload.
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
 * Removes the residual filters from where they live: the expand node that
 * carried them, or the root filters arg.
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
 * Loads everything a residual filters object reads. Each key at a level is
 * either a plain field (selected on the level's expand), a computed field
 * like `calculated_price` (fetched as a child value node, the way modules
 * serve computed fields), or a relation (recursed into).
 */
export function ensureResidualData(
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

      // Object conditions on non-column keys target computed value objects
      // (e.g. calculated_price) served as child value nodes. Scalar and
      // operator conditions always read plain columns — including ones the
      // crossjoinable metadata does not list.
      if (
        isObject(value) &&
        !isOperatorMap(value) &&
        crossjoinable &&
        !crossjoinable.includes(key)
      ) {
        childValueNodes.add(key)
        continue
      }

      selectFields.push(key)
    }
  }

  collect(filters)

  // Parents first: parseProperties must walk a fieldAlias entry before any
  // entry that continues past it.
  ensureExpandPath(context, segments, selectFields)

  for (const key of childValueNodes) {
    ensureExpandPath(context, [...segments, key], ["*"])
  }

  for (const [key, value] of nestedRelations) {
    ensureResidualData(context, [...segments, key], value)
  }
}

/**
 * Ensures an expand entry exists for the path and each of its prefixes,
 * merging `fields` onto the leaf. Anything the user did not request is
 * recorded as hidden.
 */
export function ensureExpandPath(
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
  // Hiding the shallowest prefix the user did not request hides the whole
  // subtree, so deeper entries need no bookkeeping of their own.
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
      // Computed value nodes need their full value. If the user requested
      // only a subset of the node this widens it — acceptable for a property
      // they already see.
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

export function addHidden(
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

export function resolvesToRelations(
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
 * Keeps the root items that satisfy every residual filter: some related
 * record at the end of the residual's path must match its filters (EXISTS
 * semantics, same as the SQL pushdown).
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
 * Hides properties loaded only for residual evaluation, the same way
 * applyShortcuts hides intermediate alias nodes.
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
