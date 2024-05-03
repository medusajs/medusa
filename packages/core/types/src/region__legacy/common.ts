/**
 * @interface
 *
 * The details of a legacy region.
 */
export type RegionDTO__legacy = {
  /**
   * The name of the region.
   */
  name: string

  /**
   * The currency code of the region.
   */
  currency_code: string

  /**
   * The tax rate of the region.
   */
  tax_rate?: number

  /**
   * The tax code of the region.
   */
  tax_code?: string | null

  /**
   * Whether gift cards in the region are taxable.
   */
  gift_cards_taxable?: boolean

  /**
   * Whether taxes should be calculated automatically in the region.
   */
  automatic_taxes?: boolean

  /**
   * The associated tax provider's ID.
   */
  tax_provider_id?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * Whether prices include taxes in the region.
   */
  includes_tax?: boolean
}
