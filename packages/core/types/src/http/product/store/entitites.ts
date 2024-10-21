import { StoreCollection } from "../../collection"
import { StoreProductCategory } from "../../product-category"
import { StoreProductTag } from "../../product-tag"
import { StoreProductType } from "../../product-type"
import {
  BaseProduct,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductVariant,
  ProductStatus,
} from "../common"

export interface StoreProduct
  extends Omit<
    BaseProduct,
    "categories" | "sales_channels" | "variants" | "options" | "collection"
  > {
  /**
   * The product's collection.
   */
  collection?: StoreCollection | null
  /**
   * The product's categories.
   */
  categories?: StoreProductCategory[] | null
  /**
   * The product's variants.
   */
  variants: StoreProductVariant[] | null
  /**
   * The product's types.
   */
  type?: StoreProductType | null
  /**
   * The product's tags.
   */
  tags?: StoreProductTag[] | null
  /**
   * The product's options.
   */
  options: StoreProductOption[] | null
  /**
   * The product's images.
   */
  images: StoreProductImage[] | null
}
export interface StoreProductVariant
  extends Omit<BaseProductVariant, "product" | "options"> {
  /**
   * The variant's values for the product's options.
   */
  options: StoreProductOptionValue[] | null
  /**
   * The variant's product.
   */
  product?: StoreProduct | null
}
export interface StoreProductOption
  extends Omit<BaseProductOption, "product" | "values"> {
  /**
   * The product the option belongs to.
   */
  product?: StoreProduct | null
  /**
   * The option's values.
   */
  values?: StoreProductOptionValue[]
}
export interface StoreProductImage extends BaseProductImage {}
export interface StoreProductOptionValue
  extends Omit<BaseProductOptionValue, "option"> {
  /**
   * The product's option.
   */
  option?: StoreProductOption | null
}
export type StoreProductStatus = ProductStatus
