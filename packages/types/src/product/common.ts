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
 * @prop id - The ID of the product.
 * @prop title - The title of the product.
 * @prop handle - The handle of the product. The handle can be used to create slug URL paths. It can possibly be `null`.
 * @prop subtitle - The subttle of the product. It can possibly be `null`.
 * @prop description - The description of the product. It can possibly be `null`.
 * @prop is_giftcard - Whether the product is a gift card.
 * @prop status - The status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop thumbnail - The URL of the product's thumbnail. It can possibly be `null`.
 * @prop weight - The weight of the product. It can possibly be `null`.
 * @prop length - The length of the product. It can possibly be `null`.
 * @prop height - The height of the product. It can possibly be `null`.
 * @prop origin_country - The origin country of the product. It can possibly be `null`.
 * @prop hs_code - The HS Code of the product. It can possibly be `null`.
 * @prop mid_code - The MID Code of the product. It can possibly be `null`.
 * @prop material - The material of the product. It can possibly be `null`.
 * @prop collection - The associated product collection. It may only be available if the `collection` relation is expanded.
 * @prop categories -The associated product categories. It may only be available if the `categories` relation is expanded.
 * @prop type - The associated product type. It may only be available if the `type` relation is expanded.
 * @prop tags - The associated product tags. It may only be available if the `tags` relation is expanded.
 * @prop variants - The associated product variants. It may only be available if the `variants` relation is expanded.
 * @prop options - The associated product options. It may only be available if the `options` relation is expanded.
 * @prop images - The associated product images. It may only be available if the `images` relation is expanded.
 * @prop discountable - Whether the product can be discounted.
 * @prop external_id -
 * The ID of the product in an external system. This is useful if you're integrating the product with a third-party service and want to maintain
 * a reference to the ID in the integrated service.
 * @prop created_at - When the product was created.
 * @prop updated_at - When the product was updated.
 * @prop deleted_at - When the product was deleted.
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
  width?: number | null
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
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * A product variant's data.
 * 
 * @prop id - The ID of the product variant.
 * @prop title - The tile of the product variant.
 * @prop sku - The SKU of the product variant. It can possibly be `null`.
 * @prop barcode - The barcode of the product variant. It can possibly be `null`.
 * @prop ean - The EAN of the product variant. It can possibly be `null`.
 * @prop upc - The UPC of the product variant. It can possibly be `null`.
 * @prop inventory_quantity - The inventory quantiy of the product variant.
 * @prop allow_backorder - Whether the product variant can be ordered when it's out of stock.
 * @prop manage_inventory - Whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - The HS Code of the product variant. It can possibly be `null`.
 * @prop origin_country - The origin country of the product variant. It can possibly be `null`.
 * @prop mid_code - The MID Code of the product variant. It can possibly be `null`.
 * @prop material - The material of the product variant. It can possibly be `null`.
 * @prop weight - The weight of the product variant. It can possibly be `null`.
 * @prop length - The length of the product variant. It can possibly be `null`.
 * @prop height - The height of the product variant. It can possibly be `null`.
 * @prop width - The width of the product variant. It can possibly be `null`.
 * @prop options - The associated product options. It may only be available if the `options` relation is expanded.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop product - The associated product. It may only be available if the `product` relation is expanded.
 * @prop product_id - The ID of the associated product.
 * @prop variant_rank - The ranking of the variant among other variants associated with the product. It can possibly be `null`.
 * @prop created_at - When the product variant was created.
 * @prop updated_at - When the product variant was updated.
 * @prop deleted_at - When the product variant was deleted.
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
 * @interface
 * 
 * A product category's data.
 * 
 * @prop id - The ID of the product category.
 * @prop name - The name of the product category.
 * @prop description - The description of the product category.
 * @prop handle - The handle of the product category. The handle can be used to create slug URL paths.
 * @prop is_active - Whether the product category is active.
 * @prop is_internal - Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - The ranking of the product category among sibling categories.
 * @prop parent_category - The associated parent category. It may only be available if the `parent_category` relation is expanded.
 * @prop category_children - The associated child categories. It may only be available if the `category_children` relation is expanded.
 * @prop created_at - When the product category was created.
 * @prop updated_at - When the product category was updated.
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

/**
 * @interface
 * 
 * A product category to create.
 * 
 * @prop name - The product category's name.
 * @prop handle - The product category's handle.
 * @prop is_active - Whether the product category is active.
 * @prop is_internal - Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - The ranking of the category among sibling categories.
 * @prop parent_category_id - The ID of the parent product category, if it has any. It may also be `null`.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export interface CreateProductCategoryDTO {
  name: string
  handle?: string
  is_active?: boolean
  is_internal?: boolean
  rank?: number
  parent_category_id: string | null
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * The data to update in a product category.
 * 
 * @prop name - The name of the product category.
 * @prop handle - The handle of the product category.
 * @prop is_active - Whether the product category is active.
 * @prop is_internal - Whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - The ranking of the category among sibling categories.
 * @prop parent_category_id - The ID of the parent product category, if it has any. It may also be `null`.
 * @prop metadata - Holds custom data in key-value pairs.
 */
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
 * @interface
 * 
 * A product tag's data.
 * 
 * @prop id - The ID of the product tag.
 * @prop value - The value of the product tag.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop products - The associated products. It may only be available if the `products` relation is expanded.
 */
export interface ProductTagDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  products?: ProductDTO[]
}

/**
 * @interface
 * 
 * A product collection's data.
 * 
 * @prop id - The ID of the product collection.
 * @prop title - The title of the product collection.
 * @prop handle - The handle of the product collection. The handle can be used to create slug URL paths.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop deleted_at - When the product collection was deleted.
 * @prop products - The associated products. It may only be available if the `products` relation is expanded.
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
 * @interface
 * 
 * A product type's data.
 * 
 * @prop id - The ID of the product type.
 * @prop value - The value of the product type.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop deleted_at - When the product type was deleted.
 */
export interface ProductTypeDTO {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
  deleted_at?: string | Date
}

/**
 * @interface
 * 
 * A product option's data.
 * 
 * @prop id - The ID of the product option.
 * @prop title - The title of the product option.
 * @prop product - The associated product. It may only be available if the `product` relation is expanded.
 * @prop values - The associated product option values. It may only be available if the `values` relation is expanded.
 * @prop metadata - Holds custom data in key-value pairs.
 * @prop deleted_at - When the product option was deleted.
 * 
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
  id: string
  url: string
  metadata?: Record<string, unknown> | null
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
  id: string
  value: string
  option: ProductOptionDTO
  variant: ProductVariantDTO
  metadata?: Record<string, unknown> | null
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
 * @prop categories - Filters on a product's categories.
 * @prop collection_id - Filters a product by its associated collections.
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
  id?: string | string[]
  value?: string
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
  id?: string | string[]
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
  id?: string | string[]
  title?: string
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
  id?: string | string[]
  handle?: string | string[]
  title?: string
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
  id?: string | string[]
  sku?: string | string[]
  product_id?: string | string[]
  options?: { id?: string[] }
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
  id?: string | string[]
  name?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  include_descendants_tree?: boolean
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
  title: string
  handle?: string
  product_ids?: string[]
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * The data to update in a product collection. The `id` is used to identify which product collection to update.
 * 
 * @prop id - The ID of the product collection to update.
 * @prop value - The value of the product collection.
 * @prop title - The title of the product collection.
 * @prop handle - The handle of the product collection.
 * @prop product_ids - The IDs of the products to associate with the product collection.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export interface UpdateProductCollectionDTO {
  id: string
  value?: string
  title?: string
  handle?: string
  product_ids?: string[]
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * A product type to create.
 * 
 * @prop id - The product type's ID.
 * @prop value - The product type's value.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export interface CreateProductTypeDTO {
  id?: string
  value: string
  metadata?: Record<string, unknown>
}

export interface UpsertProductTypeDTO {
  id?: string
  value: string
}

/**
 * @interface
 * 
 * The data to update in a product type. The `id` is used to identify which product type to update.
 * 
 * @prop id - The ID of the product type to update.
 * @prop value - The new value of the product type.
 * @prop metadata - Holds custom data in key-value pairs.
 */
export interface UpdateProductTypeDTO {
  id: string
  value?: string
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * A product tag to create.
 * 
 * @prop value - The value of the product tag.
 */
export interface CreateProductTagDTO {
  value: string
}

export interface UpsertProductTagDTO {
  id?: string
  value: string
}

/**
 * 
 * @interface
 * 
 * The data to update in a product tag. The `id` is used to identify which product tag to update.
 * 
 * @prop id - The ID of the product tag to update.
 * @prop value - The value of the product tag.
 */
export interface UpdateProductTagDTO {
  id: string
  value?: string
}

/**
 * @interface
 * 
 * A product option to create.
 * 
 * @prop title - The product option's title.
 * @prop product_id - The ID of the associated product.
 */
export interface CreateProductOptionDTO {
  title: string
  product_id?: string
}

export interface UpdateProductOptionDTO {
  id: string
  title?: string
  product_id?: string
}

/**
 * @interface
 * 
 * A product variant option to create.
 * 
 * @prop value - The value of a product variant option.
 */
export interface CreateProductVariantOptionDTO {
  value: string
}

/**
 * @interface
 * 
 * A product variant to create.
 * 
 * @prop title - The tile of the product variant.
 * @prop sku - The SKU of the product variant.
 * @prop barcode - The barcode of the product variant.
 * @prop ean - The EAN of the product variant.
 * @prop upc - The UPC of the product variant.
 * @prop allow_backorder - Whether the product variant can be ordered when it's out of stock.
 * @prop inventory_quantity - The inventory quantiy of the product variant.
 * @prop manage_inventory - Whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - The HS Code of the product variant.
 * @prop origin_country - The origin country of the product variant.
 * @prop mid_code - The MID Code of the product variant.
 * @prop material - The material of the product variant.
 * @prop weight - The weight of the product variant.
 * @prop length - The length of the product variant.
 * @prop height - The height of the product variant.
 * @prop width - The width of the product variant.
 * @prop options - The product variant options to create and associate with the product variant.
 * @prop metadata - Holds custom data in key-value pairs.
 */
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

/**
 * @interface
 * 
 * The data to update in a product variant. The `id` is used to identify which product variant to update.
 * 
 * @prop id - The ID of the product variant to update.
 * @prop title - The tile of the product variant.
 * @prop sku - The SKU of the product variant.
 * @prop barcode - The barcode of the product variant.
 * @prop ean - The EAN of the product variant.
 * @prop upc - The UPC of the product variant.
 * @prop allow_backorder - Whether the product variant can be ordered when it's out of stock.
 * @prop inventory_quantity - The inventory quantiy of the product variant.
 * @prop manage_inventory - Whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - The HS Code of the product variant.
 * @prop origin_country - The origin country of the product variant.
 * @prop mid_code - The MID Code of the product variant.
 * @prop material - The material of the product variant.
 * @prop weight - The weight of the product variant.
 * @prop length - The length of the product variant.
 * @prop height - The height of the product variant.
 * @prop width - The width of the product variant.
 * @prop options - The product variant options to create and associate with the product variant.
 * @prop metadata - Holds custom data in key-value pairs.
 */
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

/**
 * @interface
 * 
 * A product to create.
 * 
 * @prop title - The title of the product.
 * @prop subtitle - The subttle of the product.
 * @prop description - The description of the product.
 * @prop is_giftcard - Whether the product is a gift card.
 * @prop discountable - Whether the product can be discounted.
 * @prop images - 
 * The product's images. If an array of strings is supplied, each string will be a URL and a `ProductImage` will be created
 * and associated with the product. If an array of objects is supplied, you can pass along the ID of an existing `ProductImage`.
 * @prop thumbnail - The URL of the product's thumbnail.
 * @prop handle - 
 * The handle of the product. The handle can be used to create slug URL paths.
 * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
 * @prop status - The status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop type - The product type to create and associate with the product.
 * @prop type_id - The product type to be associated with the product.
 * @prop collection_id - The product collection to be associated with the product.
 * @prop tags - The product tags to be created and associated with the product.
 * @prop categories - The product categories to associate with the product.
 * @prop options - The product options to be created and associated with the product.
 * @prop variants - The product variants to be created and associated with the product.
 * @prop width - The width of the product.
 * @prop height - The height of the product.
 * @prop length - The length of the product.
 * @prop weight - The weight of the product.
 * @prop origin_country - The origin country of the product.
 * @prop hs_code - The HS Code of the product.
 * @prop material - The material of the product.
 * @prop mid_code - The MID Code of the product.
 * @prop metadata - Holds custom data in key-value pairs.
 */
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

/**
 * @interface
 * 
 * The data to update in a product. The `id` is used to identify which product to update.
 * 
 * @prop id - The ID of the product to update.
 * @prop title - The title of the product.
 * @prop subtitle - The subttle of the product.
 * @prop description - The description of the product.
 * @prop is_giftcard - Whether the product is a gift card.
 * @prop discountable - Whether the product can be discounted.
 * @prop images - 
 * The product's images. If an array of strings is supplied, each string will be a URL and a `ProductImage` will be created
 * and associated with the product. If an array of objects is supplied, you can pass along the ID of an existing `ProductImage`.
 * @prop thumbnail - The URL of the product's thumbnail.
 * @prop handle - 
 * The handle of the product. The handle can be used to create slug URL paths.
 * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
 * @prop status - The status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop type - The product type to create and associate with the product.
 * @prop type_id - The product type to be associated with the product.
 * @prop collection_id - The product collection to be associated with the product.
 * @prop tags - The product tags to be created and associated with the product.
 * @prop categories - The product categories to associate with the product.
 * @prop options - The product options to be created and associated with the product.
 * @prop variants - 
 * The product variants to be created and associated with the product. You can also update existing product variants associated with the product.
 * @prop width - The width of the product.
 * @prop height - The height of the product.
 * @prop length - The length of the product.
 * @prop weight - The weight of the product.
 * @prop origin_country - The origin country of the product.
 * @prop hs_code - The HS Code of the product.
 * @prop material - The material of the product.
 * @prop mid_code - The MID Code of the product.
 * @prop metadata - Holds custom data in key-value pairs.
 */
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
