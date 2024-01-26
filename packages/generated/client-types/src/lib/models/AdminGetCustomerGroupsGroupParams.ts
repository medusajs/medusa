/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetCustomerGroupsGroupParams {
  /**
   * Comma-separated relations that should be expanded in the returned customer group.
   */
  expand?: string
  /**
   * Comma-separated fields that should be included in the returned customer group.
   */
  fields?: string
}
