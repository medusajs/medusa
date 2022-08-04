import { IsArray, IsOptional } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /tax-rates/:id/products/batch
 * operationId: "PostTaxRatesTaxRateProducts"
 * summary: "Add Tax Rate to Products"
 * description: "Associates a Tax Rate with a list of Products"
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
 *           - products
 *         properties:
 *           products:
 *             type: array
 *             description: "The IDs of the products to associate with this tax rate"
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
  const value = await validator(AdminPostTaxRatesTaxRateProductsReq, req.body)

  const query = await validator(
    AdminPostTaxRatesTaxRateProductsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await rateService
      .withTransaction(transactionManager)
      .addToProduct(req.params.id, value.products)
  })

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminPostTaxRatesTaxRateProductsReq {
  @IsArray()
  products: string[]
}

export class AdminPostTaxRatesTaxRateProductsParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
