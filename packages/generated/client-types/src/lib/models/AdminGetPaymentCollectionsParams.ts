/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetPaymentCollectionsParams {
  /**
   * Comma separated list of relations to include in the results.
   */
  expand?: string
  /**
   * Comma separated list of fields to include in the results.
   */
  fields?: string
}
