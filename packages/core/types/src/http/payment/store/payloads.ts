export interface StoreCreatePaymentCollection {
  cart_id: string
}

export interface StoreInitializePaymentSession {
  /**
   * The ID of the provider to initialize a payment session
   * for.
   */
  provider_id: string
  /**
   * Any data necessary for the payment provider to process the payment.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>
}

export interface StoreUpdatePaymentSession {
  /**
   * Data to merge into the session's `data.client`, such as payment details
   * collected by the provider's checkout component. Set a property to `null` to remove it.
   */
  client_data: Record<string, unknown>
}
