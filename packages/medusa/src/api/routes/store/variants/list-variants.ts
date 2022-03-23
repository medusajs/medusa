import { Type } from "class-transformer"
import { omit } from "lodash"
import { IsInt, IsOptional, IsString } from "class-validator"
import { defaultStoreVariantRelations } from "."
import { FilterableProductVariantProps } from "../../../../types/product-variant"
import ProductVariantService from "../../../../services/product-variant"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"
import { NumericalComparisonOperator } from "../../../../types/common"
import { PriceSelectionParams } from "../../../../types/price-selection"

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
  const validated = await validator(StoreGetVariantsParams, req.query)
  const { expand, offset, limit } = validated

  let expandFields: string[] = []
  if (expand) {
    expandFields = expand.split(",")
  }

  const customer_id = req.user?.customer_id

  const listConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultStoreVariantRelations,
    skip: offset,
    take: limit,
    cart_id: validated.cart_id,
    region_id: validated.region_id,
    currency_code: validated.currency_code,
    customer_id: customer_id,
    include_discount_prices: true,
  }

  const filterableFields: FilterableProductVariantProps = omit(validated, [
    "ids",
    "limit",
    "offset",
    "expand",
    "cart_id",
    "region_id",
    "currency_code",
  ])

  if (validated.ids) {
    filterableFields.id = validated.ids.split(",")
  }

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const variants = await variantService.list(filterableFields, listConfig)

  res.json({ variants })
}

export class StoreGetVariantsParams extends PriceSelectionParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 100

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  ids?: string

  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  title?: string | string[]

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  inventory_quantity?: number | NumericalComparisonOperator
}
