export interface AdminCreateTaxRateRule {
  /**
   * The name of the table that the rule references.
   * 
   * @example
   * "product_type"
   */
  reference: string
  /**
   * The ID of the record in the table that the rule references.
   * 
   * @example
   * "protyp_123"
   */
  reference_id: string
}

export interface AdminCreateTaxRate {
  /**
   * The name of the tax rate.
   */
  name: string
  /**
   * The ID of the tax region associated with the tax rate.
   */
  tax_region_id: string
  /**
   * The rate of the tax rate.
   */
  rate?: number
  /**
   * The code of the tax rate.
   */
  code: string
  /**
   * The rules of the tax rate.
   */
  rules?: AdminCreateTaxRateRule[]
  /**
   * Whether the tax rate is the default tax rate in its tax region.
   */
  is_default?: boolean
  /**
   * Whether the tax rate is combinable with other tax rates.
   */
  is_combinable?: boolean
  /**
   * Custom key-value pairs that can be added to the tax rate.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateTaxRate {
  /**
   * The name of the tax rate.
   */
  name?: string
  /**
   * The percentage rate of the tax rate.
   */
  rate?: number
  /**
   * The code of the tax rate.
   */
  code?: string
  /**
   * The rules of the tax rate.
   */
  rules?: AdminCreateTaxRateRule[]
  /**
   * Whether the tax rate is the default tax rate in its tax region.
   */
  is_default?: boolean
  /**
   * Whether the tax rate is combinable with other tax rates.
   */
  is_combinable?: boolean
  /**
   * Custom key-value pairs that can be added to the tax rate.
   */
  metadata?: Record<string, unknown> | null
}
