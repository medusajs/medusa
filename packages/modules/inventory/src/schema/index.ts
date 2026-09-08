export default `
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
  unit_of_measure: String
  weight: Int
  length: Int
  height: Int
  width: Int
  requires_shipping: Boolean!
  description: String
  title: String
  thumbnail: String
  metadata: JSON
  location_levels: [InventoryLevel]
  reservation_items: [ReservationItem]
  reserved_quantity: Float!
  stocked_quantity: Float!
}

type InventoryLevel {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  inventory_item_id: String!
  inventory_item: InventoryItem!
  location_id: String!
  stocked_quantity: Float!
  reserved_quantity: Float!
  incoming_quantity: Float!
  metadata: JSON
  available_quantity: Float!
}

type ReservationItem {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  line_item_id: String
  allow_backorder: Boolean!
  inventory_item_id: String!
  inventory_item: InventoryItem!
  location_id: String!
  quantity: Float!
  external_id: String
  description: String
  created_by: String
  metadata: JSON
}
`
