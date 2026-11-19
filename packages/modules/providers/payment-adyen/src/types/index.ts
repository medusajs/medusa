import { Types } from "@adyen/api-library"

export type AdyenEnvironment = "TEST" | "LIVE"

export interface AdyenOptions {
  apiKey: string
  merchantAccount: string
  /**
   * The HMAC key of the standard webhook. Webhooks are rejected without it.
   */
  hmacKey?: string
  /**
   * @defaultValue "TEST"
   */
  environment?: AdyenEnvironment
  /**
   * Required when `environment` is `LIVE`. Find it in the Customer Area under Developers > API URLs.
   */
  liveEndpointUrlPrefix?: string
  /**
   * Whether to capture payments immediately after authorization.
   *
   * @defaultValue false
   */
  capture?: boolean
  /**
   * The URL to return the shopper to after a redirect, used when the
   * storefront doesn't pass `return_url` in the session's `data.client`.
   */
  returnUrl?: string
}

/**
 * Data the storefront passes in the session's `data.client`. Treated as untrusted.
 */
export interface AdyenClientData {
  payment_method?: Types.checkout.PaymentRequest["paymentMethod"] | null
  browser_info?: Types.checkout.BrowserInfo | null
  details?: Types.checkout.PaymentCompletionDetails | null
  origin?: string | null
  return_url?: string | null
  /**
   * Whether to save the card for future payments, from Drop-in's `state.data.storePaymentMethod`.
   * Only applies to customers with an account holder.
   */
  store_payment_method?: boolean | null
}

export interface AdyenSessionData {
  session_id: string
  /**
   * The amount in minor units.
   */
  amount: number
  currency: string
  capture: boolean
  shopper_email?: string | null
  /**
   * The account holder's ID, which Adyen uses to store and look up saved cards.
   */
  shopper_reference?: string | null
  payment_methods?: Types.checkout.PaymentMethodsResponse | null
  psp_reference: string | null
  capture_psp_reference: string | null
  /**
   * Incremented for every payment method the storefront submits, to key `/payments` requests.
   */
  attempt: number
  /**
   * The saved card to charge without the shopper present, set when the session is created.
   */
  off_session_payment_method: string | null
  result_code: string | null
  action: Types.checkout.PaymentResponseAction | null
  client?: AdyenClientData
}
