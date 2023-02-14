export interface StripeOptions {
  api_key: string
  webhook_secret: string
  /**
   * Use this flag to capture payment immediately (default is false)
   */
  capture?: boolean
}

export interface PaymentIntentOptions {
  capture_method?: "automatic" | "manual"
  setup_future_usage?: "on_session" | "off_session"
  payment_method_types?: string[]
}