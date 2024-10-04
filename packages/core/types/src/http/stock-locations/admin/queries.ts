import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminStockLocationListParams
  extends FindParams,
    BaseFilterable<AdminStockLocationListParams> {
  id?: string | string[]
  q?: string
  name?: string | string[]
  address_id?: string | string[]
  sales_channel_id?: string | string[]
  $and?: AdminStockLocationListParams[]
  $or?: AdminStockLocationListParams[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
