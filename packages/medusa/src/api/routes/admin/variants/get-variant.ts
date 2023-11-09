import { PricingService, ProductVariantService } from "../../../../services"

import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/variants/{id}
 * operationId: "GetVariantsVariant"
 * summary: "Get a Product variant"
 * description: "Retrieve a product variant's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the product variant.
 *   - (query) expand {string} "Comma-separated relations that should be expanded in the returned product variant."
 *   - (query) fields {string} "Comma-separated fields that should be included in the returned product variant."
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
 *       medusa.admin.variants.retrieve(variantId)
 *       .then(({ variant }) => {
 *         console.log(variant.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/variants/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Variants
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

  const [variant] = await pricingService.setAdminVariantPricing([rawVariant])

  res.status(200).json({ variant })
}

export class AdminGetVariantParams extends FindParams {}
