import { OrderAddress } from "../../order"

export interface AdminCreateDraftOrderItem {
  /**
   * The item's title.
   */
  title?: string | null
  /**
   * The item's variant SKU.
   */
  variant_sku?: string | null
  /**
   * The item's variant barcode.
   */
  variant_barcode?: string | null
  /**
   * The item's SKU.
   * @deprecated Use variant_sku instead.
   */
  sku?: string | null
  /**
   * The item's barcode.
   * @deprecated Use variant_barcode instead.
   */
  barcode?: string | null
  /**
   * The ID of the item's variant.
   */
  variant_id?: string | null
  /**
   * The item's unit price.
   */
  unit_price?: number | string | { value: string; precision: number } | null
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * The item's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateDraftOrderShippingMethod {
  /**
   * The ID of the shipping option.
   */
  shipping_option_id: string
}

export interface AdminCreateDraftOrder {
  /**
   * The draft order's status.
   */
  status?: "completed"
  /**
   * The draft order's email.
   *
   * Either email or customer_id must be provided.
   */
  email?: string | null
  /**
   * The ID of the customer to associate the draft order with.
   *
   * Either customer_id or email must be provided.
   */
  customer_id?: string | null
  /**
   * The ID of the sales channel to associate the draft order with.
   */
  sales_channel_id?: string | null
  /**
   * The ID of the region to associate the draft order with.
   */
  region_id: string
  /**
   * The currency code to use for the draft order.
   *
   * If not provided, the currency from the region will be used.
   */
  currency_code?: string | null
  /**
   * The promotions to apply to the draft order.
   */
  promo_codes?: string[]
  /**
   * The draft order's shipping address.
   */
  shipping_address?: OrderAddress | string
  /**
   * The draft order's billing address.
   */
  billing_address?: OrderAddress | string
  /**
   * The draft order's items.
   */
  items?: AdminCreateDraftOrderItem[]
  /**
   * The draft order's shipping methods.
   */
  shipping_methods?: AdminCreateDraftOrderShippingMethod[]
  /**
   * Whether to notify the customer about the draft order.
   */
  no_notification_order?: boolean
  /**
   * The BCP 47 language tag code of the locale.
   */
  locale?: string
  /**
   * The draft order's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateDraftOrder {
  /**
   * The draft order's email.
   */
  email?: string
  /**
   * The ID of the customer to associate the draft order with.
   */
  customer_id?: string
  /**
   * The ID of the sales channel to associate the draft order with.
   */
  sales_channel_id?: string
  /**
   * The draft order's shipping address.
   */
  shipping_address?: OrderAddress
  /**
   * The draft order's billing address.
   */
  billing_address?: OrderAddress
  /**
   * The BCP 47 language tag code of the locale.
   */
  locale?: string
  /**
   * The draft order's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateDraftOrderItem {
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * The item's unit price.
   */
  unit_price?: number | null
  /**
   * The item's compare at unit price.
   */
  compare_at_unit_price?: number | null
  /**
   * The item's internal note.
   */
  internal_note?: string | null
  /**
   * The item's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddDraftOrderItem {
  /**
   * The item's variant ID.
   *
   * Either variant_id or title must be provided.
   */
  variant_id?: string
  /**
   * The item's title.
   *
   * Either variant_id or title must be provided.
   */
  title?: string
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * The item's unit price.
   */
  unit_price?: number | null
  /**
   * The item's compare at unit price.
   */
  compare_at_unit_price?: number | null
  /**
   * The item's internal note.
   */
  internal_note?: string | null
  /**
   * The item's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddDraftOrderItems {
  /**
   * The items to add to the draft order.
   */
  items: AdminAddDraftOrderItem[]
}

export interface AdminAddDraftOrderPromotions {
  /**
   * The promotion codes to apply to the draft order.
   */
  promo_codes: string[]
}

export interface AdminRemoveDraftOrderPromotions {
  /**
   * The promotion codes to remove from the draft order.
   */
  promo_codes: string[]
}

export interface AdminAddDraftOrderShippingMethod {
  /**
   * ID of the shipping option to associate with the shipping method.
   */
  shipping_option_id: string
  /**
   * Custom amount for the shipping method.
   */
  custom_amount?: number
  /**
   * Description of the shipping method.
   */
  description?: string
  /**
   * Internal note for the shipping method.
   */
  internal_note?: string
  /**
   * Metadata for the shipping method.
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateDraftOrderActionShippingMethod {
  /**
   * ID of the shipping option to associate with the shipping method.
   */
  shipping_option_id: string
  /**
   * Custom amount for the shipping method.
   */
  custom_amount?: number | null
  /**
   * Description of the shipping method.
   */
  description?: string | null
  /**
   * Internal note for the shipping method.
   */
  internal_note?: string | null
  /**
   * Metadata for the shipping method.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateDraftOrderShippingMethod {
  /**
   * ID of the shipping option to associate with the shipping method.
   */
  shipping_option_id?: string
  /**
   * Custom amount for the shipping method.
   */
  custom_amount?: number
  /**
   * Internal note for the shipping method.
   */
  internal_note?: string | null
}

export interface AdminUpdateDraftOrderActionItem {
  quantity: number
  internal_note?: string | undefined
  unit_price?: number | null | undefined
  compare_at_unit_price?: number | null | undefined
}
