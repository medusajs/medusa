import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import * as _ from "lodash"
import { identity } from "lodash"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService } from "../../../../services"
import { DateComparisonOperator } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products
 * operationId: "GetProducts"
 * summary: "List Product"
 * description: "Retrieves a list of Product"
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
export default async (req, res) => {
  const validatedParams = await validator(AdminGetProductsParams, req.query)

  const productService: ProductService = req.scope.resolve("productService")

  let includeFields: string[] = []
  if (validatedParams.fields) {
    includeFields = validatedParams.fields!.split(",")
  }

  let expandFields: string[] = []
  if (validatedParams.expand) {
    expandFields = validatedParams.expand!.split(",")
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultAdminProductFields,
    relations: expandFields.length
      ? expandFields
      : defaultAdminProductRelations,
    skip: validatedParams.offset,
    take: validatedParams.limit,
  }

  const filterableFields = _.omit(validatedParams, [
    "limit",
    "offset",
    "expand",
    "fields",
    "order",
  ])

  const [products, count] = await productService.listAndCount(
    _.pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  res.json({
    products,
    count,
    offset: validatedParams.offset,
    limit: validatedParams.limit,
  })
}

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export class AdminGetProductsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}

export class AdminGetProductsParams extends AdminGetProductsPaginationParams {
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
