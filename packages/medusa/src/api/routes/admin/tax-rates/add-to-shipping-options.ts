import { pickByConfig, getRetrieveConfig } from "./utils/get-query-config"
import { IsArray, IsOptional } from "class-validator"

import { TaxRate } from "../../../.."
import { ShippingOptionService, TaxRateService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /tax-rates/:id/shipping-options/batch
 * operationId: "PostTaxRatesTaxRateShippingOptions"
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
    AdminPostTaxRatesTaxRateShippingOptionsReq,
    req.body
  )

  const query = await validator(
    AdminPostTaxRatesTaxRateShippingOptionsParams,
    req.query
  )

  const rateService: TaxRateService = req.scope.resolve("taxRateService")
  const optionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )

  try {
    await rateService.addToShippingOption(req.params.id, value.shipping_options)
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
        ...value.shipping_options.map(
          (id) =>
            optionService.retrieve(id, {
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
