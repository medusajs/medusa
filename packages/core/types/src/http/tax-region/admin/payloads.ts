export interface AdminCreateTaxRegion {
  /**
   * The country code of the tax region.
   */
  country_code: string
  /**
   * The ID of the tax provider.
   */
  provider_id?: string | null
  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province or state code of the tax region.
   */
  province_code?: string | null
  /**
   * The ID of the parent tax region.
   */
  parent_id?: string | null
  /**
   * The default tax rate of the tax region.
   */
  default_tax_rate?: {
    /**
     * The percentage rate of the default tax rate.
     */
    rate?: number
    /**
     * The code of the default tax rate.
     */
    code: string
    /**
     * The name of the default tax rate.
     */
    name: string
    /**
     * Whether the default tax rate is combinable with other tax rates.
     */
    is_combinable?: boolean
    /**
     * Custom key-value pairs that can be added to the default tax rate.
     */
    metadata?: Record<string, unknown> | null
  }
  /**
   * Custom key-value pairs that can be added to the tax region.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateTaxRegion {
  /**
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province or state code of the tax region.
   */
  province_code?: string | null
  /**
   * The ID of the tax provider.
   */
  provider_id?: string
  /**
   * Custom key-value pairs that can be added to the tax region.
   */
  metadata?: Record<string, unknown> | null
}
