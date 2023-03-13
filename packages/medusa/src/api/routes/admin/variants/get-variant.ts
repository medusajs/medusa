import { PricingService, ProductVariantService } from "../../../../services"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/variants/{id}
 * operationId: "GetVariantsVariant"
 * summary: "Get a Product variant"
 * description: "Retrieves a Product variant."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the variant.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded the order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included the order of the result.
 * x-codegen:
 *   method: retrieve
 *   queryParams: AdminGetVariantParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.variants.retrieve(product_id)
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/variants/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminVariantsRes"
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
  const { id } = req.params

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const rawVariant = await productVariantService.retrieve(
    id,
    req.retrieveConfig
  )

  const [variant] = await pricingService.setVariantPrices([rawVariant])

  res.status(200).json({ variant })
}

export class AdminGetVariantParams extends FindParams {}
