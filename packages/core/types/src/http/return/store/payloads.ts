interface StoreCreateReturnItem {
  id: string
  quantity: number
  reason_id?: string | null
  note?: string | null
}

interface StoreCreateReturnShipping {
  option_id: string
  /**
   * @deprecated Ignored by the Store API. The shipping option's price is used.
   */
  price?: number
}

export interface StoreCreateReturn {
  order_id: string
  items: StoreCreateReturnItem[]
  return_shipping: StoreCreateReturnShipping
  note?: string | null
  /**
   * @deprecated Ignored by the Store API. Returns are received by the merchant.
   */
  receive_now?: boolean
  location_id?: string | null
}
