export interface CreateOrderShippingMethodDTO {
  name: string
  shipping_method_id: string
  amount: number
  data?: Record<string, unknown>
}

export interface UpdateOrderShippingMethodDTO {
  id: string
  name?: string
  amount?: number
  data?: Record<string, unknown>
}
