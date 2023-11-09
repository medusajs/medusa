import {
  CartService,
  PricingService,
  ProductVariantInventoryService,
  ProductVariantService,
  RegionService,
} from "../../../../services"
import { IsInt, IsOptional, IsString } from "class-validator"

import { IsType } from "../../../../utils/validators/is-type"
import { NumericalComparisonOperator } from "../../../../types/common"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { promiseAll } from "@medusajs/utils"

/**
 * @oas [get] /store/variants
 * operationId: GetVariants
 * summary: Get Product Variants
 * description: |
 *   Retrieves a list of product variants. The product variants can be filtered by fields such as `id` or `title`. The product variants can also be paginated.
 *
 *   For accurate and correct pricing of the product variants based on the customer's context, it's highly recommended to pass fields such as
 *   `region_id`, `currency_code`, and `cart_id` when available.
 *
 *   Passing `sales_channel_id` ensures retrieving only variants of products available in the specified sales channel.
 *   You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 * externalDocs:
 *   description: "How to pass product pricing parameters"
 *   url: "https://docs.medusajs.com/modules/products/storefront/show-products#product-pricing-parameters"
 * parameters:
 *   - (query) ids {string} Filter by a comma-separated list of IDs. If supplied, it overrides the `id` parameter.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by one or more IDs. If `ids` is supplied, it's overrides the value of this parameter.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: Filter by an ID.
 *         - type: array
 *           description: Filter by IDs.
 *           items:
 *             type: string
 *   - (query) sales_channel_id {string} "Filter by sales channel IDs. When provided, only products available in the selected sales channels are retrieved. Alternatively, you can pass a
 *      publishable API key in the request header and this will have the same effect."
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned product variants.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned product variants.
 *   - (query) offset=0 {number} The number of products to skip when retrieving the product variants.
 *   - (query) limit=100 {number} Limit the number of product variants returned.
 *   - (query) cart_id {string} The ID of the cart. This is useful for accurate pricing based on the cart's context.
 *   - (query) region_id {string} The ID of the region. This is useful for accurate pricing based on the selected region.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: A 3 character ISO currency code. This is useful for accurate pricing based on the selected currency.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 *   - in: query
 *     name: title
 *     style: form
 *     explode: false
 *     description: Filter by title
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: a single title to filter by
 *         - type: array
 *           description: multiple titles to filter by
 *           items:
 *             type: string
 *   - in: query
 *     name: inventory_quantity
 *     description: Filter by available inventory quantity
 *     schema:
 *       oneOf:
 *         - type: number
 *           description: A specific number to filter by.
 *         - type: object
 *           description: Filter using less and greater than comparisons.
 *           properties:
 *             lt:
 *               type: number
 *               description: Filter by inventory quantity less than this number
 *             gt:
 *               type: number
 *               description: Filter by inventory quantity greater than this number
 *             lte:
 *               type: number
 *               description: Filter by inventory quantity less than or equal to this number
 *             gte:
 *               type: number
 *               description: Filter by inventory quantity greater than or equal to this number
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetVariantsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.product.variants.list()
 *       .then(({ variants }) => {
 *         console.log(variants.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/variants'
 * tags:
 *   - Product Variants
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreVariantsListRes"
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

  const customer_id = req.user?.customer_id

  let {
    cart_id,
    region_id,
    currency_code,
    sales_channel_id,
    ids,
    ...filterableFields
  } = req.filterableFields

  if (validated.ids) {
    filterableFields["id"] = validated.ids.split(",")
  }

  if (req.publishableApiKeyScopes?.sales_channel_ids.length === 1) {
    sales_channel_id = req.publishableApiKeyScopes.sales_channel_ids[0]
  }

  const pricingService: PricingService = req.scope.resolve("pricingService")
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const cartService: CartService = req.scope.resolve("cartService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")

  const variants = await variantService.list(filterableFields, req.listConfig)

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

  const decoratePromises: Promise<any>[] = []

  decoratePromises.push(
    (await pricingService.setVariantPrices(variants, {
      cart_id: validated.cart_id,
      region_id: regionId,
      currency_code: currencyCode,
      customer_id: customer_id,
      include_discount_prices: true,
    })) as any
  )

  decoratePromises.push(
    (await productVariantInventoryService.setVariantAvailability(
      variants,
      sales_channel_id
    )) as any
  )
  await promiseAll(decoratePromises)

  res.json({ variants })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved product variants.
 */
export class StoreGetVariantsParams extends PriceSelectionParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 100
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 100

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  /**
   * ID to filter the product variants by.
   */
  @IsOptional()
  @IsString()
  ids?: string

  /**
   * Filter product variants by the ID of their associated sales channel.
   */
  @IsOptional()
  @IsString()
  sales_channel_id?: string

  /**
   * IDs to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Titles to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  title?: string | string[]

  /**
   * Number filters to apply on the product variants' `inventory_quantity` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  inventory_quantity?: number | NumericalComparisonOperator
}
