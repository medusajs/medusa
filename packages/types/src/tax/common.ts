import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

export interface TaxRateDTO {
  /**
   * The ID of the Tax Rate.
   */
  id: string
  /**
   * The numerical rate to charge.
   */
  rate: number | null
  /**
   * The code the tax rate is identified by.
   */
  code: string | null
  /**
   * The name of the Tax Rate. E.g. "VAT".
   */
  name: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null
  /**
   * When the Tax Rate was created.
   */
  created_at: string | Date
  /**
   * When the Tax Rate was updated.
   */
  updated_at: string | Date
  /**
   * The ID of the user that created the Tax Rate.
   */
  created_by: string
}

export interface FilterableTaxRateProps
  extends BaseFilterable<FilterableTaxRateProps> {
  id?: string | string[]

  rate?: number | number[] | OperatorMap<number>
  code?: string | string[] | OperatorMap<string>
  name?: string | string[] | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  created_by?: string | string[] | OperatorMap<string>
}

export interface TaxRegionDTO {
  id: string
  country_code: string
  province_code: string | null
  parent_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  created_by: string | null
}

export interface FilterableTaxRegionProps
  extends BaseFilterable<FilterableTaxRegionProps> {
  id?: string | string[]
  country_code?: string | string[] | OperatorMap<string>
  province_code?: string | string[] | OperatorMap<string>
  parent_id?: string | string[] | OperatorMap<string>
  metadata?:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | OperatorMap<Record<string, unknown>>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  created_by?: string | string[] | OperatorMap<string>
}

export interface TaxRateRuleDTO {
  reference: string
  reference_id: string
  tax_rate_id: string
  tax_rate?: TaxRateDTO
  metadata?: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  created_by: string | null
}

export interface FilterableTaxRateRuleProps
  extends BaseFilterable<FilterableTaxRateRuleProps> {
  reference?: string | string[] | OperatorMap<string>
  reference_id?: string | string[] | OperatorMap<string>
  tax_rate_id?: string | string[] | OperatorMap<string>
  tax_rate?: FilterableTaxRateProps
  metadata?:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | OperatorMap<Record<string, unknown>>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  created_by?: string | string[] | OperatorMap<string>
}
export interface TaxableItemDTO {
  id: string
  product_id: string
  product_name?: string
  product_category_id?: string
  product_categories?: string[]
  product_sku?: string
  product_type?: string
  product_type_id?: string
  quantity?: number
  unit_price?: number
  currency_code?: string
}

export interface TaxableShippingDTO {
  id: string
  shipping_option_id: string
  unit_price?: number
  currency_code?: string
}

export interface TaxCalculationContext {
  address: {
    country_code: string
    province_code?: string | null
    address_1?: string
    address_2?: string | null
    city?: string
    postal_code?: string
  }
  customer?: {
    id: string
    email: string
    customer_groups: string[]
  }
  is_return?: boolean
}

interface TaxLineDTO {
  rate_id: string
  rate: number | null
  code: string | null
  name: string
}

export interface ItemTaxLineDTO extends TaxLineDTO {
  line_item_id: string
}

export interface ShippingTaxLineDTO extends TaxLineDTO {
  shipping_line_id: string
}
