import { FindParams } from "../../common"

export interface AdminStockLocationListParams extends FindParams {
  id?: string | string[]
  q?: string
  name?: string | string[]
  address_id?: string | string[]
  sales_channel_id?: string | string[]
  $and?: AdminStockLocationListParams[]
  $or?: AdminStockLocationListParams[]
}
