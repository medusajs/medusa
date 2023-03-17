/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"

export type ResponseInventoryItem = InventoryItemDTO & {
  available_quantity: number
}
