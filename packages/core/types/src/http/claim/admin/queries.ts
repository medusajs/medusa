import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseClaimListParams } from "../common"

export interface AdminClaimListParams
  extends BaseClaimListParams,
    BaseFilterable<AdminClaimListParams> {
  deleted_at?: OperatorMap<string>
}

export interface AdminClaimParams extends SelectParams {
  id?: string | string[]
  status?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
