/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetStockLocationsLocationParams {
  /**
   * Comma-separated relations that should be expanded in the returned stock location.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned stock location.
   */
  fields?: string
}
