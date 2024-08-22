import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseExchangeListParams } from "../common"

export interface AdminExchangeListParams
  extends BaseExchangeListParams,
    BaseFilterable<AdminExchangeListParams> {
  deleted_at?: OperatorMap<string>
}

export interface AdminExchangeParams extends SelectParams {
  id?: string | string[]
  status?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
