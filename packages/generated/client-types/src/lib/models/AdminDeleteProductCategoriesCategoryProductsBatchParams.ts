/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteProductCategoriesCategoryProductsBatchParams {
  /**
   * Comma-separated relations that should be expanded in the returned product category.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned product category.
   */
  fields?: string
}
