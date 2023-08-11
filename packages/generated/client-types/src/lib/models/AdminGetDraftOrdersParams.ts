/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetDraftOrdersParams {
  /**
   * The number of draft orders to skip when retrieving the draft orders.
   */
  offset?: number
  /**
   * Limit the number of draft orders returned.
   */
  limit?: number
  /**
   * a term to search draft orders' display IDs and emails in the draft order's cart
   */
  q?: string
}
