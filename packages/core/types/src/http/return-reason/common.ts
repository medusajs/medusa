import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseReturnReason {
  id: string
  value: string
  label: string
  description?: string | null
  metadata?: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface BaseReturnReasonListParams extends FindParams {
  q?: string
  id?: string | string[]
  value?: string | OperatorMap<string>
  label?: string | OperatorMap<string>
  description?: string | OperatorMap<string>
  parent_return_reason_id?: string | OperatorMap<string | string[]>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
