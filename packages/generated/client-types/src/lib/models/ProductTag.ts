/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Product Tags can be added to Products for easy filtering and grouping.
 */
export interface ProductTag {
  /**
   * The product tag's ID
   */
  id: string
  /**
   * The value that the Product Tag represents
   */
  value: string
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
