import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/**
 * An enum used to indicate the product's status
 * @enum
 */
export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

/**
 * Product attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @privateRemarks
 * TODO: This DTO should represent the product, when used in config we should use Partial<ProductDTO>, it means that some props like handle should be updated to not be optional
 * 
 * @param id - the ID of the product
 * @param title - the title of the product
 * @param handle - the handle of the product
 * @param subtitle - the subtitle of the product
 * @param description - the description of the product.
 * @param is_giftcard - a flag indicating whether the product is a gift card.
 * @param status - the status of the product
 * @param thumbnail - the URL to the product's thumbnail
 * @param weight - the product's weight
 * @param length - the product's length
 * @param height - the product's height
 * @param origin_country - the product's origin country
 * @param hs_code - the product's HS Code
 * @param mid_code - the product's MID Code
 * @param material - the product's material
 * @param collection - the product's collection.
 * @param categories - the product's associated categories
 * @param type - the product's type
 * @param tags - the product's tags
 * @param variants - the product's variants
 * @param options - the product's options
 * @param images - the product's images
 * @param discountable - a flag indicating whether the product can be discounted.
 * @param external_id - the product's external ID. This is useful if the product is linked to an external service or platform.
 * @param created_at - the date the product was created.
 * @param updated_at - the date the product was updated.
 * @param deleted_at - the date the product was deleted.
 * 
 */
export interface ProductDTO {
  id: string
  title: string
  handle?: string | null
  subtitle?: string | null
  description?: string | null
  is_giftcard: boolean
  status: ProductStatus
  thumbnail?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  origin_country?: string | null
  hs_code?: string | null
  mid_code?: string | null
  material?: string | null
  collection: ProductCollectionDTO
  categories?: ProductCategoryDTO[] | null
  type: ProductTypeDTO[]
  tags: ProductTagDTO[]
  variants: ProductVariantDTO[]
  options: ProductOptionDTO[]
  images: ProductImageDTO[]
  discountable?: boolean
  external_id?: string | null
  created_at?: string | Date
  updated_at?: string | Date
  deleted_at?: string | Date
}

/**
 * Product Variant attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the product variant's ID.
 * @param title - the product variant's title.
 * @param sku - the product variant's SKU.
 * @param barcode - the product variant's barcode.
 * @param ean - the product variant's EAN.
 * @param upc - the product variant's UPC.
 * @param inventory_quantity - the product variant's inventory quantity.
 * @param allow_backorder - a flag indicating whether customers can order a variant when it's out of stock.
 * @param manage_inventory - a flag indicating whether variant's inventory is managed by the system.
 * @param hs_code - the product variant's HS Code.
 * @param origin_country - the product variant's origin country.
 * @param mid_code - the product variant's mid code.
 * @param material - the product variant's material.
 * @param weight - the product variant's weight.
 * @param length - the product variant's length.
 * @param height - the product variant's height.
 * @param width - the product variant's width.
 * @param options - the product variant's values of the product's options.
 * @param metadata - an object of custom data associated with the product variant.
 * @param product - the variant's product.
 * @param product_id - the ID of the variant's product.
 * @param variant_rank - the ranking of the product variant.
 * @param created_at - the date the product variant was created.
 * @param updated_at - the date the product variant was updated.
 * @param deleted_at - the date the product variant was deleted.
 */
export interface ProductVariantDTO {
  id: string
  title: string
  sku?: string | null
  barcode?: string | null
  ean?: string | null
  upc?: string | null
  inventory_quantity: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  hs_code?: string | null
  origin_country?: string | null
  mid_code?: string | null
  material?: string | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  options: ProductOptionValueDTO
  metadata?: Record<string, unknown> | null
  product: ProductDTO
  product_id: string
  variant_rank?: number | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date
}

/**
 * Product Category attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the product category's ID.
 * @param name - the product category's name.
 * @param description - the product category's description.
 * @param handle - the product category's handle.
 * @param is_active - a flag indicating whether the product category is active.
 * @param is_internal - a flag indicating whether the product category is used for internal purposes.
 * @param rank - a number indicating the ranking of the product category.
 * @param parent_category - the parent of the product category, if it has any.
 * @param category_children - the children of the product category.
 * @param created_at - the date the product category was created.
 * @param updated_at - the date the product category was updated.
 */
export interface ProductCategoryDTO {
  id: string
  name: string
  description?: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category?: ProductCategoryDTO
  category_children: ProductCategoryDTO[]
  created_at: string | Date
  updated_at: string | Date
}

export interface CreateProductCategoryDTO {
  name: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id: string | null
  metadata?: Record<string, unknown>
}

export interface UpdateProductCategoryDTO {
  name?: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Product Tag attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the ID of the product tag
 * @param value - the value of the product tag
 * @param metadata - an object of custom data to attach to the product tag
 * @param products - the products associated with this product tag
 */
export interface ProductTagDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  products?: ProductDTO[]
}

/**
 * Product Collection attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the ID of the product collection.
 * @param title - the title of the product collection.
 * @param handle - the handle of the product collection
 * @param metadata - an object of custom data to attach to the product collection
 * @param deleted_at - the date the product collection was deleted.
 * @param products - an array of products that belong to this collection.
 */
export interface ProductCollectionDTO {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
  products?: ProductDTO[]
}

/**
 * Product Type attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the ID of the product type
 * @param value - the value of the product type
 * @param metadata - an object of custom data to attach to the product type
 * @param deleted_at - the date the product type was deleted.
 */
export interface ProductTypeDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * Product Option attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the ID of the product option.
 * @param title - the title of the product option.
 * @param product - the option's product.
 * @param values - the option's values that are associated with variants.
 * @param metadata - an object of custom data to attach to the product option.
 * @param deleted_at - the date the product option was deleted.
 */
export interface ProductOptionDTO {
  id: string
  title: string
  product: ProductDTO
  values: ProductOptionValueDTO[]
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * Product Image attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the product image's ID.
 * @param url - the product image's URL.
 * @param metadata - an object of custom data to attach to the product image.
 * @param deleted_at - the date the product image was deleted at.
 */
export interface ProductImageDTO {
  id: string
  url: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * Product Option Value attributes accepted as a parameter to different methods in the `ProductModuleService` class.
 * 
 * @param id - the product option value's ID.
 * @param value - the value of the product option.
 * @param option - the product option.
 * @param variant - the product variant using this option value.
 * @param metadata - an object of custom data to attach to the product option value.
 * @param deleted_at - the date the product option value was deleted.
 */
export interface ProductOptionValueDTO {
  id: string
  value: string
  option: ProductOptionDTO
  variant: ProductVariantDTO
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * Filters/Config (module API input filters and config)
 * 
 * {@label FilterableProductProps}
 * 
 * @param q - (optional) a term to search products by.
 * @param handle - (optional) a string or an array of strings to filter products by their handle.
 * @param id - (optional) a string or an array of strings to filter products by their ID.
 * @param tags - 
 * (optional) an object to filter products by their tags. The object accepts the property `value` which is an array of strings indicating the
 * tag values to filter the products by.
 * @param categories - (optional) an object to filter products by associated categories.
 * @param categories.id - (optional) a string or array of strings to filter products by their associated category ID.
 * @param categories.is_internal - (optional) a boolean value that filters products by whether their category is internal.
 * @param categories.is_active - (optional) a boolean value that filters products by whether their category is active.
 * @param category_id - (optional) a string or array of strings that filters products by the ID of their associated category.
 * @param collection_id - (optional) a string or array of strings that filters products by the ID of their associated collection.
 */
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

/**
 * Write DTO (module API input)
 */

export interface CreateProductCollectionDTO {
  title: string
  handle?: string
  products?: ProductDTO[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductCollectionDTO {
  id: string
  value?: string
  title?: string
  handle?: string
  products?: ProductDTO[]
  metadata?: Record<string, unknown>
}

export interface CreateProductTypeDTO {
  id?: string
  value: string
  metadata?: Record<string, unknown>
}

export interface UpsertProductTypeDTO {
  id?: string
  value: string
}

export interface UpdateProductTypeDTO {
  id: string
  value?: string
  metadata?: Record<string, unknown>
}

export interface CreateProductTagDTO {
  value: string
}

export interface UpsertProductTagDTO {
  id?: string
  value: string
}

export interface UpdateProductTagDTO {
  id: string
  value?: string
}

export interface CreateProductOptionDTO {
  title: string
  product_id?: string
  product?: Record<any, any>
}

export interface UpdateProductOptionDTO {
  id: string
  title?: string
  product_id?: string
}

export interface CreateProductVariantOptionDTO {
  value: string
}

export interface CreateProductVariantDTO {
  title: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: CreateProductVariantOptionDTO[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductVariantDTO {
  id: string
  title?: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: CreateProductVariantOptionDTO[]
  metadata?: Record<string, unknown>
}

export interface CreateProductDTO {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[] | { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductTypeDTO
  type_id?: string
  collection_id?: string
  tags?: CreateProductTagDTO[]
  categories?: { id: string }[]
  options?: CreateProductOptionDTO[]
  variants?: CreateProductVariantDTO[]
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
}

export interface UpdateProductDTO {
  id: string
  title?: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[] | { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductTypeDTO
  type_id?: string | null
  collection_id?: string | null
  tags?: CreateProductTagDTO[]
  categories?: { id: string }[]
  options?: CreateProductOptionDTO[]
  variants?: (CreateProductVariantDTO | UpdateProductVariantDTO)[]
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
}

export interface CreateProductOnlyDTO {
  title: string
  subtitle?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: { id?: string; url: string }[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  collection_id?: string
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  metadata?: Record<string, unknown>
  tags?: { id: string }[]
  categories?: { id: string }[]
  type_id?: string
}

export interface CreateProductVariantOnlyDTO {
  title: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: (CreateProductVariantOptionDTO & { option: any })[]
  metadata?: Record<string, unknown>
}

export interface UpdateProductVariantOnlyDTO {
  id: string
  title?: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  allow_backorder?: boolean
  inventory_quantity?: number
  manage_inventory?: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  options?: (CreateProductVariantOptionDTO & { option: any })[]
  metadata?: Record<string, unknown>
}

export interface CreateProductOptionOnlyDTO {
  product_id?: string
  product?: Record<any, any>
  title: string
}
