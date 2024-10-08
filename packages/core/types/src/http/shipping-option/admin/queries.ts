import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminShippingOptionListParams extends FindParams {
  id?: string | string[]
  q?: string
  service_zone_id?: string | string[]
  stock_location_id?: string | string[]
  is_return?: boolean
  admin_only?: boolean
  shipping_profile_id?: string | string[]
  provider_id?: string | string[]
  shipping_option_type_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
