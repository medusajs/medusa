import { OperatorMap } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { ProductTagReq, ProductTypeReq } from "../../../types/product"
import { OperatorMapValidator } from "../../../types/validators/operator-map"
import { IsType } from "../../../utils"
import { optionalBooleanMapper } from "../../../utils/validators/is-boolean"

export class AdminGetProductsProductParams extends FindParams {}
export class AdminGetProductsProductVariantsVariantParams extends FindParams {}
export class AdminGetProductsProductOptionsOptionParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved regions.
 */
export class AdminGetProductsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  // TODO: Will search be handled the same way? Should it be part of the `findParams` class instead, or the mixin?
  /**
   * Search term to search products' title, description, variants' title and sku, and collections' title.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * IDs to filter products by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Statuses to filter products by.
   */
  @IsOptional()
  @IsEnum(ProductStatus, { each: true })
  status?: ProductStatus[]

  /**
   * Title to filter products by.
   */
  @IsString()
  @IsOptional()
  title?: string

  /**
   * Handle to filter products by.
   */
  @IsString()
  @IsOptional()
  handle?: string

  // TODO: Should we remove this? It makes sense for search, but not for equality comparison
  /**
   * Description to filter products by.
   */
  @IsString()
  @IsOptional()
  description?: string

  /**
   * Filter products by whether they're gift cards.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  is_giftcard?: boolean

  /**
   * Filter products by their associated price lists' ID.
   */
  @IsOptional()
  @IsArray()
  price_list_id?: string[]

  /**
   * Filter products by their associated product collection's ID.
   */
  @IsArray()
  @IsOptional()
  collection_id?: string[]

  /**
   * Filter products by their associated tags' value.
   */
  @IsArray()
  @IsOptional()
  tags?: string[]

  /**
   * Filter products by their associated product type's ID.
   */
  @IsArray()
  @IsOptional()
  type_id?: string[]

  // /**
  //  * Filter products by their associated sales channels' ID.
  //  */
  // @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [IsOptional(), IsArray()])
  // sales_channel_id?: string[]

  // /**
  //  * Filter products by their associated discount condition's ID.
  //  */
  // @IsString()
  // @IsOptional()
  // discount_condition_id?: string

  // /**
  //  * Filter products by their associated product category's ID.
  //  */
  // @IsArray()
  // @IsOptional()
  // category_id?: string[]

  // /**
  //  * Whether to include product category children in the response.
  //  *
  //  * @featureFlag product_categories
  //  */
  // @IsBoolean()
  // @IsOptional()
  // @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  // include_category_children?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // Note: These are new in v2
  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsParams)
  $and?: AdminGetProductsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsParams)
  $or?: AdminGetProductsParams[]
}

export class AdminGetProductsVariantsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  // TODO: Will search be handled the same way? Should it be part of the `findParams` class instead, or the mixin?
  /**
   * Search term to search product variants' title, sku, and products' title.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * IDs to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Filter product variants by whether their inventory is managed or not.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  manage_inventory?: boolean

  /**
   * Filter product variants by whether they are allowed to be backordered or not.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  allow_backorder?: boolean

  // TODO: The OperatorMap and DateOperator are slightly different, so the date comparisons is a breaking change.
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  created_at?: OperatorMap<string>

  @IsOptional()
  @ValidateNested()
  @Type(() => OperatorMapValidator)
  updated_at?: OperatorMap<string>

  @ValidateNested()
  @IsOptional()
  @Type(() => OperatorMapValidator)
  deleted_at?: OperatorMap<string>

  // Note: These are new in v2
  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsVariantsParams)
  $and?: AdminGetProductsVariantsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsVariantsParams)
  $or?: AdminGetProductsVariantsParams[]
}

// Note: This model and endpoint are new in v2
export class AdminGetProductsOptionsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  @IsOptional()
  @IsString()
  title?: string

  // Note: These are new in v2
  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsOptionsParams)
  $and?: AdminGetProductsOptionsParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetProductsOptionsParams)
  $or?: AdminGetProductsOptionsParams[]
}

export class AdminPostProductsReq {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  is_giftcard = false

  @IsBoolean()
  discountable = true

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT

  @IsOptional()
  @Type(() => ProductTypeReq)
  @ValidateNested()
  type?: ProductTypeReq

  @IsOptional()
  @IsString()
  collection_id?: string

  @IsOptional()
  @Type(() => ProductTagReq)
  @ValidateNested({ each: true })
  @IsArray()
  tags?: ProductTagReq[]

  // @IsOptional()
  // @Type(() => ProductProductCategoryReq)
  // @ValidateNested({ each: true })
  // @IsArray()
  // categories?: ProductProductCategoryReq[]

  // TODO: Deal with in next iteration
  // @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
  //   IsOptional(),
  //   Type(() => ProductSalesChannelReq),
  //   ValidateNested({ each: true }),
  //   IsArray(),
  // ])
  // sales_channels?: ProductSalesChannelReq[]

  @IsOptional()
  @Type(() => AdminPostProductsProductOptionsReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: AdminPostProductsProductOptionsReq[]

  @IsOptional()
  @Type(() => AdminPostProductsProductVariantsReq)
  @ValidateNested({ each: true })
  @IsArray()
  variants?: AdminPostProductsProductVariantsReq[]

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostProductsProductReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  discountable?: boolean

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsEnum(ProductStatus)
  @NotEquals(null)
  @ValidateIf((_, value) => value !== undefined)
  status?: ProductStatus

  // TODO: Deal with in next iteration
  // @IsOptional()
  // @Type(() => ProductTypeReq)
  // @ValidateNested()
  // type?: ProductTypeReq

  @IsOptional()
  @IsString()
  collection_id?: string

  @IsOptional()
  @Type(() => ProductTagReq)
  @ValidateNested({ each: true })
  @IsArray()
  tags?: ProductTagReq[]

  // @IsOptional()
  // @Type(() => ProductProductCategoryReq)
  // @ValidateNested({ each: true })
  // @IsArray()
  // categories?: ProductProductCategoryReq[]

  // @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
  //   IsOptional(),
  //   Type(() => ProductSalesChannelReq),
  //   ValidateNested({ each: true }),
  //   IsArray(),
  // ])
  // sales_channels?: ProductSalesChannelReq[] | null

  // TODO: Should we remove this on update?
  // @IsOptional()
  // @Type(() => ProductVariantReq)
  // @ValidateNested({ each: true })
  // @IsArray()
  // variants?: ProductVariantReq[]

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostProductsProductVariantsReq {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  ean?: string

  @IsString()
  @IsOptional()
  upc?: string

  @IsString()
  @IsOptional()
  barcode?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsNumber()
  @IsOptional()
  inventory_quantity?: number = 0

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean

  @IsBoolean()
  @IsOptional()
  manage_inventory?: boolean = true

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  // TODO: Add on next iteration
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ProductVariantPricesCreateReq)
  // prices: ProductVariantPricesCreateReq[]

  @IsOptional()
  @IsObject()
  options?: Record<string, string>
}

export class AdminPostProductsProductVariantsVariantReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  ean?: string

  @IsString()
  @IsOptional()
  upc?: string

  @IsString()
  @IsOptional()
  barcode?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsNumber()
  @IsOptional()
  inventory_quantity?: number

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean

  @IsBoolean()
  @IsOptional()
  manage_inventory?: boolean

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  // TODO: Deal with in next iteration
  // @IsArray()
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => ProductVariantPricesUpdateReq)
  // prices?: ProductVariantPricesUpdateReq[]

  @IsOptional()
  @IsObject()
  options?: Record<string, string>
}

export class AdminPostProductsProductOptionsReq {
  @IsString()
  title: string

  @IsArray()
  values: string[]
}

export class AdminPostProductsProductOptionsOptionReq {
  @IsString()
  title: string

  @IsArray()
  values: string[]
}
