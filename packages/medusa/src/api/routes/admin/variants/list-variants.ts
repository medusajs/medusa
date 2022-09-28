import { IsInt, IsOptional, IsString } from "class-validator"
import { defaultAdminVariantFields, defaultAdminVariantRelations } from "./"

import { Type } from "class-transformer"
import { omit } from "lodash"
import { ProductVariant } from "../../../../models/product-variant"
import {
  CartService,
  PricingService,
  RegionService,
} from "../../../../services"
import ProductVariantService from "../../../../services/product-variant"
import {
  FindConfig,
  NumericalComparisonOperator,
} from "../../../../types/common"
import { AdminPriceSelectionParams } from "../../../../types/price-selection"
import { FilterableProductVariantProps } from "../../../../types/product-variant"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /variants
 * operationId: "GetVariants"
 * summary: "List Product Variants"
 * description: "Retrieves a list of Product Variants"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} A Product Variant id to filter by.
 *   - (query) ids {string} A comma separated list of Product Variant ids to filter by.
 *   - (query) expand {string} A comma separated list of Product Variant relations to load.
 *   - (query) fields {string} A comma separated list of Product Variant fields to include.
 *   - (query) offset=0 {number} How many product variants to skip in the result.
 *   - (query) limit=100 {number} Maximum number of Product Variants to return.
 *   - (query) cart_id {string} The id of the cart to use for price selection.
 *   - (query) region_id {string} The id of the region to use for price selection.
 *   - (query) currency_code {string} The currency code to use for price selection.
 *   - (query) customer_id {string} The id of the customer to use for price selection.
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
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.variants.list()
 *       .then(({ variants, limit, offset, count }) => {
 *         console.log(variants.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/variants' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
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
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")

  const validated = await validator(AdminGetVariantsParams, req.query)

  const { expand, offset, limit } = validated

  let expandFields: string[] = []
  if (expand) {
    expandFields = expand.split(",")
  }

  let includeFields: (keyof ProductVariant)[] = []
  if (validated.fields) {
    const set = new Set(validated.fields.split(",")) as Set<
      keyof ProductVariant
    >
    set.add("id")
    includeFields = [...set]
  }

  const filterableFields: FilterableProductVariantProps = omit(validated, [
    "ids",
    "limit",
    "offset",
    "expand",
    "cart_id",
    "region_id",
    "currency_code",
    "customer_id",
  ])

  const listConfig: FindConfig<ProductVariant> = {
    select: includeFields.length ? includeFields : defaultAdminVariantFields,
    relations: expandFields.length
      ? expandFields
      : defaultAdminVariantRelations,
    skip: offset,
    take: limit,
  }

  const [rawVariants, count] = await variantService.listAndCount(
    filterableFields,
    listConfig
  )

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
    customer_id: validated.customer_id,
    include_discount_prices: true,
  })

  res.json({ variants, count, offset, limit })
}

export class AdminGetVariantsParams extends AdminPriceSelectionParams {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @IsString()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string

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
