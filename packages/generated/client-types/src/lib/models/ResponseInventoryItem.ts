/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"
import type { LevelWithAvailability } from "./LevelWithAvailability"

export type ResponseInventoryItem = InventoryItemDTO & {
  location_levels?: Array<LevelWithAvailability>
}
