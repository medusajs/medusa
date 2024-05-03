import { BigNumberInput } from "@medusajs/types"

interface PartialUpsertLineItemDTO {
  subtitle?: string
  thumbnail?: string

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

  compare_at_unit_price?: BigNumberInput
}

export interface CreateLineItemDTO extends PartialUpsertLineItemDTO {
  title: string
  quantity: BigNumberInput
  unit_price: BigNumberInput
  cart_id: string
}

export interface UpdateLineItemDTO
  extends PartialUpsertLineItemDTO,
    Partial<CreateLineItemDTO> {
  id: string
}
