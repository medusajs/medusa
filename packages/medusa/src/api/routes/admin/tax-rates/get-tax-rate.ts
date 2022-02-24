import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /tax-rates/:id
 * operationId: "GetTaxRatesTaxRate"
 * summary: "Get Tax Rate"
 * description: "Retrieves a TaxRate"
 * x-authenticated: true
 * tags:
 *   - Tax Rates
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             tax_rate:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/tax_rate"
 */
export default async (req, res) => {
  const value = await validator(AdminGetTaxRatesTaxRateParams, req.query)

  const rateService: TaxRateService = req.scope.resolve("taxRateService")
  const config = getRetrieveConfig(
    value.fields as (keyof TaxRate)[],
    value.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig<TaxRate>(rate, config)

  res.json({ tax_rate: data })
}

export class AdminGetTaxRatesTaxRateParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
