import { CartDTO, CartLineItemDTO } from "./common"

/** ADDRESS START */
export interface UpsertAddressDTO {
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

export interface UpdateAddressDTO extends UpsertAddressDTO {
  id: string
}

export interface CreateAddressDTO extends UpsertAddressDTO {}

/** ADDRESS END */

/** CART START */
export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  shipping_address_id?: string
  billing_address_id?: string
  shipping_address?: CreateAddressDTO | string
  billing_address?: CreateAddressDTO | string
  metadata?: Record<string, unknown>

  items?: CreateLineItemDTO[]
}

export interface UpdateCartDataDTO {
  region_id?: string
  customer_id?: string | null
  sales_channel_id?: string | null

  email?: string | null
  currency_code?: string

  shipping_address_id?: string | null
  billing_address_id?: string | null

  billing_address?: CreateAddressDTO | UpdateAddressDTO | null
  shipping_address?: CreateAddressDTO | UpdateAddressDTO | null

  metadata?: Record<string, unknown> | null
}

export interface UpdateCartDTO extends UpdateCartDataDTO {
  id: string
}

/** CART END */

/** ADJUSTMENT START */
export interface CreateAdjustmentDTO {
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateAdjustmentDTO {
  id: string
  code?: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface CreateLineItemAdjustmentDTO extends CreateAdjustmentDTO {
  item_id: string
}

export interface UpdateLineItemAdjustmentDTO extends UpdateAdjustmentDTO {
  item_id: string
}

export interface UpsertLineItemAdjustmentDTO {
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

export interface CreateTaxLineDTO {
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
}

export interface UpdateTaxLineDTO {
  id: string
  description?: string
  tax_rate_id?: string
  code?: string
  rate?: number
  provider_id?: string
}

export interface CreateShippingMethodTaxLineDTO extends CreateTaxLineDTO {}

export interface UpdateShippingMethodTaxLineDTO extends UpdateTaxLineDTO {}

export interface CreateLineItemTaxLineDTO extends CreateTaxLineDTO {}

export interface UpdateLineItemTaxLineDTO extends UpdateTaxLineDTO {}

/** TAX LINES END */

/** LINE ITEMS START */
export interface CreateLineItemDTO {
  title: string
  subtitle?: string
  thumbnail?: string

  cart_id?: string

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

  tax_lines?: CreateTaxLineDTO[]
  adjustments?: CreateAdjustmentDTO[]
}

export interface CreateLineItemForCartDTO extends CreateLineItemDTO {
  cart_id: string
}

export interface UpdateLineItemWithSelectorDTO {
  selector: Partial<CartLineItemDTO>
  data: Partial<UpdateLineItemDTO>
}

export interface UpdateCartWithSelectorDTO {
  selector: Partial<CartDTO>
  data: UpdateCartDataDTO
}

export interface UpdateLineItemDTO
  extends Omit<
    CreateLineItemDTO,
    "tax_lines" | "adjustments" | "title" | "quantity" | "unit_price"
  > {
  id: string

  title?: string
  quantity?: number
  unit_price?: number
  metadata?: Record<string, unknown> | null

  tax_lines?: UpdateTaxLineDTO[] | CreateTaxLineDTO[]
  adjustments?: UpdateAdjustmentDTO[] | CreateAdjustmentDTO[]
}

/** LINE ITEMS END */

/** SHIPPING METHODS START */

export interface CreateShippingMethodDTO {
  name: string
  cart_id: string
  amount: number
  data?: Record<string, unknown>
  tax_lines?: CreateTaxLineDTO[]
  adjustments?: CreateAdjustmentDTO[]
}

export interface CreateShippingMethodForSingleCartDTO {
  name: string
  amount: number
  data?: Record<string, unknown>
  tax_lines?: CreateTaxLineDTO[]
  adjustments?: CreateAdjustmentDTO[]
}

export interface UpdateShippingMethodDTO {
  id: string
  name?: string
  amount?: number
  data?: Record<string, unknown>
  tax_lines?: UpdateTaxLineDTO[] | CreateTaxLineDTO[]
  adjustments?: CreateAdjustmentDTO[] | UpdateAdjustmentDTO[]
}

export interface CreateShippingMethodAdjustmentDTO {
  shipping_method_id: string
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateShippingMethodAdjustmentDTO {
  id: string
  code?: string
  amount?: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

/** SHIPPING METHODS END */
