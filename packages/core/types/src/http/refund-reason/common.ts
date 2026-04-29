import { OperatorMap } from "../../dal"
import { FindParams } from "../common"

export interface BaseRefundReason {
  /**
   * The refund reason's ID.
   */
  id: string
  /**
   * The refund reason's label.
   *
   * @example
   * "Refund"
   */
  label: string
  /**
   * The refund reason's code.
   *
   * @example
   * "refund"
   */
  code: string
  /**
   * The refund reason's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the refund reason.
   */
  metadata?: Record<string, any> | null
  /**
   * The date that the refund reason was created.
   */
  created_at: string
  /**
   * The date that the refund reason was updated.
   */
  updated_at: string
}

export interface BaseRefundReasonListParams extends FindParams {
  /**
   * A search term to search for refund reasons by label or description.
   */
  q?: string
  /**
   * Filter by refund reason ID(s).
   */
  id?: string | string[]
  /**
   * Filter by creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the refund reason's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
