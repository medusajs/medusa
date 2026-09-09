import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { isPresent } from "@medusajs/framework/utils"

/**
 * Product list params that are named after a single relation but land on an
 * array of ids in a search index, since a document is one product with every
 * id it relates to.
 */
const SEARCH_INDEX_FIELDS = {
  sales_channel_id: "sales_channel_ids",
  category_id: "category_ids",
  tag_id: "tag_ids",
} as const

/**
 * Renames the product filter params a search index holds under another name,
 * the way `remapProductCrossModuleFilters` rewrites them into relation filters
 * for `query.graph`.
 *
 * The value is passed through as-is: a list on an array field means "contains
 * one of" to a search engine, which is what these ids need.
 */
export function remapProductSearchFilters() {
  return async (
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    for (const [param, field] of Object.entries(SEARCH_INDEX_FIELDS)) {
      if (!isPresent(req.filterableFields[param])) {
        continue
      }

      req.filterableFields[field] = req.filterableFields[param]
      delete req.filterableFields[param]
    }

    next()
  }
}
