import { FindParams, SelectParams } from "../../common"
import { BaseFilterable } from "../../../dal"

export interface AdminGetShippingOptionTypeParams extends SelectParams {}

export interface AdminShippingOptionTypeListParams
  extends FindParams,
    BaseFilterable<AdminShippingOptionTypeListParams> {
  code?: string | string[] | undefined
  q?: string | undefined
  created_at?: any
  id?: string | string[] | undefined
  updated_at?: any
  deleted_at?: any
  label?: string | string[] | undefined
  description?: string | string[] | undefined
}
