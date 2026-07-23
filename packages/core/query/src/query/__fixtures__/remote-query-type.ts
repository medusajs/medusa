export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: Date | string; output: Date | string }
  JSON: { input: Record<string, unknown>; output: Record<string, unknown> }
}

export type SimpleProduct = {
  id: Scalars["ID"]["output"]
  handle: string
  title: Scalars["String"]["output"]
  variants: Maybe<Array<Maybe<Pick<ProductVariant, "id">>>>
  sales_channels_link: Array<
    Pick<LinkProductSalesChannel, "product_id" | "sales_channel_id">
  >
  sales_channels: Array<Pick<SalesChannel, "id" | "name">>
}

export type Product = {
  __typename: "Product"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title: Scalars["String"]["output"]
  description: Scalars["String"]["output"]
  variants: Array<ProductVariant>
  sales_channels_link: Array<LinkProductSalesChannel>
  sales_channels: Array<SalesChannel>
  metadata: Maybe<Scalars["JSON"]["output"]>
  translation: Maybe<ProductTranslation>
  categories: Array<ProductCategory>
}

export type ProductTranslation = {
  __typename: "ProductTranslation"
  id: Scalars["ID"]["output"]
  title: Scalars["String"]["output"]
  description: Scalars["String"]["output"]
  product: Maybe<Product>
}

export type ProductVariant = {
  __typename: "ProductVariant"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title: Scalars["String"]["output"]
  sku: Scalars["String"]["output"]
  product: Maybe<Product>
  calculated_price: Maybe<Scalars["JSON"]["output"]>
  translation: Maybe<ProductVariantTranslation>
}

export type ProductVariantTranslation = {
  __typename: "ProductVariantTranslation"
  id: Scalars["ID"]["output"]
  title: Scalars["String"]["output"]
  description: Scalars["String"]["output"]
  variant: Maybe<ProductVariant>
}

export type ProductCategory = {
  __typename: "ProductCategory"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title: Maybe<Scalars["String"]["output"]>
  translation: Maybe<ProductCategoryTranslation>
}

export type ProductCategoryTranslation = {
  __typename: "ProductCategoryTranslation"
  id: Scalars["ID"]["output"]
  title: Scalars["String"]["output"]
  description: Scalars["String"]["output"]
  category: Maybe<ProductCategory>
}

export type SalesChannel = {
  __typename: "SalesChannel"
  id: Scalars["ID"]["output"]
  name: Maybe<Scalars["String"]["output"]>
  description: Maybe<Scalars["String"]["output"]>
  created_at: Maybe<Scalars["DateTime"]["output"]>
  updated_at: Maybe<Scalars["DateTime"]["output"]>
  products_link: Maybe<Array<Maybe<LinkProductSalesChannel>>>
  api_keys_link: Maybe<Array<Maybe<LinkPublishableApiKeySalesChannel>>>
  locations_link: Maybe<Array<Maybe<LinkSalesChannelStockLocation>>>
}

export type LinkCartPaymentCollection = {
  __typename: "LinkCartPaymentCollection"
  cart_id: Scalars["String"]["output"]
  payment_collection_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkCartPromotion = {
  __typename: "LinkCartPromotion"
  cart_id: Scalars["String"]["output"]
  promotion_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkLocationFulfillmentProvider = {
  __typename: "LinkLocationFulfillmentProvider"
  stock_location_id: Scalars["String"]["output"]
  fulfillment_provider_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkLocationFulfillmentSet = {
  __typename: "LinkLocationFulfillmentSet"
  stock_location_id: Scalars["String"]["output"]
  fulfillment_set_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderCart = {
  __typename: "LinkOrderCart"
  order_id: Scalars["String"]["output"]
  cart_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderFulfillment = {
  __typename: "LinkOrderFulfillment"
  order_id: Scalars["String"]["output"]
  fulfillment_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderPaymentCollection = {
  __typename: "LinkOrderPaymentCollection"
  order_id: Scalars["String"]["output"]
  payment_collection_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderPromotion = {
  __typename: "LinkOrderPromotion"
  order_id: Scalars["String"]["output"]
  promotion_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkReturnFulfillment = {
  __typename: "LinkReturnFulfillment"
  return_id: Scalars["String"]["output"]
  fulfillment_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkProductSalesChannel = {
  __typename: "LinkProductSalesChannel"
  product_id: Scalars["String"]["output"]
  sales_channel_id: Scalars["String"]["output"]
  product: Maybe<Product>
  sales_channel: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkProductVariantInventoryItem = {
  __typename: "LinkProductVariantInventoryItem"
  variant_id: Scalars["String"]["output"]
  inventory_item_id: Scalars["String"]["output"]
  required_quantity: Scalars["Int"]["output"]
  variant: Maybe<Product>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkProductVariantPriceSet = {
  __typename: "LinkProductVariantPriceSet"
  variant_id: Scalars["String"]["output"]
  price_set_id: Scalars["String"]["output"]
  variant: Maybe<Product>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkPublishableApiKeySalesChannel = {
  __typename: "LinkPublishableApiKeySalesChannel"
  publishable_key_id: Scalars["String"]["output"]
  sales_channel_id: Scalars["String"]["output"]
  sales_channel: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkRegionPaymentProvider = {
  __typename: "LinkRegionPaymentProvider"
  region_id: Scalars["String"]["output"]
  payment_provider_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkSalesChannelStockLocation = {
  __typename: "LinkSalesChannelStockLocation"
  sales_channel_id: Scalars["String"]["output"]
  stock_location_id: Scalars["String"]["output"]
  sales_channel: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export type LinkShippingOptionPriceSet = {
  __typename: "LinkShippingOptionPriceSet"
  shipping_option_id: Scalars["String"]["output"]
  price_set_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt: Maybe<Scalars["String"]["output"]>
}

export interface FixtureEntryPoints {
  file: any
  files: any
  workflow_execution: any
  workflow_executions: any
  inventory_items: any
  inventory_item: any
  inventory: any
  reservation: any
  reservations: any
  reservation_item: any
  reservation_items: any
  inventory_level: any
  inventory_levels: any
  stock_location_address: any
  stock_location_addresses: any
  stock_location: any
  stock_locations: any
  price_set: any
  price_sets: any
  price_list: any
  price_lists: any
  price: any
  prices: any
  price_preference: any
  price_preferences: any
  product_variant: ProductVariant
  product_variants: ProductVariant
  variant: ProductVariant
  variants: ProductVariant
  product: Product
  products: Product
  simple_product: SimpleProduct
  product_option: any
  product_options: any
  product_type: any
  product_types: any
  product_image: any
  product_images: any
  product_tag: any
  product_tags: any
  product_collection: any
  product_collections: any
  product_category: ProductCategory
  product_categories: ProductCategory
  sales_channel: SalesChannel
  sales_channels: SalesChannel
  customer_address: any
  customer_addresses: any
  customer_group_customer: any
  customer_group_customers: any
  customer_group: any
  customer_groups: any
  customer: any
  customers: any
  cart: any
  carts: any
  address: any
  addresses: any
  line_item: any
  line_items: any
  line_item_adjustment: any
  line_item_adjustments: any
  line_item_tax_line: any
  line_item_tax_lines: any
  shipping_method: any
  shipping_methods: any
  shipping_method_adjustment: any
  shipping_method_adjustments: any
  shipping_method_tax_line: any
  shipping_method_tax_lines: any
  promotion: any
  promotions: any
  campaign: any
  campaigns: any
  promotion_rule: any
  promotion_rules: any
  api_key: any
  api_keys: any
  tax_rate: any
  tax_rates: any
  tax_region: any
  tax_regions: any
  tax_rate_rule: any
  tax_rate_rules: any
  tax_provider: any
  tax_providers: any
  store: any
  stores: any
  store_currency: any
  store_currencies: any
  user: any
  users: any
  invite: any
  invites: any
  auth_identity: any
  auth_identities: any
  order: any
  orders: any
  order_address: any
  order_addresses: any
  order_line_item: any
  order_line_items: any
  order_line_item_adjustment: any
  order_line_item_adjustments: any
  order_line_item_tax_line: any
  order_line_item_tax_lines: any
  order_shipping_method: any
  order_shipping_methods: any
  order_shipping_method_adjustment: any
  order_shipping_method_adjustments: any
  order_shipping_method_tax_line: any
  order_shipping_method_tax_lines: any
  order_transaction: any
  order_transactions: any
  order_change: any
  order_changes: any
  order_change_action: any
  order_change_actions: any
  order_item: any
  order_items: any
  order_summary: any
  order_summaries: any
  order_shipping: any
  order_shippings: any
  return_reason: any
  return_reasons: any
  return: any
  returns: any
  return_item: any
  return_items: any
  order_claim: any
  order_claims: any
  order_claim_item: any
  order_claim_items: any
  order_claim_item_image: any
  order_claim_item_images: any
  order_exchange: any
  order_exchanges: any
  order_exchange_item: any
  order_exchange_items: any
  payment: any
  payments: any
  payment_collection: any
  payment_collections: any
  payment_provider: any
  payment_providers: any
  payment_session: any
  payment_sessions: any
  refund_reason: any
  refund_reasons: any
  fulfillment_address: any
  fulfillment_addresses: any
  fulfillment_item: any
  fulfillment_items: any
  fulfillment_label: any
  fulfillment_labels: any
  fulfillment_provider: any
  fulfillment_providers: any
  fulfillment_set: any
  fulfillment_sets: any
  fulfillment: any
  fulfillments: any
  geo_zone: any
  geo_zones: any
  service_zone: any
  service_zones: any
  shipping_option_rule: any
  shipping_option_rules: any
  shipping_option_type: any
  shipping_option_types: any
  shipping_option: any
  shipping_options: any
  shipping_profile: any
  shipping_profiles: any
  notification: any
  notifications: any
  region: any
  regions: any
  country: any
  countries: any
  currency: any
  currencies: any
  cart_payment_collection: LinkCartPaymentCollection
  cart_payment_collections: LinkCartPaymentCollection
  cart_promotion: LinkCartPromotion
  cart_promotions: LinkCartPromotion
  location_fulfillment_provider: LinkLocationFulfillmentProvider
  location_fulfillment_providers: LinkLocationFulfillmentProvider
  location_fulfillment_set: LinkLocationFulfillmentSet
  location_fulfillment_sets: LinkLocationFulfillmentSet
  order_cart: LinkOrderCart
  order_carts: LinkOrderCart
  order_fulfillment: LinkOrderFulfillment
  order_fulfillments: LinkOrderFulfillment
  order_payment_collection: LinkOrderPaymentCollection
  order_payment_collections: LinkOrderPaymentCollection
  order_promotion: LinkOrderPromotion
  order_promotions: LinkOrderPromotion
  return_fulfillment: LinkReturnFulfillment
  return_fulfillments: LinkReturnFulfillment
  product_sales_channel: LinkProductSalesChannel
  product_sales_channels: LinkProductSalesChannel
  product_variant_inventory_item: LinkProductVariantInventoryItem
  product_variant_inventory_items: LinkProductVariantInventoryItem
  product_variant_price_set: LinkProductVariantPriceSet
  product_variant_price_sets: LinkProductVariantPriceSet
  publishable_api_key_sales_channel: LinkPublishableApiKeySalesChannel
  publishable_api_key_sales_channels: LinkPublishableApiKeySalesChannel
  region_payment_provider: LinkRegionPaymentProvider
  region_payment_providers: LinkRegionPaymentProvider
  sales_channel_location: LinkSalesChannelStockLocation
  sales_channel_locations: LinkSalesChannelStockLocation
  shipping_option_price_set: LinkShippingOptionPriceSet
  shipping_option_price_sets: LinkShippingOptionPriceSet
}

declare module "@medusajs/types" {
  export interface RemoteQueryEntryPoints extends FixtureEntryPoints {}
}
