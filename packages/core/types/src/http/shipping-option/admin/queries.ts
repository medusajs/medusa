import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminShippingOptionListParams extends FindParams {
  id?: string | string[]
  q?: string
  service_zone_id?: string
  stock_location_id?: string | string[]
  shipping_profile_id?: string
  provider_id?: string
  shipping_option_type_id?: string
  is_return?: boolean
  admin_only?: boolean
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
