/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ResponseInventoryItem } from "./ResponseInventoryItem"

export interface VariantInventory {
  /**
   * the ID of the variant
   */
  id: string
  /**
   * The inventory details.
   */
  inventory: ResponseInventoryItem
  /**
   * Details about the variant's inventory availability in sales channels.
   */
  sales_channel_availability: Array<{
    /**
     * Sales channel's name
     */
    channel_name: string
    /**
     * Sales channel's ID
     */
    channel_id: string
    /**
     * Available quantity in the sales channel
     */
    available_quantity: number
  }>
}
