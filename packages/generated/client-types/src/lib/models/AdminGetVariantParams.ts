/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetVariantParams {
  /**
   * "Comma-separated relations that should be expanded in the returned product variant."
   */
  expand?: string
  /**
   * "Comma-separated fields that should be included in the returned product variant."
   */
  fields?: string
}
