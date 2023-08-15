export type ProductVariantPricingDTO = {
  // TODO: Replace with MoneyAmountDTO
  prices: any[]
  original_price: number | null
  calculated_price: number | null
  original_price_includes_tax?: boolean | null
  calculated_price_includes_tax?: boolean | null
  calculated_price_type?: string | null
} & TaxedPricing

export type TaxedPricing = {
  original_price_incl_tax: number | null
  calculated_price_incl_tax: number | null
  original_tax: number | null
  calculated_tax: number | null
  // TODO: Replace with TaxServiceRateDTO
  tax_rates: any[] | null
}
