import { IsArray, IsOptional } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { EntityManager } from "typeorm"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /admin/tax-rates/{id}/product-types/batch
 * operationId: "DeleteTaxRatesTaxRateProductTypes"
 * summary: "Remove Product Types from Rate"
 * description: "Remove product types from a tax rate. This only removes the association between the product types and the tax rate. It does not delete the product types."
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
 *         $ref: "#/components/schemas/AdminDeleteTaxRatesTaxRateProductTypesReq"
 * x-codegen:
 *   method: removeProductTypes
 *   queryParams: AdminDeleteTaxRatesTaxRateProductTypesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.removeProductTypes(taxRateId, {
 *         product_types: [
 *           productTypeId
 *         ]
 *       })
 *       .then(({ tax_rate }) => {
 *         console.log(tax_rate.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/tax-rates/{id}/product-types/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *          "product_types": [
 *            "{product_type_id}"
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
    AdminDeleteTaxRatesTaxRateProductTypesReq,
    req.body
  )

  const query = await validator(
    AdminDeleteTaxRatesTaxRateProductTypesParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await rateService
      .withTransaction(transactionManager)
      .removeFromProductType(req.params.id, value.product_types)
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
 * @schema AdminDeleteTaxRatesTaxRateProductTypesReq
 * type: object
 * description: "Product types to remove from the tax rates."
 * required:
 *   - product_types
 * properties:
 *   product_types:
 *     type: array
 *     description: "The IDs of the product types to remove their association with this tax rate."
 *     items:
 *       type: string
 */
export class AdminDeleteTaxRatesTaxRateProductTypesReq {
  @IsArray()
  product_types: string[]
}

/**
 * {@inheritDoc FindParams}
 */
export class AdminDeleteTaxRatesTaxRateProductTypesParams {
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
