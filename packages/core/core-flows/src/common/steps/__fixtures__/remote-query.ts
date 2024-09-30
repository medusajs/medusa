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
  __typename?: "SimpleProduct"
  id: Scalars["ID"]["output"]
  handle: string
  title?: Scalars["String"]["output"]
  variants?: Maybe<Array<Maybe<Pick<ProductVariant, "id" | "__typename">>>>
  sales_channels_link?: Array<
    Pick<
      LinkProductSalesChannel,
      "product_id" | "sales_channel_id" | "__typename"
    >
  >
  sales_channels?: Array<Pick<SalesChannel, "id" | "name" | "__typename">>
}

export type Product = {
  __typename?: "Product"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title: Scalars["String"]["output"]
  description?: Scalars["String"]["output"]
  variants?: Array<ProductVariant>
  sales_channels_link?: Array<LinkProductSalesChannel>
  sales_channels?: Array<SalesChannel>
}

export type ProductVariant = {
  __typename?: "ProductVariant"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title: Scalars["String"]["output"]
  product?: Maybe<Product>
}

export type ProductCategory = {
  __typename?: "ProductCategory"
  id: Scalars["ID"]["output"]
  handle: Scalars["String"]["output"]
  title?: Maybe<Scalars["String"]["output"]>
}

export type SalesChannel = {
  __typename?: "SalesChannel"
  id: Scalars["ID"]["output"]
  name?: Maybe<Scalars["String"]["output"]>
  description?: Maybe<Scalars["String"]["output"]>
  created_at?: Maybe<Scalars["DateTime"]["output"]>
  updated_at?: Maybe<Scalars["DateTime"]["output"]>
  products_link?: Maybe<Array<Maybe<LinkProductSalesChannel>>>
  api_keys_link?: Maybe<Array<Maybe<LinkPublishableApiKeySalesChannel>>>
  locations_link?: Maybe<Array<Maybe<LinkSalesChannelStockLocation>>>
}

export type LinkCartPaymentCollection = {
  __typename?: "LinkCartPaymentCollection"
  cart_id: Scalars["String"]["output"]
  payment_collection_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkCartPromotion = {
  __typename?: "LinkCartPromotion"
  cart_id: Scalars["String"]["output"]
  promotion_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkLocationFulfillmentProvider = {
  __typename?: "LinkLocationFulfillmentProvider"
  stock_location_id: Scalars["String"]["output"]
  fulfillment_provider_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkLocationFulfillmentSet = {
  __typename?: "LinkLocationFulfillmentSet"
  stock_location_id: Scalars["String"]["output"]
  fulfillment_set_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderCart = {
  __typename?: "LinkOrderCart"
  order_id: Scalars["String"]["output"]
  cart_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderFulfillment = {
  __typename?: "LinkOrderFulfillment"
  order_id: Scalars["String"]["output"]
  fulfillment_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderPaymentCollection = {
  __typename?: "LinkOrderPaymentCollection"
  order_id: Scalars["String"]["output"]
  payment_collection_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkOrderPromotion = {
  __typename?: "LinkOrderPromotion"
  order_id: Scalars["String"]["output"]
  promotion_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkReturnFulfillment = {
  __typename?: "LinkReturnFulfillment"
  return_id: Scalars["String"]["output"]
  fulfillment_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkProductSalesChannel = {
  __typename?: "LinkProductSalesChannel"
  product_id: Scalars["String"]["output"]
  sales_channel_id: Scalars["String"]["output"]
  product?: Maybe<Product>
  sales_channel?: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkProductVariantInventoryItem = {
  __typename?: "LinkProductVariantInventoryItem"
  variant_id: Scalars["String"]["output"]
  inventory_item_id: Scalars["String"]["output"]
  required_quantity: Scalars["Int"]["output"]
  variant?: Maybe<Product>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkProductVariantPriceSet = {
  __typename?: "LinkProductVariantPriceSet"
  variant_id: Scalars["String"]["output"]
  price_set_id: Scalars["String"]["output"]
  variant?: Maybe<Product>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkPublishableApiKeySalesChannel = {
  __typename?: "LinkPublishableApiKeySalesChannel"
  publishable_key_id: Scalars["String"]["output"]
  sales_channel_id: Scalars["String"]["output"]
  sales_channel?: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkRegionPaymentProvider = {
  __typename?: "LinkRegionPaymentProvider"
  region_id: Scalars["String"]["output"]
  payment_provider_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkSalesChannelStockLocation = {
  __typename?: "LinkSalesChannelStockLocation"
  sales_channel_id: Scalars["String"]["output"]
  stock_location_id: Scalars["String"]["output"]
  sales_channel?: Maybe<SalesChannel>
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export type LinkShippingOptionPriceSet = {
  __typename?: "LinkShippingOptionPriceSet"
  shipping_option_id: Scalars["String"]["output"]
  price_set_id: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
  deletedAt?: Maybe<Scalars["String"]["output"]>
}

export interface FixtureEntryPoints {
  product_variant: ProductVariant
  product_variants: ProductVariant
  variant: ProductVariant
  variants: ProductVariant
  product: Product
  products: Product
  simple_product: SimpleProduct
  product_category: ProductCategory
  product_categories: ProductCategory
  sales_channel: SalesChannel
  sales_channels: SalesChannel
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

declare module "@medusajs/framework/types" {
  export interface RemoteQueryEntryPoints extends FixtureEntryPoints {}
}
