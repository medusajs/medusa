import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/**
 * @enum
 */
export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

/**
 * @interface
 *
 * A product's data.
 */
export interface ProductDTO {
  /**
   * The ID of the product.
   */
  id: string
  /**
   * The title of the product.
   */
  title: string
  /**
   * The handle of the product. The handle can be used to create slug URL paths.
   */
  handle?: string | null
  /**
   * The subttle of the product.
   */
  subtitle?: string | null
  /**
   * The description of the product.
   */
  description?: string | null
  /**
   * Whether the product is a gift card.
   */
  is_giftcard: boolean
  /**
   * The status of the product.
   */
  status: ProductStatus
  /**
   * The URL of the product's thumbnail.
   */
  thumbnail?: string | null
  /**
   * The width of the product.
   */
  width?: number | null
  /**
   * The weight of the product.
   */
  weight?: number | null
  /**
   * The length of the product.
   */
  length?: number | null
  /**
   * The height of the product.
   */
  height?: number | null
  /**
   * The origin country of the product.
   */
  origin_country?: string | null
  /**
   * The HS Code of the product.
   */
  hs_code?: string | null
  /**
   * The MID Code of the product.
   */
  mid_code?: string | null
  /**
   * The material of the product.
   */
  material?: string | null
  /**
   * The associated product collection.
   *
   * @expandable
   */
  collection?: ProductCollectionDTO | null
  /**
   * The associated product collection id.
   */
  collection_id?: string | null
  /**
   * The associated product categories.
   *
   * @expandable
   */
  categories?: ProductCategoryDTO[] | null
  /**
   * The associated product type.
   *
   * @expandable
   */
  type?: ProductTypeDTO | null
  /**
   * The associated product type id.
   */
  type_id?: string | null
  /**
   * The associated product tags.
   *
   * @expandable
   */
  tags: ProductTagDTO[]
  /**
   * The associated product variants.
   *
   * @expandable
   */
  variants: ProductVariantDTO[]
  /**
   * The associated product options.
   *
   * @expandable
   */
  options: ProductOptionDTO[]
  /**
   * The associated product images.
   *
   * @expandable
   */
  images: ProductImageDTO[]
  /**
   * Whether the product can be discounted.
   */
  discountable?: boolean
  /**
   * The ID of the product in an external system. This is useful if you're integrating the product with a third-party service and want to maintain
   * a reference to the ID in the integrated service.
   */
  external_id?: string | null
  /**
   * When the product was created.
   */
  created_at?: string | Date
  /**
   * When the product was updated.
   */
  updated_at?: string | Date
  /**
   * When the product was deleted.
   */
  deleted_at?: string | Date
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product variant's data.
 */
export interface ProductVariantDTO {
  /**
   * The ID of the product variant.
   */
  id: string
  /**
   * The tile of the product variant.
   */
  title: string
  /**
   * The SKU of the product variant.
   */
  sku?: string | null
  /**
   * The barcode of the product variant.
   */
  barcode?: string | null
  /**
   * The EAN of the product variant.
   */
  ean?: string | null
  /**
   * The UPC of the product variant.
   */
  upc?: string | null
  /**
   * Whether the product variant can be ordered when it's out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether the product variant's inventory should be managed by the core system.
   */
  manage_inventory?: boolean
  /**
   * The HS Code of the product variant.
   */
  hs_code?: string | null
  /**
   * The origin country of the product variant.
   */
  origin_country?: string | null
  /**
   * The MID Code of the product variant.
   */
  mid_code?: string | null
  /**
   * The material of the product variant.
   */
  material?: string | null
  /**
   * The weight of the product variant.
   */
  weight?: number | null
  /**
   * The length of the product variant.
   */
  length?: number | null
  /**
   * The height of the product variant.
   */
  height?: number | null
  /**
   * The width of the product variant.
   */
  width?: number | null
  /**
   * The associated product options.
   *
   * @expandable
   */
  options: ProductOptionValueDTO[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The associated product.
   *
   * @expandable
   */
  product?: ProductDTO | null
  /**
   * The associated product id.
   */
  product_id?: string | null
  /**
   * he ranking of the variant among other variants associated with the product.
   */
  variant_rank?: number | null
  /**
   * When the product variant was created.
   */
  created_at: string | Date
  /**
   * When the product variant was updated.
   */
  updated_at: string | Date
  /**
   * When the product variant was deleted.
   */
  deleted_at: string | Date
}

/**
 * @interface
 *
 * A product category's data.
 */
export interface ProductCategoryDTO {
  /**
   * The ID of the product category.
   */
  id: string
  /**
   * The name of the product category.
   */
  name: string
  /**
   * The description of the product category.
   */
  description: string
  /**
   * The handle of the product category. The handle can be used to create slug URL paths.
   */
  handle: string
  /**
   * Whether the product category is active.
   */
  is_active: boolean
  /**
   * Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
   */
  is_internal: boolean
  /**
   * The ranking of the product category among sibling categories.
   */
  rank: number
  /**
   * The ranking of the product category among sibling categories.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The associated parent category.
   *
   * @expandable
   */
  parent_category?: ProductCategoryDTO | null
  /**
   * The associated parent category id.
   */
  parent_category_id?: string | null
  /**
   * The associated child categories.
   *
   * @expandable
   */
  category_children: ProductCategoryDTO[]
  /**
   * The associated products.
   *
   * @expandable
   */
  products: ProductDTO[]
  /**
   * When the product category was created.
   */
  created_at: string | Date
  /**
   * When the product category was updated.
   */
  updated_at: string | Date
}

/**
 * @interface
 *
 * A product category to create.
 */
export interface CreateProductCategoryDTO {
  /**
   * The product category's name.
   */
  name: string
  /**
   * The product category's description.
   */
  description?: string
  /**
   * The product category's handle.
   */
  handle?: string
  /**
   * Whether the product category is active.
   */
  is_active?: boolean
  /**
   * Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
   */
  is_internal?: boolean
  /**
   * The ranking of the category among sibling categories.
   */
  rank?: number
  /**
   * The ID of the parent product category, if it has any.
   */
  parent_category_id?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * The data to update in a product category.
 */
export interface UpdateProductCategoryDTO {
  /**
   * The name of the product category.
   */
  name?: string
  /**
   * The product category's description.
   */
  description?: string
  /**
   * The handle of the product category.
   */
  handle?: string
  /**
   * Whether the product category is active.
   */
  is_active?: boolean
  /**
   * Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
   */
  is_internal?: boolean
  /**
   * The ranking of the category among sibling categories.
   */
  rank?: number
  /**
   * The ID of the parent product category, if it has any.
   */
  parent_category_id?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @interface
 *
 * A product tag's data.
 */
export interface ProductTagDTO {
  /**
   * The ID of the product tag.
   */
  id: string
  /**
   * The value of the product tag.
   */
  value: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The associated products.
   *
   * @expandable
   */
  products?: ProductDTO[]
}

/**
 * @interface
 *
 * A product collection's data.
 */
export interface ProductCollectionDTO {
  /**
   * The ID of the product collection.
   */
  id: string
  /**
   * The title of the product collection.
   */
  title: string
  /**
   * The handle of the product collection. The handle can be used to create slug URL paths.
   */
  handle: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the product collection was created.
   */
  created_at: string | Date
  /**
   * When the product collection was updated.
   */
  updated_at: string | Date
  /**
   * When the product collection was deleted.
   */
  deleted_at?: string | Date
  /**
   * The associated products.
   *
   * @expandable
   */
  products?: ProductDTO[]
}

/**
 * @interface
 *
 * A product type's data.
 */
export interface ProductTypeDTO {
  /**
   * The ID of the product type.
   */
  id: string
  /**
   * The value of the product type.
   */
  value: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the product type was created.
   */
  created_at: string | Date
  /**
   * When the product type was updated.
   */
  updated_at: string | Date
  /**
   * When the product type was deleted.
   */
  deleted_at?: string | Date
}

/**
 * @interface
 *
 * A product option's data.
 *
 */
export interface ProductOptionDTO {
  /**
   * The ID of the product option.
   */
  id: string
  /**
   * The title of the product option.
   */
  title: string
  /**
   * The associated product.
   *
   * @expandable
   */
  product?: ProductDTO | null
  /**
   * The associated product id.
   */
  product_id?: string | null
  /**
   * The associated product option values.
   *
   * @expandable
   */
  values: ProductOptionValueDTO[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the product option was created.
   */
  created_at: string | Date
  /**
   * When the product option was updated.
   */
  updated_at: string | Date
  /**
   * When the product option was deleted.
   */
  deleted_at?: string | Date
}

/**
 * @interface
 *
 * The product image's data.
 *
 * @prop id - The ID of the product image.
 * @prop url - The URL of the product image.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop deleted_at - When the product image was deleted.
 */
export interface ProductImageDTO {
  /**
   * The ID of the product image.
   */
  id: string
  /**
   * The URL of the product image.
   */
  url: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the product image was created.
   */
  created_at: string | Date
  /**
   * When the product image was updated.
   */
  updated_at: string | Date
  /**
   * When the product image was deleted.
   */
  deleted_at?: string | Date
}

/**
 * @interface
 *
 * The product option value's data.
 *
 * @prop id - The ID of the product option value.
 * @prop value - The value of the product option value.
 * @prop option - The associated product option. It may only be available if the `option` relation is expanded.
 * @prop variant - The associated product variant. It may only be available if the `variant` relation is expanded.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop deleted_at - When the product option value was deleted.
 */
export interface ProductOptionValueDTO {
  /**
   * The ID of the product option value.
   */
  id: string
  /**
   * The value of the product option value.
   */
  value: string
  /**
   * The associated product option.
   *
   * @expandable
   */
  option?: ProductOptionDTO | null
  /**
   * The associated product option id.
   */
  option_id?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the product option value was created.
   */
  created_at: string | Date
  /**
   * When the product option value was updated.
   */
  updated_at: string | Date
  /**
   * When the product option value was deleted.
   */
  deleted_at?: string | Date
}

/**
 * @interface
 *
 * The filters to apply on retrieved products.
 *
 * @prop q - Search through the products' attributes, such as titles and descriptions, using this search term.
 * @prop handle - The handles to filter products by.
 * @prop id - The IDs to filter products by.
 * @prop tags - Filters on a product's tags.
 * @prop category_id - Filters on a product's category_id.
 * @prop collection_id - Filters a product by its associated collections.
 */

export interface FilterableProductProps
  extends BaseFilterable<FilterableProductProps> {
  /**
   * Search through the products' attributes, such as titles and descriptions, using this search term.
   */
  q?: string
  /**
   * The status to filter products by
   */
  status?: ProductStatus | ProductStatus[]
  /**
   * The titles to filter products by.
   */
  title?: string | string[]
  /**
   * The handles to filter products by.
   */
  handle?: string | string[]
  /**
   * The IDs to filter products by.
   */
  id?: string | string[]
  /**
   * Filters only or excluding gift card products
   */
  is_giftcard?: boolean
  /**
   * Filters on a product's tags.
   */
  tags?: {
    /**
     * Values to filter product tags by.
     */
    value?: string[]
  }
  /**
   * Filter a product by the ID of the associated type
   */
  type_id?: string | string[]
  /**
   * @deprecated - Use `categories` instead
   * Filter a product by the IDs of their associated categories.
   */
  category_id?: string | string[] | OperatorMap<string>
  /**
   * Filter a product by the IDs of their associated categories.
   */
  categories?: { id: OperatorMap<string> } | { id: OperatorMap<string[]> }
  /**
   * Filters a product by the IDs of their associated collections.
   */
  collection_id?: string | string[] | OperatorMap<string>
  /**
   * Filters a product based on when it was created
   */
  created_at?: OperatorMap<string>
  /**
   * Filters a product based on when it was updated
   */
  updated_at?: OperatorMap<string>
  /**
   * Filters soft-deleted products based on the date they were deleted at.
   */
  deleted_at?: OperatorMap<string>
}

/**
 * @interface
 *
 * The filters to apply on retrieved product tags.
 *
 * @prop id - The IDs to filter product tags by.
 * @prop value - The value to filter product tags by.
 */
export interface FilterableProductTagProps
  extends BaseFilterable<FilterableProductTagProps> {
  /**
   * Search through the tags' values.
   */
  q?: string
  /**
   * The IDs to filter product tags by.
   */
  id?: string | string[]
  /**
   * The value to filter product tags by.
   */
  value?: string | string[]
}

/**
 * @interface
 *
 * The filters to apply on retrieved product types.
 *
 * @prop id - The IDs to filter product types by.
 * @prop value - The value to filter product types by.
 */
export interface FilterableProductTypeProps
  extends BaseFilterable<FilterableProductTypeProps> {
  /**
   * Search through the types' values.
   */
  q?: string
  /**
   * The IDs to filter product types by.
   */
  id?: string | string[]
  /**
   * The value to filter product types by.
   */
  value?: string
}

/**
 * @interface
 *
 * The filters to apply on retrieved product options.
 *
 * @prop id - The IDs to filter product options by.
 * @prop title - The titles to filter product options by.
 * @prop product_id - Filter the product options by their associated products' IDs.
 */
export interface FilterableProductOptionProps
  extends BaseFilterable<FilterableProductOptionProps> {
  /**
   * Search through the options' titles.
   */
  q?: string
  /**
   * The IDs to filter product options by.
   */
  id?: string | string[]
  /**
   * The titles to filter product options by.
   */
  title?: string | string[]
  /**
   * Filter the product options by their associated products' IDs.
   */
  product_id?: string | string[]
}

/**
 * @interface
 *
 * The filters to apply on retrieved product collections.
 *
 * @prop id - The IDs to filter product collections by.
 * @prop title - The title to filter product collections by.
 */
export interface FilterableProductCollectionProps
  extends BaseFilterable<FilterableProductCollectionProps> {
  /**
   * Search through the collections' titles.
   */
  q?: string
  /**
   * The IDs to filter product collections by.
   */
  id?: string | string[]
  /**
   * The handles to filter product collections by.
   */
  handle?: string | string[]
  /**
   * The title to filter product collections by.
   */
  title?: string | string[]
}

/**
 * @interface
 *
 * The filters to apply on retrieved product variants.
 *
 * @prop id - The IDs to filter product variants by.
 * @prop sku - The SKUs to filter product variants by.
 * @prop product_id - Filter the product variants by their associated products' IDs.
 * @prop options - Filter product variants by their associated options.
 */
export interface FilterableProductVariantProps
  extends BaseFilterable<FilterableProductVariantProps> {
  /**
   * Search through the title and different code attributes on the variant
   */
  q?: string
  /**
   * The IDs to filter product variants by.
   */
  id?: string | string[]
  /**
   * The SKUs to filter product variants by.
   */
  sku?: string | string[]
  /**
   * Filter the product variants by their associated products' IDs.
   */
  product_id?: string | string[]
  /**
   * Filter product variants by their associated options.
   */
  options?: Record<string, string>
}

/**
 * @interface
 *
 * The filters to apply on retrieved product categories.
 *
 * @prop id - The IDs to filter product categories by.
 * @prop name - The names to filter product categories by.
 * @prop parent_category_id - Filter product categories by their parent category's ID.
 * @prop handle - The handles to filter product categories by.
 * @prop is_active - Filter product categories by whether they're active.
 * @prop is_internal - Filter product categories by whether they're internal.
 * @prop include_descendants_tree - Whether to include children of retrieved product categories.
 */
export interface FilterableProductCategoryProps
  extends BaseFilterable<FilterableProductCategoryProps> {
  /**
   * Filter product categories based on searchable fields
   */
  q?: string
  /**
   * The IDs to filter product categories by.
   */
  id?: string | string[]
  /**
   * The names to filter product categories by.
   */
  name?: string | string[]
  /**
   * Filter product categories by their parent category's ID.
   */
  parent_category_id?: string | string[] | null
  /**
   * The handles to filter product categories by.
   */
  handle?: string | string[]
  /**
   * Filter product categories by whether they're active.
   */
  is_active?: boolean
  /**
   * Filter product categories by whether they're internal.
   */
  is_internal?: boolean
  /**
   * Whether to include children of retrieved product categories.
   */
  include_descendants_tree?: boolean
  /**
   * Whether to include parents of retrieved product categories.
   */
  include_ancestors_tree?: boolean
}

/**
 * @interface
 *
 * A product collection to create.
 *
 * @prop title - The product collection's title.
 * @prop handle - The product collection's handle. If not provided, the value of this attribute is set to the slug version of the title.
 * @prop products - The products to associate with the collection.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export interface CreateProductCollectionDTO {
  /**
   * The product collection's title.
   */
  title: string
  /**
   * The product collection's handle. If not provided, the value of this attribute is set to the slug version of the title.
   */
  handle?: string
  /**
   * The products to associate with the collection.
   */
  product_ids?: string[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * The product collection to create or update.
 */
export interface UpsertProductCollectionDTO extends UpdateProductCollectionDTO {
  /**
   * The ID of the product collection to update. If not provided,
   * the product collection is created. In this case, the `title` property is
   * required.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a product collection. The `id` is used to identify which product collection to update.
 */
export interface UpdateProductCollectionDTO {
  /**
   * The value of the product collection.
   */
  value?: string
  /**
   * The title of the product collection.
   */
  title?: string
  /**
   * The handle of the product collection.
   */
  handle?: string
  /**
   * The IDs of the products to associate with the product collection.
   */
  product_ids?: string[]
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product type to create.
 */
export interface CreateProductTypeDTO {
  /**
   * The product type's value.
   */
  value: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product type to create or update
 */
export interface UpsertProductTypeDTO extends UpdateProductTypeDTO {
  /**
   * The product type's ID. If provided, the product
   * tag is updated. Otheriwse, it's created.
   * In that case, the `value` property is required.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a product type. The `id` is used to identify which product type to update.
 */
export interface UpdateProductTypeDTO {
  /**
   * The new value of the product type.
   */
  value?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @interface
 *
 * A product image to create.
 */
export interface CreateProductImageDTO {
  /**
   * The product image's URL.
   */
  url: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product image to create or update.
 */
export interface UpsertProductImageDTO extends UpdateProductImageDTO {
  /**
   * The product image's ID. If not provided, the image is created. In
   * that case, the `url` property is required.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a product image. The `id` is used to identify which product image to update.
 */
export interface UpdateProductImageDTO {
  /**
   * The new URL of the product image.
   */
  url?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product tag to create.
 */
export interface CreateProductTagDTO {
  /**
   * The value of the product tag.
   */
  value: string
}

/**
 * @interface
 *
 * A product tag to create or update.
 */
export interface UpsertProductTagDTO extends UpdateProductTagDTO {
  /**
   * The ID of the product tag to update. If not provided, the tag
   * is created. In that case, the `value` property is required.
   */
  id?: string
}

/**
 *
 * @interface
 *
 * The data to update in a product tag. The `id` is used to identify which product tag to update.
 */
export interface UpdateProductTagDTO {
  /**
   * The value of the product tag.
   */
  value?: string
}

/**
 * @interface
 *
 * A product option to create.
 */
export interface CreateProductOptionDTO {
  /**
   * The product option's title.
   */
  title: string
  /**
   * The product option values.
   */
  values: string[]
  /**
   * The ID of the associated product.
   */
  product_id?: string
}

/**
 * @interface
 *
 * A product option to create or update.
 */
export interface UpsertProductOptionDTO extends UpdateProductOptionDTO {
  /**
   * The ID of the product option to update. If not provided, the product
   * option is created. In that case, the `title` and `values` properties are
   * required.
   */
  id?: string
}

export interface UpdateProductOptionDTO {
  /**
   * The product option's title.
   */
  title?: string
  /**
   * The product option values.
   */
  values?: string[]
  /**
   * The ID of the associated product.
   */
  product_id?: string
}

/**
 * @interface
 *
 * A product variant to create.
 */
export interface CreateProductVariantDTO {
  /**
   * The id of the product
   */
  product_id?: string
  /**
   * The tile of the product variant.
   */
  title: string
  /**
   * The SKU of the product variant.
   */
  sku?: string | null
  /**
   * The barcode of the product variant.
   */
  barcode?: string | null
  /**
   * The EAN of the product variant.
   */
  ean?: string | null
  /**
   * The UPC of the product variant.
   */
  upc?: string | null
  /**
   * Whether the product variant can be ordered when it's out of stock.
   */
  allow_backorder?: boolean
  /**
   *  Whether the product variant's inventory should be managed by the core system.
   */
  manage_inventory?: boolean
  /**
   * The HS Code of the product variant.
   */
  hs_code?: string | null
  /**
   * The origin country of the product variant.
   */
  origin_country?: string | null
  /**
   * The MID Code of the product variant.
   */
  mid_code?: string | null
  /**
   * The material of the product variant.
   */
  material?: string | null
  /**
   * The weight of the product variant.
   */
  weight?: number | null
  /**
   * The length of the product variant.
   */
  length?: number | null
  /**
   * The height of the product variant.
   */
  height?: number | null
  /**
   * The width of the product variant.
   */
  width?: number | null
  /**
   * The options of the variant. Each key is an option's title, and value
   * is an option's value. If an option with the specified title doesn't exist,
   * a new one is created.
   *
   * @example
   * `{ Color: "Blue" }`
   */
  options?: Record<string, string>
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product variant to create or update.
 *
 * @privateRemarks
 * Shouldn't this type support passing a `product_id`? In case a variant
 * is created.
 */
export interface UpsertProductVariantDTO extends UpdateProductVariantDTO {
  /**
   * The ID of the product variant to update.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a product variant. The `id` is used to identify which product variant to update.
 */
export interface UpdateProductVariantDTO {
  /**
   * The tile of the product variant.
   */
  title?: string
  /**
   * The SKU of the product variant.
   */
  sku?: string | null
  /**
   * The barcode of the product variant.
   */
  barcode?: string | null
  /**
   * The EAN of the product variant.
   */
  ean?: string | null
  /**
   * The UPC of the product variant.
   */
  upc?: string | null
  /**
   * Whether the product variant can be ordered when it's out of stock.
   */
  allow_backorder?: boolean
  /**
   * Whether the product variant's inventory should be managed by the core system.
   */
  manage_inventory?: boolean
  /**
   * The HS Code of the product variant.
   */
  hs_code?: string | null
  /**
   * The origin country of the product variant.
   */
  origin_country?: string | null
  /**
   * The MID Code of the product variant.
   */
  mid_code?: string | null
  /**
   * The material of the product variant.
   */
  material?: string | null
  /**
   * The weight of the product variant.
   */
  weight?: number | null
  /**
   * The length of the product variant.
   */
  length?: number | null
  /**
   * The height of the product variant.
   */
  height?: number | null
  /**
   * The width of the product variant.
   */
  width?: number | null
  /**
   * The product variant options to associate with the product variant.
   */
  options?: Record<string, string>
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * A product to create.
 */
export interface CreateProductDTO {
  /**
   * The title of the product.
   */
  title: string
  /**
   * The subttle of the product.
   */
  subtitle?: string
  /**
   * The description of the product.
   */
  description?: string
  /**
   * Whether the product is a gift card.
   */
  is_giftcard?: boolean
  /**
   * Whether the product can be discounted.
   */
  discountable?: boolean
  /**
   * The URL of the product's thumbnail.
   */
  thumbnail?: string
  /**
   * The handle of the product. The handle can be used to create slug URL paths.
   * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
   */
  handle?: string
  /**
   * The status of the product.
   */
  status?: ProductStatus
  /**
   * The associated images to created or updated.
   */
  images?: UpsertProductImageDTO[]
  /**
   * The product type id to associate with the product.
   */
  type_id?: string
  /**
   * The product collection to associate with the product.
   */
  collection_id?: string
  /**
   * The associated tags to be created or updated.
   */
  tags?: UpsertProductTagDTO[]
  /**
   * The product categories to associate with the product.
   */
  category_ids?: string[]
  /**
   * The product options to be created and associated with the product.
   */
  options?: CreateProductOptionDTO[]
  /**
   * The product variants to be created and associated with the product.
   */
  variants?: CreateProductVariantDTO[]
  /**
   * The width of the product.
   */
  width?: number
  /**
   * The height of the product.
   */
  height?: number
  /**
   * The length of the product.
   */
  length?: number
  /**
   * The weight of the product.
   */
  weight?: number
  /**
   * The origin country of the product.
   */
  origin_country?: string
  /**
   * The HS Code of the product.
   */
  hs_code?: string
  /**
   * The material of the product.
   */
  material?: string
  /**
   * The MID Code of the product.
   */
  mid_code?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}

/**
 * A product to be created or updated.
 */
export interface UpsertProductDTO extends UpdateProductDTO {
  /**
   * The ID of the product to update. If not provided, a product
   * is created instead. In that case, the `title` property is required.
   */
  id?: string
}

/**
 * @interface
 *
 * The data to update in a product.
 */
export interface UpdateProductDTO {
  /**
   * The title of the product.
   */
  title?: string
  /**
   * The subttle of the product.
   */
  subtitle?: string
  /**
   * The description of the product.
   */
  description?: string
  /**
   * Whether the product is a gift card.
   */
  is_giftcard?: boolean
  /**
   * Whether the product can be discounted.
   */
  discountable?: boolean
  /**
   * The URL of the product's thumbnail.
   */
  thumbnail?: string
  /**
   * The handle of the product. The handle can be used to create slug URL paths.
   * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
   */
  handle?: string
  /**
   * The status of the product.
   */
  status?: ProductStatus
  /**
   * The associated images to create or update.
   */
  images?: UpsertProductImageDTO[]
  /**
   * The product type to associate with the product.
   */
  type_id?: string | null
  /**
   * The product collection to associate with the product.
   */
  collection_id?: string | null
  /**
   * The associated tags to create or update.
   */
  tags?: UpsertProductTagDTO[]
  /**
   * The product categories to associate with the product.
   */
  category_ids?: string[]
  /**
   * The associated options to create or update.
   */
  options?: UpsertProductOptionDTO[]
  /**
   * The product variants to be created and associated with the product.
   * You can also update existing product variants associated with the product.
   */
  variants?: UpsertProductVariantDTO[]
  /**
   * The width of the product.
   */
  width?: number
  /**
   * The height of the product.
   */
  height?: number
  /**
   * The length of the product.
   */
  length?: number
  /**
   * The weight of the product.
   */
  weight?: number
  /**
   * The origin country of the product.
   */
  origin_country?: string
  /**
   * The HS Code of the product.
   */
  hs_code?: string
  /**
   * The material of the product.
   */
  material?: string
  /**
   * The MID Code of the product.
   */
  mid_code?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}
