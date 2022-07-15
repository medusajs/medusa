import { EntityManager } from "typeorm"
import { IsString, IsArray, IsOptional } from "class-validator"
import { omit } from "lodash"

import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [post] /tax-rates/:id
 * operationId: "PostTaxRatesTaxRate"
 * summary: "Update a Tax Rate"
 * description: "Updates a Tax Rate"
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
  const value = await validator(AdminPostTaxRatesTaxRateReq, req.body)

  const query = await validator(AdminPostTaxRatesTaxRateParams, req.query)

  const manager: EntityManager = req.scope.resolve("manager")
  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    await txRateService.update(
      req.params.id,
      omit(value, ["products", "product_types", "shipping_options"])
    )

    if (typeof value.products !== "undefined") {
      await txRateService.addToProduct(req.params.id, value.products, true)
    }

    if (typeof value.product_types !== "undefined") {
      await txRateService.addToProductType(
        req.params.id,
        value.product_types,
        true
      )
    }

    if (typeof value.shipping_options !== "undefined") {
      await txRateService.addToShippingOption(
        req.params.id,
        value.shipping_options,
        true
      )
    }
  })

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )

  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminPostTaxRatesTaxRateReq {
  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsType([Number, null])
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

export class AdminPostTaxRatesTaxRateParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
