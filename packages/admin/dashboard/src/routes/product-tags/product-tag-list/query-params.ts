import { HttpTypes } from "@medusajs/types"

/**
 * Matches the `queryPrefix` the product tag table adapter registers. With the
 * view configurations flag on, the table writes its state to the URL under this
 * prefix, so the loader sees `ptag_order` rather than `order`.
 */
const PRODUCT_TAG_QUERY_PREFIX = "ptag"

/**
 * The params `/admin/product-tags` accepts. Everything else in the URL is table
 * state, and the endpoint rejects unknown fields outright, so this is an
 * allowlist rather than a filter.
 */
const LIST_PARAMS = [
  "offset",
  "q",
  "order",
  "created_at",
  "updated_at",
] as const

/**
 * Build the list query for the product tags endpoint from the URL, taking the
 * prefixed form of a param when it is there and falling back to the bare one.
 */
export const getProductTagListQueryParams = (
  searchParams: URLSearchParams
): HttpTypes.AdminProductTagListParams => {
  const queryObject: Record<string, unknown> = {}

  LIST_PARAMS.forEach((key) => {
    const value =
      searchParams.get(`${PRODUCT_TAG_QUERY_PREFIX}_${key}`) ??
      searchParams.get(key)

    if (value === null) {
      return
    }

    try {
      queryObject[key] = JSON.parse(value)
    } catch (_e) {
      queryObject[key] = value
    }
  })

  return queryObject as HttpTypes.AdminProductTagListParams
}
