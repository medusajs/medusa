import {
  BaseProduct,
  BaseProductCategory,
  BaseProductCategoryFilters,
  BaseProductFilters,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionFilters,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductTagFilters,
  BaseProductType,
  BaseProductTypeFilters,
  BaseProductVariant,
  BaseProductVariantFilters,
} from "./common"

export interface StoreProduct extends BaseProduct {}
export interface StoreProductCategory extends BaseProductCategory {}
export interface StoreProductVariant extends BaseProductVariant {}
export interface StoreProductTag extends BaseProductTag {}
export interface StoreProductType extends BaseProductType {}
export interface StoreProductOption extends BaseProductOption {}
export interface StoreProductImage extends BaseProductImage {}
export interface StoreProductOptionValue extends BaseProductOptionValue {}

export interface StoreProductTagFilters extends BaseProductTagFilters {}
export interface StoreProductTypeFilters extends BaseProductTypeFilters {}
export interface StoreProductOptionFilters extends BaseProductOptionFilters {}
export interface StoreProductVariantFilters extends BaseProductVariantFilters {}
export interface StoreProductFilters extends BaseProductFilters {
  // The region ID and currency_code are not filters, but are used for the pricing context. Maybe move to separate type definition.
  region_id?: string
  currency_code?: string
  variants?: StoreProductVariantFilters
}
export interface StoreProductCategoryFilters
  extends BaseProductCategoryFilters {}
