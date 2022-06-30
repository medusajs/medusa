import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /tax-rates/:id/products/batch
 * operationId: "DeleteTaxRatesTaxRateProducts"
 * summary: "Removes Tax Rate from Products"
 * description: "Removes a Tax Rate from a list of Products"
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
  const value = await validator(AdminDeleteTaxRatesTaxRateProductsReq, req.body)

  const query = await validator(
    AdminDeleteTaxRatesTaxRateProductsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  await rateService.removeFromProduct(req.params.id, value.products)

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminDeleteTaxRatesTaxRateProductsReq {
  @IsArray()
  products: string[]
}

export class AdminDeleteTaxRatesTaxRateProductsParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
