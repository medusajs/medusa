import { EntityManager } from "typeorm"
import { IsString, IsArray, IsOptional } from "class-validator"
import { omit } from "lodash"

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
  const productService: ProductService = req.scope.resolve("productService")
  const productTypeService: ProductTypeService =
    req.scope.resolve("productTypeService")
  const shippingOptionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )

  await manager.transaction(async (tx) => {
    const txRateService = rateService.withTransaction(tx)
    await txRateService.update(
      req.params.id,
      omit(value, ["products", "product_types", "shipping_options"])
    )

    if (typeof value.products !== "undefined") {
      try {
        await txRateService.addToProduct(req.params.id, value.products)
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(req.params.id, { select: ["id"] }),
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
        await txRateService.addToProductType(req.params.id, value.product_types)
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(req.params.id, {
              select: ["id"],
            }) as Promise<unknown>,
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
        await txRateService.addToShippingOption(
          req.params.id,
          value.shipping_options
        )
      } catch (err) {
        if (err.code === "23503") {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using Promise.all
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await Promise.all([
            txRateService.retrieve(req.params.id, { select: ["id"] }),
            ...value.shipping_options.map((sId) =>
              shippingOptionService.retrieve(sId, { select: ["id"] })
            ),
          ])
        }

        throw err
      }
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
