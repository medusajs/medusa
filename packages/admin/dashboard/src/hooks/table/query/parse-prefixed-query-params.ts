import { parseFilterParam } from "./parse-filter-param"

const NON_FILTER_KEYS = ["offset", "limit", "order"]

/**
 * Expand dotted param keys into nested objects so the SDK's qs serializer emits
 * bracket notation the endpoint's nested filter schema expects, e.g.
 * `{ "location_levels.location_id": ["x"] }` -> `{ location_levels: { location_id: ["x"] } }`
 * -> `location_levels[location_id][0]=x`. Keys without a dot pass through.
 */
export function expandDottedKeys(
  params: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(params)) {
    if (!key.includes(".")) {
      result[key] = value
      continue
    }
    const parts = key.split(".")
    let node = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof node[parts[i]] !== "object" || node[parts[i]] === null) {
        node[parts[i]] = {}
      }
      node = node[parts[i]]
    }
    node[parts[parts.length - 1]] = value
  }
  return result
}

/**
 * Builds API filters from the `<prefix>_*` URL params written by a
 * configurable data table, where each filter value is stored as JSON.
 *
 * @param searchParams - The current URL search params.
 * @param prefix - The table's query prefix, e.g. `p` for products.
 * @returns The search query and filters, without pagination or sorting.
 */
export function parsePrefixedQueryParams(
  searchParams: URLSearchParams,
  prefix: string
): Record<string, any> {
  const params: Record<string, any> = {}

  searchParams.forEach((raw, prefixedKey) => {
    if (!prefixedKey.startsWith(`${prefix}_`)) {
      return
    }

    const key = prefixedKey.slice(prefix.length + 1)
    if (NON_FILTER_KEYS.includes(key)) {
      return
    }

    const value = key === "q" ? raw || undefined : parseFilterParam(raw)
    if (value !== undefined) {
      params[key] = value
    }
  })

  return expandDottedKeys(params)
}
