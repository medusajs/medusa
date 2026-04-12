/**
 * Test fixtures for entity discovery integration tests.
 * These joiner configs simulate real Product and Order modules
 * with simplified schemas for testing purposes.
 */

/**
 * Simplified Product schema based on the real Product module schema.
 * Includes common field types: ID, String, Boolean, DateTime, JSON, enums, and relationships.
 */
export const productSchema = `
enum ProductStatus {
  draft
  proposed
  published
  rejected
}

type SalesChannel {
  id: ID!
  name: String!
  description: String
  is_disabled: Boolean!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
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
  type: ProductType
  type_id: String
  tags: [ProductTag!]!
  sales_channels: [SalesChannel]
  variants: [ProductVariant!]!
  options: [ProductOption!]!
  images: [ProductImage!]!
  discountable: Boolean
  external_id: String
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  metadata: JSON
  raw_price: JSON
  raw_compare_at_price: JSON
  category_link: String
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
  images: [ProductImage!]!
  thumbnail: String
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
  rank: Int!
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

/**
 * Simplified Order schema based on the real Order module schema.
 * Includes common patterns: enums, status fields, totals, addresses, and relationships.
 */
export const orderSchema = `
enum OrderStatus {
  pending
  completed
  draft
  archived
  canceled
  requires_action
}

enum PaymentStatus {
  not_paid
  awaiting
  authorized
  partially_authorized
  captured
  partially_captured
  partially_refunded
  refunded
  canceled
  requires_action
}

enum FulfillmentStatus {
  not_fulfilled
  partially_fulfilled
  fulfilled
  partially_shipped
  shipped
  partially_delivered
  delivered
  canceled
}

type OrderSummary {
  pending_difference: Float
  current_order_total: Float
  original_order_total: Float
  transaction_total: Float
  paid_total: Float
  refunded_total: Float
}

type OrderAddress {
  id: ID!
  customer_id: String
  first_name: String
  last_name: String
  phone: String
  company: String
  address_1: String
  address_2: String
  city: String
  country_code: String
  province: String
  postal_code: String
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderLineItem {
  id: ID!
  title: String!
  subtitle: String
  thumbnail: String
  variant_id: String
  product_id: String
  product_title: String
  variant_sku: String
  variant_barcode: String
  variant_title: String
  requires_shipping: Boolean!
  is_discountable: Boolean!
  is_tax_inclusive: Boolean!
  unit_price: Float!
  quantity: Int!
  total: Float
  subtotal: Float
  tax_total: Float
  discount_total: Float
  created_at: DateTime!
  updated_at: DateTime!
  metadata: JSON
}

type OrderShippingMethod {
  id: ID!
  order_id: String!
  name: String!
  description: String
  amount: Float
  is_tax_inclusive: Boolean
  shipping_option_id: String
  data: JSON
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
  total: Float
  subtotal: Float
  tax_total: Float
}

type OrderTransaction {
  id: ID!
  order_id: String!
  amount: Float!
  currency_code: String!
  reference: String!
  reference_id: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
}

type Region {
  id: ID!
  name: String!
  currency_code: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type Order {
  id: ID!
  version: Int!
  status: OrderStatus!
  region_id: String
  region: Region
  customer_id: String
  display_id: String
  sales_channel_id: String
  email: String
  currency_code: String!
  shipping_address: OrderAddress
  billing_address: OrderAddress
  items: [OrderLineItem]
  shipping_methods: [OrderShippingMethod]
  transactions: [OrderTransaction]
  summary: OrderSummary
  metadata: JSON
  canceled_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
  total: Float!
  subtotal: Float!
  tax_total: Float!
  discount_total: Float!
  shipping_total: Float!
  payment_status: PaymentStatus!
  fulfillment_status: FulfillmentStatus!
  raw_total: JSON
  raw_subtotal: JSON
  order_change: String
  customer_link: String
}
`

/**
 * Minimal Customer schema for testing entity discovery with simple types.
 */
export const customerSchema = `
type CustomerGroup {
  id: ID!
  name: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
}

type Customer {
  id: ID!
  email: String!
  first_name: String
  last_name: String
  phone: String
  company_name: String
  has_account: Boolean!
  groups: [CustomerGroup]
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  address_link: String
  raw_metadata: JSON
}
`

// Entity model stubs
export const Product = { name: "Product" }
export const ProductVariant = { name: "ProductVariant" }
export const ProductOption = { name: "ProductOption" }
export const ProductOptionValue = { name: "ProductOptionValue" }
export const ProductType = { name: "ProductType" }
export const ProductTag = { name: "ProductTag" }
export const ProductCollection = { name: "ProductCollection" }
export const ProductCategory = { name: "ProductCategory" }
export const ProductImage = { name: "ProductImage" }
export const SalesChannel = { name: "SalesChannel" }

export const Order = { name: "Order" }
export const OrderAddress = { name: "OrderAddress" }
export const OrderLineItem = { name: "OrderLineItem" }
export const OrderShippingMethod = { name: "OrderShippingMethod" }
export const OrderTransaction = { name: "OrderTransaction" }
export const Region = { name: "Region" }

export const Customer = { name: "Customer" }
export const CustomerGroup = { name: "CustomerGroup" }

/**
 * Creates joiner configs for the test Product module.
 */
export function createProductJoinerConfig() {
  return {
    serviceName: "productModuleService",
    primaryKeys: ["id", "handle"],
    linkableKeys: {
      product_id: "Product",
      variant_id: "ProductVariant",
      product_option_id: "ProductOption",
      product_type_id: "ProductType",
      product_tag_id: "ProductTag",
      product_collection_id: "ProductCollection",
      product_category_id: "ProductCategory",
    },
    alias: [
      {
        name: ["product", "products"],
        entity: "Product",
        args: { methodSuffix: "Products" },
      },
      {
        name: ["product_variant", "product_variants", "variant", "variants"],
        entity: "ProductVariant",
        args: { methodSuffix: "ProductVariants" },
      },
    ],
    schema: productSchema,
  }
}

/**
 * Creates joiner configs for the test Order module.
 */
export function createOrderJoinerConfig() {
  return {
    serviceName: "orderModuleService",
    primaryKeys: ["id"],
    linkableKeys: {
      order_id: "Order",
      order_address_id: "OrderAddress",
      order_line_item_id: "OrderLineItem",
    },
    alias: [
      {
        name: ["order", "orders"],
        entity: "Order",
        args: { methodSuffix: "Orders" },
      },
    ],
    schema: orderSchema,
  }
}

/**
 * Creates joiner configs for the test Customer module.
 */
export function createCustomerJoinerConfig() {
  return {
    serviceName: "customerModuleService",
    primaryKeys: ["id"],
    linkableKeys: {
      customer_id: "Customer",
      customer_group_id: "CustomerGroup",
    },
    alias: [
      {
        name: ["customer", "customers"],
        entity: "Customer",
        args: { methodSuffix: "Customers" },
      },
    ],
    schema: customerSchema,
  }
}

/**
 * Get all test joiner configs.
 */
export function getTestJoinerConfigs() {
  return [
    createProductJoinerConfig(),
    createOrderJoinerConfig(),
    createCustomerJoinerConfig(),
  ]
}
