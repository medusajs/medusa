import pkg from "slugify"
import { getSectionId } from "./sidebar-utils.js"

const { default: slugify } = pkg

/**
 * Minimal shape of an OAS operation needed to derive its URL slug.
 */
export type ApiRefOperationLike = {
  operationId?: string
  summary?: string
  "x-sidebar-summary"?: string
}

/**
 * Slug reserved for a tag's associated schema page (e.g. `/store/carts/schema`).
 */
export const API_REF_SCHEMA_SLUG = "schema"

/**
 * Slugify a single URL segment: lowercased and hyphen-separated.
 * (e.g. `"Get a Cart"` -> `"get-a-cart"`)
 */
export function getApiRefSegmentSlug(value: string): string {
  // `strict` drops characters that aren't URL-safe (apostrophes, parentheses,
  // etc.) so summary-derived slugs stay clean, e.g.
  // `"Change Cart's Customer"` -> `"change-carts-customer"`.
  return slugify(value.trim().toLowerCase(), { strict: true })
}

/**
 * The slug for an intro/markdown section heading. Kept identical to the
 * previous hash anchor (`getSectionId([heading])`) so old `#authentication`
 * links map cleanly to `/authentication`.
 */
export function getApiRefIntroSlug(heading: string): string {
  return getSectionId([heading])
}

/**
 * The slug for a tag. Kept identical to the previous tag hash
 * (`getSectionId([tag.name])`), e.g. `"Gift Cards"` -> `"gift-cards"`.
 */
export function getApiRefTagSlug(tagName: string): string {
  return getSectionId([tagName])
}

/**
 * The base (pre-deduplication) slug for a single operation, derived from its
 * `x-sidebar-summary`, then `summary`, then `operationId`.
 */
export function getApiRefOperationSlug(operation: ApiRefOperationLike): string {
  const base =
    operation["x-sidebar-summary"] ||
    operation.summary ||
    operation.operationId ||
    ""

  return getApiRefSegmentSlug(base)
}

/**
 * Compute unique operation slugs for all operations of a single tag.
 *
 * Slugs only need to be unique within a tag. The `operations` array should be
 * passed in the desired display order so that duplicate/reserved slugs receive
 * a deterministic numeric suffix (`-2`, `-3`, ...).
 *
 * @returns a map of `operationId` to its final, unique slug.
 */
export function getApiRefTagOperationSlugs(
  operations: (ApiRefOperationLike & { operationId: string })[]
): Map<string, string> {
  const result = new Map<string, string>()
  const usedSlugs = new Set<string>([API_REF_SCHEMA_SLUG])

  for (const operation of operations) {
    const base =
      getApiRefOperationSlug(operation) ||
      getApiRefSegmentSlug(operation.operationId)

    let slug = base
    let counter = 2
    while (usedSlugs.has(slug)) {
      slug = `${base}-${counter}`
      counter++
    }

    usedSlugs.add(slug)
    result.set(operation.operationId, slug)
  }

  return result
}

/**
 * Build an API reference page path (without the app `basePath`).
 *
 * - Tag/intro page: `getApiRefPath({ area, section })` -> `/store/carts`
 * - Operation page: `getApiRefPath({ area, section, operationSlug })` ->
 *   `/store/carts/get-a-cart`
 */
export function getApiRefPath({
  area,
  section,
  operationSlug,
}: {
  area: string
  section: string
  operationSlug?: string
}): string {
  const segments = [area, section]
  if (operationSlug) {
    segments.push(operationSlug)
  }

  return `/${segments.join("/")}`
}
