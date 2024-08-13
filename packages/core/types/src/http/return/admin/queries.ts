import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminReturnFilters extends FindParams {
  id?: string[] | string | OperatorMap<string | string[]>
  order_id?: string[] | string | OperatorMap<string | string[]>
  status?:
    | string[]
    | string
    | Record<string, unknown>
    | OperatorMap<Record<string, unknown>>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
