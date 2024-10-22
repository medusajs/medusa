import { FindParams } from "../../common"
import { BaseFilterable, OperatorMap } from "../../../dal"

export interface AdminInventoryItemParams
  extends FindParams,
    BaseFilterable<AdminInventoryItemParams> {
  /**
   * Filter by inventory item ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to search the inventory item's searchable fields.
   */
  q?: string
  /**
   * Filter by SKU(s).
   */
  sku?: string | string[]
  /**
   * Filter by origin countries.
   */
  origin_country?: string | string[]
  /**
   * Filter by MID code(s).
   */
  mid_code?: string | string[]
  /**
   * Filter by HS code(s).
   */
  hs_code?: string | string[]
  /**
   * Filter by material(s).
   */
  material?: string | string[]
  /**
   * Filter by whether the item requires shipping.
   */
  requires_shipping?: boolean
  /**
   * Filter by weight(s).
   */
  weight?: number | OperatorMap<number>
  /**
   * Filter by length(s).
   */
  length?: number | OperatorMap<number>
  /**
   * Filter by height(s).
   */
  height?: number | OperatorMap<number>
  /**
   * Filter by width(s).
   */
  width?: number | OperatorMap<number>
  /**
   * Filter by stock location IDs to retrieve inventory items
   * that have inventory levels associated with the locations.
   */
  location_levels?: Record<"location_id", string | string[]>
}
