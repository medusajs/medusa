/**
 * The details to request an order transfer.
 */
export interface StoreRequestOrderTransfer {
  /**
   * The description of the transfer request.
   */
  description?: string
  /**
   * Whether to update the order.email to the transferred customer email.
   *
   * @since 2.13.7
   */
  update_order_email?: boolean
}

/**
 * The details to accept an order transfer.
 */
export interface StoreAcceptOrderTransfer {
  /**
   * The transfer token received in the email notification.
   */
  token: string
}

/**
 * The details to decline an order transfer.
 */
export interface StoreDeclineOrderTransfer {
  /**
   * The transfer token received in the email notification.
   */
  token: string
}
