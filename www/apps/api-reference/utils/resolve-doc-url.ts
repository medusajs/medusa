import { apiRefRedirects } from "./api-ref-paths"
import { OpenAPI } from "types"

const ABSOLUTE_API_HASH_RE =
  /^https?:\/\/docs\.medusajs\.com(?:\/v2)?\/api\/(store|admin)#(.+)$/
const RELATIVE_HASH_RE = /^#(.+)$/

/**
 * Resolve a doc link that may point to the API reference using the legacy hash
 * format to its new page path. Handles:
 * - absolute legacy links (`https://docs.medusajs.com/api/store#carts_getcartsid`)
 * - relative anchors (`#select-fields-and-relations`) using the current area
 *
 * Returns a path without the `basePath` — consumers render it through the
 * `next/link`-based `Link`, which prepends `/api` (adding it here would double it
 * to `/api/api/...`). Hashes that aren't known page anchors (e.g. in-section
 * sub-headings) and non-API links are returned unchanged.
 */
export function resolveApiRefDocUrl(url: string, area: OpenAPI.Area): string {
  const absoluteMatch = url.match(ABSOLUTE_API_HASH_RE)
  if (absoluteMatch) {
    const [, linkArea, hash] = absoluteMatch
    const target = apiRefRedirects[linkArea as OpenAPI.Area]?.[hash]
    return target ?? url
  }

  const relativeMatch = url.match(RELATIVE_HASH_RE)
  if (relativeMatch) {
    const hash = relativeMatch[1]
    const target = apiRefRedirects[area]?.[hash]
    // leave unknown anchors as in-page hashes
    return target ?? url
  }

  return url
}
