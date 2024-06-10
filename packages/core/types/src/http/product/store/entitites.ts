import {
  BaseProduct,
  BaseProductCategory,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductType,
  BaseProductVariant,
} from "../common"

export interface StoreProduct extends BaseProduct {}
export interface StoreProductCategory extends BaseProductCategory {}
export interface StoreProductVariant extends BaseProductVariant {}
export interface StoreProductTag extends BaseProductTag {}
export interface StoreProductType extends BaseProductType {}
export interface StoreProductOption extends BaseProductOption {}
export interface StoreProductImage extends BaseProductImage {}
export interface StoreProductOptionValue extends BaseProductOptionValue {}
