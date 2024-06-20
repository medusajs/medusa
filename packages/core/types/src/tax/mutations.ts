import { MetadataType } from "../common"

/**
 * The tax rate to be created.
 */
export interface CreateTaxRateDTO {
  /**
   * The associated tax region's ID.
   */
  tax_region_id: string

  /**
   * The rate to charge.
   *
   * @example
   * 10
   */
  rate?: number | null

  /**
   * The code of the tax rate.
   */
  code?: string | null

  /**
   * The name of the tax rate.
   */
  name: string

  /**
   * The rules of the tax rate.
   */
  rules?: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]

  /**
   * Whether the tax rate is default.
   */
  is_default?: boolean

  /**
   * Who created the tax rate. For example, the ID of the user
   * that created the tax rate.
   */
  created_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The attributes in the tax rate to be created or updated.
 */
export interface UpsertTaxRateDTO {
  /**
   * The ID of the tax rate. If not provided, the tax rate
   * is created.
   */
  id?: string

  /**
   * The rate to charge
   *
   * @example
   * 10
   */
  rate?: number | null

  /**
   * The code of the tax rate.
   */
  code?: string | null

  /**
   * The name of the tax rate.
   */
  name?: string

  /**
   * Whether the tax rate is default.
   */
  is_default?: boolean

  /**
   * Who created the tax rate. For example, the
   * ID of the user that created it.
   */
  created_by?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The attributes to update in the tax rate.
 */
export interface UpdateTaxRateDTO {
  /**
   * The rate to charge.
   *
   * @example
   * 10
   */
  rate?: number | null

  /**
   * The code of the tax rate.
   */
  code?: string | null

  /**
   * The name of the tax rate.
   */
  name?: string

  /**
   * The rules of the tax rate.
   */
  rules?: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]

  /**
   * Whether the tax rate is default.
   */
  is_default?: boolean

  /**
   * Whether the tax rate is combinable.
   *
   * Learn more [here](https://docs.medusajs.com/experimental/tax/tax-rates-and-rules/#combinable-tax-rates).
   */
  is_combinable?: boolean

  /**
   * @ignore
   *
   * @privateRemarks
   * This should be `created_by`.
   */
  updated_by?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType
}

/**
 * The tax region to be created.
 */
export interface CreateTaxRegionDTO {
  /**
   * The ISO 3 character country code of the tax region.
   */
  country_code: string

  /**
   * The province code of the tax region.
   */
  province_code?: string | null

  /**
   * The ID of the tax region's parent.
   */
  parent_id?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType

  /**
   * Who created the tax region. For example, the ID of
   * the user that created the tax region.
   */
  created_by?: string

  /**
   * The default tax rate of the tax region.
   */
  default_tax_rate?: {
    /**
     * The rate to charge.
     *
     * @example
     * 10
     */
    rate?: number | null

    /**
     * The code of the tax rate.
     */
    code?: string | null

    /**
     * The name of the tax rate.
     */
    name: string

    /**
     * Holds custom data in key-value pairs.
     */
    metadata?: MetadataType
  }
}

/**
 * The tax rate rule to be created.
 */
export interface CreateTaxRateRuleDTO {
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
   * Holds custom data in key-value pairs.
   */
  metadata?: MetadataType

  /**
   * Who created the tax rate rule. For example, the ID of the
   * user that created it.
   */
  created_by?: string | null
}
