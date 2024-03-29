import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request, Response } from "express"

import { Transform, Type } from "class-transformer"
import { ProductVariantService } from "../../../../services"
import {
  DateComparisonOperator,
  NumericalComparisonOperator,
} from "../../../../types/common"
import { IsType } from "../../../../utils"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /admin/products/{id}/variants
 * operationId: "GetProductsProductVariants"
 * summary: "List a Product's Variants"
 * description: |
 *   Retrieve a list of Product Variants associated with a Product. The variants can be paginated.
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} ID of the product.
 *   - (query) id {string} IDs to filter product variants by.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product variants.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product variants.
 *   - (query) offset=0 {integer} The number of product variants to skip when retrieving the product variants.
 *   - (query) limit=100 {integer} Limit the number of product variants returned.
 *   - (query) q {string} Search term to search product variants' title, sku, and products' title.
 *   - (query) order {string} The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - (query) manage_inventory {boolean} Filter product variants by whether their inventory is managed or not.
 *   - (query) allow_backorder {boolean} Filter product variants by whether they are allowed to be backordered or not.
 *   - in: query
 *     name: inventory_quantity
 *     description: Filter by available inventory quantity
 *     schema:
 *       oneOf:
 *         - type: number
 *           description: a specific number to filter by.
 *         - type: object
 *           description: filter using less and greater than comparisons.
 *           properties:
 *             lt:
 *               type: number
 *               description: filter by inventory quantity less than this number
 *             gt:
 *               type: number
 *               description: filter by inventory quantity greater than this number
 *             lte:
 *               type: number
 *               description: filter by inventory quantity less than or equal to this number
 *             gte:
 *               type: number
 *               description: filter by inventory quantity greater than or equal to this number
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 * x-codegen:
 *   method: listVariants
 *   queryParams: AdminGetProductsVariantsParams
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/products/{id}/variants' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsListVariantsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const { skip, take } = req.listConfig

  const [variants, count] = await productVariantService.listAndCount(
    {
      product_id: id,
      ...req.filterableFields,
    },
    req.listConfig
  )

  res.json({
    count,
    variants,
    offset: skip,
    limit: take,
  })
}

export class AdminGetProductsVariantsParams {
  /**
   * IDs to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsString()
  @IsOptional()
  fields?: string

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 100
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100

  /**
   * Search term to search product variants' title, sku, and products' title.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Number filters to apply on product variants' `inventory_quantity` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  inventory_quantity?: number | NumericalComparisonOperator

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

  /**
   * Date filters to apply on the product variants' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the product variants' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
