import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseProductType {
  /**
   * The product type's ID.
   */
  id: string
  /**
   * The product type's value.
   */
  value: string
  /**
   * The date the product type was created.
   */
  created_at: string
  /**
   * The date the product type was updated.
   */
  updated_at: string
  /**
   * The date the product type was deleted.
   */
  deleted_at?: string | null
  /**
   * An external ID for the product type.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface BaseProductTypeListParams extends FindParams {
  /**
   * Query or keyword to apply on the type's searchable fields.
   */
  q?: string
  /**
   * Filter by type ID(s).
   */
  id?: string | string[]
  /**
   * Filter by value(s).
   */
  value?: string | string[]
  /**
   * Filter by external ID(s).
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
