import { Type } from "class-transformer"
import { pickBy } from "lodash"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { ProductStatus } from "../../../../models"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { FilterableProductProps } from "../../../../types/product"
import PriceListService from "../../../../services/price-list"
import { Request } from "express"

/**
 * @oas [get] /price-lists/:id/products
 * operationId: "GetPriceListsPriceListProducts"
 * summary: "List Product in a Price List"
 * description: "Retrieves a list of Product that are part of a Price List"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching products.
 *   - (query) id {string} Id of the product to search for.
 *   - (query) status {string[]} Status to search for.
 *   - (query) collection_id {string[]} Collection ids to search for.
 *   - (query) tags {string[]} Tags to search for.
 *   - (query) title {string} to search for.
 *   - (query) description {string} to search for.
 *   - (query) handle {string} to search for.
 *   - (query) is_giftcard {string} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} to search for.
 *   - (query) order {string} to retrieve products in.
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting products was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting products was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting products was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
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
 *             count:
 *               description: The number of Products.
 *               type: integer
 *             offset:
 *               description: The offset of the Product query.
 *               type: integer
 *             limit:
 *               description: The limit of the Product query.
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
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
