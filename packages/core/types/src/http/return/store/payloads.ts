interface StoreCreateReturnItem {
  id: string
  quantity: number
  reason_id?: string | null
  note?: string | null
}

interface StoreCreateReturnShipping {
  option_id: string
  price?: number
}

export interface StoreCreateReturn {
  order_id: string
  items: StoreCreateReturnItem[]
  return_shipping: StoreCreateReturnShipping
  note?: string | null
  receive_now?: boolean
  location_id?: string | null
}
