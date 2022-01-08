import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { ProductService, TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /tax-rates/:id/products
 * operationId: "PostTaxRatesTaxRateProducts"
 * summary: "Add Tax Rate to Products"
 * description: "Associates a Tax Rate with a list of Products"
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
  const value = await validator(AdminPostTaxRatesTaxRateProductsReq, req.body)

  const query = await validator(
    AdminPostTaxRatesTaxRateProductsParams,
    req.query
  )

  const productService: ProductService = req.scope.resolve("productService")
  const rateService: TaxRateService = req.scope.resolve("taxRateService")

  try {
    await rateService.addToProduct(req.params.id, value.products)
  } catch (err) {
    if (err.code === "23503") {
      // A foreign key constraint failed meaning some thing doesn't exist
      // either it is a product or the tax rate itself. Using Promise.all
      // will try to retrieve all of the resources and will fail when
      // something is not found.
      await Promise.all([
        rateService.retrieve(req.params.id, { select: ["id"] }),
        ...value.products.map((id) =>
          productService.retrieve(id, { select: ["id"] })
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
