export const schema = `
type PriceSet {
  id: String!
  money_amounts: [MoneyAmount]
}

type MoneyAmount {
  id: String!
  currency_code: String
  currency: Currency
  amount: Float
  min_quantity: Float
  max_quantity: Float
}
`

export default schema
