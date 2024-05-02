/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductCategoriesCategoryParams {
  /**
   * Comma-separated fields that should be expanded in the returned product category.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in the returned product category.
   */
  expand?: string
}
