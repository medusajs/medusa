import { IsArray, IsOptional } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { EntityManager } from "typeorm"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /tax-rates/{id}/shipping-options/batch
 * operationId: "PostTaxRatesTaxRateShippingOptions"
 * summary: "Add Tax Rate to Product Types"
 * description: "Associates a Tax Rate with a list of Shipping Options"
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
 *         required:
 *           - shipping_options
 *         properties:
 *           shipping_options:
 *             type: array
 *             description: "The IDs of the shipping options to associate with this tax rate"
 *             items:
 *               type: string
 * tags:
 *   - Tax Rate
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             tax_rate:
 *               $ref: "#/components/schemas/tax_rate"
 */
export default async (req, res) => {
  const value = await validator(
    AdminPostTaxRatesTaxRateShippingOptionsReq,
    req.body
  )

  const query = await validator(
    AdminPostTaxRatesTaxRateShippingOptionsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await rateService
      .withTransaction(transactionManager)
      .addToShippingOption(req.params.id, value.shipping_options)
  })

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminPostTaxRatesTaxRateShippingOptionsReq {
  @IsArray()
  shipping_options: string[]
}

export class AdminPostTaxRatesTaxRateShippingOptionsParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
