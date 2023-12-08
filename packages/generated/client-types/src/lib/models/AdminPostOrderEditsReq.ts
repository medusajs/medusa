/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrderEditsReq {
  /**
   * The ID of the order to create the edit for.
   */
  order_id: string
  /**
   * An optional note to associate with the order edit.
   */
  internal_note?: string
}
