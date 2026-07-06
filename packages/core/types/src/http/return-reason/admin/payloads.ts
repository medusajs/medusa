type AdminBaseReturnReasonPayload = {
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
  description?: string
  /**
   * Custom key-value pairs that can be added to the return reason.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateReturnReason extends AdminBaseReturnReasonPayload {
  /**
   * The ID of the return reason's parent.
   */
  parent_return_reason_id?: string | null
}

export interface AdminUpdateReturnReason extends AdminBaseReturnReasonPayload {}
