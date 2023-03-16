/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminOrderEditDeleteRes {
  /**
   * The ID of the deleted Order Edit.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the Order Edit was deleted.
   */
  deleted: boolean
}
