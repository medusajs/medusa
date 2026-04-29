/**
 * The details to capture a payment.
 */
export interface AdminCapturePayment {
  /**
   * Custom amount to capture. If not specified, the
   * payment's amount is captured.
   */
  amount?: number
}

/**
 * The details to refund a payment.
 */
export interface AdminRefundPayment {
  /**
   * Custom amount to refund. If not specified, the
   * payment's amount is refunded.
   */
  amount?: number
  /**
   * The ID of the refund's reason.
   */
  refund_reason_id?: string
  /**
   * A note to attach to the refund.
   */
  note?: string
}

/**
 * The details to create a payment collection.
 */
export interface AdminCreatePaymentCollection {
  /**
   * The ID of the order this payment collection belongs to.
   */
  order_id: string
  /**
   * The payment collection's amount.
   */
  amount: number
}

/**
 * The details to mark a payment collection as paid.
 */
export interface AdminMarkPaymentCollectionAsPaid {
  /**
   * The ID of the order this payment collection belongs to.
   */
  order_id: string
}

/**
 * The details of a payment session to initialize for a payment collection.
 * @since 2.14.2
 */
export interface AdminInitializePaymentSession {
  /**
   * The ID of the provider to initialize a payment session for.
   */
  provider_id: string
  /**
   * Any data necessary for the payment provider to process the payment.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>
}
