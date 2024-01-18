export interface CreateShippingMethodDTO {
  name: string
  cart_id: string
  amount: number
  data?: Record<string, unknown>
}

export interface UpdateShippingMethodDTO {
  id: string
  name?: string
  amount?: number
  data?: Record<string, unknown>
}
