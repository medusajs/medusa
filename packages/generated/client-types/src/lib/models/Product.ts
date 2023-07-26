/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Image } from "./Image"
import type { ProductCategory } from "./ProductCategory"
import type { ProductCollection } from "./ProductCollection"
import type { ProductOption } from "./ProductOption"
import type { ProductTag } from "./ProductTag"
import type { ProductType } from "./ProductType"
import type { ProductVariant } from "./ProductVariant"
import type { SalesChannel } from "./SalesChannel"
import type { ShippingProfile } from "./ShippingProfile"

/**
 * A product is a saleable item that holds general information such as name or description. It must include at least one Product Variant, where each product variant defines different options to purchase the product with (for example, different sizes or colors). The prices and inventory of the product are defined on the variant level.
 */
export interface Product {
  /**
   * The product's ID
   */
  id: string
  /**
   * A title that can be displayed for easy identification of the Product.
   */
  title: string
  /**
   * An optional subtitle that can be used to further specify the Product.
   */
  subtitle: string | null
  /**
   * A short description of the Product.
   */
  description: string | null
  /**
   * A unique identifier for the Product (e.g. for slug structure).
   */
  handle: string | null
  /**
   * Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased.
   */
  is_giftcard: boolean
  /**
   * The status of the product
   */
  status: "draft" | "proposed" | "published" | "rejected"
  /**
   * The details of the product's images.
   */
  images?: Array<Image>
  /**
   * A URL to an image file that can be used to identify the Product.
   */
  thumbnail: string | null
  /**
   * The details of the Product Options that are defined for the Product. The product's variants will have a unique combination of values of the product's options.
   */
  options?: Array<ProductOption>
  /**
   * The details of the Product Variants that belong to the Product. Each will have a unique combination of values of the product's options.
   */
  variants?: Array<ProductVariant>
  /**
   * The details of the product categories that this product belongs to.
   */
  categories?: Array<ProductCategory>
  /**
   * The ID of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.
   */
  profile_id: string
  /**
   * The details of the shipping profile that the product belongs to. The shipping profile has a set of defined shipping options that can be used to fulfill the product.
   */
  profile?: ShippingProfile | null
  /**
   * Available if the relation `profiles` is expanded.
   */
  profiles?: Array<ShippingProfile> | null
  /**
   * The weight of the Product Variant. May be used in shipping rate calculations.
   */
  weight: number | null
  /**
   * The length of the Product Variant. May be used in shipping rate calculations.
   */
  length: number | null
  /**
   * The height of the Product Variant. May be used in shipping rate calculations.
   */
  height: number | null
  /**
   * The width of the Product Variant. May be used in shipping rate calculations.
   */
  width: number | null
  /**
   * The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  hs_code: string | null
  /**
   * The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  origin_country: string | null
  /**
   * The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  mid_code: string | null
  /**
   * The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  material: string | null
  /**
   * The ID of the product collection that the product belongs to.
   */
  collection_id: string | null
  /**
   * The details of the product collection that the product belongs to.
   */
  collection?: ProductCollection | null
  /**
   * The ID of the product type that the product belongs to.
   */
  type_id: string | null
  /**
   * The details of the product type that the product belongs to.
   */
  type?: ProductType | null
  /**
   * The details of the product tags used in this product.
   */
  tags?: Array<ProductTag>
  /**
   * Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`.
   */
  discountable: boolean
  /**
   * The external ID of the product
   */
  external_id: string | null
  /**
   * The details of the sales channels this product is available in.
   */
  sales_channels?: Array<SalesChannel>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
