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
 * An object representing a product's data.
 * 
 * @privateRemarks
 * TODO: This DTO should represent the product, when used in config we should use Partial<ProductDTO>, it means that some props like handle should be updated to not be optional
 * 
 * @prop id - A string indicating the ID of the product.
 * @prop title - A string indicating the title of the product.
 * @prop handle - A string indicating the handle of the product. The handle can be used to create slug URL paths. It can possibly be `null`.
 * @prop subtitle - A string indicating the subttle of the product. It can possibly be `null`.
 * @prop description - A string indicating the description of the product. It can possibly be `null`.
 * @prop is_giftcard - A boolean indicating whether the product is a gift card.
 * @prop status - A string indicating the status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop thumbnail - A string indicating the URL of the product's thumbnail. It can possibly be `null`.
 * @prop weight - A number indicating the weight of the product. It can possibly be `null`.
 * @prop length - A number indicating the length of the product. It can possibly be `null`.
 * @prop height - A number indicating the height of the product. It can possibly be `null`.
 * @prop origin_country - A string indicating the origin country of the product. It can possibly be `null`.
 * @prop hs_code - A string indicating the HS Code of the product. It can possibly be `null`.
 * @prop mid_code - A string indicating the MID Code of the product. It can possibly be `null`.
 * @prop material - A string indicating the material of the product. It can possibly be `null`.
 * @prop collection - 
 * An object of type {@link ProductCollectionDTO} that holds the data of the associated collection, if any. 
 * It may only be available if the `collection` relation is expanded.
 * @prop categories -
 * An array of objects of type {@link ProductCategoryDTO}, each object holding the data of an associated product category.
 * It may only be available if the `categories` relation is expanded.
 * @prop type -
 * An array of objects of type {@link ProductTypeDTO}, each object holding the data of an associated product type.
 * It may only be available if the `type` relation is expanded.
 * @prop tags -
 * An array of objects of type {@link ProductTagDTO}, each object holding the data of an associated product tag.
 * It may only be available if the `tags` relation is expanded.
 * @prop variants -
 * An array of objects of type {@link ProductVariantDTO}, each object holding the data of an associated product variant.
 * It may only be available if the `variants` relation is expanded.
 * @prop options -
 * An array of objects of type {@link ProductOptionDTO}, each object holding the data of an associated product option.
 * It may only be available if the `options` relation is expanded.
 * @prop images -
 * An array of images of type {@link ProductImageDTO}, each object holding the data of an associated product image.
 * It may only be available if the `images` relation is expanded.
 * @prop discountable - A boolean indicating whether the product can be discounted.
 * @prop external_id - 
 * A string used to store the ID of the product in an external system. This is useful if you're integrating the product with a third-party service and want to maintain
 * a reference to the ID in the integrated service.
 * @prop created_at - A date indicating when the product was created.
 * @prop updated_at - A date indicating when the product was updated.
 * @prop deleted_at - A date indicating when the product was deleted.
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
 * @interface
 * 
 * An object representing a product variant's data.
 * 
 * @prop id - A string indicating the ID of the product variant.
 * @prop title - A string indicating the tile of the product variant.
 * @prop sku - A string indicating the SKU of the product variant. It can possibly be `null`.
 * @prop barcode - A string indicating the barcode of the product variant. It can possibly be `null`.
 * @prop ean - A string indicating the EAN of the product variant. It can possibly be `null`.
 * @prop upc - A string indicating the UPC of the product variant. It can possibly be `null`.
 * @prop inventory_quantity - A number indicating the inventory quantiy of the product variant.
 * @prop allow_backorder - A boolean indicating whether the product variant can be ordered when it's out of stock.
 * @prop manage_inventory - A boolean indicating whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - A string indicating the HS Code of the product variant. It can possibly be `null`.
 * @prop origin_country - A string indicating the origin country of the product variant. It can possibly be `null`.
 * @prop mid_code - A string indicating the MID Code of the product variant. It can possibly be `null`.
 * @prop material - A string indicating the material of the product variant. It can possibly be `null`.
 * @prop weight - A number indicating the weight of the product variant. It can possibly be `null`.
 * @prop length - A number indicating the length of the product variant. It can possibly be `null`.
 * @prop height - A number indicating the height of the product variant. It can possibly be `null`.
 * @prop width - A number indicating the width of the product variant. It can possibly be `null`.
 * @prop options - 
 * An object of type {@link ProductOptionValueDTO} holding the data of the associated product option values.
 * It may only be available if the `options` relation is expanded.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop product - 
 * An object of type {@link ProductDTO} holding the data of the associated product.
 * It may only be available if the `product` relation is expanded.
 * @prop product_id - A string indicating the ID of the associated product.
 * @prop variant_rank - 
 * A number indicating the ranking of the variant among other variants associated with the product.
 * It can possibly be `null`.
 * @prop created_at - A date indicating when the product variant was created.
 * @prop updated_at - A date indicating when the product variant was updated.
 * @prop deleted_at - A date indicating when the product variant was deleted.
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
 * An object representing a product category's data.
 * 
 * @prop id - A string indicating the ID of the product category.
 * @prop name - A string indicating the name of the product category.
 * @prop description - A string indicating the description of the product category.
 * @prop handle - A string indicating the handle of the product category. The handle can be used to create slug URL paths.
 * @prop is_active - A boolean indicating if the product category is active.
 * @prop is_internal - A boolean indicating if the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - A number indicating the ranking of the product category among sibling categories.
 * @prop parent_category - 
 * An object of type {@link ProductCategoryDTO} holding the data of the parent category, if this category has one.
 * It may only be available if the `parent_category` relation is expanded.
 * @prop category_children -
 * An array of objects of type {@link ProductCategoryDTO}, each object holding the data of a child category, if this category has any.
 * It may only be available if the `category_children` relation is expanded.
 * @prop created_at - A date indicating when the product category was created.
 * @prop updated_at - A date indicating when the product category was updated.
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
 * An object used to specify the necessary data to create a product category.
 * 
 * @prop name - A string indicating the product category's name.
 * @prop handle - A string indicating the product category's handle.
 * @prop is_active - A boolean indicating whether the product category is active.
 * @prop is_internal - A boolean indicating whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - A number indicating the ranking of the category among sibling categories.
 * @prop parent_category_id - A string indicating the ID of the parent product category, if it has any. It may also be `null`.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
 * An object used to specify the necessary data to update a product category.
 * 
 * @prop name - A string indicating the name of the product category.
 * @prop handle - A string indicating the handle of the product category.
 * @prop is_active - A boolean indicating whether the product category is active.
 * @prop is_internal - A boolean indicating whether the product category is internal. This can be used to only show the product category to admins and hide it from customers.
 * @prop rank - A number indicating the ranking of the category among sibling categories.
 * @prop parent_category_id - A string indicating the ID of the parent product category, if it has any. It may also be `null`.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
 * An object representing a product tag's data.
 * 
 * @prop id - A string indicating the ID of the product tag.
 * @prop value - A string indicating the value of the product tag.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop products - 
 * An array of objects of type {@link ProductDTO}, each object being the product associated with the product tag. 
 * It may only be available if the `products` relation is expanded.
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
 * An object representing a product collection's data.
 * 
 * @prop id - A string indicating the ID of the product collection.
 * @prop title - A string indicating the title of the product collection.
 * @prop handle - A string indicating the handle of the product collection. The handle can be used to create slug URL paths.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop deleted_at - A date indicating when the product collection was deleted.
 * @prop products - 
 * An array of objects of type {@link ProductDTO}, each object being the product associated with the collection. 
 * It may only be available if the `products` relation is expanded.
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
 * An object representing a product type's data.
 * 
 * @prop id - A string indicating the ID of the product type.
 * @prop value - A string indicating the value of the product type.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop deleted_at - A date indicating when the product type was deleted.
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
 * An object representing a product option's data.
 * 
 * @prop id - A string indicating the ID of the product option.
 * @prop title - A string indicating the title of the product option.
 * @prop product -
 * An object of type {@link ProductDTO} holding the data of the associated product.
 * It may only be available if the `product` relation is expanded.
 * @prop values - 
 * An array of objects of type {@link ProductOptionValueDTO}, each object holding the data of an associted product option value.
 * It may only be available if the `values` relation is expanded.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop deleted_at - A date indicating when the product option was deleted.
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
 * An object representing a product image's data.
 * 
 * @prop id - A string indicating the ID of the product image.
 * @prop url - A string indicating the URL of the product image.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop deleted_at - A date indicating when the product image was deleted.
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
 * An object representing a product option value's data.
 * 
 * @prop id - A string indicating the ID of the product option value.
 * @prop value - A string indicating the value of the product option value.
 * @prop option -
 * An object of type {@link ProductOptionDTO} holding the data of the associated product option.
 * It may only be available if the `option` relation is expanded.
 * @prop variant -
 * An object of type {@link ProductVariantDTO} holding the data of the associated product variant.
 * It may only be available if the `variant` relation is expanded.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 * @prop deleted_at - A date indicating when the product option value was deleted.
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
 * An object used to filter retrieved products.
 * 
 * @prop q - A string used to filter product's attributes, including the title, description, collection title, and variants' titles and descriptions, by a query term.
 * @prop handle - A string or array of strings, each string used to filter products by their handle.
 * @prop id - A string or array of strings, each string used to filter products by their IDs.
 * @prop tags - 
 * An object used to filter a product's tags. It accepts a `value` property, whose value can be an array of strings, 
 * each string being a value to filter a product by its associated product tags' values.
 * @prop categories - 
 * An object used to filter a product's categories. It accepts an `id` property, whose value can be a string or an array of strings, each string being an ID to filter a
 * product by its associated category IDs. It also accepts an `is_internal` property, whose value can be a boolean used to filter a product by its associated category's `is_internal`
 * attribute. Additionally, it accepts an `is_active` property, whose value can be a boolean used to filter a product by its associated category's `is_active` attribute.
 * @prop category_id - A string or an array of strings, each string used to filter a product by its associated category's IDs.
 * @prop collection_id - A string or an array of strings, each string used to filter a product by its associated collection's IDs.
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
 * An object used to filter retrieved product tags.
 * 
 * @prop id - A string or an array of strings, each string used to filter product tags by their ID.
 * @prop value - A string used to filter product tags by their value.
 */
export interface FilterableProductTagProps
  extends BaseFilterable<FilterableProductTagProps> {
  id?: string | string[]
  value?: string
}

/**
 * @interface
 * 
 * An object used to filter retrieved product types.
 * 
 * @prop id - A string or an array of strings, each string used to filter product types by their ID.
 * @prop value - A string used to filter product types by their value.
 */
export interface FilterableProductTypeProps
  extends BaseFilterable<FilterableProductTypeProps> {
  id?: string | string[]
  value?: string
}

/**
 * @interface
 * 
 * An object used to filter retrieved product options.
 * 
 * @prop id - A string or an array of strings, each string used to filter product options by their ID.
 * @prop title - A string used to filter product options by their title.
 * @prop product_id - A string or an array of strings, each string used to filter product options by the ID of their associated products.
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
 * An object used to filter retrieved product collections.
 * 
 * @prop id - A string or an array of strings, each string used to filter product collections by their ID.
 * @prop title - A string used to filter product collections by their title.
 */
export interface FilterableProductCollectionProps
  extends BaseFilterable<FilterableProductCollectionProps> {
  id?: string | string[]
  title?: string
}

/**
 * @interface
 * 
 * An object used to filter retrived product variants.
 * 
 * @prop id - a string or an array of strings, each string used to filter product variants by their ID.
 * @prop sku - a string or an array of strings, each string used to filter product variants by their SKU.
 * @prop product_id - a string or an array of strings, each string used to filter product variants by the ID of their associated product.
 * @prop options - an object used to filter product variants by their associated options. It accepts the property `id` whose value is an array of strings, 
 * and each string is used to filter the associated options by their ID.
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
 * An object used to filter retrieved product categories.
 * 
 * @prop id - A string or an array of strings, each string used to filter product categories by their ID.
 * @prop name - A string or an array of strings, each string used to filter product categories by their name.
 * @prop parent_category_id - 
 * A string or an array of strings, each string used to filter product categories by the ID of their parent categories. 
 * You can also pass `null` to retrieve only categories that have no parent.
 * @prop handle - A string or an array of strings, each string used to filter product categories by their handle.
 * @prop is_active - A boolean used to filter product categories by whether they're active.
 * @prop is_internal - A boolean used to filter product categories by whether they're internal.
 */
export interface FilterableProductCategoryProps
  extends BaseFilterable<FilterableProductCategoryProps> {
  id?: string | string[]
  name?: string | string[]
  parent_category_id?: string | string[] | null
  handle?: string | string[]
  is_active?: boolean
  is_internal?: boolean
  /**
   * @ignore
   * 
   * @privateRemark
   * This property seems to be misplaced, as it can't filter product categories.
   */
  include_descendants_tree?: boolean
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product collection.
 * 
 * @prop title - A string indicating the product collection's title.
 * @prop handle - A string indicating the product collection's handle. If not provided, the value of this attribute is set to the slug version of the title.
 * @prop products - 
 * An array of objects of type {@link ProductDTO}, each being a product associated with the product collection.
 * It may only be available if the `products` relation is expanded.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 */
export interface CreateProductCollectionDTO {
  title: string
  handle?: string
  products?: ProductDTO[]
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to update a product collection. The `id` property is used to identify which product collection should be updated.
 * 
 * @prop id - A string indicating the ID of the product collection to update.
 * @prop value - A string indicating the new value of the product collection.
 * @prop title - A string indicating the new title of the product collection.
 * @prop handle - A string indicating the new handle of the product collection.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 */
export interface UpdateProductCollectionDTO {
  id: string
  value?: string
  title?: string
  handle?: string
  /**
   * @ignore
   * 
   * @privateRemarks
   * Need to look into how this can be used to update the associated products of a collection.
   */
  products?: ProductDTO[]
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product type.
 * 
 * @prop id - A string indicating the product type's ID.
 * @prop value - A string indicating the product type's value.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
 * An object used to update the data of a product type. The `id` property is used to identify which product type should be updated.
 * 
 * @prop id - A string indicating the ID of the product type to update.
 * @prop value - A string indicating the new value of the product type.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
 */
export interface UpdateProductTypeDTO {
  id: string
  value?: string
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product tag.
 * 
 * @prop value - A string indicating the value of the product tag.
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
 * An object used to update data of an existing product tag. The `id` property is used to identify which product tag should be updated.
 * 
 * @prop id - A string indicating the ID of the product tag to update.
 * @prop value - A string indicating the new value of the product tag.
 */
export interface UpdateProductTagDTO {
  id: string
  value?: string
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product option.
 * 
 * @prop title - A string indicating the product option's title.
 * @prop product_id - A string indicating the ID of the associated product.
 */
export interface CreateProductOptionDTO {
  title: string
  product_id?: string
  /**
   * @ignore
   * 
   * @privateRemark
   * Need to look into the correct typing and usage for this property before documenting it.
   */
  product?: Record<any, any>
}

export interface UpdateProductOptionDTO {
  id: string
  title?: string
  product_id?: string
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product variant option.
 * 
 * @prop value - A string indicating the value of a product variant option.
 */
export interface CreateProductVariantOptionDTO {
  value: string
}

/**
 * @interface
 * 
 * An object used to specify the necessary data to create a product variant.
 * 
 * @prop title - A string indicating the tile of the product variant.
 * @prop sku - A string indicating the SKU of the product variant.
 * @prop barcode - A string indicating the barcode of the product variant.
 * @prop ean - A string indicating the EAN of the product variant.
 * @prop upc - A string indicating the UPC of the product variant.
 * @prop allow_backorder - A boolean indicating whether the product variant can be ordered when it's out of stock.
 * @prop inventory_quantity - A number indicating the inventory quantiy of the product variant.
 * @prop manage_inventory - A boolean indicating whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - A string indicating the HS Code of the product variant.
 * @prop origin_country - A string indicating the origin country of the product variant.
 * @prop mid_code - A string indicating the MID Code of the product variant.
 * @prop material - A string indicating the material of the product variant.
 * @prop weight - A number indicating the weight of the product variant.
 * @prop length - A number indicating the length of the product variant.
 * @prop height - A number indicating the height of the product variant.
 * @prop width - A number indicating the width of the product variant.
 * @prop options - 
 * An array of objects of type {@link CreateProductVariantOptionDTO}, each holding the necessary data to create a 
 * product variant option, which is then associated with the product variant.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
 * An object used to update data of an existing product variant. The `id` property is used to identify which product variant should be updated.
 * 
 * @prop id - A string indicating the ID of the product variant to update.
 * @prop title - A string indicating the tile of the product variant.
 * @prop sku - A string indicating the SKU of the product variant.
 * @prop barcode - A string indicating the barcode of the product variant.
 * @prop ean - A string indicating the EAN of the product variant.
 * @prop upc - A string indicating the UPC of the product variant.
 * @prop allow_backorder - A boolean indicating whether the product variant can be ordered when it's out of stock.
 * @prop inventory_quantity - A number indicating the inventory quantiy of the product variant.
 * @prop manage_inventory - A boolean indicating whether the product variant's inventory should be managed by the core system.
 * @prop hs_code - A string indicating the HS Code of the product variant.
 * @prop origin_country - A string indicating the origin country of the product variant.
 * @prop mid_code - A string indicating the MID Code of the product variant.
 * @prop material - A string indicating the material of the product variant.
 * @prop weight - A number indicating the weight of the product variant.
 * @prop length - A number indicating the length of the product variant.
 * @prop height - A number indicating the height of the product variant.
 * @prop width - A number indicating the width of the product variant.
 * @prop options - 
 * An array of objects of type {@link CreateProductVariantOptionDTO}, each holding the necessary data to create a 
 * product variant option, which is then associated with the product variant.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
 * An object used to specify the necessary data to create a product.
 * 
 * @prop title - A string indicating the title of the product.
 * @prop subtitle - A string indicating the subttle of the product.
 * @prop description - A string indicating the description of the product.
 * @prop is_giftcard - A boolean indicating whether the product is a gift card.
 * @prop discountable - A boolean indicating whether the product can be discounted.
 * @prop images - 
 * Can be an array of strings or an array of objects. If an array of strings is supplied, each string is a URL of a product image.
 * If an array of objects is supplied, each object can have two properties: `id`, which is a string indicating the ID of a product image,
 * and `url` which is a string indicating the URL of the product image.
 * @prop thumbnail - A string indicating the URL of the product's thumbnail.
 * @prop handle - 
 * A string indicating the handle of the product. The handle can be used to create slug URL paths.
 * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
 * @prop status - A string indicating the status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop type - An object of type {@link CreateProductTypeDTO} used to create a product type, then associate it with the product.
 * @prop type_id - A string indicating the product type to be associated with the product.
 * @prop collection_id - A string indicating the product collection to be associated with the product.
 * @prop tags - An array of objects of type {@link CreateProductTagDTO} used to create product tags, then associate them with the product.
 * @prop categories - 
 * An array of objects used to associate product categories with a product. Each object accepts the property `id` which is a string that indicates the 
 * ID of the product category to be associated with the product.
 * @prop options - An array of objects of type {@link CreateProductOptionDTO} used to create product options, then associate them with the product.
 * @prop variants - An array of objects of type {@link CreateProductVariantDTO} used to create product variants, then associate them with the product.
 * @prop width - A number indicating the width of the product.
 * @prop height - A number indicating the height of the product.
 * @prop length - A number indicating the length of the product.
 * @prop weight - A number indicating the weight of the product.
 * @prop origin_country - A string indicating the origin country of the product.
 * @prop hs_code - A string indicating the HS Code of the product.
 * @prop material - A string indicating the material of the product.
 * @prop mid_code - A string indicating the MID Code of the product.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
  /**
   * @privateRemarks
   * 
   * This property is missing from the {@link ProductDTO} type.
   */
  width?: number
  height?: number
  length?: number
  weight?: number
  origin_country?: string
  hs_code?: string
  material?: string
  mid_code?: string
  /**
   * @privateRemarks
   * 
   * This property is missing from the {@link ProductDTO} type.
   */
  metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * An object used to update data of an existing product. The `id` property is used to identify which product should be updated.
 * 
 * @prop id - A string indicating the ID of the product to update.
 * @prop title - A string indicating the title of the product.
 * @prop subtitle - A string indicating the subttle of the product.
 * @prop description - A string indicating the description of the product.
 * @prop is_giftcard - A boolean indicating whether the product is a gift card.
 * @prop discountable - A boolean indicating whether the product can be discounted.
 * @prop images - 
 * Can be an array of strings or an array of objects. If an array of strings is supplied, each string is a URL of a product image.
 * If an array of objects is supplied, each object can have two properties: `id`, which is a string indicating the ID of a product image,
 * and `url` which is a string indicating the URL of the product image.
 * @prop thumbnail - A string indicating the URL of the product's thumbnail.
 * @prop handle - 
 * A string indicating the handle of the product. The handle can be used to create slug URL paths.
 * If not supplied, the value of the `handle` attribute of the product is set to the slug version of the `title` attribute.
 * @prop status - A string indicating the status of the product. Its value can be one of the values of the enum {@link ProductStatus}.
 * @prop type - An object of type {@link CreateProductTypeDTO} used to create a product type, then associate it with the product.
 * @prop type_id - A string indicating the product type to be associated with the product.
 * @prop collection_id - A string indicating the product collection to be associated with the product.
 * @prop tags - An array of objects of type {@link CreateProductTagDTO} used to create product tags, then associate them with the product.
 * @prop categories - 
 * An array of objects used to associate product categories with a product. Each object accepts the property `id` which is a string that indicates the 
 * ID of the product category to be associated with the product.
 * @prop options - An array of objects of type {@link CreateProductOptionDTO} used to create product options, then associate them with the product.
 * @prop variants - 
 * An array of objects of either type {@link CreateProductVariantDTO}, which is used to create a product variant and associate it with the product,
 * or {@link UpdateProductVariantDTO}, which is used to update an existing product variant that is associated with the product.
 * @prop width - A number indicating the width of the product.
 * @prop height - A number indicating the height of the product.
 * @prop length - A number indicating the length of the product.
 * @prop weight - A number indicating the weight of the product.
 * @prop origin_country - A string indicating the origin country of the product.
 * @prop hs_code - A string indicating the HS Code of the product.
 * @prop material - A string indicating the material of the product.
 * @prop mid_code - A string indicating the MID Code of the product.
 * @prop metadata - An object that can be used to hold custom data in key-value pairs.
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
