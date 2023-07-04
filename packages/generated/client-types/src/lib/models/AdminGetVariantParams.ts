/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetVariantParams {
  /**
   * (Comma separated) Which fields should be expanded the order of the result.
   */
  expand?: string
  /**
   * (Comma separated) Which fields should be included the order of the result.
   */
  fields?: string
}
