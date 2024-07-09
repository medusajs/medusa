export interface WithCalculatedPrice {
  calculated_price: {
    calculated_amount: number
    is_calculated_price_tax_inclusive?: boolean
  }
}
