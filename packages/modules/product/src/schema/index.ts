export default `
enum ProductStatus {
  draft
  proposed
  published
  rejected
}

type Product {
  id: ID!
  title: String!
  handle: String!
  subtitle: String
  description: String
  is_giftcard: Boolean!
  status: ProductStatus!
  thumbnail: String
  width: Float
  weight: Float
  length: Float
  height: Float
  origin_country: String
  hs_code: String
  mid_code: String
  material: String
  collection: ProductCollection
  collection_id: String
  categories: [ProductCategory]
  type: ProductType
  type_id: String
  tags: [ProductTag!]!
  variants: [ProductVariant!]!
  options: [ProductOption!]!
  images: [ProductImage!]!
  discountable: Boolean
  external_id: String
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  metadata: JSON
}

type ProductVariant {
  id: ID!
  title: String!
  sku: String
  barcode: String
  ean: String
  upc: String
  allow_backorder: Boolean!
  manage_inventory: Boolean!
  requires_shipping: Boolean!
  hs_code: String
  origin_country: String
  mid_code: String
  material: String
  weight: Float
  length: Float
  height: Float
  width: Float
  options: [ProductOptionValue!]!
  metadata: JSON
  product: Product
  product_id: String
  variant_rank: Int
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ProductCategory {
  id: ID!
  name: String!
  description: String!
  handle: String!
  is_active: Boolean!
  is_internal: Boolean!
  rank: Int!
  metadata: JSON
  parent_category: ProductCategory
  parent_category_id: String
  category_children: [ProductCategory!]!
  products: [Product!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ProductTag {
  id: ID!
  value: String!
  metadata: JSON
  products: [Product]
}

type ProductCollection {
  id: ID!
  title: String!
  handle: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  products: [Product]
}

type ProductType {
  id: ID!
  value: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ProductOption {
  id: ID!
  title: String!
  product: Product
  product_id: String
  values: [ProductOptionValue!]!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ProductImage {
  id: ID!
  url: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ProductOptionValue {
  id: ID!
  value: String!
  option: ProductOption
  option_id: String
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

`
