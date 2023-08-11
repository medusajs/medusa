/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminOrderEditItemChangeDeleteRes {
  /**
   * The ID of the deleted Order Edit Item Change.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the Order Edit Item Change was deleted.
   */
  deleted: boolean
}
