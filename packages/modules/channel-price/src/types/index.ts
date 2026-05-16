// packages/modules/channel-price/src/types/index.ts
export const PRICE_TYPE = ["retail", "wholesale", "supply"] as const
export type PriceType = (typeof PRICE_TYPE)[number]

export interface CreateChannelPriceDTO {
  sales_material_id: string
  shop_id?: string
  customer_class_id?: string
  price_type: PriceType
  currency_code?: string
  amount: number
  start_at?: Date
  end_at?: Date
  min_quantity?: number
  max_quantity?: number
  metadata?: Record<string, unknown>
}

export interface UpdateChannelPriceDTO extends Partial<CreateChannelPriceDTO> {}
