/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { InventoryItemDTO } from "./InventoryItemDTO"
import type { InventoryLevelDTO } from "./InventoryLevelDTO"
import type { ProductVariant } from "./ProductVariant"

export type DecoratedInventoryItemDTO = InventoryItemDTO & {
  location_levels?: Array<InventoryLevelDTO>
  variants?: Array<ProductVariant>
}
