import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { BigNumberInput } from "../totals"

/**
 * The tax rate details.
 */
export interface TaxRateDTO {
  /**
   * The ID of the tax rate.
   */
  id: string

  /**
   * The rate to charge.
   * @example
   * 10
   */
  rate: number | null

  /**
   * The code the tax rate is identified by.
   */
  code: string | null

  /**
   * The name of the Tax Rate.
   * @example
   * VAT
   */
  name: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The ID of the associated tax region.
   */
  tax_region_id: string

  /**
   * Whether the tax rate should be combined with parent rates.
   *
   * Learn more [here](https://docs.medusajs.com/experimental/tax/tax-rates-and-rules/#combinable-tax-rates).
   */
  is_combinable: boolean

  /**
   * Whether the tax rate is the default rate for the region.
   */
  is_default: boolean

  /**
   * The creation date of the tax rate.
   */
  created_at: string | Date

  /**
   * The update date of the tax rate.
   */
  updated_at: string | Date

  /**
   * The deletion date of the tax rate.
   */
  deleted_at: Date | null

  /**
   * Who created the tax rate. For example, the ID of the user that created the tax rate.
   */
  created_by: string | null
}

/**
 * The tax provider details.
 */
export interface TaxProviderDTO {
  /**
   * The ID of the tax provider.
   */
  id: string

  /**
   * Whether the tax provider is enabled.
   */
  is_enabled: boolean
}

/**
 * The filters to apply on the retrieved tax rates.
 */
export interface FilterableTaxRateProps
  extends BaseFilterable<FilterableTaxRateProps> {
  /**
   * Find tax rates based on name and code properties through this search term.
   */
  q?: string

  /**
   * The IDs to filter the tax rates by.
   */
  id?: string | string[]

  /**
   * Filter the tax rates by their associated tax regions.
   */
  tax_region_id?: string | string[]

  /**
   * Filter the tax rates by their rate.
   */
  rate?: number | number[] | OperatorMap<number>

  /**
   * Filter the tax rates by their code.
   */
  code?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax rates by their name.
   */
  name?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax rates by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the tax rates by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the tax rates by who created it.
   */
  created_by?: string | string[] | OperatorMap<string>
}

/**
 * The tax region details.
 */
export interface TaxRegionDTO {
  /**
   * The ID of the tax region.
   */
  id: string

  /**
   * The ISO 2 character country code of the tax region.
   */
  country_code: string

  /**
   * The province code of the tax region.
   */
  province_code: string | null

  /**
   * The ID of the tax region's parent tax region.
   */
  parent_id: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The creation date of the tax region.
   */
  created_at: string | Date

  /**
   * The update date of the tax region.
   */
  updated_at: string | Date

  /**
   * Who created the tax region. For example, the ID of the user
   * that created the tax region.
   */
  created_by: string | null

  /**
   * The deletion date of the tax region.
   */
  deleted_at: string | Date | null
}

/**
 * The filters to apply on the retrieved tax regions.
 */
export interface FilterableTaxRegionProps
  extends BaseFilterable<FilterableTaxRegionProps> {
  /**
   * Find tax regions based on currency and province codes through this search term.
   */
  q?: string

  /**
   * The IDs to filter the tax regions by.
   */
  id?: string | string[]

  /**
   * Filter the tax regions by their country code.
   */
  country_code?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax regions by their province code.
   */
  province_code?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax regions by the ID of their parent tax region.
   */
  parent_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax regions by their metadata.
   */
  metadata?:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | OperatorMap<Record<string, unknown>>

  /**
   * Filter the tax regions by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the tax regions by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the tax regions by who created it.
   */
  created_by?: string | string[] | OperatorMap<string>
}

/**
 * The tax rate rule details.
 */
export interface TaxRateRuleDTO {
  /**
   * The ID of the tax rate rule.
   */
  id: string

  /**
   * The snake-case name of the data model that the tax rule references.
   * For example, `product`.
   *
   * Learn more in [this guide](https://docs.medusajs.com/experimental/tax/tax-rates-and-rules/#what-are-tax-rules).
   */
  reference: string

  /**
   * The ID of the record of the data model that the tax rule references.
   * For example, `prod_123`.
   *
   * Learn more in [this guide](https://docs.medusajs.com/experimental/tax/tax-rates-and-rules/#what-are-tax-rules).
   */
  reference_id: string

  /**
   * The associated tax rate's ID.
   */
  tax_rate_id: string

  /**
   * The associated tax rate.
   */
  tax_rate?: TaxRateDTO

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the tax rate rule.
   */
  created_at: string | Date

  /**
   * The update date of the tax rate rule.
   */
  updated_at: string | Date

  /**
   * Who created the tax rate rule. For example, the ID of the user
   * that created the tax rate rule.
   */
  created_by: string | null
}

/**
 * The filters to apply on the retrieved tax rate rules.
 */
export interface FilterableTaxRateRuleProps
  extends BaseFilterable<FilterableTaxRateRuleProps> {
  /**
   * Filter the tax rate rule by what it references.
   */
  reference?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax rate rule by the ID of the record it references.
   */
  reference_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax rate rule by the ID of their associated tax rate.
   */
  tax_rate_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the tax rate rule by their associated tax rate.
   */
  tax_rate?: FilterableTaxRateProps

  /**
   * Filter the tax rate rule by what its metadata.
   */
  metadata?:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | OperatorMap<Record<string, unknown>>

  /**
   * Filter the tax rate rule by its creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the tax rate rule by its update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the tax rate rule by who created it.
   */
  created_by?: string | string[] | OperatorMap<string>
}

/**
 * The taxable item details.
 */
export interface TaxableItemDTO {
  /**
   * The ID of the taxable item.
   */
  id: string

  /**
   * The associated product's ID.
   */
  product_id: string

  /**
   * The name of the item's product.
   */
  product_name?: string

  /**
   * The ID of the category of the item's product.
   */
  product_category_id?: string

  /**
   * The categories of the item's product.
   */
  product_categories?: string[]

  /**
   * The SKU of the item's product.
   */
  product_sku?: string

  /**
   * The type of the item's product.
   */
  product_type?: string

  /**
   * The ID of the type of the item's product.
   */
  product_type_id?: string

  /**
   * The quantity of the taxable item.
   */
  quantity?: BigNumberInput

  /**
   * The unit price of the taxable item.
   */
  unit_price?: BigNumberInput

  /**
   * The ISO 3 character currency code of the taxable item.
   */
  currency_code?: string
}

/**
 * The taxable shipping details.
 */
export interface TaxableShippingDTO {
  /**
   * The ID of the taxable shipping.
   */
  id: string

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id: string

  /**
   * The unit price of the taxable shipping.
   */
  unit_price?: BigNumberInput

  /**
   * The ISO 3 character currency code of the taxable shipping.
   */
  currency_code?: string
}

/**
 * The context provided when tax lines are calculated and retrieved. This
 * context is later passed to the underlying tax provider.
 */
export interface TaxCalculationContext {
  /**
   * The customer's address
   */
  address: {
    /**
     * The ISO 2 character currency code.
     */
    country_code: string

    /**
     * The province code.
     */
    province_code?: string | null

    /**
     * The first line of the address.
     */
    address_1?: string

    /**
     * The second line of the address
     */
    address_2?: string | null

    /**
     * The city.
     */
    city?: string

    /**
     * The postal code.
     */
    postal_code?: string
  }

  /**
   * The customer's details.
   */
  customer?: {
    /**
     * The ID of the customer.
     */
    id: string

    /**
     * The email of the customer.
     */
    email: string

    /**
     * The groups that the customer belongs to.
     */
    customer_groups: string[]
  }

  /**
   * Whether the tax lines are calculated for an order return.
   */
  is_return?: boolean
}

/**
 * The tax line details.
 */
interface TaxLineDTO {
  /**
   * The associated rate's ID.
   */
  rate_id?: string

  /**
   * The rate of the tax line.
   */
  rate: number | null

  /**
   * The code of the tax line.
   */
  code: string | null

  /**
   * The name of the tax line.
   */
  name: string

  /**
   * The ID of the tax provider used to calculate and retrieve the tax line.
   */
  provider_id: string
}

/**
 * The item tax line details.
 */
export interface ItemTaxLineDTO extends TaxLineDTO {
  /**
   * The associated line item's ID.
   */
  line_item_id: string
}

/**
 * The shipping tax line details.
 */
export interface ShippingTaxLineDTO extends TaxLineDTO {
  /**
   * The associated shipping line's ID.
   */
  shipping_line_id: string
}
