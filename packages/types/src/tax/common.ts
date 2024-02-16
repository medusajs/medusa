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
  metadata?: Record<string, unknown> | null
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
