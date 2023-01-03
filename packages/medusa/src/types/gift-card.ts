export type CreateGiftCardInput = {
  order_id?: string
  value?: number
  balance?: number
  ends_at?: Date
  is_disabled?: boolean
  region_id: string
  metadata?: Record<string, unknown>
  tax_rate?: number | null
}

export type UpdateGiftCardInput = {
  balance?: number
  ends_at?: Date
  is_disabled?: boolean
  region_id?: string
  metadata?: Record<string, unknown>
}

export type CreateGiftCardTransactionInput = {
  gift_card_id: string
  order_id: string
  amount: number
  created_at?: Date
  is_taxable?: boolean
  tax_rate?: number | null
}
