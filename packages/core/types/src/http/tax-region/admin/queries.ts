import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminTaxRegionListParams extends FindParams {
  id?: string | string[]
  q?: string
  parent_id?: string | string[] | OperatorMap<string>
  country_code?: string | string[] | OperatorMap<string>
  province_code?: string | string[] | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  created_by?: OperatorMap<string>
}
