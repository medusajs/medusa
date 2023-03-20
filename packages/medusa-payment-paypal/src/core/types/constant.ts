export const PAYPAL_API_PATH = {
  AUTH: "/v1/oauth2/token",
  CREATE_ORDER: "/v2/checkout/orders",
  CAPTURE_REFUND: "/v2/payments/captures/{id}/refund",
  AUTHORIZATION_VOID: "/v2/payments/authorizations/{id}/void",
}
