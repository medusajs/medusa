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

export interface AdminProduct extends Omit<BaseProduct, "categories"> {
  categories?: AdminProductCategory[]
}

export interface AdminProductCategory extends BaseProductCategory {
  is_active?: boolean
  is_internal?: boolean
}
export interface AdminProductVariant extends BaseProductVariant {}
export interface AdminProductTag extends BaseProductTag {}
export interface AdminProductType extends BaseProductType {}
export interface AdminProductOption extends BaseProductOption {}
export interface AdminProductImage extends BaseProductImage {}
export interface AdminProductOptionValue extends BaseProductOptionValue {}

export interface AdminProductFilters extends BaseProductFilters {}
export interface AdminProductTagFilters extends BaseProductTagFilters {}
export interface AdminProductTypeFilters extends BaseProductTypeFilters {}
export interface AdminProductOptionFilters extends BaseProductOptionFilters {}
export interface AdminProductVariantFilters extends BaseProductVariantFilters {}
export interface AdminProductCategoryFilters
  extends BaseProductCategoryFilters {}
