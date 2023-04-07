/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDraftOrdersDeleteRes {
  /**
   * The ID of the deleted Draft Order.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the draft order was deleted successfully or not.
   */
  deleted: boolean
}
