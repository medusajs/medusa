/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrdersOrderSwapsParams {
  /**
   * Comma-separated relations that should be expanded in the returned order.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned order.
   */
  fields?: string
}
