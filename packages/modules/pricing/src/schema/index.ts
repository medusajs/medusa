export const schema = `
type PriceSet {
  id: ID!
  prices: [Price]
  calculated_price: CalculatedPriceSet
}

type Price {
  id: ID!
  currency_code: String
  amount: Float
  min_quantity: Float
  max_quantity: Float
  rules_count: Int
  price_rules: [PriceRule]
  created_at: DateTime
  updated_at: DateTime
  deleted_at: DateTime
}

type PriceRule {
  id: ID!
  price_set_id: String!
  price_set: PriceSet
  attribute: String!
  value: String!
  priority: Int!
  price_id: String!
  price_list_id: String!
  created_at: DateTime
  updated_at: DateTime
  deleted_at: DateTime
}

type CalculatedPriceSet {
  id: ID!
  is_calculated_price_price_list: Boolean
  is_calculated_price_tax_inclusive: Boolean
  calculated_amount: Float
  raw_calculated_amount: JSON
  is_original_price_price_list: Boolean
  is_original_price_tax_inclusive: Boolean
  original_amount: Float
  raw_original_amount: JSON
  currency_code: String
  calculated_price: PriceDetails
  original_price: PriceDetails
}

type PriceDetails {
  id: ID
  price_list_id: String
  price_list_type: String
  min_quantity: Float
  max_quantity: Float
}
`

export default schema
