import { EntityManager } from "typeorm"
import { IsString, IsArray, IsOptional } from "class-validator"
import { omit } from "lodash"
import { MedusaError } from "medusa-core-utils"

import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { TaxRate } from "../../../.."
import {
  ProductService,
  ProductTypeService,
  ShippingOptionService,
  TaxRateService,
} from "../../../../services"
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
  const productService: ProductService = req.scope.resolve("productService")
  const productTypeService: ProductTypeService =
    req.scope.resolve("productTypeService")
  const shippingOptionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )

  let id: string | undefined
  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    const created = await txRateService.create(
      omit(value, ["products", "product_types", "shipping_options"])
    )
    id = created.id

    if (typeof value.products !== "undefined") {
      try {
        await txRateService.addToProduct(id, value.products)
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(id, { select: ["id"] }),
            ...value.products.map((pId) =>
              productService.retrieve(pId, { select: ["id"] })
            ),
          ])
        }

        throw err
      }
    }

    if (typeof value.product_types !== "undefined") {
      try {
        await txRateService.addToProductType(id, value.product_types)
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(id, { select: ["id"] }) as Promise<unknown>,
            ...value.product_types.map(
              (pId) =>
                productTypeService.retrieve(pId, {
                  select: ["id"],
                }) as Promise<unknown>
            ),
          ])
        }

        throw err
      }
    }

    if (typeof value.shipping_options !== "undefined") {
      try {
        await txRateService.addToShippingOption(id, value.shipping_options)
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(id, { select: ["id"] }),
            ...value.shipping_options.map((sId) =>
              shippingOptionService.retrieve(sId, { select: ["id"] })
            ),
          ])
        }

        throw err
      }
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
