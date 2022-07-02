import { defaultAdminVariantFields, defaultAdminVariantRelations } from "./"

import { FilterableProductVariantProps } from "../../../../types/product-variant"
import { FindConfig } from "../../../../types/common"
import { ProductVariant } from "../../../../models/product-variant"
import ProductVariantService from "../../../../services/product-variant"
import { validator } from "../../../../utils/validator"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"
/**
 * @oas [get] /variants
 * operationId: "GetVariants"
 * summary: "List Product Variants."
 * description: "Retrieves a list of Product Variants"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching variants.
 *   - (query) offset {string} How many variants to skip in the result.
 *   - (query) limit {string} Limit the number of variants returned.
 * tags:
 *   - Product Variant
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
export default async (req, res) => {
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const { offset, limit, q } = await validator(
    AdminGetVariantsParams,
    req.query
  )

  const selector: FilterableProductVariantProps = {}

  if ("q" in req.query) {
    selector.q = q
  }

  const listConfig: FindConfig<ProductVariant> = {
    select: defaultAdminVariantFields,
    relations: defaultAdminVariantRelations,
    skip: offset,
    take: limit,
  }

  const [variants, count] = await variantService.listAndCount(
    selector,
    listConfig
  )

  res.json({ variants, count, offset, limit })
}

export class AdminGetVariantsParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
