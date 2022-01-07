import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { omit, pickBy, identity } from "lodash"
import { defaultStoreProductsRelations } from "."
import { ProductService } from "../../../../services"
import { DateComparisonOperator } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products
 * operationId: GetProducts
 * summary: List Products
 * description: "Retrieves a list of Products."
 * parameters:
 *   - (query) q {string} Query used for searching products.
 *   - (query) id {string} Id of the product to search for.
 *   - (query) collection_id {string[]} Collection ids to search for.
 *   - (query) tags {string[]} Tags to search for.
 *   - (query) title {string} to search for.
 *   - (query) description {string} to search for.
 *   - (query) handle {string} to search for.
 *   - (query) is_giftcard {string} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} to search for.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting products was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting products was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
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
 *               description: The total number of Products.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Products to return,
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const validated = await validator(StoreGetProductsParams, req.query)

  const filterableFields = omit(validated, ["limit", "offset"])

  if (validated.is_giftcard && validated.is_giftcard === true) {
    filterableFields.is_giftcard = validated.is_giftcard
  }

  filterableFields.status = ["published"]

  const listConfig = {
    relations: defaultStoreProductsRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const [products, count] = await productService.listAndCount(
    pickBy(filterableFields, identity),
    listConfig
  )

  res.json({
    products,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class StoreGetProductsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100
}

export class StoreGetProductsParams extends StoreGetProductsPaginationParams {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  status = ["published"]

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
  is_giftcard?: boolean

  @IsString()
  @IsOptional()
  type?: string

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
