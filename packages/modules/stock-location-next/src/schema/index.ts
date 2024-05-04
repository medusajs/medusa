export default `
scalar DateTime
scalar JSON
type StockLocation {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  name: String!
  address_id: String
  address: StockLocationAddress
  metadata: JSON
}
type StockLocationAddress {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  address_1: String!
  address_2: String
  company: String
  city: String
  country_code: String!
  phone: String
  province: String
  postal_code: String
  metadata: JSON
}
`
