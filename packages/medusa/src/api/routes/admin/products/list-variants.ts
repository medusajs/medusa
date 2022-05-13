import { Request, Response } from "express"
import { ProductVariantService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { ProductVariant } from "../../../../models"
import { defaultAdminGetProductsVariantsFields } from "./index"

/**
 * @oas [get] /products/{id}/variants
 * operationId: "GetProductsProductVariants"
 * summary: "List a Product's Product Variants"
 * description: "Retrieves a list of the Product Variants associated with a Product."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} Id of the product to search for the variants.
 *   - (query) fields {string} Comma separated string of the column to select.
 *   - (query) expand {string} Comma separated string of the relations to include.
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
 *             variants:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_variant"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const { expand, fields, limit, offset } = await validator(
    AdminGetProductsVariantsParams,
    req.query
  )

  const queryConfig = getRetrieveConfig<ProductVariant>(
    defaultAdminGetProductsVariantsFields as (keyof ProductVariant)[],
    [],
    [
      ...new Set([
        ...defaultAdminGetProductsVariantsFields,
        ...(fields?.split(",") ?? []),
      ]),
    ] as (keyof ProductVariant)[],
    expand ? expand?.split(",") : undefined
  )

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const [variants, count] = await productVariantService.listAndCount(
    {
      product_id: id,
    },
    {
      ...queryConfig,
      skip: offset,
      take: limit,
    }
  )

  res.json({
    count,
    variants,
    offset,
    limit,
  })
}

export class AdminGetProductsVariantsParams {
  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100
}
