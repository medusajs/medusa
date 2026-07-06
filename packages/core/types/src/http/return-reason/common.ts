import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseReturnReason {
  /**
   * The return reason's ID.
   */
  id: string
  /**
   * The return reason's value.
   * 
   * @example
   * "refund"
   */
  value: string
  /**
   * The return reason's label.
   * 
   * @example
   * "Refund"
   */
  label: string
  /**
   * The return reason's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the return reason.
   */
  metadata?: Record<string, any> | null
  /**
   * The date that the return reason was created.
   */
  created_at: string
  /**
   * The date that the return reason was updated.
   */
  updated_at: string
}

export interface BaseReturnReasonListParams extends FindParams {
  q?: string
  id?: string | string[]
  value?: string | string[]
  label?: string | string[]
  description?: string | OperatorMap<string>
  parent_return_reason_id?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
