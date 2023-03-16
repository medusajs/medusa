/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetProductCategoriesCategoryParams {
  /**
   * (Comma separated) Which fields should be expanded in each product category.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be retrieved in each product category.
   */
  fields?: string
}
