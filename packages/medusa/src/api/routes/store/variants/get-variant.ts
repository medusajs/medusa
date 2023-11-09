import {
  CartService,
  PricingService,
  ProductVariantInventoryService,
  ProductVariantService,
  RegionService,
} from "../../../../services"
import { IsOptional, IsString } from "class-validator"

import { PriceSelectionParams } from "../../../../types/price-selection"
import { validator } from "../../../../utils/validator"
import { promiseAll } from "@medusajs/utils"

/**
 * @oas [get] /store/variants/{id}
 * operationId: GetVariantsVariant
 * summary: Get a Product Variant
 * description: |
 *   Retrieve a Product Variant's details. For accurate and correct pricing of the product variant based on the customer's context, it's highly recommended to pass fields such as
 *   `region_id`, `currency_code`, and `cart_id` when available.
 *
 *   Passing `sales_channel_id` ensures retrieving only variants of products available in the current sales channel.
 *   You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 * externalDocs:
 *   description: "How to pass product pricing parameters"
 *   url: "https://docs.medusajs.com/modules/products/storefront/show-products#product-pricing-parameters"
 * parameters:
 *   - (path) id=* {string} The ID of the Product Variant.
 *   - (query) sales_channel_id {string} The ID of the sales channel the customer is viewing the product variant from.
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
 * x-codegen:
 *   method: retrieve
 *   queryParams: StoreGetVariantsVariantParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.product.variants.retrieve(productVariantId)
 *       .then(({ variant }) => {
 *         console.log(variant.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/variants/{id}'
 * tags:
 *   - Product Variants
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreVariantsRes"
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
  const { id } = req.params

  const validated = await validator(StoreGetVariantsVariantParams, req.query)

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")

  const customer_id = req.user?.customer_id

  const variant = await variantService.retrieve(id, req.retrieveConfig)

  let sales_channel_id = validated.sales_channel_id
  if (req.publishableApiKeyScopes?.sales_channel_ids.length === 1) {
    sales_channel_id = req.publishableApiKeyScopes.sales_channel_ids[0]
  }

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
    (await pricingService.setVariantPrices([variant], {
      cart_id: validated.cart_id,
      customer_id: customer_id,
      region_id: regionId,
      currency_code: currencyCode,
      include_discount_prices: true,
    })) as any
  )

  decoratePromises.push(
    (await productVariantInventoryService.setVariantAvailability(
      [variant],
      sales_channel_id
    )) as any
  )

  await promiseAll(decoratePromises)

  res.json({ variant })
}

export class StoreGetVariantsVariantParams extends PriceSelectionParams {
  @IsString()
  @IsOptional()
  sales_channel_id?: string
}
