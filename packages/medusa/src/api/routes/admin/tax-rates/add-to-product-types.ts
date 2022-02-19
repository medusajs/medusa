import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { ProductTypeService, TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /tax-rates/:id/product-types/batch
 * operationId: "PostTaxRatesTaxRateProductTypes"
 * summary: "Add Tax Rate to Product Types"
 * description: "Associates a Tax Rate with a list of Product Types"
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
    AdminPostTaxRatesTaxRateProductTypesReq,
    req.body
  )

  const query = await validator(
    AdminPostTaxRatesTaxRateProductTypesParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")
  const productTypeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  try {
    await rateService.addToProductType(req.params.id, value.product_types)
  } catch (err) {
    if (err.code === "23503") {
      // A foreign key constraint failed meaning some thing doesn't exist
      // either it is a product type or the tax rate itself. Using Promise.all
      // will try to retrieve all of the resources and will fail when something
      // is not found.
      await Promise.all([
        rateService.retrieve(req.params.id, {
          select: ["id"],
        }) as Promise<unknown>,
        ...value.product_types.map(
          (id) =>
            productTypeService.retrieve(id, {
              select: ["id"],
            }) as Promise<unknown>
        ),
      ])
    }

    throw err
  }

  const config = getRetrieveConfig(
    query.fields as (keyof TaxRate)[],
    query.expand
  )
  const rate = await rateService.retrieve(req.params.id, config)
  const data = pickByConfig(rate, config)

  res.json({ tax_rate: data })
}

export class AdminPostTaxRatesTaxRateProductTypesReq {
  @IsArray()
  product_types: string[]
}

export class AdminPostTaxRatesTaxRateProductTypesParams {
  @IsArray()
  @IsOptional()
  expand?: string[]

  @IsArray()
  @IsOptional()
  fields?: string[]
}
