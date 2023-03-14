import {
  CartService,
  PricingService,
  ProductVariantInventoryService,
  ProductVariantService,
  RegionService,
} from "../../../../services"

import { PriceSelectionParams } from "../../../../types/price-selection"
import { defaultStoreVariantRelations } from "."
import { validator } from "../../../../utils/validator"
import { IsOptional, IsString } from "class-validator"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import { FlagRouter } from "../../../../utils/flag-router"

/**
 * @oas [get] /variants/{variant_id}
 * operationId: GetVariantsVariant
 * summary: Get a Product Variant
 * description: "Retrieves a Product Variant by id"
 * parameters:
 *   - (path) variant_id=* {string} The id of the Product Variant.
 *   - (query) cart_id {string} The id of the Cart to set prices based on.
 *   - (query) sales_channel_id {string} A sales channel id for result configuration.
 *   - (query) region_id {string} The id of the Region to set prices based on.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: The 3 character ISO currency code to set prices based on.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codegen:
 *   method: retrieve
 *   queryParams: StoreGetVariantsVariantParams
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/variants/{id}'
 * tags:
 *   - Product Variant
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

  const customer_id = req.user?.customer_id

  const rawVariant = await variantService.retrieve(id, {
    relations: defaultStoreVariantRelations,
  })

  let sales_channel_id = validated.sales_channel_id
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    if (req.publishableApiKeyScopes?.sales_channel_id.length === 1) {
      sales_channel_id = req.publishableApiKeyScopes.sales_channel_id[0]
    }
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

  const variantRes = await pricingService.setVariantPrices([rawVariant], {
    cart_id: validated.cart_id,
    customer_id: customer_id,
    region_id: regionId,
    currency_code: currencyCode,
    include_discount_prices: true,
  })

  const [variant] = await productVariantInventoryService.setVariantAvailability(
    variantRes,
    sales_channel_id
  )

  res.json({ variant })
}

export class StoreGetVariantsVariantParams extends PriceSelectionParams {
  @IsString()
  @IsOptional()
  sales_channel_id?: string
}
