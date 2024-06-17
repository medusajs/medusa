import { StoreProductCategory } from "../../product-category"
import {
  BaseProduct,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductType,
  BaseProductVariant,
  ProductStatus,
} from "../common"

export interface StoreProduct extends Omit<BaseProduct, "categories"> {
  categories?: StoreProductCategory[] | null
}
export interface StoreProductVariant extends BaseProductVariant {}
export interface StoreProductTag extends BaseProductTag {}
export interface StoreProductType extends BaseProductType {}
export interface StoreProductOption extends BaseProductOption {}
export interface StoreProductImage extends BaseProductImage {}
export interface StoreProductOptionValue extends BaseProductOptionValue {}
export type StoreProductStatus = ProductStatus
