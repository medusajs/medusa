import { OrderLineItemDTO } from "./common"

/** ADDRESS START */
export interface UpsertOrderAddressDTO {
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface UpdateOrderAddressDTO extends UpsertOrderAddressDTO {
  id: string
}

export interface CreateOrderAddressDTO extends UpsertOrderAddressDTO {}

/** ADDRESS END */

/** ORDER START */
export interface CreateOrderDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  shipping_address_id?: string
  billing_address_id?: string
  shipping_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO
  billing_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO
  metadata?: Record<string, unknown>

  items?: CreateOrderLineItemDTO[]
}

export interface UpdateOrderDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string

  email?: string
  currency_code?: string

  shipping_address_id?: string
  billing_address_id?: string

  billing_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO
  shipping_address?: CreateOrderAddressDTO | UpdateOrderAddressDTO

  metadata?: Record<string, unknown>
}

/** ORDER END */

/** ADJUSTMENT START */
export interface CreateOrderAdjustmentDTO {
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateOrderAdjustmentDTO {
  id: string
  code?: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface CreateOrderLineItemAdjustmentDTO
  extends CreateOrderAdjustmentDTO {
  item_id: string
}

export interface UpdateOrderLineItemAdjustmentDTO
  extends UpdateOrderAdjustmentDTO {
  item_id: string
}

export interface UpsertOrderLineItemAdjustmentDTO {
  id?: string
  item_id: string
  code?: string
  amount?: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

/** ADJUSTMENTS END */

/** TAX LINES START */

export interface CreateOrderTaxLineDTO {
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
}

export interface UpdateOrderTaxLineDTO {
  id: string
  description?: string
  tax_rate_id?: string
  code?: string
  rate?: number
  provider_id?: string
}

export interface CreateOrderShippingMethodTaxLineDTO
  extends CreateOrderTaxLineDTO {}

export interface UpdateOrderShippingMethodTaxLineDTO
  extends UpdateOrderTaxLineDTO {}

export interface CreateOrderLineItemTaxLineDTO extends CreateOrderTaxLineDTO {}

export interface UpdateOrderLineItemTaxLineDTO extends UpdateOrderTaxLineDTO {}

/** TAX LINES END */

/** LINE ITEMS START */
export interface CreateOrderLineItemDTO {
  title: string
  subtitle?: string
  thumbnail?: string

  order_id?: string

  quantity: number

  product_id?: string
  product_title?: string
  product_description?: string
  product_subtitle?: string
  product_type?: string
  product_collection?: string
  product_handle?: string

  variant_id?: string
  variant_sku?: string
  variant_barcode?: string
  variant_title?: string
  variant_option_values?: Record<string, unknown>

  requires_shipping?: boolean
  is_discountable?: boolean
  is_tax_inclusive?: boolean

  compare_at_unit_price?: number
  unit_price: number | string

  tax_lines?: CreateOrderTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[]
}

export interface CreateOrderLineItemForOrderDTO extends CreateOrderLineItemDTO {
  order_id: string
}

export interface UpdateOrderLineItemWithSelectorDTO {
  selector: Partial<OrderLineItemDTO>
  data: Partial<UpdateOrderLineItemDTO>
}

export interface UpdateOrderLineItemDTO
  extends Omit<
    CreateOrderLineItemDTO,
    "tax_lines" | "adjustments" | "title" | "quantity" | "unit_price"
  > {
  id: string

  title?: string
  quantity?: number
  unit_price?: number

  tax_lines?: UpdateOrderTaxLineDTO[] | CreateOrderTaxLineDTO[]
  adjustments?: UpdateOrderAdjustmentDTO[] | CreateOrderAdjustmentDTO[]
}

/** LINE ITEMS END */

/** SHIPPING METHODS START */

export interface CreateOrderShippingMethodDTO {
  name: string
  order_id: string
  amount: number
  data?: Record<string, unknown>
  tax_lines?: CreateOrderTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[]
}

export interface CreateOrderShippingMethodForSingleOrderDTO {
  name: string
  amount: number
  data?: Record<string, unknown>
  tax_lines?: CreateOrderTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[]
}

export interface UpdateOrderShippingMethodDTO {
  id: string
  name?: string
  amount?: number
  data?: Record<string, unknown>
  tax_lines?: UpdateOrderTaxLineDTO[] | CreateOrderTaxLineDTO[]
  adjustments?: CreateOrderAdjustmentDTO[] | UpdateOrderAdjustmentDTO[]
}

export interface CreateOrderShippingMethodAdjustmentDTO {
  shipping_method_id: string
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateOrderShippingMethodAdjustmentDTO {
  id: string
  code?: string
  amount?: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

/** SHIPPING METHODS END */
