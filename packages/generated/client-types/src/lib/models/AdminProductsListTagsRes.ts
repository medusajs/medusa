/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The usage details of product tags.
 */
export interface AdminProductsListTagsRes {
  /**
   * An array of product tags details.
   */
  tags: Array<{
    /**
     * The ID of the tag.
     */
    id: string
    /**
     * The number of products that use this tag.
     */
    usage_count: string
    /**
     * The value of the tag.
     */
    value: string
  }>
}
