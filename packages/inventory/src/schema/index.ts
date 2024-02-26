export default `
scalar DateTime
scalar JSON

type InventoryItem {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  sku: String
  origin_country: String
  hs_code: String
  mid_code: String
  material: String
  weight: Int
  length: Int
  height: Int
  width: Int
  requires_shipping: Boolean!
  description: String
  title: String
  thumbnail: String
  metadata: JSON
  
  inventory_levels: [InventoryLevel]
}

type InventoryLevel {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  inventory_item_id: String!
  location_id: String!
  stocked_quantity: Int!
  reserved_quantity: Int!
  incoming_quantity: Int!
  metadata: JSON
}

type ReservationItem {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  line_item_id: String
  inventory_item_id: String!
  location_id: String!
  quantity: Int!
  external_id: String
  description: String
  created_by: String
  metadata: JSON
}
`
