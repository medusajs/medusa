import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminReturnFilters extends FindParams {
  /**
   * Filter by return ID(s).
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by order ID(s) to retrieve their returns.
   */
  order_id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by status.
   */
  status?:
    | string[]
    | string
    | Record<string, unknown>
    | OperatorMap<Record<string, unknown>>
  /**
   * Filter by the date when the return was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date when the return was updated.
   */
  updated_at?: OperatorMap<string>
}