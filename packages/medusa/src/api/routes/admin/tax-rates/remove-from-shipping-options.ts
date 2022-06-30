import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /tax-rates/:id/shipping-options/batch
 * operationId: "DeleteTaxRatesTaxRateShippingOptions"
 * summary: "Removes a Tax Rate from Product Types"
 * description: "Removes a Tax Rate from a list of Product Types"
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
  const value = await validator(
    AdminDeleteTaxRatesTaxRateShippingOptionsReq,
    req.body
  )

  const query = await validator(
    AdminDeleteTaxRatesTaxRateShippingOptionsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  await rateService.removeFromShippingOption(
    req.params.id,
    value.shipping_options
  )

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminDeleteTaxRatesTaxRateShippingOptionsReq {
  @IsArray()
  shipping_options: string[]
}

export class AdminDeleteTaxRatesTaxRateShippingOptionsParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
