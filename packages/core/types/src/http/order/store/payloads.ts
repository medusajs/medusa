export interface StoreRequestOrderTransfer {
  /**
   * The description of the transfer request.
   */
  description?: string
  /**
   * Whether to update the order.email to the transferred customer email.
   */
  update_order_email?: boolean
}

export interface StoreAcceptOrderTransfer {
  token: string
}

export interface StoreDeclineOrderTransfer {
  token: string
}
