import { AdminTaxRegion } from "../../tax-region"

export interface AdminTaxRateRule {
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
  /**
   * The date the tax rate rule was created.
   */
  created_at: string
}

export interface AdminTaxRate {
  /**
   * The tax rate's ID.
   */
  id: string
  /**
   * The tax rate's percentage rate.
   */
  rate: number | null
  /**
   * The tax rate's code.
   */
  code: string
  /**
   * The tax rate's name.
   */
  name: string
  /**
   * Custom key-value pairs that can be added to the tax rate.
   */
  metadata: Record<string, unknown> | null
  /**
   * The ID of the tax region associated with the tax rate.
   */
  tax_region_id: string
  /**
   * Whether the tax rate is combinable with other tax rates.
   */
  is_combinable: boolean
  /**
   * Whether the tax rate is the default tax rate in its tax region.
   */
  is_default: boolean
  /**
   * The date the tax rate was created.
   */
  created_at: string
  /**
   * The date the tax rate was updated.
   */
  updated_at: string
  /**
   * The date the tax rate was deleted.
   */
  deleted_at: null
  /**
   * The ID of the user who created the tax rate.
   */
  created_by: string | null
  /**
   * The tax region associated with the tax rate.
   */
  tax_region: AdminTaxRegion
  /**
   * The rules associated with the tax rate.
   */
  rules: AdminTaxRateRule[]
}
