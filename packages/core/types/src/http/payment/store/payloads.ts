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
   * The payment's context, such as the customer or address details. if the customer is logged-in, 
   * the customer id is set in the context under a `customer.id` property.
   */
  context?: Record<string, unknown>
  /**
   * Any data necessary for the payment provider to process the payment.
   * 
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>
}