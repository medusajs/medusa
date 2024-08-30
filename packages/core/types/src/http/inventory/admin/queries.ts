import { FindParams } from "../../common"
import { BaseFilterable, OperatorMap } from "../../../dal"

export interface AdminInventoryItemParams extends FindParams, BaseFilterable<AdminInventoryItemParams> {
  id?: string | string[]
  q?: string
  sku?: string | string[]
  origin_country?: string | string[]
  mid_code?: string | string[]
  hs_code?: string | string[]
  material?: string | string[]
  requires_shipping?: boolean
  weight?: number | OperatorMap<number>
  length?: number | OperatorMap<number>
  height?: number | OperatorMap<number>
  width?: number | OperatorMap<number>
  location_levels?: Record<"location_id", string | string[]>
}
