import { OpenAPI } from "types"
import { getApiRefTagSlug } from "docs-utils"
import { apiRefIntroSections } from "@/utils/api-ref-paths"

export const AREAS = ["store", "admin"] as const

/**
 * Type guard for the supported API reference areas.
 */
export const isArea = (area: string): area is OpenAPI.Area =>
  AREAS.includes(area as OpenAPI.Area)

/**
 * Find an intro section of an area by its slug.
 */
export const getIntroSection = (area: OpenAPI.Area, section: string) =>
  (apiRefIntroSections[area] ?? []).find((s) => s.slug === section)

/**
 * Find a tag in the base specs by its slug.
 */
export const getTagBySlug = (
  data: OpenAPI.ExpandedDocument | undefined,
  section: string
) => data?.tags?.find((tag) => getApiRefTagSlug(tag.name) === section)

/**
 * The metadata base URL used across the API reference pages.
 */
export const apiRefMetadataBase = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
)
