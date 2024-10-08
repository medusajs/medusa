import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminShippingProfileListParams extends FindParams {
  id?: string | string[]
  q?: string
  type?: string
  name?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  $and?: AdminShippingProfileListParams[]
  $or?: AdminShippingProfileListParams[]
}
