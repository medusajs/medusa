import { IsInt, IsOptional, IsString } from "class-validator"
import {
  CartService,
  PricingService,
  ProductVariantService,
  RegionService,
} from "../../../../services"

import { Type } from "class-transformer"
import { omit } from "lodash"
import { defaultStoreVariantRelations } from "."
import { NumericalComparisonOperator } from "../../../../types/common"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { FilterableProductVariantProps } from "../../../../types/product-variant"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /variants
 * operationId: GetVariants
 * summary: Get Product Variants
 * description: "Retrieves a list of Product Variants"
 * parameters:
 *   - (query) ids {string} A comma separated list of Product Variant ids to filter by.
 *   - (query) expand {string} A comma separated list of Product Variant relations to load.
 *   - (query) offset=0 {number} How many product variants to skip in the result.
 *   - (query) limit=100 {number} Maximum number of Product Variants to return.
 *   - in: query
 *     name: title
 *     style: form
 *     explode: false
 *     description: product variant title to search for.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: a single title to search by
 *         - type: array
 *           description: multiple titles to search by
 *           items:
 *             type: string
 *   - in: query
 *     name: inventory_quantity
 *     description: Filter by available inventory quantity
 *     schema:
 *       oneOf:
 *         - type: number
 *           description: a specific number to search by.
 *         - type: object
 *           description: search using less and greater than comparisons.
 *           properties:
 *             lt:
 *               type: number
 *               description: filter by inventory quantity less than this number
 *             gt:
 *               type: number
 *               description: filter by inventory quantity greater than this number
 *             lte:
 *               type: number
 *               description: filter by inventory quantity less than or equal to this number
 *             gte:
 *               type: number
 *               description: filter by inventory quantity greater than or equal to this number
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/variants'
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
 *                 allOf:
 *                   - $ref: "#/components/schemas/product_variant"
 *                   - $ref: "#/components/schemas/product_variant_prices_fields"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
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

  const pricingService: PricingService = req.scope.resolve("pricingService")
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")

  const rawVariants = await variantService.list(filterableFields, listConfig)

  let regionId = validated.region_id
  let currencyCode = validated.currency_code
  if (validated.cart_id) {
    const cart = await cartService.retrieve(validated.cart_id, {
      select: ["id", "region_id"],
    })
    const region = await regionService.retrieve(cart.region_id, {
      select: ["id", "currency_code"],
    })
    regionId = region.id
    currencyCode = region.currency_code
  }

  const variants = await pricingService.setVariantPrices(rawVariants, {
    cart_id: validated.cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    customer_id: customer_id,
    include_discount_prices: true,
  })

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
