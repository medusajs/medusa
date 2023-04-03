import { IsBooleanString, IsOptional, IsString } from "class-validator"
import { PricingService, ProductService } from "../../../../services"
import ShippingOptionService from "../../../../services/shipping-option"
import { validator } from "../../../../utils/validator"
import { defaultRelations } from "."

/**
 * @oas [get] /store/shipping-options
 * operationId: GetShippingOptions
 * summary: Get Shipping Options
 * description: "Retrieves a list of Shipping Options."
 * parameters:
 *   - (query) is_return {boolean} Whether return Shipping Options should be included. By default all Shipping Options are returned.
 *   - (query) product_ids {string} A comma separated list of Product ids to filter Shipping Options by.
 *   - (query) region_id {string} the Region to retrieve Shipping Options from.
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/shipping-options'
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
    const prods = await productService.list({ id: productIds })
    query.profile_id = prods.map((p) => p.profile_id)
  }

  const options = await shippingOptionService.list(query, {
    relations: defaultRelations,
  })

  const data = await pricingService.setShippingOptionPrices(options)

  res.status(200).json({ shipping_options: data })
}

export class StoreGetShippingOptionsParams {
  @IsOptional()
  @IsString()
  product_ids?: string

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsBooleanString()
  is_return?: string
}
