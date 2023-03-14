import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { getListConfig, pickByConfig } from "./utils/get-query-config"
import { identity, omit, pickBy } from "lodash"

import { IsType } from "../../../../utils/validators/is-type"
import { NumericalComparisonOperator } from "../../../../types/common"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /tax-rates
 * operationId: "GetTaxRates"
 * summary: "List Tax Rates"
 * description: "Retrieves a list of TaxRates"
 * x-authenticated: true
 * parameters:
 *   - (query) name {string} Name of tax rate to retrieve
 *   - in: query
 *     name: region_id
 *     style: form
 *     explode: false
 *     description: Filter by Region ID
 *     schema:
 *       oneOf:
 *        - type: string
 *        - type: array
 *          items:
 *            type: string
 *   - (query) code {string} code to search for.
 *   - in: query
 *     name: rate
 *     style: form
 *     explode: false
 *     description: Filter by Rate
 *     schema:
 *       oneOf:
 *        - type: number
 *        - type: object
 *          properties:
 *            lt:
 *              type: number
 *              description: filter by rates less than this number
 *            gt:
 *              type: number
 *              description: filter by rates greater than this number
 *            lte:
 *              type: number
 *              description: filter by rates less than or equal to this number
 *            gte:
 *              type: number
 *              description: filter by rates greater than or equal to this number
 *   - (query) offset=0 {integer} How many tax rates to skip before retrieving the result.
 *   - (query) limit=50 {integer} Limit the number of tax rates returned.
 *   - in: query
 *     name: fields
 *     description: "Which fields should be included in each item."
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: expand
 *     description: "Which fields should be expanded and retrieved for each item."
 *     style: form
 *     explode: false
 *     schema:
 *       type: array
 *       items:
 *         type: string
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetTaxRatesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.taxRates.list()
 *       .then(({ tax_rates, limit, offset, count }) => {
 *         console.log(tax_rates.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/tax-rates' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminTaxRatesListRes"
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
  const value = await validator(AdminGetTaxRatesParams, req.query)

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  const listConfig = getListConfig()

  const filterableFields = omit(value, [
    "limit",
    "offset",
    "expand",
    "fields",
    "order",
  ])

  const [rates, count] = await rateService.listAndCount(
    pickBy(filterableFields, identity),
    listConfig
  )

  const data = pickByConfig<TaxRate>(rates, listConfig)

  res.json({ tax_rates: data, count, offset: value.offset, limit: value.limit })
}

export class AdminGetTaxRatesParams {
  @IsOptional()
  @IsType([String, [String]])
  region_id?: string | string[]

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  code?: string

  @IsType([NumericalComparisonOperator, Number])
  @IsOptional()
  rate?: number | NumericalComparisonOperator

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset? = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit? = 50

  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
