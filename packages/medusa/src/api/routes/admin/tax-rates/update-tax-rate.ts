import { IsArray, IsOptional, IsString } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { EntityManager } from "typeorm"
import { IsType } from "../../../../utils/validators/is-type"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { omit } from "lodash"
import { validator } from "../../../../utils/validator"
import { isDefined } from "medusa-core-utils"

/**
 * @oas [post] /tax-rates/{id}
 * operationId: "PostTaxRatesTaxRate"
 * summary: "Update a Tax Rate"
 * description: "Updates a Tax Rate"
 * parameters:
 *   - (path) id=* {string} ID of the tax rate.
 *   - in: query
 *     name: fields
 *     description: "Which fields should be included in the result."
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: expand
 *     description: "Which fields should be expanded and retrieved in the result."
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
 *         $ref: "#/components/schemas/AdminPostTaxRatesTaxRateReq"
 * x-codegen:
 *   method: update
 *   queryParams: AdminPostTaxRatesTaxRateParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.update(tax_rate_id, {
 *         name: 'New Tax Rate'
 *       })
 *       .then(({ tax_rate }) => {
 *         console.log(tax_rate.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/tax-rates/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "New Tax Rate"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Tax Rate
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
  const value = await validator(AdminPostTaxRatesTaxRateReq, req.body)

  const query = await validator(AdminPostTaxRatesTaxRateParams, req.query)

  const manager: EntityManager = req.scope.resolve("manager")
  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    await txRateService.update(
      req.params.id,
      omit(value, ["products", "product_types", "shipping_options"])
    )

    if (isDefined(value.products)) {
      await txRateService.addToProduct(req.params.id, value.products, true)
    }

    if (isDefined(value.product_types)) {
      await txRateService.addToProductType(
        req.params.id,
        value.product_types,
        true
      )
    }

    if (isDefined(value.shipping_options)) {
      await txRateService.addToShippingOption(
        req.params.id,
        value.shipping_options,
        true
      )
    }
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
 * @schema AdminPostTaxRatesTaxRateReq
 * type: object
 * properties:
 *   code:
 *     type: string
 *     description: "A code to identify the tax type by"
 *   name:
 *     type: string
 *     description: "A human friendly name for the tax"
 *   region_id:
 *     type: string
 *     description: "The ID of the Region that the rate belongs to"
 *   rate:
 *     type: number
 *     description: "The numeric rate to charge"
 *   products:
 *     type: array
 *     description: "The IDs of the products associated with this tax rate"
 *     items:
 *       type: string
 *   shipping_options:
 *     type: array
 *     description: "The IDs of the shipping options associated with this tax rate"
 *     items:
 *       type: string
 *   product_types:
 *     type: array
 *     description: "The IDs of the types of products associated with this tax rate"
 *     items:
 *       type: string
 */
export class AdminPostTaxRatesTaxRateReq {
  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsType([Number, null])
  rate?: number | null

  @IsOptional()
  @IsArray()
  products?: string[]

  @IsOptional()
  @IsArray()
  shipping_options?: string[]

  @IsOptional()
  @IsArray()
  product_types?: string[]
}

export class AdminPostTaxRatesTaxRateParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
