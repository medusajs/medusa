/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetProductCategoryParams {
  /**
   * (Comma separated) Which fields should be expanded in the results.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included in the results.
   */
  fields?: string
}
