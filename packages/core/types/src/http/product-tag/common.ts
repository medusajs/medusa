import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

/**
 * A product tag. Tags can be applied to products to help categorize them.
 */
export interface BaseProductTag {
  /**
   * The tag's ID.
   */
  id: string
  /**
   * The tag's value.
   */
  value: string
  /**
   * The date the tag was created.
   */
  created_at: string
  /**
   * The date the tag was updated.
   */
  updated_at: string
  /**
   * The date the tag was deleted.
   */
  deleted_at?: string | null
  /**
   * An external ID for the tag.
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The filters to apply when retrieving a list of product tags.
 */
export interface BaseProductTagListParams extends FindParams {
  /**
   * Query or keyword to apply on the tag's searchable fields.
   */
  q?: string
  /**
   * Filter by tag ID(s).
   */
  id?: string | string[]
  /**
   * Filter by value(s).
   */
  value?: string | string[]
  /**
   * Filter by external ID(s).
   *
   * @since 2.13.7
   */
  external_id?: string | string[]
  /**
   * Apply filters on the creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the update date.
   */
  updated_at?: OperatorMap<string>
}
