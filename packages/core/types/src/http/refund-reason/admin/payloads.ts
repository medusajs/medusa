export interface AdminCreateRefundReason {
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
}

export interface AdminUpdateRefundReason {
  /**
   * The refund reason's label.
   *
   * @example
   * "Refund"
   */
  label?: string
  /**
   * The refund reason's code.
   *
   * @example
   * "refund"
   */
  code?: string
  /**
   * The refund reason's description.
   */
  description?: string | null
}
