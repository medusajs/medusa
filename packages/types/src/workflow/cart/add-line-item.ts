export type AddLineItemToCartDTO = {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown> | undefined
  customer_id?: string
}

export type AddLineItemToCartWorkflowDTO = {
  line_items: AddLineItemToCartDTO[]
  cart_id: string
}
