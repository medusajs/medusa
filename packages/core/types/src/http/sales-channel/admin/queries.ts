import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminSalesChannelListParams extends FindParams {
  id?: string | string[]
  q?: string
  name?: string | string[]
  description?: string
  is_disabled?: boolean
  location_id?: string | string[]
  publishable_key_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminSalesChannelListParams[]
  $or?: AdminSalesChannelListParams[]
}
