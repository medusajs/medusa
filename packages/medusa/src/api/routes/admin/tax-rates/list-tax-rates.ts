import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { identity, omit, pickBy } from "lodash"
import { getListConfig, pickByConfig } from "./utils/get-query-config"

import { isDefined } from "@medusajs/utils"
import { Type } from "class-transformer"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import {
  DateComparisonOperator,
  NumericalComparisonOperator,
} from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /admin/tax-rates
 * operationId: "GetTaxRates"
 * summary: "List Tax Rates"
 * description: "Retrieve a list of Tax Rates. The tax rates can be filtered by fields such as `name` or `rate`. The tax rates can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) name {string} Filter by name.
 *   - in: query
 *     name: region_id
 *     style: form
 *     explode: false
 *     description: Filter by Region IDs
 *     schema:
 *       oneOf:
 *        - type: string
 *        - type: array
 *          items:
 *            type: string
 *   - (query) code {string} Filter by code.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Filter by a deletion date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
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
 *   - (query) q {string} Term used to search tax rates by name.
 *   - (query) order {string} A tax rate field to sort-order the retrieved tax rates by.
 *   - (query) offset=0 {integer} The number of tax rates to skip when retrieving the tax rates.
 *   - (query) limit=50 {integer} Limit the number of tax rates returned.
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminTaxRates } from "medusa-react"
 *
 *       const TaxRates = () => {
 *         const {
 *           tax_rates,
 *           isLoading
 *         } = useAdminTaxRates()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {tax_rates && !tax_rates.length && (
 *               <span>No Tax Rates</span>
 *             )}
 *             {tax_rates && tax_rates.length > 0 && (
 *               <ul>
 *                 {tax_rates.map((tax_rate) => (
 *                   <li key={tax_rate.id}>{tax_rate.code}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default TaxRates
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/tax-rates' \
 *       -H 'x-medusa-access-token: {api_token}'
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

  const order = value.order
  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (isDefined(order)) {
    let orderField = order
    if (order.startsWith("-")) {
      const [, field] = order.split("-")
      orderField = field
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [order]: "ASC" }
    }
  } else {
    const defaultOrder: string = "created_at"
    orderBy = { [defaultOrder]: "DESC" }
  }

  const listConfig = getListConfig(
    value.fields as (keyof TaxRate)[],
    value.expand,
    value.limit,
    value.offset,
    orderBy
  )

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

/**
 * Parameters used to filter and configure the pagination of the retrieved tax rates.
 */
export class AdminGetTaxRatesParams {
  /**
   * Filter tax rates by the IDs of their associates region.
   */
  @IsOptional()
  @IsType([String, [String]])
  region_id?: string | string[]

  /**
   * Name to filter tax rates by.
   */
  @IsString()
  @IsOptional()
  name?: string

  /**
   * Code to filter tax rates by.
   */
  @IsString()
  @IsOptional()
  code?: string

  /**
   * Number filters to filter tax rates' `rate` field.
   */
  @IsType([NumericalComparisonOperator, Number])
  @IsOptional()
  rate?: number | NumericalComparisonOperator

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset? = 0

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit? = 50

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

  @IsOptional()
  @IsString()
  order?: string

  /**
   * Date filters to apply on the tax rates' `update_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customer tax rates' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the tax rates' `deleted_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * Term used to search tax rates by name.
   */
  @IsOptional()
  @IsString()
  q?: string
}
