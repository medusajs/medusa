import { isPresent } from "@medusajs/utils"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

/**
 * Transforms a flat query param that filters by a linked module's field
 * (e.g. `sales_channel_id`) into a nested Query filter object along
 * `relationPath` (e.g. `{ product: { sales_channels: { id } } }`), so
 * `query.graph` can apply it through cross-module joins.
 *
 * @example
 * applyCrossModuleFilter({
 *   filterableField: "sales_channel_id",
 *   relationPath: "product.sales_channels.id",
 * })
 */
export function applyCrossModuleFilter({
  filterableField,
  relationPath,
}: {
  filterableField: string
  relationPath: string
}) {
  return async function crossModuleFilter(
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) {
    const filters: Record<string, any> = req.filterableFields

    if (!isPresent(filters?.[filterableField])) {
      return next()
    }

    const value = filters[filterableField]
    delete filters[filterableField]

    const segments = relationPath.split(".")
    const field = segments.pop()!

    let node = filters
    for (const segment of segments) {
      node[segment] ??= {}
      node = node[segment]
    }
    node[field] = value

    return next()
  }
}
