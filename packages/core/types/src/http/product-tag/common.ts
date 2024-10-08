import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseProductTag {
  id: string
  value: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductTagListParams extends FindParams {
  q?: string
  id?: string | string[]
  value?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
