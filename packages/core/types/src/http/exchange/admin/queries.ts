import { OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"

export interface AdminExchangeListParams extends SelectParams {
  id?: string | string[]
  order_id?: string | string[]
  status?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
