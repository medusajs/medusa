export interface AddShippingMethodToCartWorkflowDTO {
  cart_id: string
  option_id: string
  data?: Record<string, unknown>
}
