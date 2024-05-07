/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostDiscountsDiscountParams {
  /**
   * Comma-separated relations that should be expanded in the returned discount.
   */
  expand?: string
  /**
   * Comma-separated fields that should be retrieved in the returned discount.
   */
  fields?: string
}
