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

interface TaxRateRuleDTO {
  tax_rate_id: string
  tax_rate?: TaxRateDTO
  metadata?: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  created_by: string | null
}

export interface ShippingTaxRateDTO extends TaxRateRuleDTO {
  shipping_option_id: string
}

export interface FilterableShippingTaxRateProps
  extends BaseFilterable<FilterableShippingTaxRateProps> {
  shipping_option_id?: string | string[]
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

export interface ProductTaxRateDTO extends TaxRateRuleDTO {
  product_id: string
}

export interface FilterableProductTaxRateProps
  extends BaseFilterable<FilterableProductTaxRateProps> {
  product_id?: string | string[]
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

export interface ProductTypeTaxRateDTO extends TaxRateRuleDTO {
  product_type_id: string
}

export interface FilterableProductTypeTaxRateProps
  extends BaseFilterable<FilterableProductTypeTaxRateProps> {
  product_type_option_id?: string | string[]
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
