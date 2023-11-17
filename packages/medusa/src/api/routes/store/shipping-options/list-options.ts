import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { IsBooleanString, IsOptional, IsString } from "class-validator"
import { defaultRelations } from "."
import {
  PricingService,
  ProductService,
  ShippingProfileService,
} from "../../../../services"
import ShippingOptionService from "../../../../services/shipping-option"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /store/shipping-options
 * operationId: GetShippingOptions
 * summary: Get Shipping Options
 * description: "Retrieve a list of Shipping Options."
 * parameters:
 *   - (query) is_return {boolean} Whether return shipping options should be included. By default, all shipping options are returned.
 *   - (query) product_ids {string} "Comma-separated list of Product IDs to filter Shipping Options by. If provided, only shipping options that can be used with the provided products are retrieved."
 *   - (query) region_id {string} "The ID of the region that the shipping options belong to. If not provided, all shipping options are retrieved."
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetShippingOptionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.shippingOptions.list()
 *       .then(({ shipping_options }) => {
 *         console.log(shipping_options.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/shipping-options'
 * tags:
 *   - Shipping Options
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreShippingOptionsListRes"
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
  const validated = await validator(StoreGetShippingOptionsParams, req.query)

  const productIds =
    (validated.product_ids && validated.product_ids.split(",")) || []
  const regionId = validated.region_id
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const shippingOptionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  // should be selector
  const query: Record<string, unknown> = {}

  if ("is_return" in req.query) {
    query.is_return = validated.is_return === "true"
  }

  if (regionId) {
    query.region_id = regionId
  }

  query.admin_only = false

  if (productIds.length) {
    if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
      const productShippinProfileMap =
        await shippingProfileService.getMapProfileIdsByProductIds(productIds)

      query.profile_id = [...productShippinProfileMap.values()]
    } else {
      const prods = await productService.list({ id: productIds })
      query.profile_id = prods.map((p) => p.profile_id)
    }
  }

  const options = await shippingOptionService.list(query, {
    relations: defaultRelations,
  })

  const data = await pricingService.setShippingOptionPrices(options)

  res.status(200).json({ shipping_options: data })
}

/**
 * Filters to apply on the retrieved shipping options.
 */
export class StoreGetShippingOptionsParams {
  /**
   * Product ID that is used to filter shipping options by whether they can be used to ship that product.
   */
  @IsOptional()
  @IsString()
  product_ids?: string

  /**
   * Filter the shipping options by the ID of their associated region.
   */
  @IsOptional()
  @IsString()
  region_id?: string

  /**
   * Filter the shipping options by whether they're return shipping options.
   */
  @IsOptional()
  @IsBooleanString()
  is_return?: string
}
