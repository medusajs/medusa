export interface AddShippingMethodToCartWorkflowDTO {
  cart_id: string
  option_id: string
  data?: Record<string, unknown>
}

export interface ValidateShippingOptionForCartDTO {
  option: any // shipping option
  cart: any // cart
  data: Record<string, unknown>
}

export type EnsureCorrectLineItemShippingDTO = {
  items: any // line items
  methods: any // shipping methods to validate against
}

export type GetShippingOptionPriceDTO = {
  shippingOption: any // Shipping Option
  shippingOptionData: any // Validated shipping option data
  cart: any // cart
}

export type CreateShippingMethodsDTO = {
  option: any // Shipping Option
  config: any // Shipping method config

  cart?: any // cart
  order?: any // order

  data?: any
  shipping_option_id?: string
  price?: number
  return_id?: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  draft_order_id?: string
  claim_order_id?: string
}
