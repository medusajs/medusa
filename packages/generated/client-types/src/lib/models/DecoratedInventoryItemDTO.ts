/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"
import type { InventoryLevelDTO } from "./InventoryLevelDTO"
import type { ProductVariant } from "./ProductVariant"

export type DecoratedInventoryItemDTO = InventoryItemDTO & {
  /**
   * An array of location level details
   */
  location_levels?: Array<InventoryLevelDTO>
  /**
   * An array of product variant details
   */
  variants?: Array<ProductVariant>
  /**
   * The total quantity of the item in stock across levels
   */
  stocked_quantity: number
  /**
   * The total quantity of the item available across levels
   */
  reserved_quantity: number
}
