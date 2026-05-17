import { BaseFilterable } from "../dal"

/**
 * The brand details.
 */
export interface BrandDTO {
  /**
   * The ID of the brand.
   */
  id: string

  /**
   * The name of the brand.
   */
  name: string

  /**
   * The slug of the brand.
   */
  slug: string

  /**
   * The logo URL of the brand.
   */
  logo_url?: string

  /**
   * The description of the brand.
   */
  description?: string

  /**
   * The org ID of the brand.
   */
  org_id?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the brand.
   */
  created_at: string

  /**
   * The updated at of the brand.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved brands.
 */
export interface FilterableBrandProps
  extends BaseFilterable<FilterableBrandProps> {
  /**
   * Find brands by name or slug through this search term.
   */
  q?: string

  /**
   * The IDs to filter the brands by.
   */
  id?: string | string[]

  /**
   * Filter brands by their names.
   */
  name?: string | string[]

  /**
   * Filter brands by their slugs.
   */
  slug?: string | string[]
}
