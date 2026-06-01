import { FindParams, SelectParams } from "../../common"
import { BaseFilterable, OperatorMap } from "../../../dal"

export interface AdminGetShippingOptionTypeParams extends SelectParams {}

export interface AdminShippingOptionTypeListParams
  extends FindParams,
    BaseFilterable<AdminShippingOptionTypeListParams> {
  q?: string | undefined
  id?: string | string[] | undefined
  label?: string | string[] | undefined
  code?: string | string[] | undefined
  description?: string | string[] | undefined
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
