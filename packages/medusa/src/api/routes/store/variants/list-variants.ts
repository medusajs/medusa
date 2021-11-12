import { IsNumberString, IsOptional, IsString } from "class-validator"
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
  const validatedQuery = await validator(StoreGetVariantsParams, req.query)
  const limit = validatedQuery.limit ? parseInt(validatedQuery.limit) : 100
  const offset = validatedQuery.offset ? parseInt(validatedQuery.offset) : 0

  let expandFields: string[] = []
  if (validatedQuery.expand) {
    expandFields = validatedQuery.expand.split(",")
  }

  let selector = {}
  const listConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultStoreVariantRelations,
    skip: offset,
    take: limit,
  }

  if (validatedQuery.ids) {
    selector = { id: validatedQuery.ids.split(",") }
  }

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const variants = await variantService.list(selector, listConfig)

  res.json({ variants })
}

export class StoreGetVariantsParams {
  @IsOptional()
  @IsNumberString()
  limit?: string

  @IsOptional()
  @IsNumberString()
  offset?: string

  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  ids?: string
}
