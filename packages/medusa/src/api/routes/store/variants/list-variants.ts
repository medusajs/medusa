import { Type } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { defaultStoreVariantRelations } from "."
import ProductVariantService from "../../../../services/product-variant"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /variants
 * operationId: GetVariants
 * summary: Retrieve Product Variants
 * description: "Retrieves a list of Product Variants"
 * parameters:
 *   - (query) ids {string} A comma separated list of Product Variant ids to filter by.
 *   - (query) expand {string} A comma separated list of Product Variant relations to load.
 *   - (query) offset {number}
 *   - (query) limit {number} Maximum number of Product Variants to return.
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
  const { limit, offset, expand, ids } = await validator(
    StoreGetVariantsParams,
    req.query
  )

  let expandFields: string[] = []
  if (expand) {
    expandFields = expand.split(",")
  }

  let selector = {}
  const listConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultStoreVariantRelations,
    skip: offset,
    take: limit,
  }

  if (ids) {
    selector = { id: ids.split(",") }
  }

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const variants = await variantService.list(selector, listConfig)

  res.json({ variants })
}

export class StoreGetVariantsParams {
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100

  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  ids?: string
}
