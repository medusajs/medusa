/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryLevelDTO } from "./InventoryLevelDTO"

export type LevelWithAvailability = InventoryLevelDTO & {
  available_quantity: number
}
