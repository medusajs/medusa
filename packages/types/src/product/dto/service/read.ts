import { BaseFilterable } from "../../../dal"
import { OperatorMap } from "../../../dal/utils"

export interface FilterableProductProps
  extends BaseFilterable<FilterableProductProps> {
  q?: string
  handle?: string | string[]
  id?: string | string[]
  tags?: { value?: string[] }
  categories?: {
    id?: string | string[] | OperatorMap<string>
    is_internal?: boolean
    is_active?: boolean
  }
  category_id?: string | string[] | OperatorMap<string>
  collection_id?: string | string[] | OperatorMap<string>
}

export interface FilterableProductTagProps
  extends BaseFilterable<FilterableProductTagProps> {
  id?: string | string[]
  value?: string
}

export interface FilterableProductTypeProps
  extends BaseFilterable<FilterableProductTypeProps> {
  id?: string | string[]
  value?: string
}

export interface FilterableProductOptionProps
  extends BaseFilterable<FilterableProductOptionProps> {
  id?: string | string[]
  title?: string
  product_id?: string | string[]
}

export interface FilterableProductCollectionProps
  extends BaseFilterable<FilterableProductCollectionProps> {
  id?: string | string[]
  title?: string
}

export interface FilterableProductVariantProps
  extends BaseFilterable<FilterableProductVariantProps> {
  id?: string | string[]
  sku?: string | string[]
  product_id?: string | string[]
  options?: { id?: string[] }
}

export interface FilterableProductCategoryProps
  extends BaseFilterable<FilterableProductCategoryProps> {
  id?: string | string[]
  name?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  include_descendants_tree?: boolean
}
