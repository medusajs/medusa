import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../../models"
import DiscountService from "../../../../services/discount"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /discounts/code/{code}
 * operationId: "GetDiscountsDiscountCode"
 * summary: "Retrieve a Discount by code"
 * description: "Retrieves a Discount by its discount code"
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Discount
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
  const { code } = req.params

  const validated = await validator(
    AdminGetDiscountsDiscountCodeParams,
    req.query
  )

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validated?.fields?.split(",") as (keyof Discount)[],
    validated?.expand?.split(",")
  )

  const discountService: DiscountService = req.scope.resolve("discountService")
  const discount = await discountService.retrieveByCode(code, config)

  res.status(200).json({ discount })
}

export class AdminGetDiscountsDiscountCodeParams {
  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  fields?: string
}
