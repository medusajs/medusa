/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGiftCardsDeleteRes {
  /**
   * The ID of the deleted Gift Card
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether the gift card was deleted successfully or not.
   */
  deleted: boolean
}
