/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductsVariantsParams {
  /**
   * Comma-separated fields that should be included in the returned product variants.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in the returned product variants.
   */
  expand?: string
  /**
   * The number of product variants to skip when retrieving the product variants.
   */
  offset?: number
  /**
   * Limit the number of product variants returned.
   */
  limit?: number
}
