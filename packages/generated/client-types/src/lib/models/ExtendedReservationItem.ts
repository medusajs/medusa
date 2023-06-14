/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"
import type { LineItem } from "./LineItem"
import type { ReservationItemDTO } from "./ReservationItemDTO"

export type ExtendedReservationItem = ReservationItemDTO & {
  /**
   * optional line item
   */
  line_item?: LineItem
  /**
   * inventory item from inventory module
   */
  inventory_item?: InventoryItemDTO
}
