/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDiscountsDeleteRes {
  /**
   * The ID of the deleted Discount
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the discount was deleted successfully or not.
   */
  deleted: boolean
}
