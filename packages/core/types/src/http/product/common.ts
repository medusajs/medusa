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
  /**
   * The variant's ID.
   */
  id: string
  /**
   * The variant's title.
   */
  title: string | null
  /**
   * The variant's SKU.
   */
  sku: string | null
  /**
   * The variant's barcode.
   */
  barcode: string | null
  /**
   * The variant's EAN.
   */
  ean: string | null
  /**
   * The variant's UPC.
   */
  upc: string | null
  /**
   * Whether the variant can be ordered even if it's out of stock.
   */
  allow_backorder: boolean | null
  /**
   * Whether Medusa manages the variant's inventory. If disabled, the variant
   * is always considered in stock.
   */
  manage_inventory: boolean | null
  /**
   * The variant's inventory quantity if `manage_inventory` is enabled.
   */
  inventory_quantity?: number
  /**
   * The variant's HS code.
   */
  hs_code: string | null
  /**
   * The variant's origin country.
   */
  origin_country: string | null
  /**
   * The variant's MID code.
   */
  mid_code: string | null
  /**
   * The variant's material.
   */
  material: string | null
  /**
   * The variant's weight.
   */
  weight: number | null
  /**
   * The variant's length.
   */
  length: number | null
  /**
   * The variant's height.
   */
  height: number | null
  /**
   * The variant's width.
   */
  width: number | null
  /**
   * The variant's ranking among its siblings.
   */
  variant_rank?: number | null
  /**
   * The variant's values for the product's options.
   */
  options: BaseProductOptionValue[] | null
  /**
   * The variant's product.
   */
  product?: BaseProduct | null
  /**
   * The ID of the product that the variant belongs to.
   */
  product_id?: string
  /**
   * The variant's calculated price for the provided context.
   */
  calculated_price?: BaseCalculatedPriceSet
  /**
   * The date the variant was created.
   */
  created_at: string
  /**
   * The date the variant was updated.
   */
  updated_at: string
  /**
   * The date the variant was deleted.
   */
  deleted_at: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface BaseProductOption {
  /**
   * The option's ID.
   */
  id: string
  /**
   * The option's title.
   */
  title: string
  /**
   * The product that the option belongs to.
   */
  product?: BaseProduct | null
  /**
   * The ID of the product that the option belongs to.
   */
  product_id?: string | null
  /**
   * The option's values.
   */
  values?: BaseProductOptionValue[]
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the option was created.
   */
  created_at?: string
  /**
   * The date the option was updated.
   */
  updated_at?: string
  /**
   * The date the option was deleted.
   */
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
  /**
   * The option value's ID.
   */
  id: string
  /**
   * The option's value.
   */
  value: string
  /**
   * The option's details.
   */
  option?: BaseProductOption | null
  /**
   * The ID of the option.
   */
  option_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the option value was created.
   */
  created_at?: string
  /**
   * The date the option value was updated.
   */
  updated_at?: string
  /**
   * The date the option value was deleted.
   */
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
