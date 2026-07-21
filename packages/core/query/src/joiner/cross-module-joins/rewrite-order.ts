import { RemoteJoinerQuery } from "@medusajs/types"
import { isObject } from "@medusajs/utils"
import { GraphCatalog } from "../catalog"
import { InternalJoinerServiceConfig } from "../types"
import { resolveChain } from "./build-chain"
import { registerCandidates } from "./spec-registry"
import { SpecRegistry } from "./types"

/**
 * Cross-module sorting on the root order arg, e.g.
 * `order: { "price_set.id": "ASC" }` or `order: { price_set: { id: "ASC" } }`.
 * Rewrites pushable entries to the flat `<target table>.<column>` form the
 * DAL's orderBy transform expects. Entries that cannot be pushed are left
 * untouched.
 */
export function rewriteRootOrder(params: {
  query: RemoteJoinerQuery
  serviceConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
  registry: SpecRegistry
}): void {
  const { query, serviceConfig, catalog, registry } = params
  const order = query.args?.find((arg) => arg.name === "order")?.value

  if (!isObject(order)) {
    return
  }

  const rewrites: Record<string, "ASC" | "DESC"> = {}

  const visit = (obj: Record<string, any>, pathPrefix: string[]): void => {
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      const segments = [...pathPrefix, ...key.split(".")]

      if (isObject(value)) {
        visit(value, segments)
        if (!Object.keys(value).length) {
          delete obj[key]
        }
        continue
      }

      if (
        typeof value !== "string" ||
        !/^(asc|desc)$/i.test(value) ||
        segments.length < 2
      ) {
        continue
      }

      const relationSegments = segments.slice(0, -1)
      const field = segments[segments.length - 1]

      const resolution = resolveChain(
        { rootConfig: serviceConfig, pathSegments: relationSegments },
        catalog
      )

      // Same-module order paths keep their native behavior; non-pushable
      // cross-module paths stay untouched too.
      if (resolution.outcome !== "pushable") {
        continue
      }

      const leaf = resolution.levels[resolution.levels.length - 1]
      const metadata = catalog.getAliasMetadata(leaf.entity)

      if (!metadata?.crossjoinable?.includes(field)) {
        continue
      }

      if (
        !registerCandidates(registry, [
          { levels: resolution.levels, filters: {} },
        ])
      ) {
        continue
      }

      delete obj[key]
      rewrites[`${leaf.spec.target.table}.${field}`] = value.toUpperCase() as
        | "ASC"
        | "DESC"
    }
  }

  visit(order, [])
  Object.assign(order, rewrites)
}
