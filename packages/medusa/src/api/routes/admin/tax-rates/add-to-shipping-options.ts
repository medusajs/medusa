import { IsArray } from "class-validator"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/tax-rates/{id}/shipping-options/batch
 * operationId: "PostTaxRatesTaxRateShippingOptions"
 * summary: "Add to Shipping Options"
 * description: "Associates a Tax Rate with a list of Shipping Options."
 * parameters:
 *   - (path) id=* {string} ID of the tax rate.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned tax rate.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned tax rate.
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostTaxRatesTaxRateShippingOptionsReq"
 * x-codegen:
 *   method: addShippingOptions
 *   queryParams: AdminPostTaxRatesTaxRateShippingOptionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.addShippingOptions(taxRateId, {
 *         shipping_options: [
 *           shippingOptionId
 *         ]
 *       })
 *       .then(({ tax_rate }) => {
 *         console.log(tax_rate.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/admin/tax-rates/{id}/shipping-options/batch' \
 *       -H 'Authorization: Bearer {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *          "shipping_options": [
 *            "{shipping_option_id}"
 *          ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Tax Rates
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTaxRatesRes"
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
  const value = await validator(
    AdminPostTaxRatesTaxRateShippingOptionsReq,
    req.body
  )

  const query = await validator(
    AdminPostTaxRatesTaxRateShippingOptionsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await rateService
      .withTransaction(transactionManager)
      .addToShippingOption(req.params.id, value.shipping_options)
  })

  const rate = await rateService.retrieve(req.params.id, req.retrieveConfig)

  res.json({ tax_rate: rate })
}

/**
 * @schema AdminPostTaxRatesTaxRateShippingOptionsReq
 * type: object
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     description: "The IDs of the shipping options to associate with this tax rate"
 *     items:
 *       type: string
 */
export class AdminPostTaxRatesTaxRateShippingOptionsReq {
  @IsArray()
  shipping_options: string[]
}

export class AdminPostTaxRatesTaxRateShippingOptionsParams extends FindParams { }
