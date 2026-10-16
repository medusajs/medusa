export type MedusaPricingContext = {
  region_id?: string
  currency_code?: string
  customer_id?: string
  /**
   * IDs of the customer groups the customer belongs to, matching the
   * `customer_group_id` attribute used by price list rules.
   */
  customer_group_id?: string[]
  customer?: {
    groups?: {
      id: string
    }[]
  }
}
