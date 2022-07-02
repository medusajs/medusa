import { EntityManager } from "typeorm"
import { IsString, IsArray, IsOptional } from "class-validator"
import { omit } from "lodash"
import { MedusaError } from "medusa-core-utils"

import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [post] /tax-rates
 * operationId: "PostTaxRates"
 * summary: "Create a Tax Rate"
 * description: "Creates a Tax Rate"
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
  const value = await validator(AdminPostTaxRatesReq, req.body)

  const query = await validator(AdminPostTaxRatesParams, req.query)

  const manager: EntityManager = req.scope.resolve("manager")
  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  let id: string | undefined
  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    const created = await txRateService.create(
      omit(value, ["products", "product_types", "shipping_options"])
    )
    id = created.id

    if (typeof value.products !== "undefined") {
      await txRateService.addToProduct(id, value.products)
    }

    if (typeof value.product_types !== "undefined") {
      await txRateService.addToProductType(id, value.product_types)
    }

    if (typeof value.shipping_options !== "undefined") {
      await txRateService.addToShippingOption(id, value.shipping_options)
    }
  })

  if (typeof id === "undefined") {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Tax Rate was not created"
    )
  }

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )

  const rate = await rateService.retrieve(id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminPostTaxRatesReq {
  @IsString()
  code: string

  @IsString()
  name: string

  @IsString()
  region_id: string

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

export class AdminPostTaxRatesParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
