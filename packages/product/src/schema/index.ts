export default `
scalar Date
scalar JSON

enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type Product {
  id: ID!
  title: String!
  handle: String
  subtitle: String
  description: String
  isGiftcard: Boolean!
  status: ProductStatus!
  thumbnail: String
  options: [ProductOption]
  variants: [ProductVariant]
  weight: Float
  length: Float
  height: Float
  width: Float
  originCountry: String
  hsCode: String
  midCode: String
  material: String
  collectionId: String
  collection: ProductCollection
  typeId: String
  type: ProductType!
  tags: [ProductTag]
  images: [ProductImage]
  categories: [ProductCategory]
  discountable: Boolean!
  externalId: String
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
  metadata: JSON
}

type ProductVariant {
  id: ID!
  title: String!
  sku: String
  barcode: String
  ean: String
  upc: String
  inventoryQuantity: Float!
  allowBackorder: Boolean!
  manageInventory: Boolean!
  hsCode: String
  originCountry: String
  midCode: String
  material: String
  weight: Float
  length: Float
  height: Float
  width: Float
  metadata: JSON
  variantRank: Float
  productId: String!
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
  product: Product!
  options: [ProductOptionValue]
}

type ProductType {
  id: ID!
  value: String!
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
}

type ProductTag {
  id: ID!
  value: String!
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
  products: [Product]
}

type ProductOption {
  id: ID!
  title: String!
  productId: String!
  product: Product!
  values: [ProductOptionValue]
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
}

type ProductOptionValue {
  id: ID!
  value: String!
  optionId: String!
  option: ProductOption!
  variantId: String!
  variant: ProductVariant!
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
}

type ProductImage {
  id: ID!
  url: String!
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
  products: [Product]
}

type ProductCollection {
  id: ID!
  title: String!
  handle: String!
  products: [Product]
  metadata: JSON
  createdAt: Date!
  updatedAt: Date!
  deletedAt: Date
}

type ProductCategory {
  id: ID!
  name: String!
  description: String!
  handle: String!
  mpath: String!
  isActive: Boolean!
  isInternal: Boolean!
  rank: Float!
  parentCategoryId: String
  parentCategory: ProductCategory
  categoryChildren: [ProductCategory]
  createdAt: Date!
  updatedAt: Date!
  products: [Product]
}
`
