export interface AddShippingMethodToCartDTO {
  cart_id: string
  option_id: string
  data: Record<string, unknown>
}

export interface ValidateShippingOptionForCartDTO {
  option: any // shipping option
  cart: any // cart
  data: Record<string, unknown>
}
