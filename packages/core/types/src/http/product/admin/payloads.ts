import { BatchMethodRequest } from "../../../common"
import { ProductStatus } from "../common"

export interface AdminExportProductRequest {}
export interface AdminImportProductRequest {
  /**
   * The CSV file to import the products from.
   *
   * It's an uploaded file of type [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
   */
  file: File
}
interface AdminBatchUpdateProduct extends AdminUpdateProduct {
  /**
   * The ID of the product to update.
   */
  id: string
}
export interface AdminBatchProductRequest
  extends BatchMethodRequest<AdminCreateProduct, AdminBatchUpdateProduct> {}

export interface AdminBatchProductVariantRequest
  extends BatchMethodRequest<
    AdminCreateProductVariant,
    AdminBatchUpdateProductVariant
  > {}

export interface AdminBatchProductVariantInventoryItemRequest
  extends BatchMethodRequest<
    AdminCreateProductVariantInventoryItem,
    AdminUpdateProductVariantInventoryItem,
    AdminDeleteProductVariantInventoryItem
  > {}

export interface AdminCreateProductVariantPrice {
  /**
   * The price's currency code.
   *
   * @example
   * usd
   */
  currency_code: string
  /**
   * The price's amount.
   */
  amount: number
  /**
   * The minimum quantity required in the cart for the price to apply.
   */
  min_quantity?: number | null
  /**
   * The maximum quantity required in the cart for the price to apply.
   */
  max_quantity?: number | null
  /**
   * The price's rules. Currently, only supports a `region_id` key to specify the region that the price applies to.
   *
   * @example
   * {
   *   "region_id": "region_123"
   * }
   *
   * @privateRemarks
   * Note: Although the BE is generic, we only use region_id for price rules for now, so it's better to keep the typings stricter.
   */
  rules?: Record<string, string>
}

export interface AdminUpdateProductVariantPrice {
  /**
   * The price's ID.
   */
  id?: string
  /**
   * The price's currency code.
   *
   * @example
   * usd
   */
  currency_code?: string
  /**
   * The price's amount.
   */
  amount?: number
  /**
   * The minimum quantity required in the cart for the price to apply.
   */
  min_quantity?: number | null
  /**
   * The maximum quantity required in the cart for the price to apply.
   */
  max_quantity?: number | null
  /**
   * The price's rules.
   */
  rules?: Record<string, string>
}

export interface AdminCreateProductVariantInventoryKit {
  inventory_item_id: string
  required_quantity: number
}

export interface AdminCreateProductVariant {
  /**
   * The variant's title.
   */
  title: string
  /**
   * The variant's SKU.
   */
  sku?: string | null
  /**
   * The variant's EAN.
   */
  ean?: string | null
  /**
   * The variant's UPC.
   */
  upc?: string | null
  /**
   * The variant's barcode.
   */
  barcode?: string | null
  /**
   * The variant's HS code.
   */
  hs_code?: string | null
  /**
   * The variant's MID code.
   */
  mid_code?: string | null
  /**
   * Whether the variant can be ordered even if it's out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether Medusa manages the variant's inventory. If disabled,
   * the variant is always considered in stock.
   */
  manage_inventory?: boolean
  /**
   * The variant's ranking among its sibling variants.
   */
  variant_rank?: number
  /**
   * The variant's weight.
   */
  weight?: number | null
  /**
   * The variant's length.
   */
  length?: number | null
  /**
   * The variant's height.
   */
  height?: number | null
  /**
   * The variant's width.
   */
  width?: number | null
  /**
   * The variant's origin country.
   */
  origin_country?: string | null
  /**
   * The variant's material.
   */
  material?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The variant's prices.
   */
  prices: AdminCreateProductVariantPrice[]
  /**
   * The variant's inventory items. It's only
   * available if `manage_inventory` is enabled.
   */
  inventory_items?: AdminCreateProductVariantInventoryKit[]
  /**
   * The variant's values for the associated product's options.
   */
  options?: Record<string, string>
}

export interface AdminCreateProduct {
  /**
   * The product's title.
   */
  title: string
  /**
   * The product's subtitle.
   */
  subtitle?: string | null
  /**
   * The product's description.
   */
  description?: string | null
  /**
   * Whether the product is a gift card.
   */
  is_giftcard?: boolean
  /**
   * Whether discounts can be applied on the product.
   */
  discountable?: boolean
  /**
   * The product's images.
   */
  images?: {
    /**
     * The image's URL.
     */
    url: string
  }[]
  /**
   * The product's thumbnail URL.
   */
  thumbnail?: string | null
  /**
   * The product's handle.
   */
  handle?: string | null
  /**
   * The product's status.
   */
  status?: ProductStatus
  /**
   * The ID of the product's type.
   */
  type_id?: string | null
  /**
   * The ID of the product in an external or third-party system.
   */
  external_id?: string | null
  /**
   * The ID of the product's collection.
   */
  collection_id?: string | null
  /**
   * The ID of the product's shipping profile.
   */
  shipping_profile_id?: string
  /**
   * The product's categories.
   */
  categories?: {
    /**
     * The ID of a product category that the product belongs to.
     */
    id: string
  }[]
  /**
   * The product's tags.
   */
  tags?: {
    /**
     * The ID of the associated product tag.
     */
    id: string
  }[]
  /**
   * The product's options.
   */
  options?: AdminCreateProductOption[]
  /**
   * The product's variants.
   */
  variants?: AdminCreateProductVariant[]
  /**
   * The sales channels that the product is available in.
   */
  sales_channels?: {
    /**
     * The ID of a sales channel that the product is available in.
     */
    id: string
  }[]
  /**
   * The product's weight.
   */
  weight?: number | null
  /**
   * The product's length.
   */
  length?: number | null
  /**
   * The product's height.
   */
  height?: number | null
  /**
   * The product's width.
   */
  width?: number | null
  /**
   * The product's HS code.
   */
  hs_code?: string | null
  /**
   * The product's MID code.
   */
  mid_code?: string | null
  /**
   * The product's origin country.
   */
  origin_country?: string | null
  /**
   * The product's material.
   */
  material?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateProductVariant {
  /**
   * The variant's ID.
   */
  id?: string
  /**
   * The variant's title.
   */
  title?: string
  /**
   * The variant's SKU.
   */
  sku?: string | null
  /**
   * The variant's EAN.
   */
  ean?: string | null
  /**
   * The variant's UPC.
   */
  upc?: string | null
  /**
   * The variant's barcode.
   */
  barcode?: string | null
  /**
   * The variant's HS code.
   */
  hs_code?: string | null
  /**
   * The variant's MID code.
   */
  mid_code?: string | null
  /**
   * The variant's thumbnail.
   */
  thumbnail?: string | null
  /**
   * Whether the variant can be ordered even if it's out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether Medusa should manage the variant's inventory. If disabled,
   * the variant is always considered in stock.
   */
  manage_inventory?: boolean
  /**
   * The variant's ranking among its sibling variants.
   */
  variant_rank?: number
  /**
   * The variant's weight.
   */
  weight?: number | null
  /**
   * The variant's length.
   */
  length?: number | null
  /**
   * The variant's height.
   */
  height?: number | null
  /**
   * The variant's width.
   */
  width?: number | null
  /**
   * The variant's origin country.
   */
  origin_country?: string | null
  /**
   * The variant's material.
   */
  material?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The variant's prices.
   */
  prices?: AdminUpdateProductVariantPrice[]
  /**
   * The variant's values for the associated product's options.
   */
  options?: Record<string, string>
}

export interface AdminBatchUpdateProductVariant
  extends AdminUpdateProductVariant {
  /**
   * The ID of the variant to update.
   */
  id: string
}

export interface AdminUpdateProduct {
  /**
   * The product's title.
   */
  title?: string
  /**
   * The product's subtitle.
   */
  subtitle?: string | null
  /**
   * The product's description.
   */
  description?: string | null
  /**
   * Whether the product is a gift card.
   */
  is_giftcard?: boolean
  /**
   * Whether discounts can be applied on the product.
   */
  discountable?: boolean
  /**
   * The product's images.
   */
  images?: {
    /**
     * The ID of the image to update
     * or set for existing images.
     */
    id?: string
    /**
     * The image's URL.
     */
    url: string
  }[]
  /**
   * The product's thumbnail URL.
   */
  thumbnail?: string | null
  /**
   * The product's handle.
   */
  handle?: string
  /**
   * The product's status.
   */
  status?: ProductStatus
  /**
   * The ID of the associated product type.
   */
  type_id?: string | null
  /**
   * The ID of the product in an external or third-party system.
   */
  external_id?: string | null
  /**
   * The ID of the associated product collection.
   */
  collection_id?: string | null
  /**
   * The product's categories.
   */
  categories?: {
    /**
     * The ID of the category that the product belongs to.
     */
    id: string
  }[]
  /**
   * The product's tags.
   */
  tags?: {
    /**
     * The ID of a tag that the product is associated with.
     */
    id: string
  }[]
  /**
   * The product's options.
   */
  options?: AdminUpdateProductOption[]
  /**
   * The product's variants.
   */
  variants?: (AdminCreateProductVariant | AdminUpdateProductVariant)[]
  /**
   * The sales channels that the product is available in.
   */
  sales_channels?: {
    /**
     * The ID of a sales channel that the product is available in.
     */
    id: string
  }[]
  /**
   * The ID of the product's shipping profile.
   */
  shipping_profile_id?: string | null
  /**
   * The product's weight.
   */
  weight?: number | null
  /**
   * The product's length.
   */
  length?: number | null
  /**
   * The product's height.
   */
  height?: number | null
  /**
   * The product's width.
   */
  width?: number | null
  /**
   * The product's HS code.
   */
  hs_code?: string | null
  /**
   * The product's MID code.
   */
  mid_code?: string | null
  /**
   * The product's origin country.
   */
  origin_country?: string | null
  /**
   * The product's material.
   */
  material?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateProductOption {
  /**
   * The option's title.
   */
  title: string
  /**
   * The option's values.
   */
  values: string[]
}

export interface AdminUpdateProductOption {
  /**
   * The option's ID.
   */
  id?: string
  /**
   * The option's title.
   */
  title?: string
  /**
   * The option's values.
   */
  values?: string[]
}

/**
 * @privateRemarks
 * These types don't match the validators, however, they're used by the admin
 * dashboard. We should update the admin dashboard to use different types that it
 * needs instead.
 */
interface AdminCreateProductVariantInventoryItem {
  /**
   * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
   * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
   */
  required_quantity: number
  /**
   * The ID of the inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the variant.
   */
  variant_id: string
}

/**
 * @privateRemarks
 * These types don't match the validators, however, they're used by the admin
 * dashboard. We should update the admin dashboard to use different types that it
 * needs instead.
 */
interface AdminUpdateProductVariantInventoryItem {
  /**
   * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
   * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
   */
  required_quantity: number
  /**
   * The ID of the inventory item.
   */
  inventory_item_id: string
  /**
   * The ID of the variant.
   */
  variant_id: string
}

interface AdminDeleteProductVariantInventoryItem {
  /**
   * The ID of the inventory.
   */
  inventory_item_id: string
  /**
   * The ID of the variant.
   */
  variant_id: string
}

export interface AdminBatchImageVariantRequest {
  /**
   * The variant IDs to add to the image.
   */
  add?: string[]
  /**
   * The variant IDs to remove from the image.
   */
  remove?: string[]
}

export interface AdminBatchVariantImagesRequest {
  /**
   * The image IDs to add to the variant.
   */
  add?: string[]
  /**
   * The image IDs to remove from the variant.
   */
  remove?: string[]
}

export interface AdminImportProductsRequest {
  /**
   * The file's identifier in the third-party system.
   * For example, the S3 Module Provider
   * returns the file's key in S3, whereas the
   * Local File Module Provider returns the file's
   * path.
   */
  file_key: string
  /**
   * The original name of the file on the user's computer (aka clientName)
   */
  originalname: string
  /**
   * The file's extension.
   */
  extension: string
  /**
   * The file's size in bytes.
   */
  size: number
  /**
   * The file's mime type.
   */
  mime_type: string
}

export interface AdminUpdateVariantPrice {
  id?: string | undefined
  rules?: Record<string, string> | undefined
  currency_code?: string | undefined
  amount?: number | undefined
  max_quantity?: number | null | undefined
  min_quantity?: number | null | undefined
}

export interface AdminCreateVariantInventoryItem {
  inventory_item_id: string
  required_quantity: number
}

export interface AdminUpdateVariantInventoryItem {
  required_quantity: number
}

export interface AdminBatchCreateVariantInventoryItem {
  inventory_item_id: string
  required_quantity: number
  variant_id: string
}

export interface AdminBatchUpdateVariantInventoryItem {
  inventory_item_id: string
  required_quantity: number
  variant_id: string
}

export interface AdminBatchDeleteVariantInventoryItem {
  inventory_item_id: string
  variant_id: string
}

export interface AdminBatchVariantInventoryItems {
  create?: AdminBatchCreateVariantInventoryItem[]
  update?: AdminBatchUpdateVariantInventoryItem[]
  delete?: AdminBatchDeleteVariantInventoryItem[]
}
