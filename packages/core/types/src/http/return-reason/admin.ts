import { BaseReturnReason, BaseReturnReasonFilters } from "./common"
import { FindParams } from "../common"
import { OperatorMap } from "../../dal"

export interface AdminReturnReason extends BaseReturnReason {}
export interface AdminReturnReasonFilters extends BaseReturnReasonFilters {}

export interface AdminCreateReturnReason {
  // TODO:
  value: string
  label: string
  description?: string
}

export interface AdminReturnReasonsResponse {
  return_reasons: AdminReturnReason[]
}

export interface AdminReturnReasonListParams extends FindParams {
  id?: string[] | string | OperatorMap<string | string[]>
  value?: string | OperatorMap<string>
  label?: string | OperatorMap<string>
  description?: string | OperatorMap<string>
  parent_return_reason_id?: string | OperatorMap<string | string[]>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
