import { IsArray, IsOptional } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /tax-rates/:id/product-types/batch
 * operationId: "DeleteTaxRatesTaxRateProductTypes"
 * summary: "Remove Tax Rate from Product Types"
 * description: "Removes a Tax Rate from a list of Product Types"
 * parameters:
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
 *           - product_types
 *         properties:
 *           product_types:
 *             type: array
 *             description: "The IDs of the types of products to remove association with this tax rate"
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

export class AdminDeleteTaxRatesTaxRateProductTypesReq {
  @IsArray()
  product_types: string[]
}

export class AdminDeleteTaxRatesTaxRateProductTypesParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
