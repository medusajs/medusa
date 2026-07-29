import { RemoteJoinerQuery } from "@medusajs/types"
import { isObject } from "@medusajs/utils"
import { GraphCatalog } from "../catalog"
import { InternalJoinerServiceConfig, ResidualOrderBy } from "../types"
import { resolveChain, resolvePathHops } from "./build-chain"
import { registerCandidates } from "./spec-registry"
import { ChainLevel, SpecRegistry } from "./types"

/**
 * Cross-module sorting on the root order arg, e.g.
 * `order: { "price_set.id": "ASC" }` or `order: { price_set: { id: "ASC" } }`.
 *
 * Each entry is classified as native (root fields, same-module paths),
 * pushable (cross-module, sorted field is crossjoinable), or residual
 * (cross-module but not pushable: computed fields, cross-DB targets,
 * conflicting joins). Pushable entries are rewritten to the flat
 * `<target table>.<column>` form the DAL expects — but sort keys are
 * lexicographically significant, so a single residual entry moves the whole
 * ordering to the in-memory stage (stage 2) instead.
 */
export function rewriteRootOrder(params: {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  registry: SpecRegistry
}): ResidualOrderBy[] {
  const { query, serviceConfig, catalog, registry } = params
  const orderArg = query.args?.find((arg) => arg.name === "order")
  const order = orderArg?.value

  if (!isObject(order)) {
    return []
  }

  const entries = flattenOrder(order as Record<string, any>)
  if (!entries.length) {
    return []
  }

  // Classify against a scratch registry so join conflicts (e.g. a duplicate
  // target table) are detected without touching the shared one.
  const scratch: SpecRegistry = { ...registry }
  const classified = entries.map((entry) => ({
    entry,
    resolution: classifyOrderPath(
      { segments: entry.segments, serviceConfig, registry: scratch },
      catalog
    ),
  }))

  if (classified.some(({ resolution }) => resolution.kind === "residual")) {
    query.args = query.args!.filter((arg) => arg !== orderArg)
    return classified.map(({ entry }) => ({
      segments: entry.segments,
      direction: entry.direction,
    }))
  }

  const rewrites: Record<string, "ASC" | "DESC"> = {}

  for (const { entry, resolution } of classified) {
    if (resolution.kind !== "pushable") {
      continue
    }

    // Cannot fail: classification already registered the same sequence on
    // the scratch copy.
    registerCandidates(registry, [{ levels: resolution.levels, filters: {} }])

    delete entry.owner[entry.key]
    const leaf = resolution.levels[resolution.levels.length - 1]
    rewrites[`${leaf.spec.target.table}.${resolution.field}`] = entry.direction
  }

  pruneEmptyObjects(order as Record<string, any>)
  Object.assign(order, rewrites)

  return []
}

type OrderEntry = {
  segments: string[]
  direction: "ASC" | "DESC"
  owner: Record<string, any>
  key: string
}

/**
 * Flattens the order object into entries in significance order, expanding
 * both nested (`{ price_set: { id: "ASC" } }`) and dotted
 * (`{ "price_set.id": "ASC" }`) forms.
 */
function flattenOrder(
  order: Record<string, any>,
  prefix: string[] = [],
  entries: OrderEntry[] = []
): OrderEntry[] {
  for (const key of Object.keys(order)) {
    const value = order[key]
    const segments = [...prefix, ...key.split(".")]

    if (isObject(value)) {
      flattenOrder(value, segments, entries)
      continue
    }

    if (typeof value === "string" && /^(asc|desc)$/i.test(value)) {
      entries.push({
        segments,
        direction: value.toUpperCase() as "ASC" | "DESC",
        owner: order,
        key,
      })
    }
  }

  return entries
}

type OrderClassification =
  | { kind: "native" }
  | { kind: "pushable"; levels: ChainLevel[]; field: string }
  | { kind: "residual" }

function classifyOrderPath(
  params: {
    segments: string[]
    serviceConfig: InternalJoinerServiceConfig
    registry: SpecRegistry
  },
  catalog: GraphCatalog
): OrderClassification {
  const { segments, serviceConfig, registry } = params

  if (segments.length < 2) {
    return { kind: "native" }
  }

  // The longest relation-resolving prefix decides whether the key leaves the
  // root module; the remainder is a field path into the target (possibly
  // nested, e.g. calculated_price.calculated_amount).
  let prefixLength = 0
  let crossesModules = false
  for (let end = segments.length - 1; end >= 1; end--) {
    const hops = resolvePathHops(
      { rootConfig: serviceConfig, pathSegments: segments.slice(0, end) },
      catalog
    )
    if (hops) {
      prefixLength = end
      crossesModules = hops.some(
        (hop) => hop.serviceConfig.serviceName !== serviceConfig.serviceName
      )
      break
    }
  }

  if (!prefixLength || !crossesModules) {
    return { kind: "native" }
  }

  // Pushable only when the sorted field sits directly on the chain leaf and
  // is crossjoinable.
  if (prefixLength === segments.length - 1) {
    const resolution = resolveChain(
      { rootConfig: serviceConfig, pathSegments: segments.slice(0, -1) },
      catalog
    )

    if (resolution.outcome === "pushable") {
      const field = segments[segments.length - 1]
      const leaf = resolution.levels[resolution.levels.length - 1]
      const metadata = catalog.getAliasMetadata(leaf.entity)

      if (
        metadata?.crossjoinable?.includes(field) &&
        registerCandidates(registry, [
          { levels: resolution.levels, filters: {} },
        ])
      ) {
        return { kind: "pushable", levels: resolution.levels, field }
      }
    }
  }

  return { kind: "residual" }
}

function pruneEmptyObjects(obj: Record<string, any>): void {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (isObject(value)) {
      pruneEmptyObjects(value)
      if (!Object.keys(value).length) {
        delete obj[key]
      }
    }
  }
}
