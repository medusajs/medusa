import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminFulfillmentSetListParams extends FindParams {
  id?: string | string[]
  name?: string | string[]
  type?: string | string[]
  service_zone_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
