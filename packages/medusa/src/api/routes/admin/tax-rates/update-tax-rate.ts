import { IsArray, IsOptional, IsString } from "class-validator"
import { getRetrieveConfig, pickByConfig } from "./utils/get-query-config"

import { EntityManager } from "typeorm"
import { IsType } from "../../../../utils/validators/is-type"
import { TaxRate } from "../../../.."
import { TaxRateService } from "../../../../services"
import { omit } from "lodash"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /tax-rates/{id}
 * operationId: "PostTaxRatesTaxRate"
 * summary: "Update a Tax Rate"
 * description: "Updates a Tax Rate"
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
 *         properties:
 *           code:
 *             type: string
 *             description: "A code to identify the tax type by"
 *           name:
 *             type: string
 *             description: "A human friendly name for the tax"
 *           region_id:
 *             type: string
 *             description: "The ID of the Region that the rate belongs to"
 *           rate:
 *             type: number
 *             description: "The numeric rate to charge"
 *           products:
 *             type: array
 *             description: "The IDs of the products associated with this tax rate"
 *             items:
 *               type: string
 *           shipping_options:
 *             type: array
 *             description: "The IDs of the shipping options associated with this tax rate"
 *             items:
 *               type: string
 *           product_types:
 *             type: array
 *             description: "The IDs of the types of products associated with this tax rate"
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
