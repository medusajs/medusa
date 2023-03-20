export const PaypalApiPath = {
  AUTH: "/v1/oauth2/token",
  GET_ORDER: "/v2/checkout/orders/{id}",
  PATCH_ORDER: "/v2/checkout/orders/{id}",
  CREATE_ORDER: "/v2/checkout/orders",
  CAPTURE_REFUND: "/v2/payments/captures/{id}/refund",
  AUTHORIZATION_CAPTURE: "/v2/payments/authorizations/{id}/capture",
  AUTHORIZATION_VOID: "/v2/payments/authorizations/{id}/void",
}
