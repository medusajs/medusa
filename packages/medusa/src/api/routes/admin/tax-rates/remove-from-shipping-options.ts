import { IsArray, IsOptional } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { EntityManager } from "typeorm"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /admin/tax-rates/{id}/shipping-options/batch
 * operationId: "DeleteTaxRatesTaxRateShippingOptions"
 * summary: "Remove Shipping Options from Rate"
 * description: "Remove shipping options from a tax rate. This only removes the association between the shipping options and the tax rate. It does not delete the shipping options."
 * parameters:
 *   - (path) id=* {string} ID of the tax rate.
 *   - in: query
 *     name: fields
 *     description: "Comma-separated fields that should be included in the returned tax rate."
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: expand
 *     description: "Comma-separated relations that should be expanded in the returned tax rate."
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteTaxRatesTaxRateShippingOptionsReq"
 * x-codegen:
 *   method: removeShippingOptions
 *   queryParams: AdminDeleteTaxRatesTaxRateShippingOptionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.removeShippingOptions(taxRateId, {
 *         shipping_options: [
 *           shippingOptionId
 *         ]
 *       })
 *       .then(({ tax_rate }) => {
 *         console.log(tax_rate.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/tax-rates/{id}/shipping-options/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *          "shipping_options": [
 *            "{shipping_option_id}"
 *          ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
    AdminDeleteTaxRatesTaxRateShippingOptionsReq,
    req.body
  )

  const query = await validator(
    AdminDeleteTaxRatesTaxRateShippingOptionsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await rateService
      .withTransaction(transactionManager)
      .removeFromShippingOption(req.params.id, value.shipping_options)
  })

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

/**
 * @schema AdminDeleteTaxRatesTaxRateShippingOptionsReq
 * type: object
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     description: "The IDs of the shipping options to remove their association with this tax rate."
 *     items:
 *       type: string
 */
export class AdminDeleteTaxRatesTaxRateShippingOptionsReq {
  @IsArray()
  shipping_options: string[]
}

/**
 * {@inheritDoc FindParams}
 */
export class AdminDeleteTaxRatesTaxRateShippingOptionsParams {
  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsArray()
  @IsOptional()
  expand?: string[]

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsArray()
  @IsOptional()
  fields?: string[]
}
