import { BaseFilterable, OperatorMap } from "../../dal"
import { BaseCollection } from "../collection/common"
import { FindParams } from "../common"
import { BaseCalculatedPriceSet } from "../pricing/common"
import { BaseProductCategory } from "../product-category/common"
import { BaseProductTag } from "../product-tag/common"
import { BaseProductType } from "../product-type/common"

export type ProductStatus = "draft" | "proposed" | "published" | "rejected"
export interface BaseProduct {
  /**
   * The product's ID.
   */
  id: string
  /**
   * The product's title.
   */
  title: string
  /**
   * The product's handle.
   */
  handle: string
  /**
   * The product's subtitle.
   */
  subtitle: string | null
  /**
   * The product's description.
   */
  description: string | null
  /**
   * Whether the product is a gift card.
   */
  is_giftcard: boolean
  /**
   * The product's status.
   */
  status: ProductStatus
  /**
   * The product's thumbnail.
   */
  thumbnail: string | null
  /**
   * The product's width.
   */
  width: number | null
  /**
   * The product's weight.
   */
  weight: number | null
  /**
   * The product's length.
   */
  length: number | null
  /**
   * The product's height.
   */
  height: number | null
  /**
   * The product's origin country.
   */
  origin_country: string | null
  /**
   * The product's HS code.
   */
  hs_code: string | null
  /**
   * The product's MID code.
   */
  mid_code: string | null
  /**
   * The product's material.
   */
  material: string | null
  /**
   * The product's collection.
   */
  collection?: BaseCollection | null
  /**
   * The ID of the associated product collection.
   */
  collection_id: string | null
  /**
   * The product's categories.
   */
  categories?: BaseProductCategory[] | null
  /**
   * The product's type.
   */
  type?: BaseProductType | null
  /**
   * The ID of the associated product type.
   */
  type_id: string | null
  /**
   * The product's tags.
   */
  tags?: BaseProductTag[] | null
  /**
   * The product's variants.
   */
  variants: BaseProductVariant[] | null
  /**
   * The product's options.
   */
  options: BaseProductOption[] | null
  /**
   * The product's images.
   */
  images: BaseProductImage[] | null
  /**
   * Whether the product is discountable.
   */
  discountable: boolean
  /**
   * The ID of the product in external systems.
   */
  external_id: string | null
  /**
   * The date the product was created.
   */
  created_at: string | null
  /**
   * The date the product was update.
   */
  updated_at: string | null
  /**
   * The date the product was deleted.
   */
  deleted_at: string | null
  /**
   * Key-value pairs of custom data.
   */
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
  inventory_quantity?: number
  hs_code: string | null
  origin_country: string | null
  mid_code: string | null
  material: string | null
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  variant_rank?: number | null
  options: BaseProductOptionValue[] | null
  product?: BaseProduct | null
  product_id?: string
  calculated_price?: BaseCalculatedPriceSet
  created_at: string
  updated_at: string
  deleted_at: string | null
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOption {
  id: string
  title: string
  product?: BaseProduct | null
  product_id?: string | null
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
  option?: BaseProductOption | null
  option_id?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BaseProductListParams
  extends FindParams,
    BaseFilterable<BaseProductListParams> {
  /**
   * A query or keywords to search the searchable fields by.
   */
  q?: string
  /**
   * Filter the product by status(es).
   */
  status?: ProductStatus | ProductStatus[]
  /**
   * Filter the product by the sales channel(s) it belongs to.
   */
  sales_channel_id?: string | string[]
  /**
   * Filter by the product's title(s).
   */
  title?: string | string[]
  /**
   * Filter by the product's handle(s).
   */
  handle?: string | string[]
  /**
   * Filter by the product's id(s).
   */
  id?: string | string[]
  /**
   * Filter by whether the product is a gift card.
   */
  is_giftcard?: boolean
  /**
   * Filter by the product's tag(s).
   */
  tags?: string | string[]
  /**
   * Filter by the product's type(s).
   */
  type_id?: string | string[]
  /**
   * Filter by the product's category(s).
   */
  category_id?: string | string[]
  /**
   * Filter by the product's category(s).
   */
  categories?: string | string[]
  /**
   * Filter by the product's collection(s).
   */
  collection_id?: string | string[]
  /**
   * Apply filers on the product's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filers on the product's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filers on the product's deletion date.
   */
  deleted_at?: OperatorMap<string>
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
  options?: {
    value: string
    option_id: string
  }
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
