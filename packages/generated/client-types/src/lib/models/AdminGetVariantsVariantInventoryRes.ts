/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { VariantInventory } from "./VariantInventory"

/**
 * The variant's inventory details.
 */
export interface AdminGetVariantsVariantInventoryRes {
  /**
   * The product variant's inventory details.
   */
  variant?: VariantInventory
}
