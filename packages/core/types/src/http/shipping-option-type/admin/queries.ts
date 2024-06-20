import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminShippingOptionTypeListParams extends FindParams {
  id?: string | string[]
  q?: string
  label?: string
  description?: string
  code?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminShippingOptionTypeListParams[]
  $or?: AdminShippingOptionTypeListParams[]
}
