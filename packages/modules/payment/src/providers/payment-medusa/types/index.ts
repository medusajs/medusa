export interface MedusaPaymentsOptions {
  /**
   * The API key for the Stripe account
   */
  api_key: string
  /**
   * The webhook secret used to verify webhooks
   */
  webhook_secret: string
  /**
   * The endpoint to use for the payments
   */
  endpoint: string
  /**
   * The handle of the cloud environment
   */
  environment_handle: string
  /**
   * The handle of the cloud sandbox
   */
  sandbox_handle: string
  /**
   * The handle of the Medusa Payments account the provider processes payments with
   */
  payment_account: string
}
