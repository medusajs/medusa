export interface StripeCredentials {
  apiKey: string
  webhookSecret: string
}

export interface StripeOptions {
  credentials: Record<string, StripeCredentials>
  /**
   * Use this flag to capture payment immediately (default is false)
   */
  capture?: boolean
  /**
   * set `automatic_payment_methods` to `{ enabled: true }`
   */
  automatic_payment_methods?: boolean
  /**
   * Set a default description on the intent if the context does not provide one
   */
  payment_description?: string
  /**
   * The delay in milliseconds before processing the webhook event.
   * @defaultValue 5000
   */
  webhook_delay?: number
  /**
   * The number of times to retry the webhook event processing in case of an error.
   * @defaultValue 3
   */
  webhook_retries?: number
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
