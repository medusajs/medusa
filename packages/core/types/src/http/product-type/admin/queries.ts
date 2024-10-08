import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminProductTypeListParams
  extends FindParams,
    BaseFilterable<AdminProductTypeListParams> {
  q?: string
  id?: string | string[]
  value?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface AdminProductTypeParams extends SelectParams {}
