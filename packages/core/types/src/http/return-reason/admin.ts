import { BaseReturnReason } from "./common"
import { FindParams } from "../common"
import { BaseFilterable, OperatorMap } from "../../dal"

export interface AdminReturnReason extends BaseReturnReason {}

export interface AdminCreateReturnReason {
  // TODO:
  value: string
  label: string
  description?: string
}

export interface AdminReturnReasonsResponse {
  return_reasons: AdminReturnReason[]
}

export interface AdminReturnReasonListParams
  extends FindParams,
    BaseFilterable<AdminReturnReasonListParams> {
  id?: string[] | string | OperatorMap<string | string[]>
  value?: string | OperatorMap<string>
  label?: string | OperatorMap<string>
  description?: string | OperatorMap<string>
  parent_return_reason_id?: string | OperatorMap<string | string[]>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
