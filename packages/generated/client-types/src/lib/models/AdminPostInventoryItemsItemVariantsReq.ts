/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInventoryItemsItemVariantsReq {
  /**
   * The ID of the variant to associate the inventory item with.
   */
  variant_id: string
  /**
   * The quantity of the inventory item required to fulfill the variant.
   */
  required_quantity?: string
}
