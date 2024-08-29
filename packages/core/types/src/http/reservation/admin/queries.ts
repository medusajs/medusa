import { OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"

export interface AdminGetReservationsParams {
  limit?: number
  offset?: number
  location_id?: string | string[]
  inventory_item_id?: string | string[]
  line_item_id?: string | string[]
  created_by?: string | string[]
  description?: string | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface AdminReservationParams extends SelectParams {}
