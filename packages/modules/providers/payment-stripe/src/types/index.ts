export interface StripeOptions {
  /**
   * The API key for the Stripe account
   */
  apiKey: string
  /**
   * The webhook secret used to verify webhooks
   */
  webhookSecret: string
  /**
   * Use this flag to capture payment immediately (default is false)
   */
  capture?: boolean
  /**
   * set `automatic_payment_methods` on the intent request to `{ enabled: true }`
   */
  automaticPaymentMethods?: boolean
  /**
   * Set a default description on the intent if the context does not provide one
   */
  paymentDescription?: string
}

export interface PaymentIntentOptions {
  capture_method?: "automatic" | "manual"
  setup_future_usage?: "on_session" | "off_session"
  payment_method_types?: string[]
}

export const ErrorCodes = {
  PAYMENT_INTENT_UNEXPECTED_STATE: "payment_intent_unexpected_state",
}

export const ErrorIntentStatus = {
  SUCCEEDED: "succeeded",
  CANCELED: "canceled",
}

export const PaymentProviderKeys = {
  STRIPE: "stripe",
  BAN_CONTACT: "stripe-bancontact",
  BLIK: "stripe-blik",
  GIROPAY: "stripe-giropay",
  IDEAL: "stripe-ideal",
  PRZELEWY_24: "stripe-przelewy24",
}
