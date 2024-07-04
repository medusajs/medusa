import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * A price preference's data.
 */
export interface PricePreferenceDTO {
  /**
   * The ID of a price preference.
   */
  id: string
  /**
   * The rule attribute for the preference
   */
  attribute: string | null
  /**
   * The rule value for the preference
   */
  value: string | null
  /**
   * Flag specifying whether prices for the specified rule are tax inclusive.
   */
  is_tax_inclusive: boolean
  /**
   * When the price preference was created.
   */
  created_at: Date
  /**
   * When the price preference was updated.
   */
  updated_at: Date
  /**
   * When the price preference was deleted.
   */
  deleted_at: null | Date
}

export interface UpsertPricePreferenceDTO extends UpdatePricePreferenceDTO {
  /**
   * The ID of a price preference.
   */
  id?: string
}

export interface UpdatePricePreferenceDTO {
  /**
   * The rule attribute for the preference
   */
  attribute?: string | null
  /**
   * The rule value for the preference
   */
  value?: string | null
  /**
   * Flag specifying whether prices for the specified rule are tax inclusive.
   */
  is_tax_inclusive?: boolean
}

export interface CreatePricePreferenceDTO {
  /**
   * The rule attribute for the preference
   */
  attribute?: string
  /**
   * The rule value for the preference
   */
  value?: string
  /**
   * Flag specifying whether prices for the specified rule are tax inclusive.
   */
  is_tax_inclusive?: boolean
}

/**
 * @interface
 *
 * Filters to apply on prices.
 */
export interface FilterablePricePreferenceProps
  extends BaseFilterable<FilterablePricePreferenceProps> {
  /**
   * The IDs to filter the price preferences by.
   */
  id?: string[]
  /**
   * Attributes to filter price preferences by.
   */
  attribute?: string | string[]
  /**
   * Values to filter price preferences by.
   */
  value?: string | string[]
}
