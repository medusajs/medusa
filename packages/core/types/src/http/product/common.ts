import { BaseFilterable, OperatorMap } from "../../dal"
import { BaseCollection } from "../collection/common"
import { FindParams } from "../common"

export type ProductStatus = "draft" | "proposed" | "published" | "rejected"
export interface BaseProduct {
  id: string
  title: string
  handle: string
  subtitle: string | null
  description: string | null
  is_giftcard: boolean
  status: ProductStatus | null
  thumbnail: string | null
  width: number | null
  weight: number | null
  length: number | null
  height: number | null
  origin_country: string | null
  hs_code: string | null
  mid_code: string | null
  material: string | null
  collection: BaseCollection | null
  collection_id: string | null
  categories?: BaseProductCategory[] | null
  type: BaseProductType | null
  type_id: string | null
  tags: BaseProductTag[] | null
  variants: BaseProductVariant[] | null
  options: BaseProductOption[] | null
  images: BaseProductImage[] | null
  discountable: boolean
  external_id: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductVariant {
  id: string
  title: string | null
  sku: string | null
  barcode: string | null
  ean: string | null
  upc: string | null
  allow_backorder: boolean | null
  manage_inventory: boolean | null
  hs_code: string | null
  origin_country: string | null
  mid_code: string | null
  material: string | null
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  options: BaseProductOptionValue[] | null
  product?: BaseProduct
  product_id?: string
  variant_rank?: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductCategory {
  id: string
  name: string
  description: string | null
  handle: string
  rank?: number
  parent_category?: BaseProductCategory | null
  parent_category_id?: string | null
  category_children?: BaseProductCategory[]
  products?: BaseProduct[]
  created_at?: string
  updated_at?: string
  metadata?: Record<string, unknown> | null
}

export interface BaseProductTag {
  id: string
  value: string
  products?: BaseProduct[]
  metadata?: Record<string, unknown> | null
}

export interface BaseProductType {
  id: string
  value: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOption {
  id: string
  title: string
  product?: BaseProduct
  product_id?: string
  values?: BaseProductOptionValue[]
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BaseProductImage {
  id: string
  url: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOptionValue {
  id: string
  value: string
  option?: BaseProductOption
  option_id?: string
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BaseProductParams
  extends FindParams,
    BaseFilterable<BaseProductParams> {
  q?: string
  status?: ProductStatus | ProductStatus[]
  title?: string | string[]
  handle?: string | string[]
  id?: string | string[]
  is_giftcard?: boolean
  tags?: {
    value?: string[]
  }
  type_id?: string | string[]
  category_id?: string | string[] | OperatorMap<string>
  categories?: { id: OperatorMap<string> } | { id: OperatorMap<string[]> }
  collection_id?: string | string[] | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}

export interface BaseProductTagParams
  extends FindParams,
    BaseFilterable<BaseProductTagParams> {
  q?: string
  id?: string | string[]
  value?: string | string[]
}

export interface BaseProductTypeParams
  extends FindParams,
    BaseFilterable<BaseProductTypeParams> {
  q?: string
  id?: string | string[]
  value?: string
}

export interface BaseProductOptionParams
  extends FindParams,
    BaseFilterable<BaseProductOptionParams> {
  q?: string
  id?: string | string[]
  title?: string | string[]
  product_id?: string | string[]
}

export interface BaseProductVariantParams
  extends FindParams,
    BaseFilterable<BaseProductVariantParams> {
  q?: string
  id?: string | string[]
  sku?: string | string[]
  product_id?: string | string[]
  options?: Record<string, string>
}

export interface BaseProductCategoryParams
  extends FindParams,
    BaseFilterable<BaseProductCategoryParams> {
  q?: string
  id?: string | string[]
  name?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  include_descendants_tree?: boolean
  include_ancestors_tree?: boolean
}
