import { Type } from "class-transformer"
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"
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

  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

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

  const [products, count] = await productService.listAndCount(
    validatedParams,
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

export class AdminGetProductsParams {
  @IsNumber()
  @IsString()
  @IsOptional()
  id?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @IsNumber()
  @IsString()
  @IsOptional()
  collection?: string[]

  @IsNumber()
  @IsString()
  @IsOptional()
  tags?: string[]

  @IsNumber()
  @IsString()
  @IsOptional()
  title?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsString()
  @IsOptional()
  is_giftcard?: boolean

  @IsString()
  @IsOptional()
  type?: string

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

  @IsNumber()
  @IsString()
  @IsOptional()
  order?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  created_at?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  updated_at?: string

  @IsNumber()
  @IsString()
  @IsOptional()
  deleted_at?: string
}
