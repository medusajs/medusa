import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { FilterableProductProps } from "../../../../types/product"
import PriceListService from "../../../../services/price-list"
import { ProductStatus } from "../../../../models"
import { Request } from "express"
import { Type } from "class-transformer"
import { pickBy } from "lodash"

/**
 * @oas [get] /price-lists/:id/products
 * operationId: "GetPriceListsPriceListProducts"
 * summary: "List Product in a Price List"
 * description: "Retrieves a list of Product that are part of a Price List"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching product title and description, variant title and sku, and collection title.
 *   - (query) id {string} ID of the product to search for.
 *   - in: query
 *     name: status
 *     description: Product status to search for
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [draft, proposed, published, rejected]
 *   - in: query
 *     name: collection_id
 *     description: Collection IDs to search for
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: tags
 *     description: Tag IDs to search for
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) title {string} product title to search for.
 *   - (query) description {string} product description to search for.
 *   - (query) handle {string} product handle to search for.
 *   - (query) is_giftcard {string} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} to search for.
 *   - (query) order {string} field to sort results by.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting products were created.
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
 *     description: Date comparison for when resulting products were updated.
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
 *     name: deleted_at
 *     description: Date comparison for when resulting products were deleted.
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
 *   - (query) offset=0 {integer} How many products to skip in the result.
 *   - (query) limit=50 {integer} Limit the number of products returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req: Request, res) => {
  const { id } = req.params
  const { offset, limit } = req.validatedQuery

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const filterableFields: FilterableProductProps = {
    ...req.filterableFields,
    price_list_id: [id],
  }

  const [products, count] = await priceListService.listProducts(
    id,
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    req.listConfig
  )

  res.json({
    products,
    count,
    offset,
    limit,
  })
}

export class AdminGetPriceListsPriceListProductsParams extends extendedFindParamsMixin(
  { limit: 50 }
) {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsEnum(ProductStatus, { each: true })
  status?: ProductStatus[]

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_giftcard?: string

  @IsString()
  @IsOptional()
  type?: string

  @IsString()
  @IsOptional()
  order?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}
