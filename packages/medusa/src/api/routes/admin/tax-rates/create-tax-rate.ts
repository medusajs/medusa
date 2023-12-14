import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { omit } from "lodash"
import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/tax-rates
 * operationId: "PostTaxRates"
 * summary: "Create a Tax Rate"
 * description: "Create a Tax Rate."
 * parameters:
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
 *         $ref: "#/components/schemas/AdminPostTaxRatesReq"
 * x-codegen:
 *   method: create
 *   queryParams: AdminPostTaxRatesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.create({
 *         code: "TEST",
 *         name: "New Tax Rate",
 *         region_id
 *       })
 *       .then(({ tax_rate }) => {
 *         console.log(tax_rate.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/tax-rates' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "code": "TEST",
 *           "name": "New Tax Rate",
 *           "region_id": "{region_id}"
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
  const value = await validator(AdminPostTaxRatesReq, req.body)

  const query = await validator(AdminPostTaxRatesParams, req.query)

  const manager: EntityManager = req.scope.resolve("manager")
  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  let id: string | undefined
  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    const created = await txRateService.create(
      omit(value, ["products", "product_types", "shipping_options"])
    )
    id = created.id

    if (isDefined(value.products)) {
      await txRateService.addToProduct(id, value.products)
    }

    if (isDefined(value.product_types)) {
      await txRateService.addToProductType(id, value.product_types)
    }

    if (isDefined(value.shipping_options)) {
      await txRateService.addToShippingOption(id, value.shipping_options)
    }
  })

  if (typeof id === "undefined") {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Tax Rate was not created"
    )
  }

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )

  const rate = await rateService.retrieve(id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

/**
 * @schema AdminPostTaxRatesReq
 * type: object
 * required:
 *   - code
 *   - name
 *   - region_id
 * properties:
 *   code:
 *     type: string
 *     description: "The code of the tax rate."
 *   name:
 *     type: string
 *     description: "The name of the tax rate."
 *   region_id:
 *     type: string
 *     description: "The ID of the Region that the tax rate belongs to."
 *   rate:
 *     type: number
 *     description: "The numeric rate to charge."
 *   products:
 *     type: array
 *     description: "The IDs of the products associated with this tax rate."
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
export class AdminPostTaxRatesReq {
  @IsString()
  code: string

  @IsString()
  name: string

  @IsString()
  region_id: string

  @IsOptional()
  @IsNumber()
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

/**
 * {@inheritDoc FindParams}
 */
export class AdminPostTaxRatesParams {
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
