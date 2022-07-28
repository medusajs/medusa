import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts/{id}
 * operationId: "GetDiscountsDiscount"
 * summary: "Retrieve a Discount"
 * description: "Retrieves a Discount"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  const { discount_id } = req.params

  const validated = await validator(AdminGetDiscountParams, req.query)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validated?.fields?.split(",") as (keyof Discount)[],
    validated?.expand?.split(",")
  )

  const discountService: DiscountService = req.scope.resolve("discountService")
  const data = await discountService.retrieve(discount_id, config)

  res.status(200).json({ discount: data })
}

export class AdminGetDiscountParams {
  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  fields?: string
}
