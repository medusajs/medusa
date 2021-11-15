import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"
import * as _ from "lodash"
import { identity } from "lodash"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products
 * operationId: "GetProducts"
 * summary: "List Product"
 * description: "Retrieves a list of Product"
 * x-authenticated: true
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

  const productService = req.scope.resolve("productService")

  const limit = validatedParams?.limit || 50
  const offset = validatedParams?.offset || 0

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
    skip: offset,
    take: limit,
  }

  const filterableFields = _.omit(validatedParams, [
    "limit",
    "offset",
    "expand",
    "fields",
    "order",
  ])

  const [products, count] = await productService.listAndCount(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.json({ products, count, offset, limit })
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
  offset?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number

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

  @IsString()
  @IsOptional()
  created_at?: string

  @IsString()
  @IsOptional()
  updated_at?: string

  @IsString()
  @IsOptional()
  deleted_at?: string
}
