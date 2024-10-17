export default `
type StockLocationAddress {
  id: ID
  address_1: String!
  address_2: String
  company: String
  country_code: String!
  city: String
  phone: String
  postal_code: String
  province: String
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type StockLocation {
  id: ID!
  name: String!
  metadata: JSON
  address_id: ID!
  address: StockLocationAddress
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

`
