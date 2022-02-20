import { getListConfig, pickByConfig } from "./utils/get-query-config"
import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"
import { Type } from "class-transformer"
import { omit, pickBy, pick, identity } from "lodash"

import { TaxRate } from "../../../.."
import {
  NumericalComparisonOperator,
  FindConfig,
} from "../../../../types/common"
import { TaxRateService } from "../../../../services"
import { IsType } from "../../../../utils/validators/is-type"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /tax-rates
 * operationId: "GetTaxRates"
 * summary: "List Tax Rates"
 * description: "Retrieves a list of TaxRates"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching orders.
 *   - (query) id {string} Id of the order to search for.
 *   - (query) region_id {string} to search for.
 *   - (query) code {string} to search for.
 *   - (query) rate {string} to search for.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting orders was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting orders was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many orders to skip in the result.
 *   - (query) limit {string} Limit the number of orders returned.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each order of the result.
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
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
