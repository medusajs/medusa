/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Image } from './Image';
import type { ProductOption } from './ProductOption';
import type { ProductTag } from './ProductTag';
import type { ProductType } from './ProductType';
import type { ProductVariant } from './ProductVariant';
import type { ShippingProfile } from './ShippingProfile';

/**
 * Products are a grouping of Product Variants that have common properties such as images and descriptions. Products can have multiple options which define the properties that Product Variants differ by.
 */
export type Product = {
  /**
   * The product's ID
   */
  id?: string;
  /**
   * A title that can be displayed for easy identification of the Product.
   */
  title: string;
  /**
   * An optional subtitle that can be used to further specify the Product.
   */
  subtitle?: string;
  /**
   * A short description of the Product.
   */
  description?: string;
  /**
   * A unique identifier for the Product (e.g. for slug structure).
   */
  handle?: string;
  /**
   * Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased.
   */
  is_giftcard?: boolean;
  /**
   * The status of the product
   */
  status?: 'draft' | 'proposed' | 'published' | 'rejected';
  /**
   * Images of the Product. Available if the relation `images` is expanded.
   */
  images?: Array<Image>;
  /**
   * A URL to an image file that can be used to identify the Product.
   */
  thumbnail?: string;
  /**
   * The Product Options that are defined for the Product. Product Variants of the Product will have a unique combination of Product Option Values. Available if the relation `options` is expanded.
   */
  options?: Array<ProductOption>;
  /**
   * The Product Variants that belong to the Product. Each will have a unique combination of Product Option Values. Available if the relation `variants` is expanded.
   */
  variants?: Array<ProductVariant>;
  /**
   * The ID of the Shipping Profile that the Product belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products.
   */
  profile_id: string;
  /**
   * Available if the relation `profile` is expanded.
   */
  profile?: ShippingProfile;
  /**
   * The weight of the Product Variant. May be used in shipping rate calculations.
   */
  weight?: number;
  /**
   * The height of the Product Variant. May be used in shipping rate calculations.
   */
  height?: number;
  /**
   * The width of the Product Variant. May be used in shipping rate calculations.
   */
  width?: number;
  /**
   * The length of the Product Variant. May be used in shipping rate calculations.
   */
  length?: number;
  /**
   * The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  hs_code?: string;
  /**
   * The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  origin_country?: string;
  /**
   * The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  mid_code?: string;
  /**
   * The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
   */
  material?: string;
  /**
   * The Product Collection that the Product belongs to
   */
  collection_id?: string;
  /**
   * A product collection object. Available if the relation `collection` is expanded.
   */
  collection?: Record<string, any>;
  /**
   * The Product type that the Product belongs to
   */
  type_id?: string;
  /**
   * Available if the relation `type` is expanded.
   */
  type?: ProductType;
  /**
   * The Product Tags assigned to the Product. Available if the relation `tags` is expanded.
   */
  tags?: Array<ProductTag>;
  /**
   * Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`.
   */
  discountable?: boolean;
  /**
   * The external ID of the product
   */
  external_id?: string;
  /**
   * The sales channels the product is associated with. Available if the relation `sales_channels` is expanded.
   */
  sales_channels?: Array<Record<string, any>>;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

